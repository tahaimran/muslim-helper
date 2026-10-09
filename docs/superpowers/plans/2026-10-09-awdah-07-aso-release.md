# Awdah Plan 7 — Icon, ASO Listings, and Release QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Awdah a real icon set, store listings in five languages built on Applyra keyword data, an accurate privacy policy, and a final release-readiness pass.

**Architecture:** Icons are authored as SVG and rendered to PNG with a one-off script using `@resvg/resvg-js` (dev dependency). Store copy lives in `store/<lang>/*.txt` with character limits enforced by a test. QA runs the whole test suite, typecheck, lint, `npx expo-doctor`, and a web smoke walk.

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md` (§10 ASO)

## Keyword research (Applyra, 2026-10-09, Google Play unless noted)

| Market | Keyword | Diff | Traffic | KEI | Use |
|---|---|---|---|---|---|
| US en | new muslim | 18 | 58 | 3.22 | subtitle/description |
| US en | learn salah | 17 | 25 | 1.47 | title |
| US en (iOS) | learn salah | 27 | 33 | 1.22 | iOS keywords |
| US en | salah tracker | 30 | 40 | 1.33 | description |
| US en | islamic planner | 17 | 20 | 1.18 | description |
| US en | better muslim | 22 | 25 | 1.14 | short description |
| US en | dhikr counter | 45 | 52 | 1.16 | description |
| US en | muslim habit tracker (iOS) | 25 | 9 | 0.36 | avoid in title (saturated) |
| TR tr | namaz öğreniyorum | 27 | 72 | 2.67 | title |
| TR tr | namaz kılmayı öğren | 17 | 8 | 0.47 | description |
| ID id | hijrah | 45 | 63 | 1.40 | title |
| ID id | belajar sholat | 33 | 32 | 0.97 | title |
| ID id | pengingat sholat | 37 | 25 | 0.68 | description |
| PK ur | namaz sikhne ka tarika | 14 | 25 | 1.79 | description (Roman Urdu line) |
| PK ur | namaz tracker | 23 | 25 | 1.09 | description |
| SA ar | تعلم الصلاة | 20 | 25 | 1.25 | title |

Positioning everywhere: free, private, ad-free; a gentle guided way back (not another habit tracker).

## Global Constraints

- Store limits: Play title ≤ 30, Play short description ≤ 80, Play full description ≤ 4000; iOS name ≤ 30, subtitle ≤ 30, keywords ≤ 100 (comma-separated, no spaces after commas, no words already in name/subtitle), promotional text ≤ 170.
- No false claims: no "AI", no "#1", no "scholar-reviewed", no "Qibla" (not a feature). "Free forever, no ads, no account, nothing leaves your phone" is true and should be prominent.
- No keyword stuffing; natural sentences in each language.
- Privacy labels: Data not collected (both stores).

## Review Focus

1. A listing over a store limit → rejected at submission. Test enforces limits. (Task 2)
2. iOS keywords repeating name/subtitle words → wasted space. Test checks. (Task 2)
3. Icon unreadable at 48px or clipped by Android adaptive mask → check renders at small sizes and safe zone. (Task 1)
4. Privacy policy URL in app.json points to a page that doesn't exist → replaced with the real hosted URL or removed until hosted. (Task 3)
5. App opens on a fresh install with no network → everything works offline. (Task 4)

---

### Task 1: Icon, adaptive icon, splash, notification icon, favicon

**Files:** Create `assets/brand/icon.svg`, `assets/brand/adaptive-foreground.svg`, `assets/brand/notification.svg`, `scripts/render-icons.mjs`; replace PNGs in `assets/images/`; delete `assets/generate-icons.js`; modify `app.json`.

Design: night-ink square (`#161A33`) with a slim dawn-gold (`#E3B65A`) semicircle sun rising from a horizon line in the lower third, and a thin crescent-free composition — calm, geometric, legible at 48px; an optional subtle 8-point star (girih) above at 20% opacity. Adaptive foreground keeps all artwork inside the central 66% safe zone on transparent background (`backgroundColor` `#161A33` in app.json). Notification icon: white sun-on-horizon silhouette on transparent (Android requires monochrome). Splash: the sun mark centered on `#161A33` (`splash.image`, `resizeMode: contain`, `backgroundColor: #161A33`).

