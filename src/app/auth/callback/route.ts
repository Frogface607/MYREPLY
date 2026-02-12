import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/quick-reply';

  // Если пришла ошибка от OAuth провайдера
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('Exchange error:', exchangeError.message);
      return NextResponse.redirect(`${origin}/auth?error=exchange_failed`);
    }

    // Проверяем, есть ли у пользователя бизнес (прошёл ли онбординг)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

      // Если бизнес не настроен — на онбординг
      if (!business) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }
    }

    return NextResponse.redirect(`${origin}${next}`);
  }

  // Нет кода — редирект на auth
  return NextResponse.redirect(`${origin}/auth?error=no_code`);
}

