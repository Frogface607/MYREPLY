import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLAN_LIMITS, type PlanType } from '@/types';

// Создаём admin клиент только при вызове (lazy initialization)
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Верификация webhook от ЮKassa (опционально, но рекомендуется)
    // const signature = request.headers.get('x-yookassa-signature');
    // TODO: Добавить верификацию подписи в продакшене

    const { event, object: payment } = body;

    console.log('ЮKassa webhook received:', event, payment?.id);

    if (event !== 'payment.succeeded') {
      // Обрабатываем только успешные платежи
      return NextResponse.json({ received: true });
    }

    const paymentId = payment.id;
    const metadata = payment.metadata;
    const userId = metadata?.user_id;
    const plan = metadata?.plan as PlanType;

    if (!userId || !plan) {
      console.error('Missing metadata in payment:', paymentId);
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Обновляем статус платежа
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'succeeded',
        yukassa_status: payment.status,
        payment_method: payment.payment_method?.type,
      })
      .eq('yukassa_payment_id', paymentId);

    // Обновляем подписку пользователя
    const newLimit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        plan: plan,
        status: 'active',
        usage_limit: newLimit,
        usage_count: 0, // Сбрасываем счётчик при оплате
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 дней
        trial_end: null, // Убираем триал
      })
      .eq('user_id', userId);

    if (subError) {
      console.error('Error updating subscription:', subError);
      return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 });
    }

    console.log(`✅ Subscription updated for user ${userId} to plan ${plan}`);

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 }
    );
  }
}
