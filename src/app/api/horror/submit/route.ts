import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@supabase/supabase-js';

// Simple in-memory IP rate limit (resets on redeploy)
const submittedIPs = new Map<string, number>();
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMITS_PER_WINDOW = 3;

function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function generatePromoCode(): string {
  // HORROR-XXXX (4 uppercase alphanumeric)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HORROR-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIP(request);
    const now = Date.now();

    // Rate limiting per IP
    const submissions = Array.from(submittedIPs.entries()).filter(
      ([, ts]) => now - ts < RATE_WINDOW
    );
    // Cleanup
    submittedIPs.clear();
    submissions.forEach(([k, v]) => submittedIPs.set(k, v));

    const ipCount = Array.from(submittedIPs.keys()).filter((k) => k.startsWith(ip)).length;
    if (ipCount >= MAX_SUBMITS_PER_WINDOW) {
      return NextResponse.json(
        { error: 'Слишком много отправок. Попробуйте через час.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { review_text, business_type, submitter_email, author_name } = body;

    if (!review_text || typeof review_text !== 'string' || review_text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Отзыв должен быть минимум 20 символов' },
        { status: 400 }
      );
    }
    if (review_text.length > 3000) {
      return NextResponse.json(
        { error: 'Слишком длинный отзыв (макс. 3000 символов)' },
        { status: 400 }
      );
    }

    if (!submitter_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitter_email)) {
      return NextResponse.json(
        { error: 'Укажите корректный email' },
        { status: 400 }
      );
    }

    // Use service role for insert (bypasses RLS for this internal API)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const promo_code = generatePromoCode();

    const { data, error } = await supabase
      .from('horror_reviews')
      .insert({
        review_text: review_text.trim(),
        business_type: business_type || 'other',
        submitter_email: submitter_email.trim().toLowerCase(),
        author_name: author_name?.trim() || null,
        promo_code,
        status: 'pending',
        metadata: { ip: ip.slice(0, 20), user_agent: request.headers.get('user-agent')?.slice(0, 200) || '' },
      })
      .select('id, promo_code')
      .single();

    if (error) {
      console.error('Horror submit DB error:', error);
      return NextResponse.json(
        { error: 'Не удалось сохранить. Попробуйте ещё раз.' },
        { status: 500 }
      );
    }

    // Record IP submission (key includes random to count entries)
    submittedIPs.set(`${ip}-${Date.now()}-${Math.random()}`, now);

    return NextResponse.json({
      success: true,
      id: data.id,
      promo_code: data.promo_code,
      message: 'Промокод активируется сразу после регистрации на my-reply.ru. Отзыв появится в ленте в течение 24 часов.',
    });
  } catch (error) {
    console.error('Horror submit error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
