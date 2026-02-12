import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLAN_LIMITS, type PlanType } from '@/types';

// POST — активировать промокод
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

    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Введите промокод' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // Находим промокод
    const { data: promo, error: promoError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', normalizedCode)
      .eq('is_active', true)
      .single();

    if (promoError || !promo) {
      return NextResponse.json(
        { error: 'Промокод не найден или недействителен' },
        { status: 404 }
      );
    }

    // Проверяем срок действия
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Промокод истёк' },
        { status: 410 }
      );
    }

    // Проверяем лимит использований
    if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
      return NextResponse.json(
        { error: 'Промокод больше не доступен — все места заняты' },
        { status: 410 }
      );
    }

    // Проверяем, не активировал ли уже этот пользователь
    const { data: existing } = await supabase
      .from('promo_activations')
      .select('id')
      .eq('promo_code_id', promo.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Вы уже активировали этот промокод' },
        { status: 409 }
      );
    }

    const plan = promo.plan as PlanType;
    const durationDays = promo.duration_days || 30;
    const newLimit = PLAN_LIMITS[plan] || PLAN_LIMITS.start;

    // Активируем: обновляем подписку
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        plan: plan,
        status: 'active',
        usage_limit: newLimit,
        usage_count: 0,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
        trial_end: null,
      })
      .eq('user_id', user.id);

    if (subError) {
      console.error('Promo activation subscription error:', subError);
      return NextResponse.json(
        { error: 'Не удалось активировать подписку' },
        { status: 500 }
      );
    }

    // Записываем активацию
    await supabase
      .from('promo_activations')
      .insert({
        promo_code_id: promo.id,
        user_id: user.id,
      });

    // Увеличиваем счётчик использований
    await supabase
      .from('promo_codes')
      .update({ current_uses: promo.current_uses + 1 })
      .eq('id', promo.id);

    return NextResponse.json({
      success: true,
      plan: plan,
      duration_days: durationDays,
      message: `Промокод активирован! Тариф "${plan === 'start' ? 'Старт' : 'Про'}" на ${durationDays} дней`,
    });
  } catch (error) {
    console.error('Promo activation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка активации' },
      { status: 500 }
    );
  }
}
