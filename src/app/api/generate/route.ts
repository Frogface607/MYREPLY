import { NextRequest, NextResponse } from 'next/server';
import { generateResponses } from '@/lib/openrouter';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Extract text from image using Vision model
async function extractTextFromImage(imageBase64: string): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'MyReply',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Это скриншот отзыва клиента. Извлеки ТОЛЬКО текст отзыва и рейтинг (если виден).
              
Ответь в формате JSON:
{
  "reviewText": "текст отзыва",
  "rating": число от 1 до 5 или null если не видно,
  "platform": "название площадки если понятно или null"
}

Если на скриншоте нет отзыва, верни:
{
  "reviewText": null,
  "error": "описание что на скриншоте"
}`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to process image');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.reviewText) {
        return JSON.stringify(parsed);
      }
      throw new Error(parsed.error || 'Не удалось найти отзыв на скриншоте');
    }
  } catch (e) {
    if (e instanceof Error && e.message !== 'Failed to process image') {
      throw e;
    }
  }
  
  throw new Error('Не удалось обработать скриншот');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { reviewText, rating, context, adjustment, previousResponses, businessSettings, imageBase64 } = body;

    // If image provided, extract text first
    if (imageBase64) {
      try {
        const extracted = await extractTextFromImage(imageBase64);
        const parsed = JSON.parse(extracted);
        
        if (!parsed.reviewText) {
          return NextResponse.json(
            { error: parsed.error || 'Не удалось извлечь текст из скриншота' },
            { status: 400 }
          );
        }
        
        reviewText = parsed.reviewText;
        if (parsed.rating && !rating) {
          rating = parsed.rating;
        }
        if (parsed.platform) {
          context = context ? `${context}. Платформа: ${parsed.platform}` : `Платформа: ${parsed.platform}`;
        }
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Ошибка обработки изображения' },
          { status: 400 }
        );
      }
    }

    if (!reviewText || typeof reviewText !== 'string') {
      return NextResponse.json(
        { error: 'Текст отзыва обязателен' },
        { status: 400 }
      );
    }

    // Собираем профиль бизнеса из настроек
    const business = businessSettings ? {
      name: businessSettings.name || 'Мой бизнес',
      type: businessSettings.type || 'other',
      description: businessSettings.description,
      specialties: businessSettings.specialties,
      commonIssues: businessSettings.commonIssues,
      strengths: businessSettings.strengths,
      tone_settings: businessSettings.tone_settings || { formality: 50, empathy: 60, brevity: 50 },
      rules: businessSettings.rules || { canApologize: true, canOfferPromocode: false, canOfferCompensation: false, canOfferCallback: true },
      customRules: businessSettings.customRules,
    } : null;

    // Генерируем ответы
    const result = await generateResponses(
      reviewText,
      business,
      {
        adjustment,
        context,
        rating,
        previousResponses,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate API error:', error);
    
    // User-friendly error messages
    let userMessage = 'Произошла ошибка при генерации ответов';
    let statusCode = 500;
    
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      
      if (msg.includes('rate limit') || msg.includes('429')) {
        userMessage = 'Слишком много запросов. Подождите минуту и попробуйте снова.';
        statusCode = 429;
      } else if (msg.includes('api key') || msg.includes('unauthorized') || msg.includes('401')) {
        userMessage = 'Ошибка авторизации сервиса. Обратитесь в поддержку.';
        statusCode = 401;
      } else if (msg.includes('timeout') || msg.includes('network')) {
        userMessage = 'Проблема с подключением. Проверьте интернет и попробуйте снова.';
        statusCode = 503;
      } else if (msg.includes('content policy') || msg.includes('safety')) {
        userMessage = 'Текст не может быть обработан. Попробуйте другую формулировку.';
        statusCode = 400;
      } else if (error.message && error.message !== 'Ошибка генерации') {
        userMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: userMessage },
      { status: statusCode }
    );
  }
}
