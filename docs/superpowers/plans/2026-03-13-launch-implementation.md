# MyReply Launch Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure pricing from Free(15)/Start(490)/Pro(1490) to Free(5)/Start(790)/Pro(1990), implement feature gating, update landing/pricing pages, and add CSV export.

**Architecture:** Update type constants → propagate to API routes → update UI components → update landing page. All changes are additive — no DB migrations needed (subscription table schema unchanged).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase, YuKassa

**Spec:** `docs/superpowers/specs/2026-03-13-launch-strategy-design.md`

### Scope Note
This plan covers **code changes only** (pricing, feature gating, UI updates). The following spec items are intentionally deferred to separate plans/sessions:
- Promo code creation in DB (marketing session)
- Challenge page overhaul with feed/voting (separate plan)
- TG bot and content automation (separate session)
- Infrastructure monitoring / VPS proxy (if needed after Stage 1)
- Subscription lifecycle (downgrade/cancellation — post-launch when users exist)

---

## File Map

### Modified Files
| File | Responsibility | Tasks |
|------|---------------|-------|
| `src/types/index.ts` | Plan constants, feature gates | 1 |
| `src/app/pricing/page.tsx` | Pricing page UI | 2 |
| `src/components/Paywall.tsx` | Upgrade modals, usage counter | 3 |
| `src/app/page.tsx` | Landing page pricing section | 4 |
| `src/app/api/payment/create/route.ts` | YuKassa payment creation | 5 |
| `src/app/api/payment/webhook/route.ts` | YuKassa webhook | 5 |
| `src/app/api/generate/route.ts` | Hardcore gating by plan | 6 |
| `src/app/quick-reply/page.tsx` | Feature gating UI, hardcore toggle, upsell | 6, 7 |
| `src/app/api/history/route.ts` | CSV export endpoint | 8 |
| `src/app/history/page.tsx` | Export button + empty state upsell | 9 |
| `CLAUDE.md` | Documentation | 10 |

---

## Chunk 1: Pricing Constants & Types

### Task 1: Update Plan Constants

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Update PlanType — remove 'business'**

In `src/types/index.ts`, find the `PlanType` union type and remove `'business'`:

```typescript
// BEFORE:
export type PlanType = 'free' | 'start' | 'pro' | 'business';

// AFTER:
export type PlanType = 'free' | 'start' | 'pro';
```

- [ ] **Step 2: Update PLAN_LIMITS**

```typescript
// BEFORE:
export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 15, start: 999999, pro: 999999, business: 999999,
};

// AFTER:
export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 5, start: 999999, pro: 999999,
};
```

- [ ] **Step 3: Update PLAN_PRICES (kopecks)**

```typescript
// BEFORE:
export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0, start: 49000, pro: 149000, business: 149000,
};

// AFTER:
export const PLAN_PRICES: Record<PlanType, number> = {
  free: 0, start: 79000, pro: 199000,
};
```

- [ ] **Step 4: Update PLAN_NAMES — remove business**

```typescript
// AFTER:
export const PLAN_NAMES: Record<PlanType, string> = {
  free: 'Free', start: 'Старт', pro: 'Про',
};
```

- [ ] **Step 5: Update PLAN_FEATURES inline type and values**

The current code uses an **inline type** in the Record generic (NOT a named interface). Add `hardcoreMode` and `csvExport` fields to the inline type. Keep existing field types (`multipleBusinesses: number`, `multipleUsers: number`, `history: boolean | number`) to avoid breaking consumers:

