# "Расскажите свою правду" Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "your truth / business context" feature prominent in the UI form and landing page as a key competitive advantage.

**Architecture:** Two files modified — ReviewInput.tsx (card-banner replacing text link) and page.tsx (new landing section + comparison update on pricing page). No API/backend changes needed.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Lucide icons

---

## Chunk 1: UI — Card Banner in ReviewInput

### Task 1: Redesign context toggle in ReviewInput.tsx

**Files:**
- Modify: `src/components/ReviewInput.tsx:200-228`

- [ ] **Step 1: Replace text link with card-banner (collapsed state)**

Replace lines 200-228 (the context section) with a card-banner component:

```tsx
{/* Context — "Расскажите свою правду" */}
<div>
  <button
    type="button"
    onClick={() => setShowContext(!showContext)}
    className="w-full text-left p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer group"
    disabled={isLoading}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">Расскажите свою правду</p>
          <p className="text-xs text-muted mt-0.5">AI учтёт вашу версию и не будет извиняться, если вы не виноваты</p>
        </div>
      </div>
      <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${showContext ? 'rotate-180' : ''}`} />
    </div>
  </button>

  {showContext && (
    <div className="mt-3 animate-fade-in">
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Например: Гость пришёл за 20 минут до закрытия, заказал сложное блюдо. Предупредили, что ждать дольше — согласился. Потом начал снимать персонал на камеру и провоцировать конфликт..."
        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-light outline-none resize-none text-sm"
        rows={3}
        disabled={isLoading}
      />
      <p className="text-xs text-muted mt-1.5">
        AI корректно изложит вашу позицию и сохранит профессиональный тон
      </p>
    </div>
  )}
</div>
```

- [ ] **Step 2: Add Shield and ChevronDown to imports**

Update the lucide-react import on line 2 to include `Shield` and `ChevronDown`:

```tsx
import { Sparkles, Loader2, AlertCircle, Star, ImagePlus, X, Camera, Shield, ChevronDown } from 'lucide-react';
```

- [ ] **Step 3: Verify in preview**

Navigate to `/quick-reply` in preview. Check:
- Card-banner is visible between rating and submit button
- Click expands/collapses textarea
- Chevron rotates on toggle
- Placeholder text is visible
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/ReviewInput.tsx
git commit -m "feat: redesign context toggle as prominent card-banner

Replace hidden text link with visible card with shield icon,
title 'Расскажите свою правду' and description."
```

---

## Chunk 2: Landing — New "Your Truth" Section

### Task 2: Add "Your Truth" section to landing page

**Files:**
- Modify: `src/app/page.tsx` — insert new section after ExamplesSection (line 269), before "Who It's For" section (line 271)

- [ ] **Step 1: Add Scale to lucide imports**

Add `Scale` to the import on line 2:

```tsx
import { ArrowRight, Clock, Shield, Check, Search, Settings, MessageSquare, Chrome, Zap, Building2, Utensils, Hotel, Scissors, Stethoscope, Car, Copy, Star, TrendingUp, Brain, Eye, Palette, Scale } from 'lucide-react';
```

- [ ] **Step 2: Insert new section after ExamplesSection**

After `<ExamplesSection />` (line 269) and before the "Who It's For" section, add:

```tsx
{/* ─── YOUR TRUTH ─── */}
<section className="py-24 sm:py-32 px-4 sm:px-6">
  <div className="max-w-5xl mx-auto">
    <div className="text-center mb-16">
      <p className="text-primary font-medium mb-4 tracking-wide uppercase text-xs">
        Ваша правда
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
        Клиент не всегда прав.<br />AI это понимает.
      </h2>
      <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
        Расскажите что произошло на самом деле — AI не будет извиняться
        за то, в чём вы не виноваты.
      </p>
    </div>

    {/* Interactive example */}
    <div className="max-w-3xl mx-auto mb-16">
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        {/* Review */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[1].map((s) => (
                <Star key={s} className="w-4 h-4 text-warning fill-warning" />
              ))}
              {[2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 text-border" />
              ))}
            </div>
            <span className="text-xs text-muted">Яндекс.Карты</span>
          </div>
          <p className="text-sm leading-relaxed">
            &laquo;Худшее заведение в городе! Пришли отметить день рождения, ждали еду полтора часа.
            Официант хамил и закатывал глаза. Половину заказа перепутали. Именинница расплакалась.
            НЕ ХОДИТЕ СЮДА!&raquo;
          </p>
        </div>

        {/* Your truth */}
        <div className="p-6 border-b border-border/50 bg-primary/5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Ваша правда</span>
          </div>
          <p className="text-sm text-muted leading-relaxed italic">
            &laquo;Компания из 12 человек пришла без брони в пятницу вечером. Мы нашли стол за 10 минут.
            Заказ на 12 персон готовили 40 минут — это нормально для горячего. Одна гостья
            начала снимать персонал на телефон и оскорблять повара. Мы вежливо попросили прекратить.
            Перепутали один гарнир — заменили бесплатно за 5 минут.&raquo;
          </p>
        </div>

        {/* AI response */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Ответ MyReply</span>
          </div>
          <p className="text-sm leading-relaxed">
            &laquo;Здравствуйте! Спасибо за обратную связь, нам важно каждое мнение.
            Хотим уточнить детали: ваша компания из 12 человек пришла без предварительного
            бронирования в пятничный вечер — мы нашли столик за 10 минут. Время приготовления
            горячих блюд на 12 персон составило около 40 минут, что является стандартным.
            Единственная ошибка — перепутанный гарнир — была исправлена в течение 5 минут.
            Мы дорожим каждым гостем и всегда готовы к диалогу. Будем рады видеть вас снова
            — рекомендуем бронировать стол заранее для большой компании.&raquo;
          </p>
        </div>
      </div>
    </div>

    {/* Feature icons */}
    <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
      {[
        {
          icon: Shield,
          title: 'Не извиняется за то, в чём вы не виноваты',
          desc: 'AI не будет унижаться и просить прощения, если вы правы',
        },
        {
          icon: MessageSquare,
          title: 'Излагает вашу позицию',
          desc: 'Факты и контекст — корректно, без эмоций, но твёрдо',
        },
        {
          icon: Scale,
          title: 'Профессиональный тон',
          desc: 'Ответ защищает репутацию и не опускается до уровня конфликта',
        },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
          <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify in preview**

Navigate to `/` in preview. Check:
- New section appears after Examples, before "Кому подходит"
- Three-part example card renders correctly (review → truth → response)
- Three feature icons display below
- Responsive on mobile
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add 'Your Truth' section to landing page

New section showcasing the business context feature with
a real-world example: review, owner's truth, and AI response."
```

