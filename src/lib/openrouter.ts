import type { GeneratedResponse } from '@/types';

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

// Расширенный тип для профиля бизнеса
interface BusinessProfile {
  name: string;
  type: string;
  description?: string;
  specialties?: string;
  commonIssues?: string[];
  strengths?: string[];
  tone_settings: { formality: number; empathy: number; brevity: number };
  rules: { canApologize: boolean; canOfferPromocode: boolean; canOfferCompensation: boolean; canOfferCallback: boolean };
  customRules?: string;
}

function buildSystemPrompt(business: BusinessProfile | null, includeHardcore: boolean = false): string {
  const modes = includeHardcore ? 5 : 4;
  
  const jsonFormat = `
Отвечай ТОЛЬКО в формате JSON:
{
  "responses": [
    { "id": "1", "text": "текст ответа", "accent": "neutral", "explanation": "почему такой ответ" },
    { "id": "2", "text": "текст ответа", "accent": "empathetic", "explanation": "почему" },
    { "id": "3", "text": "текст ответа", "accent": "solution-focused", "explanation": "почему" },
    { "id": "4", "text": "текст ответа", "accent": "passive-aggressive", "explanation": "почему" }${includeHardcore ? `,
    { "id": "5", "text": "текст ответа", "accent": "hardcore", "explanation": "почему" }` : ''}
  ],
  "analysis": {
    "sentiment": "positive/neutral/negative",
    "mainIssue": "главная проблема или null",
    "urgency": "low/medium/high"
  }
}`;

  const modesDescription = `
Предлагай ${modes} вариантов ответа:
1. **Нейтральный** (neutral) — сбалансированный, профессиональный
2. **Эмпатичный** (empathetic) — с пониманием чувств клиента, тёплый
3. **С решением** (solution-focused) — конкретные действия, предложения
4. **Формально-холодный** (passive-aggressive) — вежливый, но твёрдый и холодный. Без извинений, фиксация позиции бизнеса. Для несправедливых/манипулятивных отзывов. Юридически безопасен.${includeHardcore ? `
5. **Дерзкий** (hardcore) — дерзкий, ироничный, с сарказмом и самоиронией. Ответ должен быть СМЕШНЫМ — чтобы хотелось заскринить и отправить друзьям. Используй абсурдные метафоры, неожиданные повороты, троллинг с любовью. БЕЗ мата и прямых оскорблений. Задача — рассмешить, а не обидеть. Если критика справедлива — признай с юмором. Если несправедлива — затролль красиво.` : ''}`;

  if (!business) {
    return `Ты — помощник владельца бизнеса для ответов на отзывы.
${modesDescription}

Правила:
- Вежливо и профессионально (кроме hardcore)
- Не признавай вину без причины
- Не оправдывайся чрезмерно
- Предлагай решения когда уместно
${jsonFormat}`;
  }

  const { tone_settings, rules, type, name, description, specialties, commonIssues, strengths, customRules } = business;
  const businessLabel = businessTypeLabels[type] || 'бизнес';

  // Тон
  const formalityDesc = tone_settings.formality > 60 
    ? 'формальный, официальный' 
    : tone_settings.formality < 40 
    ? 'дружелюбный, неформальный' 
    : 'сбалансированный';

  const empathyDesc = tone_settings.empathy > 60
    ? 'высокая эмпатия, показывай понимание'
    : tone_settings.empathy < 40
    ? 'сдержанный, по делу'
    : 'умеренная эмпатия';

  const brevityDesc = tone_settings.brevity > 60
    ? 'краткие, лаконичные'
    : tone_settings.brevity < 40
    ? 'развёрнутые, подробные'
    : 'средней длины';

  // Правила
  const rulesText = [
    rules.canApologize ? '✓ Можно извиняться' : '✗ НЕ извиняйся',
    rules.canOfferPromocode ? '✓ Можно предлагать промокод' : '✗ НЕ предлагай промокоды',
    rules.canOfferCompensation ? '✓ Можно предлагать компенсацию' : '✗ НЕ предлагай компенсации',
    rules.canOfferCallback ? '✓ Можно предлагать связаться' : '✗ НЕ предлагай связаться',
  ].join('\n');

  let prompt = `Ты — помощник "${name}" (${businessLabel}).`;

  // Описание бизнеса
  if (description) {
    prompt += `\n\nО БИЗНЕСЕ: ${description}`;
  }

  // Специализация
  if (specialties) {
    prompt += `\n\nНАШИ ФИШКИ: ${specialties}`;
  }

  // Сильные стороны
  if (strengths && strengths.length > 0) {
    prompt += `\n\n✅ ЧЕМ ГОРДИМСЯ (можно упоминать в ответах):
${strengths.map(s => `- ${s}`).join('\n')}`;
  }

  // Известные проблемы
  if (commonIssues && commonIssues.length > 0) {
    prompt += `\n\n⚠️ ИЗВЕСТНЫЕ ПРОБЛЕМЫ (не отрицай если клиент жалуется на это):
${commonIssues.map(i => `- ${i}`).join('\n')}`;
  }

  prompt += `\n\n📝 СТИЛЬ ОТВЕТОВ:
- Тон: ${formalityDesc}
- Эмпатия: ${empathyDesc}
- Длина: ${brevityDesc}

🛡️ ПРАВИЛА:
${rulesText}`;

  // Особые правила
  if (customRules) {
    prompt += `\n\n🔒 ОСОБЫЕ УКАЗАНИЯ ВЛАДЕЛЬЦА:\n${customRules}`;
  }

  prompt += `
${modesDescription}

ВАЖНО:
- Соблюдай ВСЕ правила выше
- Если проблема из списка известных — признай и предложи решение
- Если клиент хвалит наши сильные стороны — поблагодари
- Звучи как реальный человек, не шаблонно
- Защищай достоинство бизнеса
- Passive-aggressive: НЕ извиняйся, будь формален и холоден${includeHardcore ? `
- Hardcore: дерзко, смешно, вирусно. Абсурдные метафоры, неожиданные повороты. Цель — рассмешить. БЕЗ мата.` : ''}
${jsonFormat}`;

  return prompt;
}

