import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@supabase/supabase-js';
import { generateResponses } from '@/lib/openrouter';

// Simple admin auth via shared secret header (matches existing AI_PROXY_SECRET pattern)
function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get('x-admin-secret');
  const expected = process.env.ADMIN_SECRET || process.env.AI_PROXY_SECRET;
  return !!secret && !!expected && secret === expected;
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { business_name_anon } = body as { business_name_anon?: string };

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: row, error: fetchErr } = await supabase
      .from('horror_reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !row) {
      return NextResponse.json({ error: 'Не найдено' }, { status: 404 });
    }

    // Generate AI response (hardcore mode for max virality)
    let aiResponse = row.ai_response as string | null;
    if (!aiResponse) {
      try {
        const result = await generateResponses(row.review_text, null, { includeHardcore: true });
        // Pick the "hardcore" response if available, otherwise first
        const hardcore = result.responses.find((r) => r.accent === 'hardcore');
        aiResponse = (hardcore || result.responses[0])?.text || null;
      } catch (e) {
        console.error('AI generation failed during approve:', e);
        return NextResponse.json({ error: 'AI-генерация не удалась' }, { status: 502 });
      }
    }

    const update: Record<string, unknown> = {
      status: 'approved',
      ai_response: aiResponse,
    };
    if (business_name_anon) update.business_name_anon = business_name_anon;

    const { error: updErr } = await supabase
      .from('horror_reviews')
      .update(update)
      .eq('id', id);

    if (updErr) {
      return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
    }

    return NextResponse.json({ success: true, ai_response: aiResponse });
  } catch (error) {
    console.error('Admin horror approve error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
