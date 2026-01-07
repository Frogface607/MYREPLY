const TAVILY_API_URL = 'https://api.tavily.com/search';

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results: TavilySearchResult[];
  query: string;
}

export async function searchBusiness(businessName: string, city: string): Promise<TavilySearchResult[]> {
  const queries = [
    `${businessName} ${city} отзывы`,
    `${businessName} ${city} Яндекс Карты`,
    `${businessName} ${city} 2ГИС`,
  ];

  const allResults: TavilySearchResult[] = [];

  for (const query of queries) {
    try {
      const response = await fetch(TAVILY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query,
          search_depth: 'advanced',
          include_domains: [
            'yandex.ru',
            'maps.yandex.ru',
            '2gis.ru',
            'google.com',
            'tripadvisor.ru',
            'zoon.ru',
            'flamp.ru',
            'otzovik.com',
            'irecommend.ru',
          ],
          max_results: 10,
        }),
      });

      if (response.ok) {
        const data: TavilyResponse = await response.json();
        allResults.push(...data.results);
      }
    } catch (error) {
      console.error(`Tavily search error for query "${query}":`, error);
    }
  }

  // Убираем дубликаты по URL
  const uniqueResults = allResults.filter(
    (result, index, self) => index === self.findIndex((r) => r.url === result.url)
  );

  return uniqueResults;
}

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
  competitorInsights: string;
  summary: string;
}

export async function analyzeBusinessWithAI(
  businessName: string,
  city: string,
  searchResults: TavilySearchResult[]
): Promise<BusinessInsights> {
  const context = searchResults
    .map((r) => `[${r.title}]\n${r.content}`)
    .join('\n\n---\n\n');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          role: 'system',
          content: `Ты — аналитик бизнеса. Твоя задача проанализировать информацию о бизнесе и составить его профиль.

Проанализируй найденную информацию и верни JSON со следующей структурой:
{
  "description": "Краткое описание бизнеса (1-2 предложения)",
  "businessType": "restaurant|delivery|cafe|marketplace|service|hotel|other",
  "commonIssues": ["Проблема 1", "Проблема 2", "Проблема 3"],
  "strengths": ["Сильная сторона 1", "Сильная сторона 2"],
  "recommendedTone": {
    "formality": 50,
    "empathy": 50,
    "brevity": 50
  },
  "competitorInsights": "Краткий вывод о том, как отвечают на отзывы в этой нише",
  "summary": "Итоговый совет для владельца бизнеса по работе с отзывами (2-3 предложения)"
}

Где:
- formality: 0-100 (0 = очень дружелюбный, 100 = очень формальный)
- empathy: 0-100 (0 = сдержанный, 100 = очень эмпатичный)
- brevity: 0-100 (0 = развёрнутые ответы, 100 = очень краткие)

Если информации мало — делай разумные предположения на основе типа бизнеса.
Отвечай ТОЛЬКО JSON, без markdown.`,
        },
        {
          role: 'user',
          content: `Проанализируй бизнес "${businessName}" в городе ${city}.

Найденная информация:

${context || 'Информация не найдена. Сделай предположения на основе названия бизнеса.'}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze business');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from AI');
  }

  try {
    // Парсим JSON из ответа
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    return JSON.parse(jsonMatch[0]);
  } catch {
    // Возвращаем дефолтные значения если парсинг не удался
    return {
      description: `${businessName} — бизнес в городе ${city}`,
      businessType: 'other',
      commonIssues: ['Качество обслуживания', 'Время ожидания', 'Цены'],
      strengths: ['Локация', 'Ассортимент'],
      recommendedTone: { formality: 50, empathy: 50, brevity: 50 },
      competitorInsights: 'Рекомендуется отвечать на все отзывы в течение 24 часов',
      summary: 'Мы не смогли найти достаточно информации о вашем бизнесе. Пожалуйста, заполните профиль вручную.',
    };
  }
}

export async function researchBusiness(
  businessName: string,
  city: string
): Promise<BusinessInsights & { searchResults: TavilySearchResult[] }> {
  // 1. Ищем информацию через Tavily
  const searchResults = await searchBusiness(businessName, city);

  // 2. Анализируем с помощью AI
  const insights = await analyzeBusinessWithAI(businessName, city, searchResults);

  return {
    ...insights,
    searchResults,
  };
}

