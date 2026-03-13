import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Сохранить выбранный ответ в историю
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
    const { reviewText, chosenResponse, responseAccent, feedback, adjustment } = body;

    // Получаем business_id пользователя
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!business) {
      return NextResponse.json(
        { error: 'Бизнес не найден. Пройдите онбординг.' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from('response_history')
      .insert({
        business_id: business.id,
        review_text: reviewText,
        chosen_response: chosenResponse,
        response_accent: responseAccent,
        feedback,
        adjustment,
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Ошибка сохранения' },
      { status: 500 }
    );
  }
}

// Получить историю ответов (+ CSV export для Pro)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    // Получаем business_id пользователя
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!business) {
      return NextResponse.json({ history: [] });
    }

    // CSV export for Pro users
    const { searchParams } = new URL(request.url);
    if (searchParams.get('format') === 'csv') {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single();

      if (subscription?.plan !== 'pro') {
        return NextResponse.json(
          { error: 'Экспорт доступен только на тарифе Про' },
          { status: 403 }
        );
      }

      const { data: exportHistory } = await supabase
        .from('response_history')
        .select('review_text, chosen_response, response_accent, created_at')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (!exportHistory || exportHistory.length === 0) {
        return NextResponse.json(
          { error: 'Нет данных для экспорта' },
          { status: 404 }
        );
      }

      const BOM = '\uFEFF';
      const header = 'Дата,Текст отзыва,Ответ,Тон\n';
      const rows = exportHistory.map(h => {
        const date = new Date(h.created_at).toLocaleDateString('ru-RU');
        const review = `"${(h.review_text || '').replace(/"/g, '""')}"`;
        const response = `"${(h.chosen_response || '').replace(/"/g, '""')}"`;
        const accent = h.response_accent || '';
        return `${date},${review},${response},${accent}`;
      }).join('\n');

      return new Response(BOM + header + rows, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="myreply-history.csv"',
        },
      });
    }

    const { data: history, error: historyError } = await supabase
      .from('response_history')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (historyError) {
      throw historyError;
    }

    return NextResponse.json({ history: history || [] });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Ошибка загрузки истории' },
      { status: 500 }
    );
  }
}

// Удалить ответ из истории
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const historyId = searchParams.get('id');

    if (!historyId) {
      return NextResponse.json(
        { error: 'ID записи не указан' },
        { status: 400 }
      );
    }

    // Получаем business_id пользователя
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!business) {
      return NextResponse.json(
        { error: 'Бизнес не найден' },
        { status: 400 }
      );
    }

    // Удаляем только записи, принадлежащие бизнесу пользователя
    const { error: deleteError } = await supabase
      .from('response_history')
      .delete()
      .eq('id', historyId)
      .eq('business_id', business.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления' },
      { status: 500 }
    );
  }
}