---

## Chunk 3: Pricing — Update comparison to three columns

### Task 3: Expand comparison section on pricing page

**Files:**
- Modify: `src/app/pricing/page.tsx:261-282`

- [ ] **Step 1: Add Scale and MessageSquare to lucide imports**

Update line 5 of `src/app/pricing/page.tsx`:

```tsx
import { ArrowLeft, Check, Sparkles, Loader2, Crown, X, Shield, Clock, Zap, Scale, MessageSquare } from 'lucide-react';
```

- [ ] **Step 2: Replace comparison section (lines 261-282) with three columns**

Replace the entire comparison `<div>` block:

```tsx
{/* Comparison: Three levels of response */}
<div className="bg-card border border-border rounded-2xl p-8 mb-8">
  <h3 className="text-xl font-semibold text-center mb-2">Три уровня ответа</h3>
  <p className="text-sm text-muted text-center mb-6">На один и тот же негативный отзыв</p>
  <p className="text-xs text-center text-muted mb-6 italic">
    Отзыв: &laquo;Заказала платье на выпускной дочери. Пришло не того размера, ткань дешёвая, швы торчат. Дочь плакала. Продавцы-мошенники!&raquo;
  </p>
  <div className="grid md:grid-cols-3 gap-4">
    <div className="p-5 bg-muted-light rounded-xl">
      <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Free — базовый</p>
      <p className="text-sm leading-relaxed italic text-muted">
        &laquo;Благодарим за отзыв. Нам жаль, что вы остались недовольны.
        Мы учтём ваши замечания и постараемся стать лучше. Будем рады видеть вас снова.&raquo;
      </p>
      <span className="inline-block mt-3 px-2 py-1 bg-muted-light border border-border rounded text-xs text-muted">Шаблонный</span>
    </div>
    <div className="p-5 bg-primary-light rounded-xl border border-primary/20">
      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Старт — с профилем</p>
      <p className="text-sm leading-relaxed italic">
        &laquo;Здравствуйте! Нам очень жаль, что платье не оправдало ожиданий.
        В нашем магазине &quot;Стиль&quot; все товары проходят проверку качества перед отправкой.
        Напишите нам — оформим возврат или обмен на нужный размер. Хотим, чтобы
        выпускной вашей дочери прошёл идеально!&raquo;
      </p>
      <span className="inline-block mt-3 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary">Персональный</span>
    </div>
    <div className="p-5 bg-primary/5 rounded-xl border border-primary/30">
      <div className="flex items-center gap-1.5 mb-3">
        <Shield className="w-3.5 h-3.5 text-primary" />
        <p className="text-xs font-medium text-primary uppercase tracking-wider">+ Ваша правда</p>
      </div>
      <p className="text-sm leading-relaxed italic">
        &laquo;Здравствуйте! Хотим уточнить: размер был указан корректно в карточке товара,
        и мы дважды подтверждали его с вами в переписке. Ткань — натуральный хлопок,
        сертификаты качества доступны по запросу. Если размер не подошёл — готовы
        оформить обмен. Мы дорожим каждым клиентом и работаем прозрачно.&raquo;
      </p>
      <span className="inline-block mt-3 px-2 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-primary font-medium">Защищает репутацию</span>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Verify in preview**

Navigate to `/pricing` in preview. Check:
- Three columns display correctly
- Tags are visible under each response ("Шаблонный" / "Персональный" / "Защищает репутацию")
- Responsive: stacks vertically on mobile
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/app/pricing/page.tsx
git commit -m "feat: expand pricing comparison to three columns

Add 'Your Truth' as third column showing how business context
changes the AI response from apologetic to reputation-defending."
```

---

## Chunk 4: Final verification and push

### Task 4: Build, verify, and push

- [ ] **Step 1: Run build**

```bash
cd D:/PROJECTS/MYREPLY && npm run build
```

Expected: Build succeeds with 0 TypeScript errors.

- [ ] **Step 2: Preview verification**

Check both `/` and `/pricing` pages in preview — all new sections render correctly.

- [ ] **Step 3: Push to Vercel**

```bash
git push origin main
```

- [ ] **Step 4: Verify deployment on Vercel**
