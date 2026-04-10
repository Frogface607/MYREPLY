import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@supabase/supabase-js';

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
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('horror_reviews')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin horror reject error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