```typescript
export const PLAN_FEATURES: Record<PlanType, {
  businessProfile: boolean;
  deepResearch: boolean;
  toneSettings: boolean;
  history: boolean | number; // true = all, number = last N, false/0 = none
  chromeExtension: boolean;
  multipleBusinesses: number; // number of profiles
  multipleUsers: number;     // number of users
  invoicePayment: boolean;
  hardcoreMode: boolean;     // NEW — Pro only
  csvExport: boolean;        // NEW — Pro only
}> = {
  free: {
    businessProfile: false,
    deepResearch: false,
    toneSettings: false,
    history: 0,               // was 5, now 0 (no history on free)
    chromeExtension: false,
    multipleBusinesses: 0,    // keep as number
    multipleUsers: 1,         // keep as number
    invoicePayment: false,
    hardcoreMode: false,
    csvExport: false,
  },
  start: {
    businessProfile: true,
    deepResearch: true,
    toneSettings: true,
    history: true,            // keep as boolean true = unlimited
    chromeExtension: false,   // was true, now false (not ready for v1)
    multipleBusinesses: 1,
    multipleUsers: 1,
    invoicePayment: false,
    hardcoreMode: false,
    csvExport: false,
  },
  pro: {
    businessProfile: true,
    deepResearch: true,
    toneSettings: true,
    history: true,
    chromeExtension: false,   // not ready for v1
    multipleBusinesses: 5,
    multipleUsers: 3,
    invoicePayment: true,
    hardcoreMode: true,
    csvExport: true,
  },
};
```

Remove the entire `business: { ... }` entry.

- [ ] **Step 6: Fix all 'business' plan references in codebase**

Search and fix:
```bash
grep -rn "'business'" src/ --include="*.ts" --include="*.tsx" -l
```

For any found references: replace `'business'` with `'pro'` (they had identical config). Also check for `plan === 'business'` conditionals and remove them.

- [ ] **Step 7: Verify build**

```bash
cd D:/PROJECTS/MYREPLY && npx next build 2>&1 | head -30
```

Fix any TypeScript errors. If `multipleBusinesses` or `multipleUsers` are compared as booleans anywhere, those comparisons need updating too:
```bash
grep -rn "multipleBusinesses\|multipleUsers" src/ --include="*.ts" --include="*.tsx"
```

- [ ] **Step 8: Commit**

```bash
git add src/types/index.ts
# + any files fixed in steps 6-7
git commit -m "feat: update pricing constants — Free(5)/Start(790)/Pro(1990), remove business plan"
```

---

## Chunk 2: UI Updates (Pricing Page, Landing, Paywall)

### Task 2: Update Pricing Page

**Files:**
- Modify: `src/app/pricing/page.tsx`

- [ ] **Step 1: Update Free tier card**

Find the Free plan card and update:
- Limit: `15` → `5`
- Features: remove any mention of history, business profile, tone settings
- Keep: "Базовая генерация", "5 ответов/мес", "Загрузка скриншотов"

- [ ] **Step 2: Update Start tier card**

Find the Start plan card and update:
- Price: `490` → `790` everywhere (including CTA button text like "Подключить за 490 р/мес")
- Also check subtitle text around line 154 ("от 490 р" → "от 790 р")
- Remove Chrome extension ("Chrome-расширение для WB/Ozon") from features list
- Ensure features: Unlimited responses, 1 business profile, Deep Research, tone settings, history

- [ ] **Step 3: Update Pro tier card**

Find the Pro plan card and update:
- Price: `1490` → `1990` everywhere
- Add "Режим Хардкор 🔥" to features
- Add "Экспорт истории (CSV)" to features
- Remove Chrome extension from features
- Keep: 5 profiles, 3 users, priority support

- [ ] **Step 4: Update comparison section**

The pricing page has a comparison section showing Free vs Start. Update the limit numbers and feature lists to match new tiers.

- [ ] **Step 5: Commit**

```bash
git add src/app/pricing/page.tsx
git commit -m "feat: update pricing page — 790/1990 prices, new feature lists"
```

### Task 3: Update Paywall Component

**Files:**
- Modify: `src/components/Paywall.tsx`

- [ ] **Step 1: Update price in Paywall modal**

Find all `490` references and replace with `790`. The Paywall shows Start plan price prominently.

- [ ] **Step 2: Update feature list in Paywall**

Remove "Chrome-расширение для WB/Ozon" from features (around line 143). Add "Персонализированные ответы с профилем бизнеса" as first bullet.

