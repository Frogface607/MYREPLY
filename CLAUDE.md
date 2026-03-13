# MYREPLY — Умные ответы на отзывы

AI-SaaS для владельцев бизнеса: генерирует профессиональные ответы на отзывы клиентов.
Пользователь вставляет отзыв → AI генерирует 4-5 вариантов ответа с разным тоном.

## Стек
- **Next.js 16.1.1** (App Router), React 19, TypeScript 5
- **Supabase** — БД, auth (magic link + Google OAuth), RLS
- **Tailwind CSS 4** + CSS-переменные (light/dark mode)
- **OpenRouter API** → Claude Sonnet 4 (генерация ответов)
- **YuKassa** — оплата (российский процессинг)
- **Vercel** — хостинг
- **Яндекс.Метрика** — аналитика

## Структура
```
src/
├── app/
│   ├── page.tsx              # Лендинг (hero, фичи, pricing, social proof)
│   ├── auth/                 # Magic link авторизация
│   ├── onboarding/           # Онбординг — настройка бизнес-профиля
│   ├── quick-reply/          # ГЛАВНАЯ ФИЧА — генерация ответов
│   ├── settings/             # Настройки бизнеса + Deep Research
│   ├── dashboard/            # Дашборд (подписка, статистика, рефералы, промокоды)
│   ├── history/              # История ответов
│   ├── pricing/              # Тарифы
│   ├── challenge/            # Публичное демо (без авторизации)
│   ├── payment/success/      # Успешная оплата
│   ├── privacy/ & terms/     # Юридические страницы
│   └── api/                  # 12 API-эндпоинтов
├── components/               # UI-компоненты (ResponseCard, ReviewInput, Paywall...)
├── lib/                      # Утилиты, supabase клиенты
└── types/                    # TypeScript типы
extension/                    # Chrome-расширение для маркетплейсов
supabase/                     # Миграции БД
```

## Пользовательский флоу
1. Лендинг → Попробовать бесплатно (/challenge)
2. Регистрация (magic link email)
3. Онбординг — настройка бизнеса (название, тип, город, тон)
4. Quick Reply — вставляешь отзыв → получаешь 4-5 вариантов ответа
5. Копируешь и отправляешь на площадку

## Генерация ответов (core logic)
- **API:** `/api/generate` → OpenRouter → Claude Sonnet 4
- **Тона:** Нейтральный, Эмпатичный, Решение, Пассивно-агрессивный, Хардкор
- **Вход:** текст отзыва + рейтинг + контекст + бизнес-профиль
- **Выход:** JSON с 4-5 вариантами + анализ тональности + срочность
- **Скриншоты:** поддержка OCR через vision-модель

## Монетизация
| Тариф | Цена | Лимит |
|-------|------|-------|
| Free | 0₽ | 15 ответов/мес |
| Старт | 490₽/мес | Безлимит |
| Про | 1490₽/мес | Команда + приоритетная поддержка |

7 дней полного доступа при регистрации. Промокоды. Реферальная система.

## База данных
Таблицы: `businesses`, `reviews`, `response_history`, `subscriptions`, `payments`, `promo_codes`, `referral_links`, `referral_visits`, `referral_bonuses`

RLS на всех таблицах — юзер видит только свои данные.

## API-эндпоинты
- `/api/generate` — генерация ответов (core)
- `/api/business` — CRUD бизнес-профиля
- `/api/research` — Deep Research (AI изучает бизнес онлайн)
- `/api/history` — история ответов
- `/api/subscription` — статус подписки
- `/api/payment/create` + `/api/payment/webhook` — YuKassa
- `/api/promo` — активация промокодов
- `/api/referral` — реферальная система
- `/api/feedback` — лайк/дизлайк ответов
- `/api/challenge` — публичное демо
- `/api/ai-proxy/[target]/[...path]` — прокси для расширения

## Дизайн
- **Brand color:** Teal #1E8B8B (палитра "Calm Authority")
- Light mode: тёплый нейтральный (#faf9f7), primary #1E8B8B
- Dark mode: глубокий тёмный (#0a0a0a), primary #3DBDBD
- Logo: MY=#1E8B8B (teal), REPLY=#1A2332 (deep navy) / currentColor в тёмной теме
- Шрифты: Geist Sans + Geist Mono (с кириллицей)
- Переключатель темы: data-theme атрибут

## Git
https://github.com/Frogface607/MYREPLY.git

## Env-переменные
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `NEXT_PUBLIC_APP_URL`, `YUKASSA_SHOP_ID`, `YUKASSA_SECRET_KEY`, `AI_PROXY_SECRET`, `NEXT_PUBLIC_METRIKA_ID`, `NEXT_PUBLIC_EXTENSION_ID`

## Приоритеты запуска
- Дизайн и брендинг (фирменный стиль, лого)
- Лендинг — улучшить визуал и конверсию
- Chrome-расширение — доделать для WB/Ozon/Yandex.Market
- SEO + маркетинг
- Продакшн-домен: my-reply.ru

## Важно
- Все тексты на русском (российский рынок)
- Оплата через YuKassa (не Stripe)
- AI через OpenRouter (не напрямую Anthropic API)
- middleware.ts — защита роутов, обновление сессий
