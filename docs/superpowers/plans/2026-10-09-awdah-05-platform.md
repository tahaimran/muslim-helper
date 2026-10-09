# Awdah Plan 5 — Platform Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make prayer times, location, reminders, file backup, and RTL language switching work on real devices — all on-device, nothing sent anywhere.

**Architecture:** Pure planners (`lib/cities.ts` nearest-city lookup, `lib/notifications.ts` `planNotifications`) are unit-tested; thin platform wrappers (`lib/platform/*.ts`) call Expo modules and are typechecked. Location is GPS coordinates only; the place label and country come from an offline bundled city list — no reverse geocoding (that would send coordinates to Apple/Google).

**Tech Stack:** expo-location, expo-notifications, expo-file-system, expo-sharing, expo-document-picker, expo-updates (reload for RTL), adhan.

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md` (§4 Features, §6 Localization)

## Global Constraints

- No network calls. No reverse geocoding. No analytics.
- Reminders are off by default; enabling one requests permission; denial reverts the toggle and explains how to enable in system settings.
- Prayer alerts scheduled for at most the next 7 days (≤ 35 + 1 notifications, under iOS's 64 limit), rescheduled on app foreground and on any relevant settings change.
- High-latitude locations must never produce invalid (NaN) times (ledger ruling from Plan 1 Task 5).
- All strings via `t()`; run `node scripts/sync-locales.js` after adding keys.

## Review Focus

1. Oslo/Reykjavik in June → valid ordered times (high-latitude rule). (Task 1 test)
2. User denies notification permission → toggle returns to off with an explanation; nothing scheduled. (Task 3)
3. Import of a file from another app or a corrupt file → clear error toast, data untouched. (Task 4)
4. Switching to Arabic/Urdu flips layout direction after reload; switching back to English flips it back. (Task 5)
5. GPS permission denied → user can still choose a city manually. (Task 2)

---

### Task 1: Prayer time hardening

**Files:** Modify `lib/prayerTimes.ts`, `lib/__tests__/prayerTimes.test.ts`

- [ ] **Step 1: Failing tests**
```ts
const OSLO = { latitude: 59.9139, longitude: 10.7522 };
const REYKJAVIK = { latitude: 64.1466, longitude: -21.9426 };
it('produces valid ordered times at high latitudes in summer', () => {
  for (const loc of [OSLO, REYKJAVIK]) {
    const t = getPrayerTimes(new Date(2026, 5, 21), loc, 'MuslimWorldLeague', 'shafi');
    const seq = [t.fajr, t.sunrise, t.dhuhr, t.asr, t.maghrib, t.isha].map((d) => d.getTime());
    seq.forEach((ms) => expect(Number.isFinite(ms)).toBe(true));
    expect([...seq].sort((a, b) => a - b)).toEqual(seq);
  }
});
it('getNextPrayer never returns an invalid date', () => {
  const next = getNextPrayer(new Date(2026, 5, 21, 23, 30), REYKJAVIK, 'MuslimWorldLeague', 'shafi');
  expect(Number.isFinite(next.time.getTime())).toBe(true);
});
```
- [ ] **Step 2:** In `getPrayerTimes`, after creating params: `params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);` (import `HighLatitudeRule` from adhan). In `getNextPrayer`, skip any time whose `getTime()` is not finite.
- [ ] **Step 3:** Tests pass; commit `fix(prayer): high-latitude rule and invalid-time guard`.

---

### Task 2: Location — offline cities, GPS, settings & onboarding UI, Today/Worship wiring

**Files:**
- Create: `lib/cities.ts` (+ `content/cities.json`), `lib/__tests__/cities.test.ts`, `lib/platform/location.ts`, `components/settings/CityPicker.tsx`, `lib/usePrayerTimes.ts`
- Modify: `app/(modals)/settings.tsx`, `app/(onboarding)/index.tsx`, `app/(tabs)/index.tsx`, `app/(tabs)/worship.tsx`, `app.json`

**Interfaces:**
```ts
// content/cities.json: Array<{ name: string; country: string /* ISO-2 */; lat: number; lng: number }>
export interface City { name: string; country: string; lat: number; lng: number }
export const CITIES: City[];
export function nearestCity(lat: number, lng: number): City;              // haversine
export function searchCities(query: string, limit?: number): City[];      // case/diacritic-insensitive prefix-then-substring
// lib/platform/location.ts
export async function getCurrentCoords(): Promise<{ ok: true; latitude: number; longitude: number } | { ok: false; reason: 'denied' | 'unavailable' }>;
// lib/usePrayerTimes.ts
export function usePrayerTimes(date: DateKey): { times: DailyPrayerTimes | null; next: { name: PrayerName; time: Date } | null; method: CalcMethodId; madhab: MadhabId };
```
- `content/cities.json`: ~300 cities — every national capital of Muslim-majority countries, the 10 largest cities of each of PK, IN, ID, BD, TR, EG, NG, SA, IR, MY, DZ, MA, plus major diaspora cities (London, Birmingham, Manchester, Bradford, Leicester, Paris, Marseille, Lyon, Berlin, Hamburg, Cologne, Amsterdam, Rotterdam, Brussels, Stockholm, Oslo, Copenhagen, Vienna, Zurich, Toronto, Montreal, New York, Chicago, Houston, Dallas, Los Angeles, Detroit, Dearborn, Minneapolis, Sydney, Melbourne, Auckland, Johannesburg, Cape Town, Durban). Coordinates to 2 decimals. Validate with a test: names non-empty, `country` matches `/^[A-Z]{2}$/`, lat ∈ [-90,90], lng ∈ [-180,180], no duplicate name+country, ≥ 250 entries.
- `cities.test.ts`: `nearestCity(51.51, -0.13).name === 'London'`; `nearestCity(24.86, 67.0).country === 'PK'`; `searchCities('ist')[0].name === 'Istanbul'`; `searchCities('Ankara')` finds Ankara; diacritics: `searchCities('dusseldorf')` finds "Düsseldorf" if present (include Düsseldorf).
- `lib/platform/location.ts`: `requestForegroundPermissionsAsync` → `getCurrentPositionAsync({ accuracy: Balanced })` with a 10s timeout; never call reverse geocoding.
- Saving a location: GPS → `nearestCity` gives `label = "{city}, {country}"`-style via `t('location.near', { city })` and `countryCode`; manual city → exact city coords. Store via `updateSettings({ location: { latitude, longitude, label, countryCode } })`.
- **Settings → "Prayer times" section:** current location label (or "Not set"), "Use my location", "Choose a city" (`CityPicker` modal: search box + results list), calculation method (Auto (shows resolved method name) + the 12 methods), Asr method (Auto / Standard (Shafi'i, Maliki, Hanbali) / Hanafi). Method names localized via keys `methods.<Id>`.
- **Onboarding:** insert a step after "Time": "Prayer times" — explain on-device only; buttons "Use my location", "Choose a city", "Later".
- **Today:** use `usePrayerTimes(today)` → pass `times`, `timeLabel` (`Intl.DateTimeFormat(lang,{hour:'numeric',minute:'2-digit'})`), and `nextPrayerLine` (`t('today.nextPrayer', { prayer, time })` or relative "in 1 h 20 min" via `t('today.nextIn', { prayer, h, m })`) to `SkyHeader`; refresh every minute. Remove the "Set prayer times" button when location exists.
- **Worship:** a "Prayer times today" `Section` listing the five prayers + sunrise with times, next prayer highlighted.
- **app.json:** add `["expo-location", { "locationWhenInUsePermission": "Awdah uses your location only on your phone to calculate prayer times. It is never sent anywhere." }]`.
- [ ] Steps: cities data + tests (RED→GREEN) → platform wrapper → hook → UI wiring → keys + sync → `npm test && npm run typecheck && npm run lint` → commit `feat(prayer): offline location, city picker, live prayer times`.

---

### Task 3: Reminders (local notifications)

**Files:** Create `lib/notifications.ts`, `lib/__tests__/notifications.test.ts`, `lib/platform/notify.ts`; modify `app/(modals)/settings.tsx`, `app/_layout.tsx`, `app.json`

**Interfaces:**
```ts
export interface PlannedNotification { id: string; kind: 'daily' | 'prayer'; at?: Date; hour?: number; minute?: number; title: string; body: string }
export function planNotifications(args: {
  now: Date;
  reminders: Settings['reminders'];
  timesFor: ((d: Date) => DailyPrayerTimes) | null; // null when no location
  text: { dailyTitle: string; dailyBody: string; prayerTitle: (p: PrayerName) => string; prayerBody: (p: PrayerName) => string };
}): PlannedNotification[];
// lib/platform/notify.ts
export async function ensurePermission(): Promise<boolean>;
export async function applyNotifications(planned: PlannedNotification[]): Promise<void>; // cancelAll then schedule
export async function rescheduleFromStore(): Promise<void>; // reads appStore + i18n, plans, applies (no-op if both reminders off)
```
Rules: daily → one `kind:'daily'` with hour/minute parsed from `dailyTime` (`HH:mm`). Prayers (only if `reminders.prayers && timesFor`) → for each of the next 7 days (today included), each prayer time strictly after `now` → `kind:'prayer'`, id `prayer-YYYY-MM-DD-name`. Sorted by time; daily first.
- Tests: none enabled → []; daily only → 1 item with parsed time; prayers at 23:00 → today has 0 remaining prayers so 30 items (6 days × 5) + 0 today… compute precisely with the fixed Mecca fixture and assert count and first id; prayers without location → only daily.
- Settings → "Reminders" section: "Daily reminder" toggle + time picker (simple hour/minute chips list or `@react-native-community/datetimepicker` via `npx expo install`), "Prayer time alerts" toggle (disabled with caption when no location). Turning on → `ensurePermission()`; if false → revert + toast `t('reminders.denied')`. After any change → `rescheduleFromStore()`.
- Root layout: call `rescheduleFromStore()` once after ready and on every `AppState` → active. Android: create channel `reminders` (importance DEFAULT) in `notify.ts`. Notification handler shows alert/sound.
- app.json notifications plugin color → `#161A33`.
- [ ] Steps: planner tests RED→GREEN → platform module → settings UI → layout wiring → keys/sync → full checks → commit `feat(reminders): daily and prayer-time local notifications`.

