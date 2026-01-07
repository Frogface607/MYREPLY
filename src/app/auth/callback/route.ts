import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
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
  }

  // Если что-то пошло не так — на страницу ошибки
  return NextResponse.redirect(`${origin}/auth?error=auth_failed`);
}

