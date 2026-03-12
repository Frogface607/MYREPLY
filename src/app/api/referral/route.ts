import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

// Бонусные пороги
const BONUS_THRESHOLDS = [
  { clicks: 3, bonus_type: 'extra_responses', bonus_amount: 5, reason: '3 перехода по ссылке' },
  { clicks: 10, bonus_type: 'extra_responses', bonus_amount: 15, reason: '10 переходов по ссылке' },
  { clicks: 25, bonus_type: 'promo_days', bonus_amount: 7, reason: '25 переходов — 7 дней Start' },
  { clicks: 50, bonus_type: 'promo_days', bonus_amount: 14, reason: '50 переходов — 14 дней Start' },
];

function generateCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// GET — получить свою реферальную ссылку (или создать)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    // Ищем существующую ссылку
    let { data: link } = await supabase
      .from('referral_links')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Если нет — создаём
    if (!link) {
      const code = generateCode();
      const { data: newLink, error: insertError } = await supabase
        .from('referral_links')
        .insert({ user_id: user.id, code })
        .select()
        .single();

      if (insertError) {
        logger.error('referral', 'Failed to create link', insertError);
        return NextResponse.json({ error: 'Не удалось создать ссылку' }, { status: 500 });
      }
      link = newLink;
    }

    // Бонусы пользователя
    const { data: bonuses } = await supabase
      .from('referral_bonuses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Следующий порог
    const currentClicks = link.clicks || 0;
    const nextThreshold = BONUS_THRESHOLDS.find(t => t.clicks > currentClicks);

    return NextResponse.json({
      code: link.code,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://my-reply.ru'}/challenge?ref=${link.code}`,
      clicks: link.clicks,
      signups: link.signups,
      bonuses: bonuses || [],
      nextThreshold: nextThreshold ? {
        clicks: nextThreshold.clicks,
        remaining: nextThreshold.clicks - currentClicks,
        reward: nextThreshold.reason,
      } : null,
    });
  } catch (error) {
    logger.error('referral', 'GET error', error);
    return NextResponse.json({ error: 'Ошибка' }, { status: 500 });
  }
}

// POST — зафиксировать переход по реферальной ссылке
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      logger.error('referral', 'Missing Supabase service config');
      return NextResponse.json({ ok: true });
    }

    const supabaseAdmin = createServiceClient(supabaseUrl, serviceKey);

    // Проверяем, что код существует
    const { data: link } = await supabaseAdmin
      .from('referral_links')
      .select('id, user_id, clicks')
      .eq('code', code)
      .single();

    if (!link) {
      return NextResponse.json({ ok: true }); // не выдаём ошибку — просто игнорируем
    }

    // Дедупликация по IP (1 клик с одного IP в 24 часа)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    
    const { data: recentVisit } = await supabaseAdmin
      .from('referral_visits')
      .select('id')
      .eq('referral_code', code)
      .eq('visitor_ip', ip)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .single();

    if (recentVisit) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Записываем визит
    await supabaseAdmin
      .from('referral_visits')
      .insert({
        referral_code: code,
        visitor_ip: ip,
      });

    // Инкрементируем счётчик
    const newClicks = (link.clicks || 0) + 1;
    await supabaseAdmin
      .from('referral_links')
      .update({ clicks: newClicks })
      .eq('id', link.id);

    // Проверяем, достигнут ли бонусный порог
    for (const threshold of BONUS_THRESHOLDS) {
      if (newClicks >= threshold.clicks) {
        // Проверяем, не начислялся ли уже этот бонус
        const { data: existingBonus } = await supabaseAdmin
          .from('referral_bonuses')
          .select('id')
          .eq('user_id', link.user_id)
          .eq('reason', threshold.reason)
          .single();

        if (!existingBonus) {
          // Начисляем бонус
          await supabaseAdmin
            .from('referral_bonuses')
            .insert({
              user_id: link.user_id,
              bonus_type: threshold.bonus_type,
              bonus_amount: threshold.bonus_amount,
              reason: threshold.reason,
            });

          // Применяем бонус к подписке
          if (threshold.bonus_type === 'extra_responses') {
            const { data: sub } = await supabaseAdmin
              .from('subscriptions')
              .select('id, usage_limit')
              .eq('user_id', link.user_id)
              .single();

            if (sub) {
              await supabaseAdmin
                .from('subscriptions')
                .update({ usage_limit: (sub.usage_limit || 0) + threshold.bonus_amount })
                .eq('id', sub.id);
            }
          } else if (threshold.bonus_type === 'promo_days') {
            const { data: sub } = await supabaseAdmin
              .from('subscriptions')
              .select('id, plan, status, current_period_end, usage_limit')
              .eq('user_id', link.user_id)
              .single();

            if (sub) {
              const currentEnd = sub.current_period_end ? new Date(sub.current_period_end) : new Date();
              const newEnd = new Date(Math.max(currentEnd.getTime(), Date.now()) + threshold.bonus_amount * 24 * 60 * 60 * 1000);

              await supabaseAdmin
                .from('subscriptions')
                .update({
                  plan: sub.plan === 'free' ? 'start' : sub.plan,
                  status: 'active',
                  usage_limit: sub.plan === 'free' ? 100 : sub.usage_limit,
                  current_period_end: newEnd.toISOString(),
                })
                .eq('id', sub.id);
            }
          }

          logger.info('referral', 'Bonus awarded', { reason: threshold.reason, userId: link.user_id });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error('referral', 'POST error', error);
    return NextResponse.json({ ok: true });
  }
}
