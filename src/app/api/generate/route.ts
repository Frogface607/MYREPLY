import { NextRequest, NextResponse } from 'next/server';
import { generateResponses } from '@/lib/openrouter';
import type { Business } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewText, rating, context, adjustment, previousResponses, businessSettings } = body;

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

