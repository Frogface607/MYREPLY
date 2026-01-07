const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Используем Perplexity через OpenRouter — модель с доступом к интернету
const PERPLEXITY_MODEL = 'perplexity/llama-3.1-sonar-large-128k-online';

export interface BusinessInsights {
  description: string;
  businessType: string;
  commonIssues: string[];
  strengths: string[];
  recommendedTone: {
    formality: number;
    empathy: number;
    brevity: number;
  };
  recentReviews: string[];
  averageRating: string;
  summary: string;
}

export async function researchBusiness(
  businessName: string,
  city: string
): Promise<BusinessInsights> {
  // Один умный запрос к Perplexity — она сама найдёт информацию в интернете
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'MyReply',
    },
    body: JSON.stringify({
      model: PERPLEXITY_MODEL,
      messages: [
        {
          role: 'system',
          content: `Ты — аналитик бизнеса с доступом к интернету. Твоя задача — найти и проанализировать информацию о бизнесе.

ВАЖНО: Ищи реальную информацию на площадках отзывов: Яндекс Карты, 2ГИС, Google Maps, TripAdvisor, Flamp, Zoon.

Верни результат СТРОГО в формате JSON:
{
  "description": "Описание бизнеса на основе найденной информации (2-3 предложения)",
  "businessType": "restaurant|delivery|cafe|marketplace|service|hotel|other",
  "commonIssues": ["Реальная проблема из отзывов 1", "Проблема 2", "Проблема 3"],
  "strengths": ["Реальная сильная сторона 1", "Сильная сторона 2", "Сильная сторона 3"],
  "recommendedTone": {
    "formality": число от 0 до 100,
    "empathy": число от 0 до 100,
    "brevity": число от 0 до 100
  },
  "recentReviews": ["Краткое содержание недавнего отзыва 1", "Отзыв 2", "Отзыв 3"],
  "averageRating": "Средний рейтинг на площадках, например: 4.2 на Яндекс, 4.5 на 2ГИС",
  "summary": "Главный совет для владельца по работе с отзывами на основе анализа (2-3 предложения)"
}

Где:
- formality: 0 = дружелюбный, 100 = формальный (оцени по стилю бизнеса)
- empathy: 0 = сдержанный, 100 = эмпатичный
- brevity: 0 = развёрнутые ответы, 100 = краткие

Если бизнес не найден — так и скажи в description и дай общие рекомендации для этого типа бизнеса.
Отвечай ТОЛЬКО валидным JSON, без markdown.`,
        },
        {
          role: 'user',
          content: `Найди и проанализируй бизнес: "${businessName}" в городе ${city}.

Что нужно найти:
1. Рейтинги на Яндекс Картах, 2ГИС, Google Maps
2. Типичные жалобы клиентов из отзывов
3. За что хвалят
4. Примеры недавних отзывов
5. Как лучше отвечать на отзывы для этого бизнеса`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Perplexity API error:', error);
    throw new Error('Не удалось выполнить исследование');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Пустой ответ от AI');
  }

  try {
    // Парсим JSON из ответа
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON не найден в ответе');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Валидация и дефолты
    return {
      description: parsed.description || `${businessName} — бизнес в городе ${city}`,
      businessType: parsed.businessType || 'other',
      commonIssues: Array.isArray(parsed.commonIssues) ? parsed.commonIssues : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      recommendedTone: {
        formality: parsed.recommendedTone?.formality ?? 50,
        empathy: parsed.recommendedTone?.empathy ?? 50,
        brevity: parsed.recommendedTone?.brevity ?? 50,
      },
      recentReviews: Array.isArray(parsed.recentReviews) ? parsed.recentReviews : [],
      averageRating: parsed.averageRating || 'Не найден',
      summary: parsed.summary || 'Рекомендуем отвечать на все отзывы в течение 24 часов.',
    };
  } catch (e) {
    console.error('Failed to parse Perplexity response:', content);
    
    // Возвращаем дефолтные значения
    return {
      description: `${businessName} — бизнес в городе ${city}. Не удалось найти подробную информацию.`,
      businessType: 'other',
      commonIssues: ['Качество обслуживания', 'Время ожидания', 'Коммуникация'],
      strengths: ['Локация', 'Ассортимент'],
      recommendedTone: { formality: 50, empathy: 60, brevity: 50 },
      recentReviews: [],
      averageRating: 'Не найден',
      summary: 'Не удалось найти достаточно информации. Заполните профиль вручную для лучших результатов.',
    };
  }
}

