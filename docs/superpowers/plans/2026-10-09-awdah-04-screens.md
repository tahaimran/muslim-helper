# Awdah Plan 4 — Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every screen on the new store, content, and "Fajr" UI kit so the full loop works: onboarding → Today (advancing by calendar) → tracking → Journey → Me → Istiqamah; then delete the old Nafs code.

**Architecture:** Screen files in `app/` are thin containers: they read the store via `useAppStore`, call pure view-model builders in `lib/view/*.ts` (unit-tested), and render presentational components from `components/`. All strings go through `t()` with keys in `locales/en.json`; `scripts/sync-locales.js` copies new English keys into the other locale files until Plan 6 translates them.

**Tech Stack:** Expo Router 6, React Native 0.81, Zustand store (`lib/store.ts`), i18next, content (`content/*`), UI kit (`components/*`, `theme/*`).

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md` (§3 Product, §4 Features, §7 Visual design)

## Global Constraints

- No points, levels, or scores anywhere. Progress = days shown up, streak, prayers kept, milestones.
- Gentle tone: never shame a missed day. Welcome-back copy uses the WELCOME_BACK hadith.
- Every user-visible string via `t('…')`; keys added to `locales/en.json`; then run `node scripts/sync-locales.js` so all locales keep identical keys (the i18n parity test enforces this).
- Screens never hardcode colors/fonts; use `useTheme()`; use logical `start/end` spacing.
- Never call store actions before hydration: the root layout renders only the splash until `waitForHydration()` resolves.
- `dailyMinutes` from onboarding/edit-profile is clamped to an integer 5–120.
- Tasbih: per-round counter lives in component state only; the store's day total only increases (`incrementTasbih`), never reset by rounds.
- No `console.log`. No network calls except opening external links the user taps.
- Prayer times/location UI arrive in Plan 5; in this plan, Today passes `times={null}` when `settings.location` is null and shows a "Set prayer times" row that routes to `/(modals)/settings`.

## Review Focus

1. Day rolls over while the app stays open (past midnight) → Today must re-derive `today` on app foreground and every minute (`useToday()` hook). (Task 1)
2. Viewing a past day from Journey and checking tasks must write to that plan day and mark the *current calendar date* active, not the past date. (Task 4 test)
3. Future days: visible as a locked preview; tasks cannot be toggled. (Task 4 test)
4. Tasbih-linked tasks show as done when today's counts meet targets even if never tapped; unchecking such a task is not possible while targets are met (tap shows a gentle toast). (Task 2 test)
5. Istiqamah phase (after day 30): Today must not crash looking up day 31 content; shows the steady routine. (Task 2 test)

---

### Task 1: App shell — root layout, hydration gate, i18n, tabs, locale sync

**Files:**
- Modify: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/+not-found.tsx`
- Create: `lib/useToday.ts`, `scripts/sync-locales.js`, `lib/milestoneWatcher.ts`
- Modify: `locales/en.json` (+ synced locales)

**Interfaces:**
- Produces:
  - `useToday(): DateKey` — `toDateKey(new Date())`, refreshed on `AppState` → `active` and every 60s.
  - `startMilestoneWatcher(): () => void` — subscribes to `appStore`; on change, runs `evaluateMilestones(getPersisted(state), toDateKey(new Date()))`; if any, calls `unlockMilestones(ids, today)` and `showToast(t('milestones.unlocked', { title: t(MILESTONE title) }))`. Returns unsubscribe.
  - `scripts/sync-locales.js` — for each of `ar, ur, id, tr`: deep-merge so every key in `en.json` exists (missing → English value); remove keys not in `en.json`; preserve existing translated values; write with 2-space indent + trailing newline.

**Root layout behavior (`app/_layout.tsx`):**
1. `SplashScreen.preventAutoHideAsync()` at module scope.
2. `useFonts(FONT_ASSETS)`.
3. On mount: `const ok = await waitForHydration(); await importLegacyIfNeeded(); const lang = resolveLanguage(settings.language, getLocales().map(l => l.languageCode)); await initI18n(lang);` then set ready.
4. When ready and fonts loaded: hide splash; render `<AppThemeProvider><Stack …/><ToastHost/></AppThemeProvider>` wrapped in a class `ErrorBoundary` whose fallback uses `i18n.t('errors.generic')` and a retry button.
5. Routing gate: if `profile === null` and not in `(onboarding)` → `router.replace('/(onboarding)')`; if profile exists and in `(onboarding)` → `router.replace('/(tabs)')`. Use `useSegments` in an effect that depends on `[ready, profile, segments]`.
6. Start `startMilestoneWatcher()` once ready; unsubscribe on unmount.
7. Re-run `initI18n` when `settings.language` changes.
8. Status bar style from theme scheme. Remove all `console.log`.
9. If `waitForHydration` returned false: still render, but show a one-time toast `t('errors.storage')`.

