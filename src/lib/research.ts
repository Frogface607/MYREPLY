const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Perplexity для поиска, Claude как fallback
const PERPLEXITY_MODEL = 'perplexity/sonar-pro';
const FALLBACK_MODEL = 'anthropic/claude-sonnet-4';

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

async function tryModel(model: string, messages: { role: string; content: string }[]): Promise<Response> {
  return fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'MyReply',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      max_tokens: 2500,
    }),
  });
}

export async function researchBusiness(
  businessName: string,
  city: string
): Promise<BusinessInsights> {
  const systemPrompt = `Ты — аналитик бизнеса. Найди информацию о бизнесе в интернете.

Ищи на площадках: Яндекс Карты, 2ГИС, Google Maps, TripAdvisor, Flamp, Zoon.

Верни ТОЛЬКО JSON:
{
  "description": "Описание бизнеса (2-3 предложения)",
  "businessType": "restaurant|delivery|cafe|marketplace|service|hotel|other",
  "commonIssues": ["Проблема 1", "Проблема 2"],
  "strengths": ["Сильная сторона 1", "Сильная сторона 2"],
  "recommendedTone": { "formality": 50, "empathy": 60, "brevity": 50 },
  "recentReviews": ["Краткий отзыв 1", "Отзыв 2"],
  "averageRating": "4.2 на Яндекс, 4.5 на 2ГИС",
  "summary": "Совет владельцу (2-3 предложения)"
}

formality: 0=дружелюбный, 100=формальный
empathy: 0=сдержанный, 100=эмпатичный
brevity: 0=развёрнуто, 100=кратко

Если не найден — укажи это. Отвечай ТОЛЬКО JSON.`;

  const userPrompt = `Найди: "${businessName}" в городе ${city}.

Нужно:
1. Рейтинги
2. Жалобы клиентов
3. За что хвалят
4. Примеры отзывов`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  // Пробуем Perplexity, если ошибка — Claude
  let response = await tryModel(PERPLEXITY_MODEL, messages);
  
  if (!response.ok) {
    console.log('Perplexity unavailable, trying Claude...');
    response = await tryModel(FALLBACK_MODEL, messages);
  }

  if (!response.ok) {
    const error = await response.text();
    console.error('Research API error:', error);
    throw new Error('Не удалось выполнить исследование');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('Пустой ответ от AI');
  }

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON не найден');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      description: parsed.description || `${businessName} — бизнес в ${city}`,
      businessType: parsed.businessType || 'other',
      commonIssues: Array.isArray(parsed.commonIssues) ? parsed.commonIssues : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      recommendedTone: {
        formality: parsed.recommendedTone?.formality ?? 50,
        empathy: parsed.recommendedTone?.empathy ?? 60,
        brevity: parsed.recommendedTone?.brevity ?? 50,
      },
      recentReviews: Array.isArray(parsed.recentReviews) ? parsed.recentReviews : [],
      averageRating: parsed.averageRating || 'Не найден',
      summary: parsed.summary || 'Отвечайте на отзывы в течение 24 часов.',
    };
  } catch {
    return {
      description: `${businessName} — бизнес в ${city}. Информация не найдена.`,
      businessType: 'other',
      commonIssues: ['Качество обслуживания', 'Время ожидания'],
      strengths: ['Локация', 'Ассортимент'],
      recommendedTone: { formality: 50, empathy: 60, brevity: 50 },
      recentReviews: [],
      averageRating: 'Не найден',
      summary: 'Заполните профиль вручную для лучших результатов.',
    };
  }
}
