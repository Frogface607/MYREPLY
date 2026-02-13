import { NextRequest, NextResponse } from 'next/server';
import { generateResponses } from '@/lib/openrouter';

// Простой in-memory rate limiter (сбрасывается при редеплое — ок для MVP)
const usedIPs = new Map<string, { count: number; lastUsed: number }>();

// Чистим старые записи каждые 10 минут
const CLEANUP_INTERVAL = 10 * 60 * 1000;
const MAX_FREE_USES = 1; // 1 бесплатная генерация
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 часа

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [ip, data] of usedIPs.entries()) {
    if (now - data.lastUsed > WINDOW_MS) {
      usedIPs.delete(ip);
    }
  }
}

function getIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  try {
    cleanup();

    const ip = getIP(request);
    const now = Date.now();

    // Проверяем cookie — дополнительный уровень (не основной)
    const challengeCookie = request.cookies.get('myreply-challenge-used');

    // Проверяем IP rate limit
    const ipData = usedIPs.get(ip);
    const ipUsed = ipData && (now - ipData.lastUsed < WINDOW_MS) && ipData.count >= MAX_FREE_USES;

    if (ipUsed || challengeCookie) {
      return NextResponse.json(
        {
          error: 'limit',
          message: 'Бесплатная генерация уже использована. Зарегистрируйтесь для продолжения!',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { reviewText } = body;

    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Вставьте отзыв (минимум 10 символов)' },
        { status: 400 }
      );
    }

    // Генерируем ответы без бизнес-профиля, с hardcore
    const result = await generateResponses(
      reviewText.trim(),
      null, // без бизнес-профиля
      {
        includeHardcore: true,
      }
    );

    // Записываем использование
    const existing = usedIPs.get(ip);
    usedIPs.set(ip, {
      count: (existing?.count || 0) + 1,
      lastUsed: now,
    });

    // Устанавливаем cookie на 24 часа
    const response = NextResponse.json(result);
    response.cookies.set('myreply-challenge-used', '1', {
      maxAge: 24 * 60 * 60, // 24 часа
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Challenge API error:', error);

    let userMessage = 'Произошла ошибка при генерации';
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('rate limit') || msg.includes('429')) {
        userMessage = 'Слишком много запросов. Подождите минуту.';
      }
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