---

### Task 4: Backup to file

**Files:** Create `lib/platform/backupFile.ts`; modify `app/(modals)/settings.tsx`, `app/(modals)/help.tsx`

**Interfaces:**
```ts
export async function exportBackup(): Promise<{ ok: true } | { ok: false; reason: 'unavailable' | 'failed' }>;
export async function pickBackup(): Promise<{ ok: true; json: string } | { ok: false; reason: 'cancelled' | 'failed' }>;
```
- Export: `serializeBackup(getPersisted(appStore.getState()), new Date())` → write `${FileSystem.cacheDirectory}awdah-backup-${today}.json` → `Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle })`. If `!(await Sharing.isAvailableAsync())` (web) → `{ ok:false, reason:'unavailable' }`.
- Import: `DocumentPicker.getDocumentAsync({ type: ['application/json', 'text/plain', '*/*'], copyToCacheDirectory: true })` → read as string → `parseBackup(json, today)`; on error show `t('backup.error.<code>')`; on success show an inline confirm ("This replaces everything on this phone. Tap again to restore.") → `replaceAll(data)` → `rescheduleFromStore()` → toast `t('backup.restored')`.
- Settings → "Backup" section: "Save a backup file", "Restore from a file". Help gets an accurate backup FAQ entry.
- [ ] Steps: implement → keys/sync → typecheck/lint/test → commit `feat(backup): export and restore backup files`.

