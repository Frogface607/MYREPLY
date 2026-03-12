import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

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
      logger.info('feedback', 'Feedback without business profile', { feedback, accent });
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

    logger.info('feedback', 'Saved', { feedback, accent });

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('feedback', 'API error', error);
    return NextResponse.json({ received: true });
  }
}
