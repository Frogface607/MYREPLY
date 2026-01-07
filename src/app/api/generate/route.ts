import { NextRequest, NextResponse } from 'next/server';
import { generateResponses } from '@/lib/openrouter';
import type { Business } from '@/types';

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

    // Используем настройки из запроса (localStorage на клиенте) или null
    const business: Business | null = businessSettings ? {
      id: 'demo',
      user_id: 'demo',
      name: businessSettings.name || 'Мой бизнес',
      type: businessSettings.type || 'other',
      tone_settings: businessSettings.tone_settings || { formality: 50, empathy: 50, brevity: 50 },
      rules: businessSettings.rules || { canApologize: true, canOfferPromocode: false, canOfferCompensation: false, canOfferCallback: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } : null;

    // Генерируем ответы
    const result = await generateResponses(
      reviewText,
      business,
      adjustment || context,
      previousResponses,
      rating
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка генерации' },
      { status: 500 }
    );
  }
}
