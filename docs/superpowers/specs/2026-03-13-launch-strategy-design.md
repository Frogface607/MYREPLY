# MyReply — Launch Strategy Design Spec

> Date: 2026-03-13
> Status: Draft (pending implementation plan)
> Author: Sergey + Claude

## Overview

Comprehensive launch strategy for MyReply — Russian AI SaaS that generates professional responses to customer reviews. Covers pricing restructure, UX funnel, infrastructure, staged rollout, content automation, viral challenge mechanic, and v2 roadmap.

### Migration from Current State
Current pricing in code: Free(15)/Start(490)/Pro(1490). This spec changes to Free(5)/Start(790)/Pro(1990).

**Existing user handling:**
- Product is pre-launch, no paying customers yet → clean migration, no grandfathering needed
- Code changes: update `PLAN_LIMITS` in `src/types/index.ts`, pricing page, CLAUDE.md
- Remove legacy `'business'` plan type from `PlanType` union
- Remove Chrome extension from pricing page features (not ready for v1)

---

## 1. Pricing

### Tiers

| | Free | Start (790 RUB/mo) | Pro (1990 RUB/mo) |
|---|---|---|---|
| Responses/mo | 5 | Unlimited | Unlimited |
| Business profiles | — | 1 | 5 |
| Tone settings | — | ✅ | ✅ |
| Deep Research | — | ✅ | ✅ |
| History | — | ✅ | ✅ |
| Hardcore mode | — | — | ✅ |
| Team members | 1 | 1 | 3 |
| Export | — | — | ✅ |
| Screenshot upload | ✅ | ✅ | ✅ |
| Priority support | — | — | ✅ |

### Trial Mechanic
- 7 days full Start on registration (unlimited responses, profile, tone, history, Deep Research)
- After trial expires → Free tier (5 answers/mo)
- Profile data preserved but not applied on Free
- Day 5 reminder: in-app banner "Trial ends in 2 days" (no push notifications in v1 — just banner on next visit)

### Free Tier Rationale
Dropping from 15 to 5 responses/mo is intentional:
- 15 was "good enough" — users never converted because Free covered their needs
- 5 forces a decision within the first week of active use
- Combined with NO personalization (generic responses), the quality gap is obvious
- Risk: users may not engage enough → mitigated by trial (7 days full Start on signup)
- Current code has `history: 5` for Free — this changes to `history: 0` (no history on Free)

### Feature Definitions
- **Hardcore mode:** The "Хардкор" tone variant (aggressive/sarcastic response style). On Free/Start: not generated at all (4 tones instead of 5). On Pro: included as 5th variant. Gate in `generateResponses()` based on plan.
- **Export:** Download response history as CSV file. Pro-only. Simple implementation: serialize `response_history` table rows to CSV with columns: date, review text, selected response, tone, rating.
- **Deep Research:** AI analyzes the business online (existing `/api/research` endpoint). Available on Start/Pro. During trial: unlimited (same as Start).

### Promo Codes
- **ЛЯГУШКА** — 7 days Start free (personal channels)
- **EDISON** — 7 days Start free (Edison Bar audience)
- **VCRU** — 3 days Start free (VC.ru launch)
- Challenge auto-generated one-time codes — 3 days Start per submission
- Challenge top-of-week winner — 1 month Start free

### Competitor Context
- WB Otvet: 2800 RUB/mo for 50 answers
- RoboGPT: 699 RUB/mo
- Otveto.ru: ~990+ RUB/mo
- MyReply Start at 790 is competitive and not cheap

---

## 2. UX Funnel

### Free User Experience
- No business profile → generic responses (no company name, no personalization)
- No tone settings (formality, empathy, brevity)
- No Deep Research
- No history
- Basic generation: paste text → get 3 variants
- Screenshot upload works

### "Aha Moment" Design
- When free user generates a response, show blur-preview: "How this would look on Start plan" with personalized business name, specific strengths, correct tone
- Clear visual difference between generic and personalized response

### CTA Touchpoints (3 points)
1. **During generation (free)** — banner: "Personalize your responses →"
2. **At limit reached** — modal with specific time-saving numbers
3. **In empty history** — "Upgrade to Start to save and reuse responses"

