import type { Business, GeneratedResponse } from '@/types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Маппинг типов бизнеса на русский
const businessTypeLabels: Record<string, string> = {
  restaurant: 'ресторан',
  delivery: 'доставка еды',
  cafe: 'кафе',
  marketplace: 'магазин на маркетплейсе',
  service: 'сервисная компания',
  hotel: 'отель/гостиница',
  other: 'бизнес',
};

function buildSystemPrompt(business: Business | null): string {
  if (!business) {
    return `Ты — помощник владельца бизнеса, который помогает отвечать на отзывы клиентов.

Твоя задача: предложить 3 варианта ответа на отзыв с разными акцентами:
1. Нейтральный — сбалансированный, профессиональный ответ
2. Эмпатичный — с упором на понимание чувств клиента
3. Решение-ориентированный — с фокусом на конкретные действия

Правила:
- Ответы должны быть вежливыми и профессиональными
- Не признавай вину там, где её нет
- Не оправдывайся чрезмерно
- Предлагай конструктивные решения когда уместно

Отвечай ТОЛЬКО в формате JSON:
{
  "responses": [
    {
      "id": "1",
      "text": "текст ответа",
      "accent": "neutral",
      "explanation": "короткое объяснение почему такой ответ"
    },
    {
      "id": "2", 
      "text": "текст ответа",
      "accent": "empathetic",
      "explanation": "короткое объяснение"
    },
    {
      "id": "3",
      "text": "текст ответа", 
      "accent": "solution-focused",
      "explanation": "короткое объяснение"
    }
  ],
  "analysis": {
    "sentiment": "positive/neutral/negative",
    "mainIssue": "главная проблема если есть",
    "urgency": "low/medium/high"
  }
}`;
  }

  const { tone_settings, rules, type, name } = business;
  const businessLabel = businessTypeLabels[type] || 'бизнес';

  // Преобразуем настройки тона в описание
  const formalityDesc = tone_settings.formality > 60 
    ? 'формальный, официальный' 
    : tone_settings.formality < 40 
    ? 'дружелюбный, неформальный' 
    : 'сбалансированный';

  const empathyDesc = tone_settings.empathy > 60
    ? 'с высокой эмпатией, показывай понимание'
    : tone_settings.empathy < 40
    ? 'сдержанный, по делу'
    : 'умеренно эмпатичный';

  const brevityDesc = tone_settings.brevity > 60
    ? 'краткие, лаконичные'
    : tone_settings.brevity < 40
    ? 'развёрнутые, подробные'
    : 'средней длины';

  // Правила бизнеса
  const rulesText = [
    rules.canApologize ? 'Можно извиняться когда уместно' : 'НЕ извиняйся, даже если клиент недоволен',
    rules.canOfferPromocode ? 'Можно предлагать промокод как жест доброй воли' : 'НЕ предлагай промокоды',
    rules.canOfferCompensation ? 'Можно предлагать компенсацию в сложных случаях' : 'НЕ предлагай компенсации',
    rules.canOfferCallback ? 'Можно предлагать связаться для решения вопроса' : 'НЕ предлагай перезвонить или написать',
  ].join('\n- ');

  return `Ты — помощник владельца бизнеса "${name}" (${businessLabel}), который помогает отвечать на отзывы клиентов.

СТИЛЬ ОБЩЕНИЯ:
- Тон: ${formalityDesc}
- Эмпатия: ${empathyDesc}  
- Длина ответов: ${brevityDesc}

ПРАВИЛА БИЗНЕСА:
- ${rulesText}

Твоя задача: предложить 3 варианта ответа на отзыв с разными акцентами:
1. Нейтральный — сбалансированный ответ в заданном стиле
2. Эмпатичный — с упором на понимание (в рамках правил!)
3. Решение-ориентированный — с фокусом на действия (в рамках правил!)

ВАЖНО:
- Строго соблюдай правила бизнеса выше
- Не признавай вину если её нет
- Сохраняй достоинство бизнеса
- Ответы должны звучать как от реального человека, не шаблонно

Отвечай ТОЛЬКО в формате JSON:
{
  "responses": [
    {
      "id": "1",
      "text": "текст ответа",
      "accent": "neutral",
      "explanation": "короткое объяснение почему такой ответ"
    },
    {
      "id": "2", 
      "text": "текст ответа",
      "accent": "empathetic",
      "explanation": "короткое объяснение"
    },
    {
      "id": "3",
      "text": "текст ответа", 
      "accent": "solution-focused",
      "explanation": "короткое объяснение"
    }
  ],
  "analysis": {
    "sentiment": "positive/neutral/negative",
    "mainIssue": "главная проблема если есть или null",
    "urgency": "low/medium/high"
  }
}`;
}

function buildUserPrompt(reviewText: string, adjustment?: string, rating?: number): string {
  let prompt = '';
  
  if (rating) {
    const ratingDescriptions: Record<number, string> = {
      1: '1 из 5 (очень негативный)',
      2: '2 из 5 (негативный)',
      3: '3 из 5 (нейтральный)',
      4: '4 из 5 (положительный)',
      5: '5 из 5 (очень положительный)',
    };
    prompt += `Рейтинг: ${ratingDescriptions[rating] || `${rating} из 5`}\n\n`;
  }
  
  prompt += `Отзыв клиента:\n\n"${reviewText}"`;
  
  if (adjustment) {
    prompt += `\n\nДополнительное пожелание к ответам: ${adjustment}`;
  }
  
  return prompt;
}

export async function generateResponses(
  reviewText: string,
  business: Business | null,
  adjustment?: string,
  previousResponses?: GeneratedResponse[],
  rating?: number
): Promise<{
  responses: GeneratedResponse[];
  analysis: {
    sentiment: 'positive' | 'neutral' | 'negative';
    mainIssue: string | null;
    urgency: 'low' | 'medium' | 'high';
  };
}> {
  const messages: OpenRouterMessage[] = [
    {
      role: 'system',
      content: buildSystemPrompt(business),
    },
  ];

  // Если есть предыдущие ответы (для перегенерации с учётом контекста)
  if (previousResponses && previousResponses.length > 0) {
    messages.push({
      role: 'assistant',
      content: JSON.stringify({ responses: previousResponses }),
    });
    messages.push({
      role: 'user',
      content: `Пользователь попросил: "${adjustment || 'другие варианты'}". Сгенерируй новые 3 ответа с учётом этого пожелания.`,
    });
  } else {
    messages.push({
      role: 'user',
      content: buildUserPrompt(reviewText, adjustment, rating),
    });
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'MyReply',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4', // Можно заменить на другую модель
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data: OpenRouterResponse = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from OpenRouter');
  }

  try {
    // Парсим JSON из ответа
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      responses: parsed.responses,
      analysis: {
        sentiment: parsed.analysis?.sentiment || 'neutral',
        mainIssue: parsed.analysis?.mainIssue || null,
        urgency: parsed.analysis?.urgency || 'low',
      },
    };
  } catch {
    throw new Error('Failed to parse OpenRouter response');
  }
}