---

### Task 5: RTL switching and app config

**Files:** Create `lib/platform/direction.ts`; modify `app/_layout.tsx`, `app/(modals)/settings.tsx`, `app/(onboarding)/index.tsx`, `app.json`, `package.json`

**Interfaces:**
```ts
export function needsDirectionChange(lang: Lang): boolean; // isRTL(lang) !== I18nManager.isRTL
export async function applyDirection(lang: Lang): Promise<'unchanged' | 'reloading' | 'restart-required'>;
```
- `applyDirection`: if no change → 'unchanged'. Else `I18nManager.allowRTL(true); I18nManager.forceRTL(isRTL(lang));` then try `Updates.reloadAsync()` (`npx expo install expo-updates`) → 'reloading'; if it throws (dev/Expo Go) try `DevSettings.reload()`; else return 'restart-required' and the caller shows a persistent banner `t('language.restart')`.
- Root layout: after `initI18n`, call `applyDirection(lang)` once per launch (guards a mismatch after restore/import).
- Settings & onboarding language pickers: after `updateSettings({ language })`, call `applyDirection`.
- `app.json`: `"extra": { …, "supportsRTL": true }` and confirm via Expo docs (use the Expo MCP `search_documentation` tool: "RTL supportsRTL app.json") the correct config for SDK 54 (e.g. `expo-localization` plugin `supportsRTL`); `ios.infoPlist.CFBundleLocalizations = ["en","ar","ur","id","tr"]`; `android.adaptiveIcon.backgroundColor = "#161A33"`; splash background `#161A33`.
- Verify on web: set language Arabic → `document.dir` / layout mirrored after reload (web uses `I18nManager` polyfill; if web cannot mirror, note it — native is the target).
- [ ] Steps: implement → typecheck/lint/test → commit `feat(i18n): RTL direction switching with reload`.

---

### Task 6: Platform QA on web

- [ ] Run web; via Chrome DevTools MCP: set a city (London) → Today shows times + next prayer; Worship shows list; Settings: toggle reminders (web: permission likely unavailable → graceful toast); export backup (web → "unavailable" toast); switch Arabic → mirrored layout. Screenshot to `docs/screenshots/plan5/`. Fix issues; commit.
