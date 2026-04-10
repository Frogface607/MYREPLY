import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    const { data, error, count } = await supabase
      .from('horror_reviews')
      .select('id, review_text, business_type, business_name_anon, ai_response, likes, created_at, posted_at', {
        count: 'exact',
      })
      .in('status', ['approved', 'posted'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Horror list error:', error);
      return NextResponse.json({ error: 'Не удалось загрузить' }, { status: 500 });
    }

    return NextResponse.json({
      items: data || [],
      total: count || 0,
      page,
      has_more: (count || 0) > offset + limit,
    });
  } catch (error) {
    console.error('Horror list error:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