- [ ] **Step 3: Commit**

```bash
git add src/components/Paywall.tsx
git commit -m "feat: update paywall — Start price 790, updated features"
```

### Task 4: Update Landing Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update pricing cards on landing**

The landing page (lines ~414-537) has its own pricing section. Update:
- Free: `15` → `5` responses (check lines ~425, 441, 470, 504 for hardcoded numbers)
- Start: `490` → `790`
- Pro: `1490` → `1990`
- Remove Chrome extension references from feature lists
- Add Hardcore mode to Pro features

- [ ] **Step 2: Update Chrome extension section**

The landing has a Chrome extension feature section (lines ~328-365). Change to "Coming Soon":
- Title: "Скоро: Chrome-расширение"
- Subtitle: "Отвечайте на отзывы прямо на Яндекс.Картах, 2ГИС, Авито"
- Replace CTA with: "Хочу первым →" (link to TG channel for now)

- [ ] **Step 3: Check hero subtext**

If hero says "15 ответов бесплатно" or similar — update to match new Free limit.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update landing — new prices, chrome extension coming soon"
```

---

## Chunk 3: Payment Integration Update

### Task 5: Update Payment Routes

**Files:**
- Modify: `src/app/api/payment/create/route.ts`
- Modify: `src/app/api/payment/webhook/route.ts`

- [ ] **Step 1: Verify payment creation uses PLAN_PRICES**

The payment creation should use `PLAN_PRICES[plan]` from types. Verify no hardcoded prices:

```bash
grep -n "49000\|149000\|490\|1490" src/app/api/payment/create/route.ts
```

If any hardcoded prices exist, replace with `PLAN_PRICES[plan]` reference.

- [ ] **Step 2: Remove 'business' plan handling from both files**

```bash
grep -n "business" src/app/api/payment/create/route.ts src/app/api/payment/webhook/route.ts
```

Remove any `plan === 'business'` conditionals. The webhook uses `PLAN_LIMITS[plan]` which is already updated.

- [ ] **Step 3: Update receipt description if needed**

If the YuKassa receipt includes hardcoded price in description text, update it.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/payment/create/route.ts src/app/api/payment/webhook/route.ts
git commit -m "fix: payment routes — remove business plan, verify dynamic pricing"
```

---

## Chunk 4: Feature Gating (Hardcore Mode + Free Restrictions)

### Task 6: Gate Hardcore Mode by Plan

**Files:**
- Modify: `src/app/api/generate/route.ts`
- Modify: `src/app/quick-reply/page.tsx`

- [ ] **Step 1: Gate hardcore in generate API**

In `src/app/api/generate/route.ts`, add import and gate check. After fetching subscription (around line 95-100), before generation block:

```typescript
// Add to imports at top:
import { PLAN_LIMITS, PLAN_FEATURES } from '@/types';
import type { PlanType } from '@/types';

// After subscription fetch, before generation (around line 140):
const currentPlan = (subscription?.plan || 'free') as PlanType;
const planFeatures = PLAN_FEATURES[currentPlan];
if (!planFeatures?.hardcoreMode) {
  includeHardcore = false;
}
```

- [ ] **Step 2: Gate hardcore toggle in Quick Reply UI**

In `src/app/quick-reply/page.tsx`, the hardcore toggle button (around lines 334-351). Show toggle only for Pro users (NOT trialing — trial gives Start-level access per spec):

```typescript
{/* Hardcore toggle — Pro only */}
{subscription?.plan === 'pro' && (
  <button
    onClick={() => setIncludeHardcore(!includeHardcore)}
    // ... keep existing button code
  >
    {/* keep existing content */}
  </button>
)}
{/* Teaser for non-Pro */}
{subscription && subscription.plan !== 'pro' && (
  <div className="text-xs text-muted flex items-center gap-1 opacity-60">
    <span>🔥</span>
    <span>Режим Хардкор — на тарифе Про</span>
  </div>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/generate/route.ts src/app/quick-reply/page.tsx
git commit -m "feat: gate hardcore mode — Pro plan only"
```