function buildUserPrompt(reviewText: string, options?: { 
  adjustment?: string; 
  rating?: number; 
  context?: string;
}): string {
  let prompt = '';
  
  if (options?.rating) {
    const ratingDescriptions: Record<number, string> = {
      1: '1 из 5 (очень негативный)',
      2: '2 из 5 (негативный)',
      3: '3 из 5 (нейтральный)',
      4: '4 из 5 (положительный)',
      5: '5 из 5 (очень положительный)',
    };
    prompt += `Рейтинг: ${ratingDescriptions[options.rating] || `${options.rating} из 5`}\n\n`;
  }
  
  prompt += `Отзыв клиента:\n\n"${reviewText}"`;
  
  // ВАЖНО: Контекст от владельца — реальная ситуация, которую нужно учесть!
  if (options?.context) {
    prompt += `\n\n⚠️ ВАЖНЫЙ КОНТЕКСТ ОТ ВЛАДЕЛЬЦА БИЗНЕСА (учти это при составлении ответов!):\n"${options.context}"`;
    prompt += `\n\nЭто информация от владельца о реальной ситуации. Если владелец говорит, что клиент был неправ или неадекватен — НЕ извиняйся и НЕ признавай вину. Формулируй ответ с учётом этой информации.`;
  }
  
  if (options?.adjustment) {
    prompt += `\n\nДополнительное пожелание к ответам: ${options.adjustment}`;
  }
  
  return prompt;
}

export async function generateResponses(
  reviewText: string,
  business: BusinessProfile | null,
  options?: {
    adjustment?: string;
    context?: string;
    rating?: number;
    previousResponses?: GeneratedResponse[];
    includeHardcore?: boolean;
  }
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
      content: buildSystemPrompt(business, options?.includeHardcore ?? false),
    },
  ];

  // Если есть предыдущие ответы (для перегенерации с учётом контекста)
  if (options?.previousResponses && options.previousResponses.length > 0) {
    messages.push({
      role: 'assistant',
      content: JSON.stringify({ responses: options.previousResponses }),
    });
    messages.push({
      role: 'user',
      content: `Пользователь попросил: "${options?.adjustment || 'другие варианты'}". Сгенерируй новые 3 ответа с учётом этого пожелания.`,
    });
  } else {
    messages.push({
      role: 'user',
      content: buildUserPrompt(reviewText, options),
    });
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://my-reply.ru',
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

