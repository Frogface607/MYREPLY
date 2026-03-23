# MyReply — Freepik Spaces Guide

> Инструкция для создания брендированного контента в Freepik Spaces
> Палитра, стиль, промпты для 10 постов, сборка воркфлоу

---

## 1. Брендинг-инструкция

### Палитра

| Название | HEX | Где используем |
|----------|-----|---------------|
| Teal (primary) | #1E8B8B | Акценты, лого, CTA-элементы |
| Teal Light | #3DBDBD | Свечение, градиенты |
| Deep Navy | #1A2332 | Текст на светлом фоне |
| Warm White | #FAF9F7 | Фон Clean-режима |
| Dark BG | #0A0A0A | Фон Dark/Pain-режима |
| Alert Red | #E74C3C | Акценты в Dark/Pain (звёзды, уведомления) |
| Warm Yellow | #F2C94C | Акценты в Bright/Fun |

### Стиль

- **Общий:** Современный, минималистичный, чистый. Не корпоративный — скорее как Notion, Linear, Arc.
- **Типографика:** Крупные заголовки, много воздуха, контраст размеров.
- **Форма:** Скруглённые углы (border-radius), мягкие тени, карточки.
- **Настроение:** Уверенный и спокойный. Не кричащий, не дешёвый.
- **Лого:** В правом нижнем углу, полупрозрачное или мелкое. Не доминирует.
- **Формат:** Квадрат 1:1 (1080x1080px) — оптимально для TG и Instagram.

### 3 визуальных режима

