# MyReply Chrome Extension

Расширение добавляет MyReply прямо в кабинеты продавца:

- Wildberries: `seller.wildberries.ru`
- Ozon: `seller.ozon.ru`
- Яндекс.Маркет: `partner.market.yandex.ru`

Главное отличие от нативных AI-ответов маркетплейсов: MyReply не просто зеркалит текст отзыва. Расширение подтягивает бизнес-профиль из MyReply и генерирует ответ с учетом продукта, сильных сторон, типовых проблем, правил компенсаций и тона бренда.

## Development Install

1. Открой Chrome -> `chrome://extensions/`.
2. Включи Developer mode.
3. Нажми Load unpacked.
4. Выбери папку `extension`.
5. Войди через `https://myreply.vercel.app/auth`.

## How It Works

1. Content scripts добавляют кнопку MyReply рядом с отзывами на WB, Ozon и Яндекс.Маркете.
2. При клике текст отзыва передается в popup.
3. Popup получает:
   - access token пользователя из `chrome.storage.local`;
   - лимиты через `GET /api/subscription`;
   - бизнес-профиль через `GET /api/business`.
4. Генерация идет через `POST /api/generate` с `businessSettings`, поэтому ответы учитывают профиль бизнеса.

## API Endpoints

- `GET /api/subscription` - лимиты и тариф.
- `GET /api/business` - профиль бизнеса.
- `POST /api/generate` - генерация ответов.

Все endpoints поддерживают сайтовые cookies и `Authorization: Bearer <supabase_access_token>` для расширения.

## Positioning

Короткий тезис для запуска:

> WB/Ozon AI отвечает как generic-помощник маркетплейса. MyReply отвечает как ваш менеджер: знает продукт, правила бизнеса, что можно обещать клиенту, а что нельзя.

## Release Checklist

1. Проверить unpacked extension в Chrome.
2. После публикации в Chrome Web Store прописать ID расширения в Vercel env `NEXT_PUBLIC_EXTENSION_ID`.
3. Сделать 3-5 скриншотов:
   - кнопка MyReply рядом с отзывом;
   - popup с подключенным бизнес-профилем;
   - варианты ответов;
   - экран профиля бизнеса на сайте.
4. Собрать ZIP из содержимого папки `extension`.
5. Отправить в Chrome Web Store moderation.

Пока домен `my-reply.ru` не восстановлен, расширение использует production URL `https://myreply.vercel.app`.