- [ ] **Step 1:** `npm i -D @resvg/resvg-js`; write SVGs.
- [ ] **Step 2:** `scripts/render-icons.mjs` renders: `icon.png` 1024, `adaptive-icon-foreground.png` 1024, `splash-icon.png` 1024, `notification-icon.png` 96, `favicon.png` 48.
- [ ] **Step 3:** Run it; view each PNG with the Read tool to check (especially 48px favicon legibility); adjust.
- [ ] **Step 4:** Update `app.json` (icon, adaptive bg, splash config, notification color) and commit `feat(brand): Awdah icon set and splash`.

---

### Task 2: Store listings (5 languages) with limit tests

**Files:** Create `store/{en,ar,ur,id,tr}/{title,short_description,full_description,ios_subtitle,ios_keywords,promo_text,screenshot_captions}.txt`, `lib/__tests__/store-listing.test.ts`

Titles (fixed):
- en: Play title `Awdah: Learn Salah & Deen`; iOS name `Awdah: Return to Deen`, iOS subtitle `New Muslim & Learn Salah Guide`
- tr: `Awdah: Namaz Öğreniyorum`
- id: `Awdah: Hijrah & Belajar Sholat`
- ur: `Awdah: نماز سیکھیں، دین کی طرف`
- ar: `عودة: تعلم الصلاة والعودة` (verify ≤ 30 chars)

Full descriptions (each language, written natively, ~1,800–2,500 chars): opening line on the return ("Coming back to Allah starts with one small step."), what you get (30-day guided path; Learn Salah & wudu step by step; prayer times offline; tasbih & morning/evening adhkar; verified hadith with sources; reflection journal; gentle reminders; 5 languages), what you won't get (ads, accounts, tracking, subscriptions), a sincerity note (made as sadaqah jariyah; content sourced from Bukhari, Muslim and other authentic collections; please share feedback), and one natural sentence for each market keyword from the table. ur also includes one Roman-Urdu line containing "namaz sikhne ka tarika". Screenshot captions: 6 per language (Today sky, Learn Salah, Journey, Tasbih, Hadith, Private & free).

- [ ] **Step 1: Test** — reads every file and asserts the limits from Global Constraints (using `[...str].length` for character counts), iOS keywords have no spaces after commas and share no word with that language's iOS name/subtitle, and no forbidden claims (`/\bAI\b|#1|qibla|scholar[- ]reviewed/i`).
- [ ] **Step 2:** Write copy for all languages (controller supplies the keyword table above; the implementer may run Applyra `check_metadata`/`simulate_metadata` if available, otherwise skip).
- [ ] **Step 3:** Test passes; commit `docs(aso): store listings in five languages`.

---

### Task 3: Privacy policy, support info, app config

**Files:** Create `docs/privacy-policy.md` (public-ready, mirrors the in-app privacy screen, with contact `nafs.app.support@gmail.com` until the owner sets a new address); modify `app.json` (`extra.privacyPolicyUrl` → remove until the owner hosts the policy, and note in README how to host it via GitHub Pages); rewrite `README.md` (what Awdah is, run/test commands, content sources & review checklists, how to build with EAS, hosting the privacy policy).

- [ ] Write files; commit `docs: privacy policy and README`.

---

### Task 4: Release QA

- [ ] `npm test`, `npm run typecheck`, `npm run lint` (0 errors), `npx expo-doctor` (fix issues it reports that are in scope).
- [ ] Web smoke (Chrome DevTools MCP): fresh profile (clear localStorage) with network throttled to offline after load → onboarding → Today → all tabs; en, ar, ur, id, tr each: screenshot Today → `docs/screenshots/release/`.
- [ ] Search the repo for leftovers: `console.log`, `TODO`, `Nafs` (allowed only in legacy-import code/tests and the package id), `points`, `supabase`.
- [ ] Final whole-branch review on the most capable model; one fix wave; commit `chore: release QA`.
