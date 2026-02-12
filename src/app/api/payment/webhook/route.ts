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

// IP-адреса ЮKassa для верификации webhook
// Источник: https://yookassa.ru/developers/using-api/webhooks
const YUKASSA_IPS = [
  '185.71.76.0/27',
  '185.71.77.0/27',
  '77.75.153.0/25',
  '77.75.156.11',
  '77.75.156.35',
  '77.75.154.128/25',
  '2a02:5180::/32',
];

function ipInCIDR(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) return ip === cidr;
  
  const [range, bits] = cidr.split('/');
  const mask = ~(2 ** (32 - parseInt(bits)) - 1);
  
  const ipParts = ip.split('.').map(Number);
  const rangeParts = range.split('.').map(Number);
  
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const rangeNum = (rangeParts[0] << 24) | (rangeParts[1] << 16) | (rangeParts[2] << 8) | rangeParts[3];
  
  return (ipNum & mask) === (rangeNum & mask);
}

function isYukassaIP(ip: string): boolean {
  // Пропускаем IPv6 адреса из YUKASSA_IPS для простоты
  // и localhost для тестирования
  if (ip === '127.0.0.1' || ip === '::1') {
    return process.env.NODE_ENV === 'development';
  }
  
  return YUKASSA_IPS.some(cidr => {
    if (cidr.includes(':')) return false; // Skip IPv6 ranges for now
    return ipInCIDR(ip, cidr);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Верификация IP-адреса ЮKassa
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || realIp || '';
    
    if (clientIp && !isYukassaIP(clientIp)) {
      console.warn(`Webhook rejected: untrusted IP ${clientIp}`);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
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
