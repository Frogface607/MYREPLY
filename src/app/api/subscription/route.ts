import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLAN_LIMITS, type PlanType } from '@/types';

// GET - получить подписку текущего пользователя
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      // Для неавторизованных - возвращаем дефолтную free подписку
      return NextResponse.json({
        subscription: {
          plan: 'free' as PlanType,
          status: 'active',
          usage_count: 0,
          usage_limit: PLAN_LIMITS.free,
          trial_end: null,
        },
      });
    }

    // Получаем подписку пользователя
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !subscription) {
      // Если подписки нет - создаём free с триалом
      const { data: newSub, error: createError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: 'free',
          status: 'trialing',
          usage_count: 0,
          usage_limit: 100, // Во время триала даём 100
          trial_start: new Date().toISOString(),
          trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 дней
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating subscription:', createError);
        return NextResponse.json({
          subscription: {
            plan: 'free' as PlanType,
            status: 'active',
            usage_count: 0,
            usage_limit: PLAN_LIMITS.free,
          },
        });
      }

      return NextResponse.json({ subscription: newSub });
    }

    // Проверяем, не истёк ли триал
    if (subscription.status === 'trialing' && subscription.trial_end) {
      const trialEnd = new Date(subscription.trial_end);
      if (trialEnd < new Date()) {
        // Триал истёк - переводим на free
        const { data: updatedSub } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan: 'free',
            usage_limit: PLAN_LIMITS.free,
            usage_count: 0,
          })
          .eq('id', subscription.id)
          .select()
          .single();

        return NextResponse.json({ subscription: updatedSub || subscription });
      }
    }

    // Проверяем, не пора ли сбросить usage_count (новый месяц)
    if (subscription.current_period_end) {
      const periodEnd = new Date(subscription.current_period_end);
      if (periodEnd < new Date()) {
        const { data: updatedSub } = await supabase
          .from('subscriptions')
          .update({
            usage_count: 0,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', subscription.id)
          .select()
          .single();

        return NextResponse.json({ subscription: updatedSub || subscription });
      }
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка загрузки подписки' },
      { status: 500 }
    );
  }
}

// POST - увеличить счетчик использования
export async function POST() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем и обновляем подписку
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !subscription) {
      return NextResponse.json(
        { error: 'Подписка не найдена' },
        { status: 404 }
      );
    }

    // Проверяем лимит
    if (subscription.usage_count >= subscription.usage_limit) {
      return NextResponse.json(
        { 
          error: 'Лимит исчерпан',
          limitReached: true,
          usage_count: subscription.usage_count,
          usage_limit: subscription.usage_limit,
        },
        { status: 403 }
      );
    }

    // Увеличиваем счетчик
    const { data: updatedSub, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        usage_count: subscription.usage_count + 1,
      })
      .eq('id', subscription.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      usage_count: updatedSub?.usage_count,
      usage_limit: updatedSub?.usage_limit,
    });
  } catch (error) {
    console.error('Subscription increment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Ошибка обновления' },
      { status: 500 }
    );
  }
}