### Task 7: Add Upsell Banners for Free Users

**Files:**
- Modify: `src/app/quick-reply/page.tsx`
- Modify: `src/app/history/page.tsx`

- [ ] **Step 1: Add upsell after generation in Quick Reply**

After responses are shown (around line 400+), add banner for free users who are NOT trialing:

```typescript
{subscription?.plan === 'free' && subscription?.status !== 'trialing' && responses.length > 0 && (
  <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary-light/50">
    <p className="text-sm font-medium mb-1">
      💡 С профилем бизнеса ответы станут персональными
    </p>
    <p className="text-xs text-muted mb-3">
      AI будет знать название, сильные стороны и стиль вашего бизнеса
    </p>
    <a href="/pricing" className="text-sm text-primary font-medium hover:underline">
      Подключить Старт за 790 ₽/мес →
    </a>
  </div>
)}
```

- [ ] **Step 2: Add upsell in empty history state**

In `src/app/history/page.tsx`, find the empty state (when `history.length === 0`). Add upsell for free users:

```typescript
{history.length === 0 && subscription?.plan === 'free' && subscription?.status !== 'trialing' && (
  <div className="text-center py-8">
    <p className="text-muted mb-2">История доступна на тарифе Старт</p>
    <a href="/pricing" className="text-primary hover:underline text-sm">
      Подключить за 790 ₽/мес →
    </a>
  </div>
)}
```

This requires fetching subscription in the history page — add it in the useEffect alongside history fetch.

- [ ] **Step 3: Commit**

```bash
git add src/app/quick-reply/page.tsx src/app/history/page.tsx
git commit -m "feat: add upsell banners for free users — quick-reply + history"
```

---

## Chunk 5: CSV Export (Pro Only)

### Task 8: Add CSV Export Endpoint

**Files:**
- Modify: `src/app/api/history/route.ts`

- [ ] **Step 1: Update GET handler signature**

The current GET handler has no parameters: `export async function GET()`. Change to accept request:

```typescript
// BEFORE:
export async function GET() {

// AFTER:
export async function GET(request: NextRequest) {
```

`NextRequest` is already imported at line 1.

- [ ] **Step 2: Add CSV export logic after auth check, after business fetch**

Insert CSV export branch **after** the business fetch (line 79), before the regular history fetch (line 85). The `business` variable is available at this point:

