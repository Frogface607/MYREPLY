import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateResponses } from '@/lib/openrouter';
import type { Business } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Проверяем авторизацию
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reviewText, rating, context, adjustment, previousResponses } = body;

    if (!reviewText || typeof reviewText !== 'string') {
      return NextResponse.json(
        { error: 'Текст отзыва обязателен' },
        { status: 400 }
      );
    }

    // Получаем настройки бизнеса пользователя
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Генерируем ответы
    const result = await generateResponses(
      reviewText,
      business as Business | null,
      adjustment || context, // context используется как adjustment при первой генерации
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

