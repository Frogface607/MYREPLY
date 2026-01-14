# MyReply Chrome Extension

Браузерное расширение для генерации ответов на отзывы прямо на площадках:
- Wildberries (seller.wildberries.ru)
- Ozon (seller.ozon.ru)
- Яндекс.Маркет (partner.market.yandex.ru)

## Установка для разработки

1. Создай иконки PNG (см. `/icons/README.md`)

2. Открой Chrome → `chrome://extensions/`

3. Включи "Режим разработчика" (справа вверху)

4. Нажми "Загрузить распакованное"

5. Выбери папку `/extension`

## Структура

```
extension/
├── manifest.json       # Конфиг расширения (Manifest V3)
├── background.js       # Service Worker
├── popup/
│   ├── popup.html     # UI popup
│   ├── popup.css      # Стили
│   └── popup.js       # Логика
├── content/
│   ├── styles.css     # Общие стили для кнопок
│   ├── wildberries.js # Content script для WB
│   ├── ozon.js        # Content script для Ozon
│   └── yandex-market.js # Content script для Я.Маркет
└── icons/
    └── README.md      # Инструкции по иконкам
```

## Как работает

1. **Content Scripts** добавляют кнопку "MyReply" рядом с отзывами на площадках

2. При клике на кнопку — текст отзыва сохраняется и открывается **Popup**

3. В Popup пользователь может:
   - Добавить контекст
   - Выбрать режим ответа
   - Сгенерировать ответы
   - Скопировать понравившийся

4. **Background Script** обрабатывает коммуникацию между компонентами

## API Endpoints

Расширение использует:
- `POST /api/generate` — генерация ответов
- `GET /api/subscription` — проверка лимитов

## Авторизация

При первой установке расширение откроет страницу авторизации на myreply.vercel.app.
После входа токен сохраняется в `chrome.storage.local`.

## Публикация

1. Создать аккаунт разработчика в [Chrome Web Store](https://chrome.google.com/webstore/devconsole)

2. Заплатить $5 регистрационный сбор

3. Подготовить:
   - ZIP архив с расширением
   - Скриншоты (1280x800)
   - Описание
   - Политику конфиденциальности

4. Загрузить и отправить на модерацию (1-3 дня)

## Тестирование

Для тестирования без публикации:
1. Загрузи как "распакованное расширение"
2. Открой seller.wildberries.ru / seller.ozon.ru
3. Найди отзыв и проверь появление кнопки MyReply
