import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST — сохранить фидбэк на ответ
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { feedback, comment, reviewText, responseText, accent } = await request.json();

    // Находим бизнес пользователя
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!business) {
      // Если нет бизнеса — сохраняем в отдельную таблицу или просто логируем
      console.log('Feedback without business:', { userId: user.id, feedback, comment, accent });
      return NextResponse.json({ received: true });
    }

    // Сохраняем в response_history с фидбэком
    await supabase.from('response_history').insert({
      business_id: business.id,
      review_text: reviewText || '',
      chosen_response: responseText || '',
      response_accent: ['neutral', 'empathetic', 'solution-focused'].includes(accent) ? accent : 'neutral',
      feedback: feedback,
      adjustment: comment || null,
    });

    console.log(`📊 Feedback: ${feedback}${comment ? ` — "${comment}"` : ''} (accent: ${accent})`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ received: true }); // Не показываем ошибку пользователю
  }
}