### What We Don't Touch
- Main generator UI (works, don't break)
- Challenge page (separate flow)
- Profile settings (ready, just locked for free)

---

## 3. Infrastructure

### Approach: Hybrid (Vercel + VPS fallback)

**Default:** Vercel as primary host (free, fast deploy, existing setup)

**Verification:** First launch wave (personal channels) includes explicit ask: "Does my-reply.ru load for you? Report if it doesn't"

**If 10%+ can't access:**
- Spin up Russian VPS (Timeweb/Beget, ~300 RUB/mo)
- Nginx reverse proxy → Vercel origin
- DNS switch takes 5 minutes
- Deploy workflow unchanged (still push to Vercel)

**Monitoring:** Free uptime check from Russian IP (UptimeRobot or host-tracker.com), alert to Telegram on downtime.

**What we don't do:**
- Don't migrate everything to VPS (lose Vercel convenience)
- Don't use Cloudflare (also blocked in Russia)
- Don't panic preemptively — verify first

---

## 4. Staged Launch + Content Machine

### Stage 1: Soft Launch — Personal Socials (ASAP)

**Channels:** "S Litsom Lyagushki" TG (100 subs) + Personal Instagram (1.2k)

**Message:** Story about building Edison Bar website, problems faced. "I also built my own SaaS — MyReply. Test it, here's a promo code ЛЯГУШКА for friends. Report if site doesn't load. Any feedback welcome."

**Goals:**
- 10-20 registrations
- Verify Vercel accessibility from Russia
- Collect first feedback
- If Vercel problems → deploy VPS proxy before Stage 2

### Stage 2: Edison Audience (3-5 days after Stage 1)

**Channels:** Edison VK (8k) + Instagram (8k) + TG (1.2k)

**Message:** From Edison's voice: "We work with reviews every day. Built a tool that helps. Try it." Pain-point hook: "You know what it's like to answer an unfair review at 2 AM?"

**Promo:** EDISON → 7 days Start free

**Goals:** 50-100 registrations, first paid conversions

### Stage 3: Public Launch — VC.ru (1-2 weeks after Stage 1)

**Format:** Case study article: "How a bar owner from Irkutsk built an AI service for review responses"

**By this point:** Real users exist, feedback incorporated, bugs fixed

**Promo:** VCRU → 3 days Start free

### Content Machine: MyReply TG Channel

**Technical setup:**
- Telegram bot connected via separate Claude Code session
- Bot capabilities: post text, generate carousels (via Freepik), scheduled posting (crons)

**Content schedule:**

| Day | Type | Example |
|-----|------|---------|
| Mon | Tip | "How to respond to a 1-star review with no text" |
| Wed | Review of the week | Anonymized extreme review + MyReply AI response |
| Fri | Fact/stat | "73% of customers read business responses to reviews" |

**Subscriber funnel:**
- Edison channels → link to MyReply TG in posts
- Personal socials → same
- Inside the product → "Subscribe for tips on handling reviews"
- Challenge entries → drive traffic to channel

**Automation level:** Content generated by AI, Sergey approves or sets to autopilot. Minimal manual work.

---

## 5. Challenge "Адовый отзыв"

### Concept
Gamified viral mechanic: people submit the most extreme, absurd, unfair real reviews. MyReply generates a professional response. Published anonymized — entertainment + product demo.

### User Flow

**Participant:**
1. Goes to my-reply.ru/challenge
2. Pastes review text (or uploads screenshot)
3. MyReply generates response — shown immediately
4. Review + response published to challenge feed (anonymized)
5. Can vote for most extreme review

**Viewer:**
- Scrolls feed — cringe, laugh, relate
- Sees MyReply elegantly handling complete trash
- Thinks: "I could use this too"

### Rewards

**Every participant (immediately after submission):**
- Auto-generated one-time promo code → 3 days Start free
- "Thanks for the review! Here's a gift 🎁"

**Top of the week (most liked review):**
- 1 month Start free
- Announced in TG channel: "Winner of the week — review about [topic] 🏆"
- Double-duty as channel content

### Viral Potential
- Social sharing: "Look what review someone got 😂"
- TG channel content: best reviews of the week
- VC.ru article material: "Top-20 most insane reviews in Russian business"

### Moderation
- AI auto-moderation (profanity, personal data, threats → filtered)
- All reviews anonymized: no names, company names, addresses
- Manual moderation as fallback (daily review)

### Simplicity Rules (v1)
- No accounts required to participate — just paste and submit
- No complex ratings/prizes — just a feed
- Voting = simple likes, no registration
- **Promo code delivery:** Shown on-screen immediately after submission ("Your code: CHALLENGE-XXXX"). No email required. User copies code and applies during registration. Rate limit: max 3 submissions per IP per day (prevents promo farming)

### Edge Cases
- Gibberish/spam submissions → AI moderation filters nonsensical text, returns friendly error
- AI generation failure → show error, don't publish to feed, don't issue promo code
- Max review text length: 2000 characters (same as main generator)
- Duplicate submissions → deduplicate by text hash, show existing entry

### Product Connection
- Under each response: "Generated by MyReply → Try for your business"
- Challenge page = live product demo
- Every participant already experienced the product

---

## 6. Chrome Extension & v2 Roadmap

### v1 Launch (now)
Extension NOT ready. Create anticipation:

**On landing page:**
- "Coming Soon" section: "Chrome extension — respond to reviews directly on Yandex.Maps, 2GIS, Avito"
- "Be first" button → collect email (waitlist)
- Visual: browser extension mockup

**In TG channel:**
- Teasers about extension development
- Poll: "Which platform do you answer reviews on most?"

### v2 Roadmap (post-launch, 1-2 months)

| Feature | Priority | Rationale |
|---------|----------|-----------|
| Chrome extension | 🔴 High | Killer feature, competitor differentiator |
| Auto-monitoring reviews | 🟡 Medium | Competitors have it, users expect it |
| "Owner advice" mode | 🟡 Medium | Additional value, strengthens Pro tier |
| API for integrations | 🟢 Low | B2B feature, too early |
| Multi-language | 🟢 Low | Capture Russia first |

---

## Implementation Order

1. **Pricing code changes** — update tiers, limits, trial logic
2. **UX funnel fixes** — lock features for free, add blur-preview, CTAs
3. **Promo code system** — create/validate/apply promo codes
4. **Landing page update** — new pricing, Chrome extension waitlist, updated copy
5. **Challenge mechanic** — /challenge page with submission, feed, voting, auto-promo
6. **TG bot setup** — separate session, content posting, cron scheduling
7. **Infrastructure monitoring** — uptime check, VPS proxy ready as fallback
8. **Content seeding** — initial posts for TG channel before Stage 1
9. **Stage 1 launch** — personal socials post
10. **Stage 2 launch** — Edison channels post
11. **Stage 3 launch** — VC.ru article

---

## Subscription Lifecycle

### Downgrade/Cancellation
- **Cancel mid-cycle:** Access continues until period end, then drops to Free
- **Pro → Start downgrade:** Keeps 1 business profile (most recently updated), others deactivated but not deleted
- **Start → Free:** Profile deactivated, history locked (visible but read-only), tone settings reset to defaults
- **YuKassa:** Cancel = don't renew. Webhook `payment.canceled` updates subscription status

### Recurring Payments
- YuKassa autopayment (recurring). User confirms first payment, subsequent ones auto-charge
- Failed payment → 3-day grace period → downgrade to Free
- Reactivation: user pays again → immediately restored to previous plan level

---

## Success Metrics

Assumptions: ~70% Start, ~30% Pro split among paid users.

| Metric | Stage 1 | Stage 2 | Stage 3 (1 month) |
|--------|---------|---------|---------------------|
| Registrations | 10-20 | 50-100 | 300+ |
| Trial→Paid conversion | — | 5-10% | 8-12% |
| Challenge submissions | — | 20+ | 100+ |
| TG channel subs | 10 | 50 | 200+ |
| MRR | 0 | 3-8k RUB | 15-30k RUB |

MRR model (Stage 3): 300 regs × 10% conv = 30 paid users. 21 Start (790) + 9 Pro (1990) = 16,590 + 17,910 = ~34k RUB. Conservative estimate with lower Pro share: ~20k RUB.

---

## Housekeeping
- Update `CLAUDE.md` with new pricing after implementation
- Remove `'business'` from `PlanType` union in `src/types/index.ts`
- Remove Chrome extension from pricing page features list
- TG bot technical spec → separate document (out of scope for this spec)
