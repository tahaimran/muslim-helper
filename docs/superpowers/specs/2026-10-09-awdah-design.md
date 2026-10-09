# Awdah — Design Spec

**Date:** 2026-10-09
**Status:** Approved in conversation, pending written-spec review
**Supersedes:** "Nafs" (Bolt-generated prototype)

## 1. Purpose

Awdah (عودة, "The Return") is a free, private, ad-free companion for Muslim youth who want to come back to the deen but lack a clear track. It gives them a gentle, structured 30-day path back, then helps them stay steadfast (istiqamah).

**Non-negotiable constraints (from the owner):**
- No backend, no database server, no authentication. All data stays on the device.
- No ads, no in-app purchases, no analytics or tracking SDKs, no monetization of any kind.
- Built sincerely: religious content must be authentic and honestly sourced.

**Success criteria:**
1. The core loop works end to end: onboarding → daily plan that advances by calendar → tracking → progress → Day 30 → Istiqamah mode.
2. Every hadith shown is Sahih or Hasan, cited with collection + number, with Arabic text.
3. Ships in English, Arabic, Urdu, Indonesian, Turkish, with correct RTL.
4. No dead buttons, no false claims in Help/Privacy/Terms, no unused dependencies.
5. Store listings for all 5 languages, informed by Applyra keyword data.

## 2. Approach

