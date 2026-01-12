import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLAN_PRICES, PLAN_NAMES, PLAN_LIMITS, type PlanType } from '@/types';

// ЮKassa API endpoint
const YUKASSA_API_URL = 'https://api.yookassa.ru/v3/payments';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body as { plan: PlanType };

    if (!plan || !PLAN_PRICES[plan] || plan === 'free') {
      return NextResponse.json(
        { error: 'Некорректный тариф' },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[plan];
    const planName = PLAN_NAMES[plan];

    // Проверяем наличие ключей ЮKassa
    const shopId = process.env.YUKASSA_SHOP_ID;
    const secretKey = process.env.YUKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      console.error('ЮKassa credentials not configured');
      return NextResponse.json(
        { error: 'Платежная система не настроена' },
        { status: 500 }
      );
    }

    // Создаём платёж в ЮKassa
    const idempotenceKey = `${user.id}-${plan}-${Date.now()}`;
    
    const paymentData = {
      amount: {
        value: (amount / 100).toFixed(2), // ЮKassa принимает в рублях
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?plan=${plan}`,
      },
      capture: true,
      description: `MyReply — тариф ${planName}`,
      metadata: {
        user_id: user.id,
        plan: plan,
        user_email: user.email,
      },
      receipt: {
        customer: {
          email: user.email,
        },
        items: [
          {
            description: `Подписка MyReply "${planName}" на 1 месяц`,
            quantity: '1',
            amount: {
              value: (amount / 100).toFixed(2),
              currency: 'RUB',
            },
            vat_code: 1, // Без НДС
            payment_mode: 'full_payment',
            payment_subject: 'service',
          },
        ],
      },
    };

    const response = await fetch(YUKASSA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
        'Idempotence-Key': idempotenceKey,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ЮKassa API error:', errorData);
      return NextResponse.json(
        { error: 'Ошибка создания платежа' },
        { status: 500 }
      );
    }

    const payment = await response.json();

    // Сохраняем платёж в БД
    await supabase.from('payments').insert({
      user_id: user.id,
      amount: amount,
      currency: 'RUB',
      status: 'pending',
      yukassa_payment_id: payment.id,
      yukassa_status: payment.status,
      description: `Тариф ${planName}`,
      metadata: { plan },
    });

    return NextResponse.json({
      paymentId: payment.id,
      paymentUrl: payment.confirmation.confirmation_url,
    });
  } catch (error) {
    console.error('Payment create error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка создания платежа' },
      { status: 500 }
    );
  }
}
