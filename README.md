# MyReply 💬

**Умные ответы на отзывы без стресса**

MyReply — сервис, который анализирует отзывы и генерирует идеальные ответы. Вы просто копируете готовый текст и идёте дальше заниматься бизнесом.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Перейдите в **SQL Editor** и выполните скрипт из `supabase/schema.sql`
3. Настройте **Authentication**:
   - Перейдите в **Authentication → Providers → Email**
   - Включите **Enable Email provider**
   - Включите **Enable email confirmations** (для Magic Link)
4. Настройте **URL Configuration**:
   - **Site URL**: `http://localhost:3000` (для разработки)
   - **Redirect URLs**: добавьте `http://localhost:3000/auth/callback`

### 3. Настройка переменных окружения

Создайте файл `.env.local`:

```env
# Supabase (найдите в Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key    # Для webhook (Project Settings → API → service_role)

# OpenRouter API (получите на openrouter.ai)
OPENROUTER_API_KEY=sk-or-v1-your-api-key

# ЮKassa (получите в ЛК yookassa.ru → Настройки → Ключи API)
YUKASSA_SHOP_ID=your-shop-id
YUKASSA_SECRET_KEY=your-secret-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Яндекс.Метрика (создайте счётчик на metrika.yandex.ru)
NEXT_PUBLIC_METRIKA_ID=your-counter-id

# Chrome Extension ID (после публикации в Chrome Web Store)
# NEXT_PUBLIC_EXTENSION_ID=your-extension-id
```

> **На Vercel:** добавьте все переменные в Settings → Environment Variables.
> **Webhook ЮKassa:** укажите URL `https://your-domain.vercel.app/api/payment/webhook` в ЛК ЮKassa → Интеграция → HTTP-уведомления.

### 4. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 📁 Структура проекта

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/                 # Magic Link авторизация
│   ├── onboarding/           # Настройка бизнеса
│   ├── dashboard/            # Главная панель
│   ├── quick-reply/          # Генерация ответов
│   ├── history/              # История ответов
│   ├── settings/             # Настройки
│   └── api/
│       ├── generate/         # API генерации через OpenRouter
│       └── history/          # API истории
├── components/
│   ├── ResponseCard.tsx      # Карточка ответа
│   ├── ReviewInput.tsx       # Ввод отзыва
│   └── AdjustmentInput.tsx   # Уточнение пожеланий
├── lib/
│   ├── openrouter.ts         # Интеграция с OpenRouter
│   └── supabase/             # Клиенты Supabase
└── types/
    └── index.ts              # TypeScript типы
```

## ✨ Возможности

- **Quick Reply** — вставьте отзыв, получите 3 варианта ответа
- **Персонализация** — настройте тон и правила под свой бизнес
- **Память** — система запоминает ваш стиль
- **История** — все ответы сохраняются
- **Любая площадка** — работает с Яндекс, Google, 2ГИС, Ozon, WB...

## 🛠 Технологии

- **Next.js 16** — React фреймворк
- **Supabase** — БД и авторизация
- **OpenRouter** — доступ к AI моделям
- **Tailwind CSS 4** — стилизация
- **TypeScript** — типизация

## 📝 Лицензия

MIT