**Dark/Pain** (для постов 2, 3, 6):
- Фон: тёмный (#0A0A0A) или очень тёмный градиент
- Акценты: красный (#E74C3C), оранжевый
- Настроение: тревога, усталость, одиночество
- Элементы: экран телефона в темноте, уведомления, звёзды-рейтинг

**Bright/Fun** (для постов 5, 7, 8):
- Фон: яркий градиент или насыщенные цвета
- Акценты: teal + жёлтый (#F2C94C)
- Настроение: юмор, энергия, дерзость
- Элементы: речевые пузыри, emoji-стиль, контрасты

**Clean/Solution** (для постов 1, 4, 9, 10):
- Фон: светлый (#FAF9F7) или белый
- Акценты: teal (#1E8B8B)
- Настроение: уверенность, профессионализм, решение
- Элементы: UI-элементы, чистая типографика, карточки

---

## 2. Промпты для 10 картинок

### Общая инструкция для Text node (подключить к генератору):

```
Brand style guidelines:
- Color palette: teal #1E8B8B (primary), deep navy #1A2332, warm white #FAF9F7
- Style: modern minimalist, clean, professional but friendly. Like Notion, Linear, Arc aesthetic.
- Elements: rounded corners, soft shadows, card-based layouts
- Format: square 1:1
- CRITICAL: absolutely NO text, NO letters, NO words, NO numbers, NO typography, NO labels, NO captions on the image. Pure visual only.
- NO stock photo feel, NO corporate cliché, NO generic clip-art
- Abstract and conceptual compositions preferred over literal depictions
```

### Промпт 1 — Приветствие (Clean)

```
Abstract minimalist composition: a glowing teal #1E8B8B geometric shield shape floating in center, surrounded by soft orbiting speech bubble shapes in light teal. Clean warm white #FAF9F7 background. Gentle ambient glow around the shield. Feeling of protection and trust. Rendered in modern flat vector style with soft gradients and subtle depth. No text, no letters, no words. Square 1:1 format.
```

### Промпт 2 — Стресс/пятничный отзыв (Dark/Pain)

```
Moody atmospheric scene: a lone glowing phone screen in complete darkness, casting cold blue light on a desk surface. A single bright red #E74C3C star shape floats above the screen like a warning. Deep black #0A0A0A background with subtle blue-teal undertones in the shadows. Isolation and anxiety mood. Cinematic lighting, modern digital art style. No text, no letters, no words, no UI elements. Square 1:1 format.
```

### Промпт 3 — "Хватит унижаться" (Dark/Pain)

```
Dramatic abstract composition: a silhouette figure standing upright and confident, with crumpled paper shapes dissolving into particles below their feet. Dark background #0A0A0A with powerful teal #1E8B8B backlight creating a halo effect behind the figure. Mood of empowerment and breaking free. Bold geometric composition, modern illustration style. No text, no letters, no words. Square 1:1 format.
```

### Промпт 4 — Deep Research (Clean)

```
Elegant abstract data visualization: interconnected glowing nodes forming a constellation pattern. Nodes are different sizes — representing stars, map pins, and social icons as abstract circles. Connected by thin luminous teal #1E8B8B lines on clean white #FAF9F7 background. Neural network meets star map aesthetic. Sophisticated, techy but warm. No text, no letters, no numbers, no labels. Square 1:1 format.
```

### Промпт 5 — До/После (Bright/Fun)

```
Bold split composition divided diagonally: left half is grayscale, flat, lifeless with a dull gray speech bubble shape. Right half explodes with color — vibrant teal #1E8B8B speech bubble radiating warmth and energy, small colorful particles flying out. Bright gradient background blending yellow #F2C94C into teal. Transformation energy. Modern graphic design style. No text, no letters, no words. Square 1:1 format.
```

### Промпт 6 — Время/часы (Dark/Pain)

```
Surreal abstract concept: a melting clock face dissolving into flowing teal #1E8B8B liquid particles that float upward like fireflies. Dark background #0A0A0A. Scattered red #E74C3C geometric star shapes caught in the dissolving stream. Dreamy yet dramatic atmosphere. Inspired by Dalí but rendered in clean modern digital art style. No text, no numbers, no letters on the clock. Square 1:1 format.
```

### Промпт 7 — 5 тонов (Bright/Fun)

```
Five abstract speech bubble shapes arranged in a dynamic fan/arc pattern, each a distinctly different color and personality: calm ocean blue, warm coral pink, sharp electric green, mysterious deep purple, fierce bold red. Each has a unique abstract texture or pattern inside. Bright cheerful background gradient from yellow #F2C94C to teal #1E8B8B. Playful, energetic composition. No text, no letters, no emoji, no faces. Square 1:1 format.
```

### Промпт 8 — Кринж-отзывы (Bright/Fun)

```
Playful chaotic composition: three abstract card shapes floating at tilted angles, each with different sized star shapes on them in contradictory arrangements (big stars mixed with tiny stars, upside-down stars). Cards have exaggerated shadows and perspective. Bright background with teal #1E8B8B and yellow #F2C94C splashes. Comic energy meets clean design. No text, no numbers, no letters, no faces. Square 1:1 format.
```

### Промпт 9 — Репутация/факт (Clean)

```
Minimalist conceptual illustration: a large abstract upward arrow shape made of tiny human silhouette figures, some figures walking toward a glowing teal #1E8B8B beacon shape, some walking away into gray. Clean white #FAF9F7 background. Data visualization feel — authoritative but human. Modern infographic aesthetic without actual numbers. No text, no numbers, no percentages, no letters. Square 1:1 format.
```

### Промпт 10 — Как это работает (Clean)

```
Clean abstract process flow: three connected geometric shapes progressing left to right — a rough angular shape (input), a glowing teal #1E8B8B sphere with orbital rings (processing), and five smooth card shapes fanning out elegantly (output). Connected by flowing curved lines. Clean white #FAF9F7 background. Modern UI-inspired abstract design. No text, no numbers, no labels, no arrows with text. Square 1:1 format.
```

---

## 3. Воркфлоу: по одному промпту, 10 вариантов

### Схема Space

```
[Text: брендинг-инструкция] ──→ [Image Generator (Flux)]
[Text: промпт поста N]      ──→ [Image Generator]
[Upload: лого MyReply]       ──→ [Image Generator] (reference)
                                        ↓
                                  10 вариантов
                                        ↓
                                 Выбираешь лучший
                                        ↓
                                 [Image Upscaler (Magnific)]
                                        ↓
                                    Готово!
```

### Настройки Image Generator
- **Model:** Flux (консистентнее для иллюстраций) или Nanobanana Pro (реалистичнее)
- **Aspect ratio:** 1:1 (квадрат)
- **Количество:** 10 (генерит 10 вариантов за раз)
- **Лого:** подключи как reference image

### Процесс работы
1. Подключи Text node с брендинг-инструкцией + лого
2. Вставь промпт поста 1 в Text node → запусти → выбери лучший из 10
3. Упскейль лучший через Magnific
4. Замени промпт на пост 2 → запусти → выбери → упскейль
5. Повтори для всех 10 постов
6. Итого: ~10 запусков × 10 вариантов = 100 генераций, выбираешь 10 лучших

---

## 4. После генерации

1. Скачай все 10 картинок
2. Скинь мне (или просто скажи "готово")
3. Я отправлю посты с картинками в канал @myreply_ru через бота

---

## 5. Советы

- **Flux** лучше держит консистентность стиля между картинками
- **Nanobanana Pro** — попробуй если Flux даёт слишком "плоский" результат
- Упскейл через **Magnific** сделает картинки чётче (особенно для Instagram)
- Если на картинке появляется текст/буквы — перегенери, иногда модель игнорирует "no text"
- Лого лучше наложить поверх в редакторе Freepik (полупрозрачное, правый нижний угол)
- Сохрани Space — потом просто меняешь промпт и генеришь новый контент за минуты
- **10 вариантов** — не жалей кредитов, лучше выбрать из 10 чем мириться с одним