```typescript
    // After business fetch (line 79), add:

    // CSV export for Pro users
    const { searchParams } = new URL(request.url);
    if (searchParams.get('format') === 'csv') {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single();

      if (subscription?.plan !== 'pro') {
        return NextResponse.json(
          { error: 'Экспорт доступен только на тарифе Про' },
          { status: 403 }
        );
      }

      if (!business) {
        return NextResponse.json(
          { error: 'Нет данных для экспорта' },
          { status: 404 }
        );
      }

      const { data: exportHistory } = await supabase
        .from('response_history')
        .select('review_text, chosen_response, response_accent, created_at')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (!exportHistory || exportHistory.length === 0) {
        return NextResponse.json(
          { error: 'Нет данных для экспорта' },
          { status: 404 }
        );
      }

      const BOM = '\uFEFF';
      const header = 'Дата,Текст отзыва,Ответ,Тон\n';
      const rows = exportHistory.map(h => {
        const date = new Date(h.created_at).toLocaleDateString('ru-RU');
        const review = `"${(h.review_text || '').replace(/"/g, '""')}"`;
        const response = `"${(h.chosen_response || '').replace(/"/g, '""')}"`;
        const accent = h.response_accent || '';
        return `${date},${review},${response},${accent}`;
      }).join('\n');

      return new Response(BOM + header + rows, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="myreply-history.csv"',
        },
      });
    }

    // ... existing regular history fetch continues
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/history/route.ts
git commit -m "feat: add CSV export endpoint — GET /api/history?format=csv (Pro only)"
```

### Task 9: Update Export Button on History Page

**Files:**
- Modify: `src/app/history/page.tsx`

- [ ] **Step 1: Replace existing text export with plan-aware CSV export**

The page already has a `handleExport` function (lines 96-121) that creates a plain text file. Replace it:

```typescript
const handleExport = async () => {
  if (history.length === 0) {
    toast.showWarning('Нет данных для экспорта');
    return;
  }

  if (subscription?.plan !== 'pro') {
    toast.showInfo('Экспорт в CSV доступен на тарифе Про');
    return;
  }

  try {
    const res = await fetch('/api/history?format=csv');
    if (!res.ok) {
      toast.showError('Ошибка при экспорте');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myreply-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.showSuccess('История экспортирована в CSV');
  } catch (error) {
    toast.showError('Ошибка при экспорте истории');
  }
};
```

- [ ] **Step 2: Add subscription fetch in useEffect**

Add subscription state and fetch it alongside history:

```typescript
const [subscription, setSubscription] = useState<any>(null);

// In useEffect:
const subRes = await fetch('/api/subscription');
if (subRes.ok) {
  const subData = await subRes.json();
  setSubscription(subData);
}
```

- [ ] **Step 3: Update export button label**

Find the export button in JSX. Update label to indicate CSV and show Pro badge if not Pro:

```typescript
<button onClick={handleExport} /* existing classes */>
  {subscription?.plan === 'pro' ? (
    <>
      <Download className="w-4 h-4" />
      Экспорт CSV
    </>
  ) : (
    <>
      <Download className="w-4 h-4" />
      Экспорт CSV
      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">Про</span>
    </>
  )}
</button>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/history/page.tsx
git commit -m "feat: upgrade history export to CSV, gate behind Pro plan"
```

---

## Chunk 6: Documentation & Final Verification

### Task 10: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update pricing table**

Replace the Монетизация section:

```markdown
## Монетизация
| Тариф | Цена | Лимит |
|-------|------|-------|
| Free | 0₽ | 5 ответов/мес, базовая генерация |
| Старт | 790₽/мес | Безлимит, профиль бизнеса, Deep Research, настройки тона, история |
| Про | 1990₽/мес | Всё из Старт + 5 профилей, 3 пользователя, хардкор, экспорт CSV, приоритетная поддержка |

7 дней полного доступа (тариф Старт) при регистрации. Промокоды. Реферальная система.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with new pricing tiers"
```

### Task 11: Build & Deploy Verification

- [ ] **Step 1: Full build check**

```bash
cd D:/PROJECTS/MYREPLY && npx next build
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 2: Search for any remaining old prices**

```bash
grep -rn "\"490\"\|'490'\|49000\|149000\|\"1490\"\|'1490'" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".next"
```

Any matches need updating. Note: `490` may appear in unrelated contexts (CSS, IDs) — check each match.

- [ ] **Step 3: Search for remaining 'business' plan references**

```bash
grep -rn "'business'" src/ --include="*.ts" --include="*.tsx"
```

Should return 0 results.

- [ ] **Step 4: Deploy to Vercel**

```bash
git push origin main
```

Vercel auto-deploys on push. Verify at https://my-reply.ru.

- [ ] **Step 5: Spot-check live site**

Check: pricing page shows 790/1990, landing page updated, challenge still works.

---

## Summary

| Chunk | Tasks | Description |
|-------|-------|------------|
| 1: Pricing Constants | 1 | Types, limits, prices, features |
| 2: UI Updates | 2-4 | Pricing page, Paywall, Landing |
| 3: Payment Integration | 5 | YuKassa routes |
| 4: Feature Gating | 6-7 | Hardcore Pro-only, upsell banners |
| 5: CSV Export | 8-9 | API endpoint + UI |
| 6: Docs & Verification | 10-11 | CLAUDE.md, build, deploy |
| **Total** | **11 tasks** | **~60-80 min** |
