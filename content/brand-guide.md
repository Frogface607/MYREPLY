# MyReply — Brand Guide

## 1. Философия бренда

### Миссия
Вернуть владельцам бизнеса спокойствие. Негативный отзыв — больше не оружие.

### Позиционирование
AI-ассистент, который отвечает на отзывы профессионально, быстро и с характером. 
Не робот, а умный коллега с чувством юмора.

### Тон голоса
- **Профессионал с характером** — мы серьёзно относимся к работе, но не к себе
- **Дружелюбный, но не панибратский** — обращаемся на "вы" в продукте, на "ты" в соцсетях
- **Уверенный** — мы знаем, что делаем. Без слов "попробуем", "может быть"
- **Ироничный когда уместно** — в стиле Slack, Notion, Linear. Не клоунада, а подмигивание

### Ключевые сообщения
1. "Негативный отзыв? Больше не ваша проблема."
2. "5 идеальных ответов за 30 секунд"
3. "Не позволяйте чужому мнению управлять вашим днём"
4. "AI знает ваш бизнес. Отвечает как вы — только быстрее"

---

## 2. Цветовая палитра

### Концепция
**Индиго + янтарный акцент** — технологичность AI + тепло человечности.
Индиго — современный, глубокий, отличается от generic blue.
Янтарный — энергия, тепло, "защита" (как щит).

### Light Mode

| Роль | Цвет | HEX | Использование |
|------|-------|-----|---------------|
| **Background** | Тёплый белый | `#FAFAF8` | Фон страниц |
| **Foreground** | Глубокий чёрный | `#111111` | Основной текст |
| **Primary** | Индиго | `#6366F1` | Кнопки, ссылки, акценты |
| **Primary Hover** | Тёмный индиго | `#4F46E5` | Hover-состояния |
| **Primary Light** | Лавандовый | `#EEF2FF` | Фон badges, подложки |
| **Accent** | Янтарный | `#F59E0B` | CTA-акценты, звёзды, highlights |
| **Accent Light** | Светлый янтарь | `#FEF3C7` | Фон предупреждений |
| **Success** | Изумруд | `#059669` | Позитив, подтверждения |
| **Success Light** | | `#D1FAE5` | Фон успехов |
| **Danger** | Коралл | `#EF4444` | Ошибки, негатив |
| **Danger Light** | | `#FEE2E2` | Фон ошибок |
| **Muted** | Серый | `#6B7280` | Вторичный текст |
| **Muted Light** | | `#F3F4F6` | Фон secondary |
| **Border** | | `#E5E7EB` | Границы |
| **Card** | Белый | `#FFFFFF` | Карточки |

### Dark Mode

| Роль | HEX |
|------|-----|
| **Background** | `#09090B` |
| **Foreground** | `#FAFAFA` |
| **Primary** | `#818CF8` |
| **Primary Hover** | `#A5B4FC` |
| **Primary Light** | `#1E1B4B` |
| **Accent** | `#FBBF24` |
| **Accent Light** | `#78350F` |
| **Success** | `#34D399` |
| **Success Light** | `#064E3B` |
| **Danger** | `#F87171` |
| **Danger Light** | `#7F1D1D` |
| **Muted** | `#A1A1AA` |
| **Muted Light** | `#18181B` |
| **Border** | `#27272A` |
| **Card** | `#0F0F12` |

### Градиенты
- **Hero gradient**: `linear-gradient(135deg, #6366F1, #8B5CF6, #A78BFA)` — индиго → фиолетовый
- **CTA glow**: `0 8px 32px rgba(99, 102, 241, 0.3)` — свечение кнопок
- **Accent gradient**: `linear-gradient(135deg, #F59E0B, #EF4444)` — тёплый для highlights

---

## 3. Типографика

### Шрифты
- **Основной**: Geist Sans (уже подключён) — чистый, современный
- **Моноширинный**: Geist Mono — для промокодов, кода

### Размеры
- **Hero h1**: 3.5rem (56px) mobile: 2.25rem (36px)
- **Section h2**: 2.25rem (36px) mobile: 1.75rem (28px)  
- **Card h3**: 1.125rem (18px)
- **Body**: 1rem (16px)
- **Small/Caption**: 0.875rem (14px)
- **Tiny**: 0.75rem (12px)

---

## 4. Логотип

### Концепция
Речевой пузырь (reply/ответ) + стилизованная молния/искра (AI/скорость).
Простой, узнаваемый в 16x16. Работает в ч/б.

### Варианты
1. **Иконка**: Речевой пузырь с молнией внутри
2. **Wordmark**: "MyReply" — "My" обычным весом, "Reply" bold или в другом цвете
3. **Комбинированный**: Иконка + wordmark

### Цвета логотипа
- На светлом фоне: индиго (#6366F1) или чёрный (#111111)
- На тёмном фоне: лавандовый (#A5B4FC) или белый (#FAFAFA)
- Акцентный элемент (молния/искра): янтарный (#F59E0B)

---

## 5. Компоненты UI

### Кнопки
- **Primary**: bg-primary, text-white, rounded-xl, shadow-lg shadow-primary/20
- **Secondary**: border border-border, bg-transparent, hover:border-primary
- **Accent CTA**: bg-gradient (indigo → violet), text-white, с glow-эффектом
- **Ghost**: text-primary, hover:bg-primary-light

### Карточки
- bg-card, border border-border, rounded-2xl
- Hover: shadow-lg, border-primary/30, translateY(-2px)
- Padding: p-6 (desktop), p-4 (mobile)

### Badges/Tags
- bg-primary-light, text-primary, px-3 py-1, rounded-full, text-sm font-medium

### Иконки
- Lucide React (уже используем)
- Размер: w-5 h-5 (стандартный), w-4 h-4 (мелкий), w-6 h-6 (крупный)

---

## 6. Промпты для генерации визуала (Freepik Spaces)

### Стиль-нода (применяется ко всем генерациям):
```
Style: Clean minimalist tech branding. Flat design with subtle gradients. 
Color palette: indigo (#6366F1), amber (#F59E0B), white, dark (#111111).
Aesthetic: Linear.app meets Notion — modern, professional yet friendly.
No photorealistic elements. Vector-like, geometric.
```

### Промпт для логотипа:
```
Minimalist logo for "MyReply" - AI service that writes professional responses to customer reviews.
Speech bubble icon with a lightning bolt or sparkle inside, representing AI speed and intelligence.
Clean geometric shapes. Works at 16x16 favicon size.
Colors: indigo (#6366F1) primary, amber (#F59E0B) accent spark.
Variations: icon only, wordmark, combined.
Black and white version must work perfectly.
Style: tech startup, like Linear, Notion, Vercel logos.
```

### Промпт для контент-карточек (Отзыв дня):
```
Social media card template for "Review of the Day" series.
Layout: customer review quote on top (negative tone), AI response below (professional/funny).
Brand colors: indigo (#6366F1), amber (#F59E0B), white background.
MyReply logo watermark in corner. Format: 1080x1080 for Instagram, 1200x675 for Telegram.
Clean typography, modern tech aesthetic.
```

### Промпт для OG-image:
```
Open Graph preview image for MyReply website. 1200x630px.
Text: "MyReply — Идеальный ответ на отзыв за 30 секунд"
Subtext: "AI-ассистент для бизнеса"
Brand colors: indigo gradient background, white text, amber accent.
Clean, modern, tech aesthetic. Logo in corner.
```