**Tabs (`app/(tabs)/_layout.tsx`):** five tabs in this order — `index` (Today, icon `Sunrise`), `worship` (Worship, `HandHeart`), `learn` (Learn, `BookOpen`), `journey` (Journey, `Route`), `me` (Me, `CircleUser`). Floating bar: `position: 'absolute'`, start/end 16, bottom = safe-area bottom + 8, height 64, radius 22, `colors.surface` at 92% opacity with a `BlurView` behind on iOS, hairline border `colors.line`, single soft shadow. Labels `t('tabs.today')` etc, font `uiMedium` 11. Create placeholder `learn.tsx` and `me.tsx` that render `<Screen><AppText variant="title">{t('tabs.learn')}</AppText></Screen>` (replaced in Tasks 6/7); delete `progress.tsx` and `profile.tsx` tab files (their content moves to `me` in Task 7).

- [ ] **Step 1:** Write `scripts/sync-locales.js` and run it; `npx jest lib/__tests__/i18n.test.ts` passes.
- [ ] **Step 2:** Implement `lib/useToday.ts`, `lib/milestoneWatcher.ts`.
- [ ] **Step 3:** Implement root and tabs layouts as specified. Add keys: `tabs.{today,worship,learn,journey,me}`, `milestones.unlocked` ("Milestone reached: {{title}}"), `splash.preparing`.
- [ ] **Step 4:** Old screens that still import `lib/storage.ts` may break at runtime; that is expected until replaced in Tasks 2–8. `npm run typecheck` must pass (keep old files compiling).
- [ ] **Step 5:** `npm test && npm run typecheck && npm run lint`.
- [ ] **Step 6:** Commit `feat(app): hydration-gated root layout, i18n init, five-tab shell`.

---

### Task 2: Today view-model and Today screen

**Files:**
- Create: `lib/view/today.ts`, `lib/__tests__/view-today.test.ts`, `components/day/TaskThread.tsx`, `components/day/ReflectionBox.tsx`, `components/day/MoodPicker.tsx`
- Modify: `app/(tabs)/index.tsx` (full rewrite)

**Interfaces:**
- Consumes: `PersistedState`, `planDayKey`, `getPlanPosition`, `getStreak`, `daysSinceLastActive`, `shouldWelcomeBack`, `activeDateSet`, `personalizeTasks`, `shouldShowLearnSalah`, `DAYS`, `ContentTask`, `DayContent`, `WELCOME_BACK`.
- Produces (`lib/view/today.ts`):
```ts
export interface TaskVM extends ContentTask { done: boolean; lockedByTasbih: boolean }
export interface DayVM {
  day: number; cycle: number; content: DayContent; tasks: TaskVM[];
  journal: string; mood: MoodType | null; editable: boolean; isFuture: boolean;
}
export interface TodayVM {
  phase: Phase; today: DateKey; streak: number; daysShownUp: number;
  welcomeBack: boolean; showLearnSalah: boolean; prayersDone: PrayerName[];
  day: DayVM | null;            // null in istiqamah
  istiqamah: IstiqamahVM | null; // null in journey phase
}
export interface IstiqamahVM { hadith: SourcedText; morningDone: boolean; eveningDone: boolean; reflectionKey: number }
export function buildDayVM(state: PersistedState, day: number, today: DateKey): DayVM;
export function buildTodayVM(state: PersistedState, today: DateKey): TodayVM;
```
Rules:
- `buildDayVM`: content = `DAYS[day-1]`; tasks = `personalizeTasks(content.tasks, profile, cycle)`; `done` = id in `planDays[planDayKey(cycle, day)].completedTaskIds` OR (`day` is the current plan day AND task has `tasbih` AND every target ≤ `dates[today].tasbih[dhikrId]`); `lockedByTasbih` = done because of tasbih and not in completedTaskIds. `isFuture` = day > current plan day; `editable` = !isFuture.
- `buildTodayVM`: position from `getPlanPosition(planStartDate, today)`; `welcomeBack` = `shouldWelcomeBack(daysSinceLastActive(active, today))`; `showLearnSalah` = `shouldShowLearnSalah(profile, day, cycle)`; `prayersDone` = `dates[today]?.prayers ?? []`; istiqamah: hadith rotates `DAYS[(daysBetween(planStartDate, today)) % 30].hadith`, `morningDone`/`eveningDone` = tasbih/adhkar flags for today (`dates[today].tasbih['morning_adhkar'] >= 1` / `'evening_adhkar'`), `reflectionKey` = `daysBetween(planStartDate, today)` (istiqamah journal stored under `planDayKey(cycle, 30 + reflectionKey)`; document this).

