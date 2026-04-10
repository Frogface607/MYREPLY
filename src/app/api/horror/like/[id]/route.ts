import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@supabase/supabase-js';

// In-memory IP+review dedup (resets on redeploy — ok for MVP)
const likedMap = new Map<string, number>();
const LIKE_WINDOW = 24 * 60 * 60 * 1000; // 24h

function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      return NextResponse.json({ error: 'Некорректный id' }, { status: 400 });
    }

    const ip = getIP(request);
    const key = `${ip}:${id}`;
    const now = Date.now();

    // Cleanup
    for (const [k, ts] of likedMap.entries()) {
      if (now - ts > LIKE_WINDOW) likedMap.delete(k);
    }

    if (likedMap.has(key)) {
      return NextResponse.json({ error: 'Уже лайкнул' }, { status: 429 });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch current likes
    const { data: current, error: fetchErr } = await supabase
      .from('horror_reviews')
      .select('likes, status')
      .eq('id', id)
      .single();

    if (fetchErr || !current) {
      return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    }
    if (!['approved', 'posted'].includes(current.status)) {
      return NextResponse.json({ error: 'Нельзя лайкать' }, { status: 403 });
    }

    const newLikes = (current.likes || 0) + 1;
    const { error: updErr } = await supabase
      .from('horror_reviews')
      .update({ likes: newLikes })
      .eq('id', id);

    if (updErr) {
      return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
    }

    likedMap.set(key, now);
    return NextResponse.json({ success: true, likes: newLikes });
  } catch (error) {
    console.error('Horror like error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
