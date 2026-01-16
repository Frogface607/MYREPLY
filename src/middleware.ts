import { type NextRequest, NextResponse } from 'next/server';
// import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // DEMO MODE: пропускаем авторизацию для тестирования
  // TODO: включить обратно вечером
  return NextResponse.next();
  
  // return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