- [ ] **Step 1: Write failing tests** `lib/__tests__/view-today.test.ts` covering: day 1 on start date; day advances with calendar; personalization trims for 10 min/day; tasbih targets mark a task done + lockedByTasbih; past day editable, future day not; welcomeBack after 3 days; istiqamah after day 30 returns `day: null` and a hadith; `showLearnSalah` for beginner day 1. Build states with `initialState()` and set fields directly. Use `DAYS[0].tasks` ids in assertions (read them from content, don't hardcode titles).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: Components**
  - `TaskThread` props `{ tasks: TaskVM[]; editable: boolean; onToggle(id): void; onLockedPress(): void; labels: { a11yDone: string } }` — `ThreadList` + `CheckNode` rows; title (body), category caption (`t('category.prayer')`…) rendered by the caller-provided label map prop `categoryLabel: (c) => string`.
  - `ReflectionBox` props `{ question: string; value: string; onChange(text): void; placeholder: string; savedLabel: string }` — multiline TextInput (min height 120, radius 14, `colors.surface`), debounced `onChange` commit 600ms after typing stops and on blur; shows a small "Saved" caption after commit.
  - `MoodPicker` props `{ value: MoodType | null; onChange(m: MoodType | null): void; labels: Record<MoodType, string> }` — five `Chip`s, tap again to clear.
- [ ] **Step 6: Today screen** (`app/(tabs)/index.tsx`), top to bottom:
  1. `SkyHeader` with phase (`getSkyPhase(now, times)`), greeting `t('today.greeting', { name })` (or `t('today.greetingNoName')`), Arabic theme title + transliterated theme, date line = Hijri (`toHijri`, month names from `t('hijri.months.N')`) + localized Gregorian (`Intl.DateTimeFormat(lang)` with fallback to `toDateString()`), `PrayerHorizon` (times null in this plan; `done = vm.prayersDone`, `onToggle → togglePrayer(today, p)`). If no location: under the horizon a ghost `Button` `t('today.setPrayerTimes')` → `/(modals)/settings`.
  2. Welcome-back block (if `vm.welcomeBack`): `ArabicBlock` with WELCOME_BACK + one line `t('today.welcomeBack')` ("Welcome back. Pick up right where you are — no catching up needed.").
  3. Learn Salah prompt (if `vm.showLearnSalah`): `ListRow` `t('today.learnSalah')` → `/(tabs)/learn`.
  4. Section "Today's intention": day intro (body).
  5. Section "Today's steps": `TaskThread` (`onToggle → toggleTask(vm.day.day, id, today)`; locked → toast `t('today.tasbihLocked')`).
  6. Hadith: `ArabicBlock` size large + Share icon button (`Share.share({ message })`, message = meaning + source + `t('share.footer')` "Shared from Awdah").
  7. Section "Reflect": `ReflectionBox` (question = `content.reflection`) → `setJournal(day, text, today)`; `MoodPicker` → `setMood(day, m)`.
  8. Istiqamah variant (when `vm.istiqamah`): header title `t('istiqamah.title')` ("Istiqamah — staying steady"), steps: morning adhkar row → `/(tabs)/worship`, evening adhkar row, rotating hadith, reflection, then `Button` secondary `t('istiqamah.newCycle')` with an inline confirm (second tap within 4s, label changes to `t('istiqamah.confirm')`) → `startNextCycle(today)`.
- [ ] **Step 7:** Add all keys, run `node scripts/sync-locales.js`, `npm test && npm run typecheck && npm run lint`.
- [ ] **Step 8:** Commit `feat(today): calendar-driven Today with Prayer Horizon, tasks, reflection`.

---

### Task 3: Day detail modal (past/future days from Journey)

**Files:**
- Create: `app/(modals)/day/[n].tsx`
- Modify: `app/(modals)/_layout.tsx` (register `day/[n]`, drop headers for removed modals later in Task 8)
- Test: extend `lib/__tests__/view-today.test.ts`

Behavior: reads `n` param (1–30, clamp; invalid → back). Uses `buildDayVM(state, n, today)`. Shows theme (Arabic + transliteration), intro, `TaskThread` (`editable` from VM; toggling calls `toggleTask(n, id, today)` — note the store marks *today* active, which is correct), hadith, reflection for that day. Future day: tasks rendered with `editable=false`, a caption `t('day.locked', { n })` ("Opens on day {{n}}"), reflection hidden.

- [ ] **Step 1: Failing test:** with planStartDate 5 days ago, toggling day 2 task via store (`createAppStore()`, `completeOnboarding`, `toggleTask(2, id, today)`) writes `planDays['1:2']` and marks `dates[today]` active (not day 2's date).
- [ ] **Step 2:** Implement screen. **Step 3:** tests/typecheck/lint. **Step 4:** Commit `feat(journey): day detail modal for past and future days`.

---

### Task 4: Journey tab

**Files:**
- Create: `lib/view/journey.ts`, `lib/__tests__/view-journey.test.ts`
- Modify: `app/(tabs)/journey.tsx` (rewrite)

**Interfaces:**
```ts
export type DayStatus = 'complete' | 'partial' | 'open' | 'today' | 'locked';
export interface JourneyDayVM { day: number; theme: string; themeArabic: string; status: DayStatus }
export interface JourneyWeekVM { week: number; title: string; titleArabic: string; days: JourneyDayVM[]; doneCount: number }
export function buildJourneyVM(state: PersistedState, today: DateKey): { cycle: number; currentDay: number; phase: Phase; weeks: JourneyWeekVM[] };
```
Status: `day > currentDay` → locked; `day === currentDay && phase==='journey'` → today (unless all tasks done → complete); else complete if completed ≥ personalized task count, partial if ≥1, open if 0. `doneCount` = complete days in week.

- [ ] **Step 1:** Failing tests: day statuses on a state at day 10 with mixed progress; all 30 days present across 4 weeks (week 4 has 9 days); istiqamah → no `today` status.
- [ ] **Step 2:** Implement VM → PASS.
- [ ] **Step 3: Screen:** header (title `t('journey.title')`, cycle caption when cycle ≥ 2: `t('journey.cycle', { n })`). Each week = `Section` titled with week title + Arabic, subtitle `t('journey.weekProgress', { done, total })`. Days render as a vertical winding path: `ThreadList` whose nodes alternate indent start/end by 24px to suggest a path; node = 36px circle — complete: filled accent + check; partial: half-filled (accent ring + inner dot); today: gold ring 3px + pulsing once on mount (skip if reduceMotion); open: line ring; locked: line ring at 50% opacity + lock icon 12px. Row text: "Day N" caption + theme title. Tap → `router.push('/(modals)/day/' + n)`; today → `/(tabs)`.
- [ ] **Step 4:** keys, sync, tests/typecheck/lint. **Step 5:** Commit `feat(journey): 30-day path with day statuses`.

---

### Task 5: Worship tab — tasbih and adhkar

**Files:**
- Create: `components/worship/TasbihCounter.tsx`, `components/worship/AdhkarList.tsx`
- Modify: `app/(tabs)/worship.tsx` (rewrite)

Behavior:
- **Tasbih:** dhikr selector (horizontal Chips) built from: `subhanallah`, `alhamdulillah`, `allahuakbar`, `astaghfirullah`, `tahlil`, `salawat` (+ any other dhikr ids in today's day content), labels = transliteration, Arabic shown large above the counter. Big circular tap area (min 220px, `colors.surface`, ring progress drawn with SVG for `round % target`), round target chips 33 / 99 / 100 (component state). Each tap: `incrementTasbih(today, dhikrId)`, light haptic; on reaching target: success haptic and round counter resets in UI only. Show "Today: {{count}}" from store. A small "Reset round" ghost button resets UI round only.
- **Adhkar:** Section "Morning adhkar" and "Evening adhkar" from `MORNING_ADHKAR`/`EVENING_ADHKAR` — each item expandable row showing `ArabicBlock`, a per-item mini counter (tap to count up to `count`, UI state), and at the bottom a `Button` "I've completed the morning adhkar" → `incrementTasbih(today, 'morning_adhkar')` (once; disabled if already ≥1 today). Same for evening. Default expansion: morning before Dhuhr, evening after Asr (by clock if no times).
- **Duas:** `ListRow` `t('worship.duas')` → `/(modals)/duas`.

- [ ] **Step 1:** Implement components and screen. **Step 2:** keys, sync, typecheck/lint/test. **Step 3:** Commit `feat(worship): tasbih counter and daily adhkar`.

---

### Task 6: Learn tab

**Files:** Modify `app/(tabs)/learn.tsx`; create `components/learn/StepList.tsx`

Sections: "Wudu, step by step" (`WUDU_STEPS` numbered — this IS a sequence, numbering is appropriate — each step expandable with `recite` as `ArabicBlock`; then `DUA_AFTER_WUDU`), "Your first prayer" (`SALAH_STEPS` numbered + `SALAH_NOTES`), "How many rak'ah?" (`RAKAH_COUNTS` as a simple 5-row table with localized prayer names), "Pillars of Islam" and "Pillars of iman" (name, Arabic, meaning; sources caption), "Keep learning" (`ListRow`s opening `https://quran.com` and `https://sunnah.com` via `Linking.openURL`, captions "Free, trusted resources").

- [ ] **Step 1:** Implement. **Step 2:** keys, sync, typecheck/lint/test. **Step 3:** Commit `feat(learn): Learn Salah, pillars, trusted resources`.

---

### Task 7: Me tab — progress, milestones

**Files:**
- Create: `lib/view/progress.ts`, `lib/__tests__/view-progress.test.ts`, `components/me/PrayerHeatmap.tsx`, `components/me/MilestoneGrid.tsx`, `app/(modals)/milestone/[id].tsx`
- Modify: `app/(tabs)/me.tsx`

**Interfaces:**
```ts
export interface ProgressVM {
  daysShownUp: number; streak: number; prayersKept30: number; // prayers logged in last 30 days
  heatmap: { date: DateKey; count: number }[];  // last 35 days oldest→newest, count 0–5
  milestones: { id: MilestoneId; unlockedOn: DateKey | null }[]; // MILESTONE_IDS order
}
export function buildProgressVM(state: PersistedState, today: DateKey): ProgressVM;
```
- [ ] **Step 1:** Failing tests (heatmap length 35 ending today, counts, prayersKept30 window, milestone order) → implement → PASS.
- [ ] **Step 2: Screen:** greeting with name + edit pencil (`/(modals)/edit-profile`); three plain stat lines (large numeral in Amiri display + label) — days shown up, current streak, prayers kept (30 days) — laid out as a row that wraps; `PrayerHeatmap` (7 columns × 5 rows, square cells radius 6, opacity by count, accessibility label per cell); `MilestoneGrid` (locked = outline + muted title; unlocked = gold Arabic initial glyph; tap → `/(modals)/milestone/[id]` showing title, unlocked date, `ArabicBlock` of its text); `ListRow`s: Settings, About, Help, Privacy.
- [ ] **Step 3:** keys, sync, typecheck/lint/test. **Step 4:** Commit `feat(me): progress, prayer heatmap, milestones`.

---

### Task 8: Onboarding, modals rewrite, and old-code removal

**Files:**
- Modify: `app/(onboarding)/index.tsx` (rewrite), `app/(modals)/_layout.tsx`, `app/(modals)/{settings,edit-profile,duas,about,privacy,help,terms}.tsx` (rewrite); delete `app/(modals)/achievements.tsx`
- Delete: `lib/storage.ts`, `lib/planGenerator.ts`, `lib/achievements.ts`, `lib/theme.ts`, `lib/ThemeProvider.tsx`, `constants/islamicContent.ts`, `constants/duas.ts`, `hooks/useFrameworkReady.ts` (if unused), and remove `points` from `DayTask` plus now-unused types in `lib/types.ts`
- Modify: `package.json` (remove packages no longer imported anywhere: check `expo-blur`, `@expo/vector-icons`, `expo-linking`, `expo-system-ui`, `expo-web-browser`, `expo-symbols` with grep before removing; keep anything Expo Router requires)

**Onboarding** (one screen, step state, progress dots, back button, `KeyboardAvoidingView`):
1. Welcome — Arabic «عودة» hero (Amiri 72, gold), `t('onboarding.welcomeTitle')` ("A gentle path back to your deen"), body: free, private, no accounts, nothing leaves your phone. Button "Begin".
2. Language — 5 options as large rows showing native names (English, العربية, اردو, Bahasa Indonesia, Türkçe); selecting calls `updateSettings({ language })` (RTL takes effect after restart — Plan 5 handles the reload).
3. Name — optional TextInput, "Skip" allowed.
4. Prayer habit — four rows: "Not yet" (none), "Sometimes" (some), "Most days" (most), "All five, alhamdulillah" (all).
5. Knowledge — beginner / intermediate / advanced with one-line gentle descriptions.
6. Focus — up to 3 chips from the 8 areas (localized labels).
7. Time — 5 / 10 / 20 / 30 / 60 minutes rows ("A few minutes is enough to start").
8. Intention — summary + Arabic «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ» with meaning and source Bukhari 1; Button "Start my journey" → `completeOnboarding({ name: name.trim(), prayerHabit, knowledgeLevel, focusAreas, dailyMinutes: clamp(5,120) }, today)`.

**Modals:** `_layout.tsx` uses a Stack with themed header (title via `t()`), back chevron mirrored for RTL.
- `settings`: Language (5 options, same as onboarding), Theme (System / Light / Dark chips), sections reserved for Plan 5 (prayer times, reminders, backup) rendered as a single caption row `t('settings.comingSoon')` is NOT allowed — instead omit them entirely in this plan; Reset all data (destructive `ListRow` → inline confirm: type-free two-step "Tap again to erase everything" within 4s → `resetAll()` → router to onboarding).
- `edit-profile`: edit the five profile fields with the same controls as onboarding; Save → `updateProfile`.
- `duas`: `DUA_CATEGORIES` as Sections with expandable rows (`ArabicBlock`).
- `about`: what Awdah is, why it is free (sadaqah jariyah intention, no ads, no data), version from `expo-constants`.
- `privacy`: accurate — Awdah collects no data; everything is stored only on this device; no accounts, analytics, ads, or trackers; location (if you set it) is used only on-device to calculate prayer times; backups are files you control; uninstalling deletes all data. "Last updated" = 2026-10-09.
- `terms`: plain-language terms; content is for personal spiritual guidance, not a fatwa; consult qualified scholars.
- `help`: accurate FAQ only (how days advance, missed days, past days, tasbih, prayers, language, backup (Plan 5 will add), reset).
- [ ] **Step 1:** Rewrite onboarding + modals. **Step 2:** Delete old files; fix imports; remove `points`. **Step 3:** Remove unused packages (grep-verified). **Step 4:** keys, sync, `npm test && npm run typecheck && npm run lint` (0 errors, no warnings in touched files). **Step 5:** Commit `feat(app): new onboarding and modals; remove legacy Nafs code`.

---

### Task 9: Web smoke test and visual QA

**Files:** fixes anywhere as needed.

- [ ] **Step 1:** Start web: `npx expo start --web --port 8081` (background). Using Chrome DevTools MCP: open `http://localhost:8081`, emulate a 390×844 mobile viewport.
- [ ] **Step 2:** Walk: onboarding (all 8 steps) → Today → check 2 tasks → toggle 2 prayers on the horizon → write a reflection → Journey (open day 1 modal) → Worship (tap tasbih 33×) → Learn → Me (milestone unlocked toast seen) → Settings (switch theme to dark; switch language to Arabic and back).
- [ ] **Step 3:** Screenshot each tab in light and dark (`take_screenshot`), save to `docs/screenshots/plan4/`. Check `list_console_messages` for errors.
- [ ] **Step 4:** Fix any crash, console error, overflow, clipped text, or contrast problem found; re-screenshot.
- [ ] **Step 5:** Commit `fix(app): visual QA fixes from web smoke test` (+ screenshots).