Rebuild on the existing Expo + Expo Router skeleton (Expo SDK 54, React Native 0.81, TypeScript). Keep the 30-day content structure. Replace the state layer, design system, and screens. Rejected: full rewrite (wastes working routing/content) and bug-fix-only (can't meet UX/i18n goals).

## 3. Product

### 3.1 The Return path (days 1–30)
- `currentDay` is **derived**, not stored: `min(30, daysBetween(planStartDate, today) + 1)`, using local calendar dates.
- Missed days never reset anything. On return after ≥2 missed days, Today shows a gentle welcome-back card (authentic hadith: "The most beloved deeds to Allah are the most consistent, even if small" — Bukhari 6464, Muslim 783).
- Any past day (≤ currentDay) can be opened and completed from Journey. Future days are visible as locked previews.
- Each day has: theme (with Arabic), intention, tasks, morning/evening dhikr, Quran goal, prayer focus, sunnah practice, character goal, hadith, reflection question.

### 3.2 No points or levels
Points and titles like "Champion of the Deen" are removed. Progress is shown through:
- **Days shown up** (any task or prayer logged that day)
- **Consistency streak** (consecutive calendar days with activity; a missed day ends the streak but the message stays gentle)
- **Prayers kept** (per prayer, per day)
- **Milestones** (e.g. first day, 7 days, all 5 prayers in one day, 30 days), each paired with an authentic hadith or ayah.

### 3.3 Personalization (onboarding is used)
Onboarding collects: name (optional), current prayer habit, knowledge level, focus areas, daily minutes, preferred language, location for prayer times (optional). Rules:
- `knowledgeLevel = beginner` or prayer habit `none`/`some` → the Learn Salah track is pinned on Today for days 1–7, and the plan uses simplified task variants.
- `dailyMinutes` → task count per day: <15 → 3, <30 → 4, otherwise all (max 6). Prayer tasks are never dropped.
- Focus areas order the tasks.
Gender and age are no longer collected (unused, unneeded data).

### 3.4 After Day 30: Istiqamah mode
Today switches to a steady daily routine: 5 prayers, morning/evening adhkar, a rotating hadith, a reflection, plus a "Begin a deeper cycle" action that restarts days 1–30 with the `advanced` task variants (cycle counter increments; history is kept).

## 4. Features

| Area | Behavior |
|---|---|
| **Today** (tab) | Greeting, Hijri + Gregorian date, next prayer countdown, 5-prayer row, today's tasks, hadith card, reflection journal + mood. Share hadith as text via the system share sheet. |
| **Worship** (tab) | Prayer times for today (offline), Tasbih counter, morning/evening adhkar, Duas library entry point. |
| **Learn** (tab) | Learn Salah: step-by-step wudu and salah (2 and 4 rak'ah), with Arabic, transliteration, meaning. Basics: the 6 pillars of iman, 5 pillars of Islam. Links to trusted external free resources (Quran.com, Sunnah.com) via the system browser. |
| **Journey** (tab) | 30-day path by week (week 4 = days 22–30), tap any unlocked day to open and complete it. |
| **Me** (tab) | Progress (days shown up, streak, prayers kept heatmap, milestones), settings entry. |
| **Prayer times** | `adhan` library, computed on device. Location from one-time GPS (`expo-location`, foreground only) or manual city/coordinates. Calculation method and Asr madhab selectable; sensible default by country. |
| **Tasbih** | Big tap target, haptic per tap and stronger at target (33/99/custom). Counts persist per day and auto-complete matching dhikr tasks. |
| **Reminders** | `expo-notifications` local schedules: daily reminder at chosen time, optional per-prayer alerts (rescheduled for the next 7 days on each app open), all off by default until the user opts in during onboarding or settings. |
| **Backup** | Export: JSON file written with `expo-file-system` and shared via `expo-sharing`. Import: pick a file with `expo-document-picker`, validate schema version, confirm before overwrite, show success/error. |
| **Settings** | Language, theme (system/light/dark), prayer calculation, reminders, backup, reset (with confirmation). |
| **About / Privacy / Terms / Help** | Rewritten to be accurate: no data collected, nothing leaves the device, no PIN, no accounts. |

**Out of scope (YAGNI):** Qibla compass, Quran reader, audio recitation, social/community features, cloud sync, widgets.

## 5. Content integrity

- Every narration in `constants/` is re-verified. Keep only Sahih/Hasan; each `Hadith` has `arabic`, `text`, `collection`, `number`, `grade`.
- Remove and replace these known-problem items (from the audit): "one hour of reflection better than seventy years" (no basis), "du'a is the weapon of the believer… light of the heavens" (fabricated/very weak), "any matter not begun with Bismillah is cut off" (weak), "seeking lawful sustenance is obligatory" (Tabarani, weak), Al-Waqi'ah against poverty (weak, misreferenced), ghusl-for-tawbah (misapplied), "Companions walked in nature" (unsourced), the "Before reading Quran" dua (not established), the weak after-eating wording. Fix over-attributed sources (dua times; "best of people are most beneficial"). Label Companion sayings as athar, not hadith. Normalize surah 41 naming to "Fussilat". Fix the tasbih 33/33/34 inconsistency.
- Quran references as `surah:ayah`.
- **Translations of religious text:** Arabic is always shown. Meaning translations in EN/UR/ID/TR (Arabic UI shows the original text only) are written carefully but flagged `reviewed: false` in content files; a `docs/content-review-checklist.md` lists every item for review by a qualified person. The app never claims scholarly review that hasn't happened.

## 6. Localization

- `i18next` + `react-i18next` + `expo-localization`. UI strings in `locales/{en,ar,ur,id,tr}.json`. Religious content translations in per-language content files, keyed by stable IDs.
- Default language = device language if supported, else English. Switchable in Settings and onboarding.
- RTL for `ar` and `ur`: `I18nManager.forceRTL` + app reload on change (`expo-updates` `reloadAsync`, falling back to a "restart the app" prompt in dev); layout uses `start`/`end` and logical properties; directional icons mirror.
- Fonts via `expo-font`: Amiri (Arabic and Quranic text), Noto Nastaliq Urdu (Urdu UI), and a Latin display + text pair chosen during visual design.
- Numbers and dates via `Intl` where Hermes supports it. Hijri date via Umm al-Qura conversion (library chosen in the plan, verified against known dates), replacing the current fake calculation.

## 7. Visual design: "Fajr"

- Concept: night giving way to dawn — returning to Allah as the dawn after darkness.
- Palette tokens: deep night indigo, dawn gold, warm sand, and a sage accent (carried over from the current brand). Light mode is soft and readable; dark mode is a true night. All tokens are defined in one theme module; no screen uses raw colors.
- Texture: subtle geometric (girih) pattern; Arabic calligraphy as the hero element on Today and onboarding.
- Motion: spring transitions, gentle haptics, respects reduce-motion.
- Accessibility: 44pt minimum touch targets, WCAG AA contrast, dynamic type up to 1.3×, screen-reader labels on all controls.
- Mockups produced with the superdesign + frontend-design skills and approved before screen implementation.

## 8. Architecture

```
app/                 Expo Router screens (thin: compose components, read store)
  (onboarding)/      multi-step onboarding
  (tabs)/            today, worship, learn, journey, me
  (modals)/          day/[n], duas, tasbih, settings, about, privacy, terms, help
components/          UI kit (Card, Button, Text, PrayerRow, TaskItem, HadithCard, …)
lib/
  store.ts           Zustand store + persist(AsyncStorage), schema version + migrate
  day.ts             derived currentDay, streak, days-shown-up (pure)
  milestones.ts      milestone definitions + evaluation (pure)
  plan.ts            personalization of day tasks (pure)
  prayerTimes.ts     adhan wrapper (pure given inputs)
  hijri.ts           Hijri conversion
  notifications.ts   scheduling
  backup.ts          export/import + validation
  i18n.ts            i18next setup, RTL handling
  theme/             tokens, fonts, ThemeProvider
content/             days, duas, learn-salah, hadith (+ per-language translation files)
locales/             UI strings per language
```

- **State:** one persisted Zustand store is the only source of truth; screens subscribe to it, so tabs are always fresh (fixes the stale-state and overwrite bugs). Persisted shape: `{ version, profile, settings, cycle, planStartDate, days: Record<dayKey, DayLog>, tasbih, milestonesUnlocked }`. Migration v0→v1 imports existing Nafs `nafs_app_state` data (journal, completed tasks, prayers) if present.
- **Pure logic in `lib/`** has no React imports, so it is unit-testable.
- Errors: storage failures surface a toast and keep in-memory state; root error boundary with a localized message; no `console.log` in production code.

**Dependencies.** Remove: `@supabase/supabase-js`, `expo-camera`, `expo-secure-store`, `react-native-url-polyfill`, `react-native-webview`, `expo-symbols`, `@lucide/lab`, `@expo/vector-icons` (if unused after the rebuild), `@expo-google-fonts/inter`, `@expo-google-fonts/playfair-display` (replaced by chosen fonts), `@expo/ngrok`. Add: `zustand`, `i18next`, `react-i18next`, `expo-localization`, `adhan`, `expo-location`, `expo-file-system`, `expo-sharing`, `expo-document-picker`, the chosen font packages, `jest-expo` + `@testing-library/react-native` (dev). Keep `expo-notifications`, `expo-linear-gradient`, `expo-haptics`, `expo-blur`, `react-native-svg`, `lucide-react-native`.

**App config:** name "Awdah", slug `awdah`, scheme `awdah`. Bundle ID / package stays `com.nafs.transformation` unless the owner changes it before first store submission. Remove the secure-store plugin; add location permission strings (localized) explaining the on-device-only use.

## 9. Testing

- Jest unit tests for `day.ts` (day derivation across month/DST boundaries, streak, missed days), `milestones.ts`, `plan.ts`, `prayerTimes.ts` (known city/date fixtures), `hijri.ts` (known dates), `backup.ts` (round trip, rejects invalid), store migration from Nafs data.
- `npm run typecheck` and `npm run lint` clean.
- Web smoke test via Chrome DevTools: onboarding → Today → complete tasks → Journey → switch to Arabic (RTL) → settings export.
- Manual check on a device/emulator for notifications, location, and RTL reload.

## 10. ASO

- Title: **Awdah: Return to Deen & Salah**. Positioning: "the free, private, ad-free guide back to your deen."
- Target keywords (Google Play US data): new muslim (KEI 3.22), learn salah (1.47), salah tracker (1.33), islamic planner (1.18), better muslim (1.14), dhikr counter (1.16). Avoid leading with "muslim habit tracker" (saturated).
- Deliverables in `store/`: per-language title, subtitle/short description, full description, iOS keyword field, screenshot captions (6), feature-graphic brief. Each language backed by Applyra keyword checks in its core market (ID, TR, PK, SA/EG).
- Store privacy labels: "Data not collected."

## 11. Delivery phases

1. Foundation: deps cleanup, store + migration, pure logic + tests, i18n scaffold, theme tokens.
2. Content: verify/replace narrations, restructure content files, review checklist.
3. Visual design: mockups (superdesign/frontend-design), approval.
4. Screens: onboarding, tabs, modals on the new UI kit.
5. Platform: prayer times, notifications, backup, RTL.
6. Localization: string extraction and translations for 5 languages.
7. ASO listings + final QA.

Model guidance: Opus for phases 2, 3, 7 and reviews; Sonnet for mechanical work in 1, 4, 5, 6.
