# Awdah Plan 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken state/logic layer with a tested, pure-logic foundation (day derivation, personalization, milestones, prayer times, Hijri, persisted store, legacy import, backup, i18n scaffold) and clean up dependencies — without touching screens yet.

**Architecture:** Pure functions in `lib/` (no React imports) carry all rules and are unit-tested with Jest. One persisted Zustand store (`lib/store.ts`) is the single source of truth. Old files (`lib/storage.ts`, `lib/planGenerator.ts`, `lib/achievements.ts`) stay untouched so current screens keep running; Plan 4 switches screens over and deletes them.

**Tech Stack:** Expo SDK 54, React Native 0.81, TypeScript 5.9, Zustand 5, i18next + react-i18next, expo-localization, adhan 4.x, @umalqura/core, Jest via jest-expo.

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md`

## Global Constraints

- No backend, no auth, no analytics/tracking SDKs, no ads, no purchases. Nothing leaves the device.
- App name "Awdah", slug `awdah`, scheme `awdah`. Bundle ID / package stays `com.nafs.transformation`.
- Supported languages exactly: `en`, `ar`, `ur`, `id`, `tr`. RTL: `ar`, `ur`.
- No points or levels anywhere in new code.
- Pure logic files in `lib/` must not import React or React Native (except `lib/store.ts`, which imports AsyncStorage, and `lib/i18n.ts`).
- No `console.log` in new code.
- Use `npx expo install <pkg>` for Expo-managed packages so versions match SDK 54.
- Tests live in `lib/__tests__/*.test.ts`. Run with `npm test`.
- Windows dev machine: scripts must not use Unix-only env syntax.

## Review Focus

1. Device clock moved backwards (planStartDate later than today) → plan shows Day 1, never Day 0 or negative. (Task 2 test)
2. Prayer times after Isha → next prayer is tomorrow's Fajr, not null or a past time. (Task 5 test)
3. A user with very little time (5 min/day) on a day with 2 prayer tasks → prayer tasks are never dropped. (Task 3 test)
4. Importing a corrupted file or another app's JSON → rejected with a specific error, existing data untouched. (Task 7 test)
5. Legacy Nafs data with missing/partial fields (no profile, no planStartDate, odd day keys) → converts without throwing, or returns null. (Task 6 test)

---

### Task 1: Tooling, dependency cleanup, Jest

**Files:**
- Modify: `package.json`, `app.json`, `tsconfig.json` (only if needed)
- Create: `jest.config.js`, `jest.global-setup.js`, `jest.setup.js`, `lib/__tests__/sanity.test.ts`

**Interfaces:**
- Produces: `npm test` runs Jest with `TZ=America/New_York`, AsyncStorage mocked, `@/` alias mapped.

- [ ] **Step 1: Install current dependencies**

Run: `npm install`
Expected: completes; `node_modules/` exists.

- [ ] **Step 2: Record baseline typecheck**

Run: `npm run typecheck 2>&1 | tail -20`
Note the error count (may be non-zero from existing screens). Later tasks must not add errors in files they touch.

- [ ] **Step 3: Remove unused packages**

Run:
```bash
npm uninstall @supabase/supabase-js expo-camera expo-secure-store react-native-url-polyfill react-native-webview expo-symbols @lucide/lab @expo/ngrok
```
Expected: success. (Fonts and `@expo/vector-icons` stay until Plan 3/4 decide.)

- [ ] **Step 4: Add new runtime and dev packages**

Run:
```bash
npm install zustand@5 i18next react-i18next adhan @umalqura/core
npx expo install expo-localization
npx expo install jest-expo jest @types/jest -- --save-dev
```
Expected: all succeed.

- [ ] **Step 5: Update package.json name and scripts**

Set `"name": "awdah"`, and the scripts to:
```json
"scripts": {
  "dev": "expo start",
  "build:web": "expo export --platform web",
  "lint": "expo lint",
  "typecheck": "tsc --noEmit",
  "test": "jest"
}
```

- [ ] **Step 6: Update app.json**

In `expo`: set `"name": "Awdah"`, `"slug": "awdah"`, `"scheme": "awdah"`, `"description": "Awdah — a free, private, ad-free guide back to your deen: a gentle 30-day path, salah, dhikr and reflection. No accounts, no ads, nothing leaves your phone."`. Remove the whole `["expo-secure-store", {...}]` entry from `plugins`. Change `"backgroundColor"` of `android.adaptiveIcon` only in Plan 3 (leave as is). Keep `extra.privacyPolicyUrl`/`supportEmail` for now.

- [ ] **Step 7: Create Jest config files**

`jest.config.js`:
```js
module.exports = {
  preset: 'jest-expo',
  globalSetup: './jest.global-setup.js',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
};
```

`jest.global-setup.js`:
```js
module.exports = async () => {
  process.env.TZ = 'America/New_York';
};
```

`jest.setup.js`:
```js
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
```

- [ ] **Step 8: Write a sanity test**

`lib/__tests__/sanity.test.ts`:
```ts
describe('test environment', () => {
  it('runs in America/New_York', () => {
    // Jan offset is UTC-5 => 300 minutes
    expect(new Date(2026, 0, 15).getTimezoneOffset()).toBe(300);
  });
});
```

- [ ] **Step 9: Run tests**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 10: Ensure JSON imports typecheck**

Check `tsconfig.json` / `expo/tsconfig.base` for `"resolveJsonModule": true`. If absent, add it under `compilerOptions` in `tsconfig.json`. Do not set `compilerOptions.types` (leaving it unset lets `@types/jest` load). Run `npm run typecheck`; error count must not exceed the Step 2 baseline.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: rename to Awdah, drop unused deps, add Jest"
```

---

### Task 2: Date keys and plan position (`lib/day.ts`)

**Files:**
- Create: `lib/day.ts`
- Test: `lib/__tests__/day.test.ts`

**Interfaces:**
- Produces:
  - `type DateKey = string` (`'YYYY-MM-DD'`, local calendar)
  - `toDateKey(d: Date): DateKey`
  - `addDays(key: DateKey, n: number): DateKey`
  - `daysBetween(from: DateKey, to: DateKey): number`
  - `PLAN_LENGTH = 30`
  - `type Phase = 'journey' | 'istiqamah'`
  - `getPlanPosition(planStartDate: DateKey, today: DateKey): { day: number; phase: Phase }`
  - `getStreak(active: ReadonlySet<DateKey>, today: DateKey): number`
  - `daysSinceLastActive(active: ReadonlySet<DateKey>, today: DateKey): number | null`
  - `shouldWelcomeBack(daysSince: number | null): boolean`

- [ ] **Step 1: Write failing tests**

`lib/__tests__/day.test.ts`:
```ts
import {
  toDateKey, addDays, daysBetween, getPlanPosition, getStreak,
  daysSinceLastActive, shouldWelcomeBack, PLAN_LENGTH,
} from '../day';

describe('date keys', () => {
  it('uses the local calendar date', () => {
    expect(toDateKey(new Date(2026, 2, 8, 23, 30))).toBe('2026-03-08');
    expect(toDateKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05');
  });
  it('adds days across month, leap and DST boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-08', 1)).toBe('2026-03-09'); // US DST start
    expect(addDays('2026-11-01', 1)).toBe('2026-11-02'); // US DST end
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });
  it('counts whole days between keys, DST-safe', () => {
    expect(daysBetween('2026-03-07', '2026-03-09')).toBe(2);
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
    expect(daysBetween('2026-01-10', '2026-01-10')).toBe(0);
    expect(daysBetween('2026-01-10', '2026-01-08')).toBe(-2);
  });
});

describe('getPlanPosition', () => {
  it('starts on day 1', () => {
    expect(getPlanPosition('2026-10-01', '2026-10-01')).toEqual({ day: 1, phase: 'journey' });
  });
  it('advances by calendar day', () => {
    expect(getPlanPosition('2026-10-01', '2026-10-15')).toEqual({ day: 15, phase: 'journey' });
    expect(getPlanPosition('2026-10-01', '2026-10-30')).toEqual({ day: 30, phase: 'journey' });
  });
  it('enters istiqamah after day 30', () => {
    expect(getPlanPosition('2026-10-01', '2026-10-31')).toEqual({ day: PLAN_LENGTH, phase: 'istiqamah' });
    expect(getPlanPosition('2026-10-01', '2027-03-01')).toEqual({ day: PLAN_LENGTH, phase: 'istiqamah' });
  });
  it('never goes below day 1 if the clock moved backwards', () => {
    expect(getPlanPosition('2026-10-10', '2026-10-01')).toEqual({ day: 1, phase: 'journey' });
  });
});

describe('getStreak', () => {
  const set = (...k: string[]) => new Set(k);
  it('counts consecutive days ending today', () => {
    expect(getStreak(set('2026-10-07', '2026-10-08', '2026-10-09'), '2026-10-09')).toBe(3);
  });
  it('still counts through yesterday if today has no activity yet', () => {
    expect(getStreak(set('2026-10-07', '2026-10-08'), '2026-10-09')).toBe(2);
  });
  it('is 0 after a missed day', () => {
    expect(getStreak(set('2026-10-06'), '2026-10-09')).toBe(0);
  });
  it('stops at a gap', () => {
    expect(getStreak(set('2026-10-05', '2026-10-07', '2026-10-08', '2026-10-09'), '2026-10-09')).toBe(3);
  });
});

describe('welcome back', () => {
  it('measures days since last activity, ignoring future keys', () => {
    expect(daysSinceLastActive(new Set(['2026-10-01', '2026-10-05', '2026-12-01']), '2026-10-09')).toBe(4);
    expect(daysSinceLastActive(new Set(), '2026-10-09')).toBeNull();
  });
  it('welcomes back after 2+ missed days (last active 3+ days ago)', () => {
    expect(shouldWelcomeBack(null)).toBe(false);
    expect(shouldWelcomeBack(1)).toBe(false);
    expect(shouldWelcomeBack(2)).toBe(false);
    expect(shouldWelcomeBack(3)).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx jest lib/__tests__/day.test.ts`
Expected: FAIL — cannot find module `../day`.

- [ ] **Step 3: Implement `lib/day.ts`**

```ts
export type DateKey = string;

export const PLAN_LENGTH = 30;
export type Phase = 'journey' | 'istiqamah';

const DAY_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(d: Date): DateKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function keyToUTC(key: DateKey): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(key: DateKey, n: number): DateKey {
  const t = new Date(keyToUTC(key) + n * DAY_MS);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export function daysBetween(from: DateKey, to: DateKey): number {
  return Math.round((keyToUTC(to) - keyToUTC(from)) / DAY_MS);
}

export function getPlanPosition(planStartDate: DateKey, today: DateKey): { day: number; phase: Phase } {
  const elapsed = Math.max(0, daysBetween(planStartDate, today));
  if (elapsed >= PLAN_LENGTH) return { day: PLAN_LENGTH, phase: 'istiqamah' };
  return { day: elapsed + 1, phase: 'journey' };
}

export function getStreak(active: ReadonlySet<DateKey>, today: DateKey): number {
  let cursor = active.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (active.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

export function daysSinceLastActive(active: ReadonlySet<DateKey>, today: DateKey): number | null {
  let latest: DateKey | null = null;
  for (const key of active) {
    if (key <= today && (latest === null || key > latest)) latest = key;
  }
  return latest === null ? null : daysBetween(latest, today);
}

export function shouldWelcomeBack(daysSince: number | null): boolean {
  return daysSince !== null && daysSince >= 3;
}
```

- [ ] **Step 4: Run tests**

Run: `npx jest lib/__tests__/day.test.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/day.ts lib/__tests__/day.test.ts
git commit -m "feat(core): calendar-based plan position, streak, welcome-back"
```

---

### Task 3: Domain model and plan personalization (`lib/model.ts`, `lib/plan.ts`)

**Files:**
- Create: `lib/model.ts`, `lib/plan.ts`
- Modify: `lib/types.ts` (add two optional fields to `DayTask`)
- Test: `lib/__tests__/plan.test.ts`

**Interfaces:**
- Consumes: `DateKey` from `lib/day.ts`; `DayTask`, `ImprovementArea`, `KnowledgeLevel`, `PracticeLevel`, `MoodType`, `PrayerName` from `lib/types.ts`.
- Produces (`lib/model.ts`):
  - `type Lang = 'en' | 'ar' | 'ur' | 'id' | 'tr'`
  - `type CalcMethodId`, `type MadhabId = 'shafi' | 'hanafi'`
  - `interface Profile`, `interface SavedLocation`, `interface Settings`, `interface PlanDayLog`, `interface DateLog`, `interface PersistedState`
  - `DEFAULT_SETTINGS: Settings`, `initialState(): PersistedState`, `emptyDateLog(): DateLog`, `planDayKey(cycle: number, day: number): string`
- Produces (`lib/plan.ts`):
  - `taskLimit(dailyMinutes: number): number`
  - `personalizeTasks(tasks: DayTask[], profile: Profile, cycle: number): DayTask[]`
  - `shouldShowLearnSalah(profile: Profile, day: number, cycle: number): boolean`

- [ ] **Step 1: Add optional variant titles to `DayTask` in `lib/types.ts`**

Replace the `DayTask` interface with:
```ts
export interface DayTask {
  id: string;
  title: string;
  titleBeginner?: string;
  titleAdvanced?: string;
  category: 'prayer' | 'quran' | 'dhikr' | 'sunnah' | 'character' | 'reflection';
  points: number;
}
```
(`points` stays for now because old screens use it; Plan 4 removes it.)

- [ ] **Step 2: Create `lib/model.ts`**

```ts
import type { DateKey } from './day';
import type { ImprovementArea, KnowledgeLevel, MoodType, PracticeLevel, PrayerName } from './types';

export type Lang = 'en' | 'ar' | 'ur' | 'id' | 'tr';

export type CalcMethodId =
  | 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'UmmAlQura' | 'Dubai'
  | 'MoonsightingCommittee' | 'NorthAmerica' | 'Kuwait' | 'Qatar'
  | 'Singapore' | 'Tehran' | 'Turkey';

export type MadhabId = 'shafi' | 'hanafi';

export interface Profile {
  name: string;
  prayerHabit: PracticeLevel;
  knowledgeLevel: KnowledgeLevel;
  focusAreas: ImprovementArea[];
  dailyMinutes: number;
}

export interface SavedLocation {
  latitude: number;
  longitude: number;
  label: string;
  countryCode: string | null;
}

export interface Settings {
  language: Lang | null; // null = follow device
  theme: 'system' | 'light' | 'dark';
  location: SavedLocation | null;
  calcMethod: CalcMethodId | null; // null = auto by country
  madhab: MadhabId | null; // null = auto by country
  reminders: { daily: boolean; dailyTime: string; prayers: boolean };
}

export interface PlanDayLog {
  completedTaskIds: string[];
  journal?: string;
  mood?: MoodType;
}

export interface DateLog {
  active: boolean;
  prayers: PrayerName[];
  tasbih: Record<string, number>;
}

export interface PersistedState {
  schema: 1;
  profile: Profile | null;
  settings: Settings;
  cycle: number;
  planStartDate: DateKey | null;
  planDays: Record<string, PlanDayLog>; // key: planDayKey(cycle, day)
  dates: Record<DateKey, DateLog>;
  milestones: Record<string, DateKey>; // id -> date unlocked
}

export const DEFAULT_SETTINGS: Settings = {
  language: null,
  theme: 'system',
  location: null,
  calcMethod: null,
  madhab: null,
  reminders: { daily: false, dailyTime: '20:00', prayers: false },
};

export function initialState(): PersistedState {
  return {
    schema: 1,
    profile: null,
    settings: { ...DEFAULT_SETTINGS, reminders: { ...DEFAULT_SETTINGS.reminders } },
    cycle: 1,
    planStartDate: null,
    planDays: {},
    dates: {},
    milestones: {},
  };
}

export function emptyDateLog(): DateLog {
  return { active: false, prayers: [], tasbih: {} };
}

export function planDayKey(cycle: number, day: number): string {
  return `${cycle}:${day}`;
}
```

- [ ] **Step 3: Write failing tests**

`lib/__tests__/plan.test.ts`:
```ts
import { personalizeTasks, shouldShowLearnSalah, taskLimit } from '../plan';
import type { Profile } from '../model';
import type { DayTask } from '../types';

const tasks: DayTask[] = [
  { id: '1_fajr', title: 'Pray Fajr with all Sunnah prayers', titleBeginner: 'Pray Fajr', titleAdvanced: 'Pray Fajr + 2 sunnah + adhkar', category: 'prayer', points: 0 },
  { id: '1_bismillah', title: 'Bismillah', category: 'sunnah', points: 0 },
  { id: '1_fatihah', title: 'Fatihah', category: 'quran', points: 0 },
  { id: '1_secret', title: 'Secret deed', category: 'character', points: 0 },
  { id: '1_dhikr', title: 'Evening dhikr', category: 'dhikr', points: 0 },
  { id: '1_reflect', title: 'Reflect', category: 'reflection', points: 0 },
];

const profile = (p: Partial<Profile> = {}): Profile => ({
  name: 'Ali', prayerHabit: 'most', knowledgeLevel: 'intermediate',
  focusAreas: [], dailyMinutes: 60, ...p,
});

describe('taskLimit', () => {
  it('scales with daily minutes', () => {
    expect(taskLimit(5)).toBe(3);
    expect(taskLimit(15)).toBe(4);
    expect(taskLimit(29)).toBe(4);
    expect(taskLimit(30)).toBe(6);
  });
});

describe('personalizeTasks', () => {
  it('keeps all tasks and original order when time allows and no focus', () => {
    expect(personalizeTasks(tasks, profile(), 1).map((t) => t.id)).toEqual(tasks.map((t) => t.id));
  });
  it('puts prayer first, then focus areas, preserving relative order', () => {
    const ids = personalizeTasks(tasks, profile({ focusAreas: ['dhikr', 'quran'] }), 1).map((t) => t.id);
    expect(ids).toEqual(['1_fajr', '1_fatihah', '1_dhikr', '1_bismillah', '1_secret', '1_reflect']);
  });
  it('trims to the time limit', () => {
    expect(personalizeTasks(tasks, profile({ dailyMinutes: 10 }), 1)).toHaveLength(3);
  });
  it('never drops prayer tasks even below the limit', () => {
    const many: DayTask[] = [
      { id: 'a', title: 'A', category: 'prayer', points: 0 },
      { id: 'b', title: 'B', category: 'prayer', points: 0 },
      { id: 'c', title: 'C', category: 'prayer', points: 0 },
      { id: 'd', title: 'D', category: 'prayer', points: 0 },
      { id: 'e', title: 'E', category: 'quran', points: 0 },
    ];
    const ids = personalizeTasks(many, profile({ dailyMinutes: 5 }), 1).map((t) => t.id);
    expect(ids).toEqual(['a', 'b', 'c', 'd']);
  });
  it('uses beginner titles for beginners in cycle 1', () => {
    expect(personalizeTasks(tasks, profile({ knowledgeLevel: 'beginner' }), 1)[0].title).toBe('Pray Fajr');
  });
  it('uses advanced titles from cycle 2', () => {
    expect(personalizeTasks(tasks, profile({ knowledgeLevel: 'beginner' }), 2)[0].title).toBe('Pray Fajr + 2 sunnah + adhkar');
  });
  it('falls back to the base title when a variant is missing', () => {
    expect(personalizeTasks(tasks, profile({ knowledgeLevel: 'beginner' }), 1)[1].title).toBe('Bismillah');
  });
});

describe('shouldShowLearnSalah', () => {
  it('shows for beginners or low prayer habit in the first week of cycle 1', () => {
    expect(shouldShowLearnSalah(profile({ knowledgeLevel: 'beginner' }), 1, 1)).toBe(true);
    expect(shouldShowLearnSalah(profile({ prayerHabit: 'none' }), 7, 1)).toBe(true);
    expect(shouldShowLearnSalah(profile({ prayerHabit: 'some' }), 3, 1)).toBe(true);
  });
  it('hides after day 7, in later cycles, or for practicing users', () => {
    expect(shouldShowLearnSalah(profile({ knowledgeLevel: 'beginner' }), 8, 1)).toBe(false);
    expect(shouldShowLearnSalah(profile({ knowledgeLevel: 'beginner' }), 1, 2)).toBe(false);
    expect(shouldShowLearnSalah(profile(), 1, 1)).toBe(false);
  });
});
```

- [ ] **Step 4: Run to verify failure**

Run: `npx jest lib/__tests__/plan.test.ts`
Expected: FAIL — cannot find module `../plan`.

- [ ] **Step 5: Implement `lib/plan.ts`**

```ts
import type { Profile } from './model';
import type { DayTask, ImprovementArea } from './types';

const FOCUS_TO_CATEGORY: Record<ImprovementArea, DayTask['category']> = {
  prayer: 'prayer',
  quran: 'quran',
  dhikr: 'dhikr',
  fasting: 'sunnah',
  character: 'character',
  family: 'character',
  charity: 'character',
  knowledge: 'reflection',
};

export function taskLimit(dailyMinutes: number): number {
  if (dailyMinutes < 15) return 3;
  if (dailyMinutes < 30) return 4;
  return 6;
}

export function personalizeTasks(tasks: DayTask[], profile: Profile, cycle: number): DayTask[] {
  const focus = new Set(profile.focusAreas.map((a) => FOCUS_TO_CATEGORY[a]));
  const rank = (t: DayTask) => (t.category === 'prayer' ? 0 : focus.has(t.category) ? 1 : 2);

  const ordered = tasks
    .map((task, index) => ({ task, index }))
    .sort((a, b) => rank(a.task) - rank(b.task) || a.index - b.index)
    .map((x) => x.task);

  const prayerCount = ordered.filter((t) => t.category === 'prayer').length;
  const limit = Math.max(taskLimit(profile.dailyMinutes), prayerCount);

  return ordered.slice(0, limit).map((t) => {
    if (cycle >= 2) return { ...t, title: t.titleAdvanced ?? t.title };
    if (profile.knowledgeLevel === 'beginner') return { ...t, title: t.titleBeginner ?? t.title };
    return t;
  });
}

export function shouldShowLearnSalah(profile: Profile, day: number, cycle: number): boolean {
  if (cycle !== 1 || day > 7) return false;
  return (
    profile.knowledgeLevel === 'beginner' ||
    profile.prayerHabit === 'none' ||
    profile.prayerHabit === 'some'
  );
}
```

- [ ] **Step 6: Run tests**

Run: `npx jest lib/__tests__/plan.test.ts`
Expected: all PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/model.ts lib/plan.ts lib/types.ts lib/__tests__/plan.test.ts
git commit -m "feat(core): domain model and onboarding-driven task personalization"
```

---

### Task 4: Milestones (`lib/milestones.ts`)

**Files:**
- Create: `lib/milestones.ts`
- Test: `lib/__tests__/milestones.test.ts`

**Interfaces:**
- Consumes: `PersistedState`, `initialState`, `planDayKey` from `lib/model.ts`; `getStreak`, `DateKey` from `lib/day.ts`.
- Produces:
  - `MILESTONE_IDS` (readonly tuple) and `type MilestoneId`
  - `activeDateSet(state: PersistedState): Set<DateKey>`
  - `evaluateMilestones(state: PersistedState, today: DateKey): MilestoneId[]` — returns only newly met ids (not already in `state.milestones`), in `MILESTONE_IDS` order.

Milestone rules:
| id | met when |
|---|---|
| `first_step` | ≥1 active date |
| `first_full_salah_day` | some date has all 5 prayers |
| `three_days` | ≥3 active dates |
| `week_one` | ≥7 active dates |
| `streak_7` | current streak ≥7 |
| `fajr_7` | fajr logged on ≥7 dates |
| `first_reflection` | some plan day has a non-blank journal |
| `tasbih_1000` | total tasbih count across all dates ≥1000 |
| `halfway` | in the current cycle, ≥15 plan days have ≥1 completed task |
| `journey_complete` | in any cycle, all 30 plan days have ≥1 completed task |

- [ ] **Step 1: Write failing tests**

`lib/__tests__/milestones.test.ts`:
```ts
import { evaluateMilestones, activeDateSet } from '../milestones';
import { initialState, planDayKey, type PersistedState } from '../model';
import { addDays } from '../day';
import type { PrayerName } from '../types';

const ALL: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function withActiveDays(n: number, end = '2026-10-09', prayers: PrayerName[] = []): PersistedState {
  const s = initialState();
  for (let i = 0; i < n; i++) {
    s.dates[addDays(end, -i)] = { active: true, prayers, tasbih: {} };
  }
  return s;
}

describe('evaluateMilestones', () => {
  it('returns nothing for a fresh state', () => {
    expect(evaluateMilestones(initialState(), '2026-10-09')).toEqual([]);
  });
  it('unlocks first_step on the first active day', () => {
    expect(evaluateMilestones(withActiveDays(1), '2026-10-09')).toEqual(['first_step']);
  });
  it('unlocks day-count and streak milestones', () => {
    const ids = evaluateMilestones(withActiveDays(7), '2026-10-09');
    expect(ids).toEqual(expect.arrayContaining(['first_step', 'three_days', 'week_one', 'streak_7']));
  });
  it('unlocks prayer milestones', () => {
    const ids = evaluateMilestones(withActiveDays(7, '2026-10-09', ALL), '2026-10-09');
    expect(ids).toEqual(expect.arrayContaining(['first_full_salah_day', 'fajr_7']));
  });
  it('does not return already unlocked milestones', () => {
    const s = withActiveDays(1);
    s.milestones.first_step = '2026-10-01';
    expect(evaluateMilestones(s, '2026-10-09')).toEqual([]);
  });
  it('ignores inactive dates', () => {
    const s = initialState();
    s.dates['2026-10-09'] = { active: false, prayers: [], tasbih: {} };
    expect(activeDateSet(s).size).toBe(0);
  });
  it('unlocks first_reflection only for non-blank journals', () => {
    const s = initialState();
    s.planDays[planDayKey(1, 1)] = { completedTaskIds: [], journal: '   ' };
    expect(evaluateMilestones(s, '2026-10-09')).not.toContain('first_reflection');
    s.planDays[planDayKey(1, 1)].journal = 'Bismillah';
    expect(evaluateMilestones(s, '2026-10-09')).toContain('first_reflection');
  });
  it('sums tasbih across dates', () => {
    const s = initialState();
    s.dates['2026-10-08'] = { active: true, prayers: [], tasbih: { subhanallah: 600 } };
    s.dates['2026-10-09'] = { active: true, prayers: [], tasbih: { alhamdulillah: 400 } };
    expect(evaluateMilestones(s, '2026-10-09')).toContain('tasbih_1000');
  });
  it('counts halfway only in the current cycle, journey_complete in any cycle', () => {
    const s = initialState();
    for (let d = 1; d <= 30; d++) s.planDays[planDayKey(1, d)] = { completedTaskIds: [`${d}_x`] };
    s.cycle = 2;
    const ids = evaluateMilestones(s, '2026-10-09');
    expect(ids).toContain('journey_complete');
    expect(ids).not.toContain('halfway');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx jest lib/__tests__/milestones.test.ts`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `lib/milestones.ts`**

```ts
import { getStreak, PLAN_LENGTH, type DateKey } from './day';
import { planDayKey, type PersistedState } from './model';

export const MILESTONE_IDS = [
  'first_step',
  'first_full_salah_day',
  'three_days',
  'week_one',
  'streak_7',
  'fajr_7',
  'first_reflection',
  'tasbih_1000',
  'halfway',
  'journey_complete',
] as const;

export type MilestoneId = (typeof MILESTONE_IDS)[number];

export function activeDateSet(state: PersistedState): Set<DateKey> {
  return new Set(Object.keys(state.dates).filter((k) => state.dates[k].active));
}

function daysWithTasks(state: PersistedState, cycle: number): number {
  let n = 0;
  for (let d = 1; d <= PLAN_LENGTH; d++) {
    if ((state.planDays[planDayKey(cycle, d)]?.completedTaskIds.length ?? 0) > 0) n++;
  }
  return n;
}

export function evaluateMilestones(state: PersistedState, today: DateKey): MilestoneId[] {
  const active = activeDateSet(state);
  const dateLogs = Object.values(state.dates);
  const journals = Object.values(state.planDays).some((p) => (p.journal ?? '').trim().length > 0);
  const tasbihTotal = dateLogs.reduce(
    (sum, log) => sum + Object.values(log.tasbih).reduce((a, b) => a + b, 0),
    0
  );
  const fajrDays = dateLogs.filter((log) => log.prayers.includes('fajr')).length;
  const fullSalahDay = dateLogs.some((log) => new Set(log.prayers).size === 5);
  let anyCycleComplete = false;
  for (let c = 1; c <= state.cycle; c++) {
    if (daysWithTasks(state, c) >= PLAN_LENGTH) anyCycleComplete = true;
  }

  const met: Record<MilestoneId, boolean> = {
    first_step: active.size >= 1,
    first_full_salah_day: fullSalahDay,
    three_days: active.size >= 3,
    week_one: active.size >= 7,
    streak_7: getStreak(active, today) >= 7,
    fajr_7: fajrDays >= 7,
    first_reflection: journals,
    tasbih_1000: tasbihTotal >= 1000,
    halfway: daysWithTasks(state, state.cycle) >= 15,
    journey_complete: anyCycleComplete,
  };

  return MILESTONE_IDS.filter((id) => met[id] && !state.milestones[id]);
}
```

- [ ] **Step 4: Run tests**

Run: `npx jest lib/__tests__/milestones.test.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/milestones.ts lib/__tests__/milestones.test.ts
git commit -m "feat(core): sincerity-friendly milestones replacing points"
```

---

### Task 5: Hijri date and offline prayer times (`lib/hijri.ts`, `lib/prayerTimes.ts`)

**Files:**
- Create: `lib/hijri.ts`, `lib/prayerTimes.ts`
- Test: `lib/__tests__/hijri.test.ts`, `lib/__tests__/prayerTimes.test.ts`

**Interfaces:**
- Consumes: `CalcMethodId`, `MadhabId`, `Settings` from `lib/model.ts`; `PrayerName` from `lib/types.ts`.
- Produces (`lib/hijri.ts`): `interface HijriDate { year: number; month: number; day: number }`, `toHijri(date: Date): HijriDate | null`
- Produces (`lib/prayerTimes.ts`):
  - `PRAYER_ORDER: PrayerName[]`
  - `interface DailyPrayerTimes { fajr: Date; sunrise: Date; dhuhr: Date; asr: Date; maghrib: Date; isha: Date }`
  - `interface Coords { latitude: number; longitude: number }`
  - `resolveCalcSettings(settings: Pick<Settings, 'calcMethod' | 'madhab'>, countryCode: string | null): { method: CalcMethodId; madhab: MadhabId }`
  - `getPrayerTimes(date: Date, coords: Coords, method: CalcMethodId, madhab: MadhabId): DailyPrayerTimes`
  - `getNextPrayer(now: Date, coords: Coords, method: CalcMethodId, madhab: MadhabId): { name: PrayerName; time: Date }`

- [ ] **Step 1: Write failing Hijri tests**

`lib/__tests__/hijri.test.ts`:
```ts
import { toHijri } from '../hijri';

describe('toHijri (Umm al-Qura)', () => {
  it('matches known dates', () => {
    expect(toHijri(new Date(2026, 1, 18))).toEqual({ year: 1447, month: 9, day: 1 }); // 1 Ramadan 1447
    expect(toHijri(new Date(2025, 2, 1))).toEqual({ year: 1446, month: 9, day: 1 }); // 1 Ramadan 1446
    expect(toHijri(new Date(2025, 5, 26))).toEqual({ year: 1447, month: 1, day: 1 }); // 1 Muharram 1447
  });
  it('returns null instead of throwing outside the supported range', () => {
    expect(toHijri(new Date(1800, 0, 1))).toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx jest lib/__tests__/hijri.test.ts`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `lib/hijri.ts`**

```ts
import umalqura from '@umalqura/core';

export interface HijriDate {
  year: number;
  month: number; // 1 = Muharram … 12 = Dhu al-Hijjah
  day: number;
}

export function toHijri(date: Date): HijriDate | null {
  try {
    const h = umalqura(date);
    if (!Number.isFinite(h.hy) || !Number.isFinite(h.hm) || !Number.isFinite(h.hd)) return null;
    return { year: h.hy, month: h.hm, day: h.hd };
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run Hijri tests**

Run: `npx jest lib/__tests__/hijri.test.ts`
Expected: PASS. If the out-of-range case returns a value instead of null, add an explicit guard before calling the library: `if (date.getFullYear() < 1900 || date.getFullYear() > 2076) return null;` (Umm al-Qura tables cover roughly 1300–1500 AH), and re-run.

- [ ] **Step 5: Write failing prayer time tests**

`lib/__tests__/prayerTimes.test.ts`:
```ts
import { getPrayerTimes, getNextPrayer, resolveCalcSettings, PRAYER_ORDER } from '../prayerTimes';

const MECCA = { latitude: 21.4225, longitude: 39.8262 };
const DAY = new Date(2026, 9, 9); // local Y/M/D = 2026-10-09

describe('getPrayerTimes', () => {
  it('computes Umm al-Qura times for Mecca', () => {
    const t = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    expect(t.fajr.toISOString()).toBe('2026-10-09T01:58:00.000Z');
    expect(t.maghrib.toISOString()).toBe('2026-10-09T15:01:00.000Z');
  });
  it('returns times in prayer order', () => {
    const t = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    const times = PRAYER_ORDER.map((p) => t[p].getTime());
    expect([...times].sort((a, b) => a - b)).toEqual(times);
  });
  it('puts Hanafi Asr later than Shafi Asr', () => {
    const shafi = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'shafi');
    const hanafi = getPrayerTimes(DAY, MECCA, 'UmmAlQura', 'hanafi');
    expect(hanafi.asr.getTime()).toBeGreaterThan(shafi.asr.getTime());
  });
});

describe('getNextPrayer', () => {
  it('returns the next prayer later today', () => {
    const next = getNextPrayer(new Date('2026-10-09T15:30:00Z'), MECCA, 'UmmAlQura', 'shafi');
    expect(next.name).toBe('isha');
  });
  it("returns tomorrow's fajr after isha", () => {
    const now = new Date('2026-10-09T20:00:00Z'); // 16:00 in New York, still 2026-10-09 locally
    const next = getNextPrayer(now, MECCA, 'UmmAlQura', 'shafi');
    expect(next.name).toBe('fajr');
    expect(next.time.getTime()).toBeGreaterThan(now.getTime());
    expect(next.time.toISOString().startsWith('2026-10-10')).toBe(true);
  });
});

describe('resolveCalcSettings', () => {
  it('picks a regional default method and madhab', () => {
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'PK')).toEqual({ method: 'Karachi', madhab: 'hanafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'TR')).toEqual({ method: 'Turkey', madhab: 'hanafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'ID')).toEqual({ method: 'Singapore', madhab: 'shafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'SA')).toEqual({ method: 'UmmAlQura', madhab: 'shafi' });
  });
  it('falls back to Muslim World League / shafi', () => {
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, null)).toEqual({ method: 'MuslimWorldLeague', madhab: 'shafi' });
    expect(resolveCalcSettings({ calcMethod: null, madhab: null }, 'ZZ')).toEqual({ method: 'MuslimWorldLeague', madhab: 'shafi' });
  });
  it('respects explicit user choices', () => {
    expect(resolveCalcSettings({ calcMethod: 'Egyptian', madhab: 'hanafi' }, 'SA')).toEqual({ method: 'Egyptian', madhab: 'hanafi' });
  });
});
```

- [ ] **Step 6: Run to verify failure**

Run: `npx jest lib/__tests__/prayerTimes.test.ts`
Expected: FAIL — cannot find module.

- [ ] **Step 7: Implement `lib/prayerTimes.ts`**

```ts
import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';
import type { CalcMethodId, MadhabId, Settings } from './model';
import type { PrayerName } from './types';

export const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface Coords {
  latitude: number;
  longitude: number;
}

const COUNTRY_METHOD: Record<string, CalcMethodId> = {
  SA: 'UmmAlQura',
  PK: 'Karachi', IN: 'Karachi', BD: 'Karachi', AF: 'Karachi',
  TR: 'Turkey',
  ID: 'Singapore', MY: 'Singapore', SG: 'Singapore', BN: 'Singapore',
  EG: 'Egyptian', SD: 'Egyptian', LY: 'Egyptian',
  AE: 'Dubai', QA: 'Qatar', KW: 'Kuwait',
  US: 'NorthAmerica', CA: 'NorthAmerica',
  IR: 'Tehran',
};

const HANAFI_COUNTRIES = new Set(['PK', 'IN', 'BD', 'AF', 'TR']);

export function resolveCalcSettings(
  settings: Pick<Settings, 'calcMethod' | 'madhab'>,
  countryCode: string | null
): { method: CalcMethodId; madhab: MadhabId } {
  const cc = countryCode?.toUpperCase() ?? '';
  return {
    method: settings.calcMethod ?? COUNTRY_METHOD[cc] ?? 'MuslimWorldLeague',
    madhab: settings.madhab ?? (HANAFI_COUNTRIES.has(cc) ? 'hanafi' : 'shafi'),
  };
}

export function getPrayerTimes(
  date: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): DailyPrayerTimes {
  const params = CalculationMethod[method]();
  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  const t = new PrayerTimes(new Coordinates(coords.latitude, coords.longitude), date, params);
  return { fajr: t.fajr, sunrise: t.sunrise, dhuhr: t.dhuhr, asr: t.asr, maghrib: t.maghrib, isha: t.isha };
}

export function getNextPrayer(
  now: Date,
  coords: Coords,
  method: CalcMethodId,
  madhab: MadhabId
): { name: PrayerName; time: Date } {
  const today = getPrayerTimes(now, coords, method, madhab);
  for (const name of PRAYER_ORDER) {
    if (today[name].getTime() > now.getTime()) return { name, time: today[name] };
  }
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return { name: 'fajr', time: getPrayerTimes(tomorrow, coords, method, madhab).fajr };
}
```

- [ ] **Step 8: Run tests**

Run: `npx jest lib/__tests__/prayerTimes.test.ts lib/__tests__/hijri.test.ts`
Expected: all PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/hijri.ts lib/prayerTimes.ts lib/__tests__/hijri.test.ts lib/__tests__/prayerTimes.test.ts
git commit -m "feat(core): Umm al-Qura Hijri date and offline prayer times"
```

---

### Task 6: Persisted store and legacy Nafs import (`lib/legacy.ts`, `lib/store.ts`)

**Files:**
- Create: `lib/legacy.ts`, `lib/store.ts`
- Test: `lib/__tests__/legacy.test.ts`, `lib/__tests__/store.test.ts`

**Interfaces:**
- Consumes: everything in `lib/model.ts`; `DateKey`, `addDays`, `toDateKey` from `lib/day.ts`; `MilestoneId` from `lib/milestones.ts`.
- Produces (`lib/legacy.ts`):
  - `LEGACY_NAFS_KEY = 'nafs_app_state'`
  - `convertLegacyNafs(raw: unknown, today: DateKey): PersistedState | null`
- Produces (`lib/store.ts`):
  - `STORE_KEY = 'awdah_state'`
  - `interface AppActions` (below), `type AppStore = PersistedState & AppActions`
  - `createAppStore(): StoreApi<AppStore> & { persist: … }` (zustand vanilla store with persist)
  - `appStore` (singleton), `useAppStore<T>(selector: (s: AppStore) => T): T`
  - `getPersisted(s: AppStore): PersistedState`
  - `importLegacyIfNeeded(store?: typeof appStore, today?: DateKey): Promise<boolean>`

`AppActions`:
```ts
completeOnboarding(profile: Profile, today: DateKey): void;
toggleTask(day: number, taskId: string, today: DateKey): void;
togglePrayer(date: DateKey, prayer: PrayerName): void;
setJournal(day: number, text: string, today: DateKey): void;
setMood(day: number, mood: MoodType | null): void;
incrementTasbih(date: DateKey, dhikrId: string, by?: number): void;
resetTasbih(date: DateKey, dhikrId: string): void;
updateProfile(partial: Partial<Profile>): void;
updateSettings(partial: Partial<Settings>): void;
startNextCycle(today: DateKey): void;
unlockMilestones(ids: MilestoneId[], today: DateKey): void;
replaceAll(data: PersistedState): void;
resetAll(): void; // keeps settings.language and settings.theme
```
Activity rule: a date becomes `active: true` when, on that date, a task is checked, a prayer is checked, a non-blank journal is saved, or tasbih is incremented. Unchecking never clears `active`.

- [ ] **Step 1: Write failing legacy tests**

`lib/__tests__/legacy.test.ts`:
```ts
import { convertLegacyNafs } from '../legacy';

const legacy = {
  isOnboarded: true,
  userProfile: {
    name: 'Aisha', age: 20, gender: 'female', knowledgeLevel: 'beginner',
    prayerConsistency: 'some', improvementAreas: ['prayer', 'quran'], dailyMinutes: 20,
    personalGoal: 'x', challenges: 'y', commitmentLevel: 3,
    createdAt: '2026-09-01T10:00:00.000Z', planStartDate: '2026-09-01T10:00:00.000Z',
  },
  currentDay: 1,
  dayProgress: {
    1: { day: 1, completedTaskIds: ['1_fajr', '1_fatihah'], journalEntry: 'my niyyah', mood: 'grateful', prayersCompleted: ['fajr', 'dhuhr'] },
  },
  totalPoints: 35, streakDays: 1, lastActiveDate: 'Tue Sep 01 2026',
};

describe('convertLegacyNafs', () => {
  it('maps profile, plan days, prayers and activity', () => {
    const s = convertLegacyNafs(legacy, '2026-10-09')!;
    expect(s.profile).toEqual({
      name: 'Aisha', prayerHabit: 'some', knowledgeLevel: 'beginner',
      focusAreas: ['prayer', 'quran'], dailyMinutes: 20,
    });
    expect(s.planStartDate).toBe('2026-09-01');
    expect(s.planDays['1:1']).toEqual({ completedTaskIds: ['1_fajr', '1_fatihah'], journal: 'my niyyah', mood: 'grateful' });
    expect(s.dates['2026-09-01']).toEqual({ active: true, prayers: ['fajr', 'dhuhr'], tasbih: {} });
    expect(s.cycle).toBe(1);
  });
  it('returns null for non-onboarded or garbage input', () => {
    expect(convertLegacyNafs(null, '2026-10-09')).toBeNull();
    expect(convertLegacyNafs('hello', '2026-10-09')).toBeNull();
    expect(convertLegacyNafs({ isOnboarded: false }, '2026-10-09')).toBeNull();
  });
  it('survives missing fields', () => {
    const s = convertLegacyNafs({ isOnboarded: true, dayProgress: { x: {}, 2: { completedTaskIds: 'bad' } } }, '2026-10-09')!;
    expect(s.planStartDate).toBe('2026-10-09');
    expect(s.profile?.name).toBe('');
    expect(s.profile?.dailyMinutes).toBe(30);
    expect(Object.keys(s.planDays)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx jest lib/__tests__/legacy.test.ts`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `lib/legacy.ts`**

```ts
import { addDays, toDateKey, type DateKey } from './day';
import { initialState, planDayKey, type PersistedState, type Profile } from './model';
import type { ImprovementArea, KnowledgeLevel, MoodType, PracticeLevel, PrayerName } from './types';

export const LEGACY_NAFS_KEY = 'nafs_app_state';

const PRACTICE: PracticeLevel[] = ['none', 'some', 'most', 'all'];
const KNOWLEDGE: KnowledgeLevel[] = ['beginner', 'intermediate', 'advanced'];
const AREAS: ImprovementArea[] = ['prayer', 'quran', 'dhikr', 'fasting', 'character', 'family', 'knowledge', 'charity'];
const MOODS: MoodType[] = ['grateful', 'peaceful', 'struggling', 'motivated', 'reflective'];
const PRAYERS: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const oneOf = <T extends string>(v: unknown, allowed: T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function parseStart(v: unknown, today: DateKey): DateKey {
  if (typeof v !== 'string') return today;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? today : toDateKey(d);
}

export function convertLegacyNafs(raw: unknown, today: DateKey): PersistedState | null {
  if (!isObj(raw) || raw.isOnboarded !== true) return null;
  const up = isObj(raw.userProfile) ? raw.userProfile : {};

  const profile: Profile = {
    name: typeof up.name === 'string' ? up.name : '',
    prayerHabit: oneOf(up.prayerConsistency, PRACTICE, 'some'),
    knowledgeLevel: oneOf(up.knowledgeLevel, KNOWLEDGE, 'beginner'),
    focusAreas: strings(up.improvementAreas).filter((a): a is ImprovementArea => AREAS.includes(a as ImprovementArea)),
    dailyMinutes: typeof up.dailyMinutes === 'number' && up.dailyMinutes > 0 ? up.dailyMinutes : 30,
  };

  const state = initialState();
  state.profile = profile;
  state.planStartDate = parseStart(up.planStartDate, today);

  const progress = isObj(raw.dayProgress) ? raw.dayProgress : {};
  for (const [key, value] of Object.entries(progress)) {
    const day = Number(key);
    if (!Number.isInteger(day) || day < 1 || day > 30 || !isObj(value)) continue;
    if (!Array.isArray(value.completedTaskIds)) continue;

    const completedTaskIds = strings(value.completedTaskIds);
    const journal = typeof value.journalEntry === 'string' ? value.journalEntry : undefined;
    const mood = MOODS.includes(value.mood as MoodType) ? (value.mood as MoodType) : undefined;
    state.planDays[planDayKey(1, day)] = {
      completedTaskIds,
      ...(journal !== undefined ? { journal } : {}),
      ...(mood !== undefined ? { mood } : {}),
    };

    const prayers = strings(value.prayersCompleted).filter((p): p is PrayerName => PRAYERS.includes(p as PrayerName));
    const active = completedTaskIds.length > 0 || prayers.length > 0 || (journal ?? '').trim().length > 0;
    if (active || prayers.length > 0) {
      state.dates[addDays(state.planStartDate, day - 1)] = { active, prayers, tasbih: {} };
    }
  }
  return state;
}
```

- [ ] **Step 4: Run legacy tests**

Run: `npx jest lib/__tests__/legacy.test.ts`
Expected: all PASS.

- [ ] **Step 5: Write failing store tests**

`lib/__tests__/store.test.ts`:
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAppStore, getPersisted, importLegacyIfNeeded, STORE_KEY } from '../store';
import { LEGACY_NAFS_KEY } from '../legacy';
import type { Profile } from '../model';

const profile: Profile = { name: 'Yusuf', prayerHabit: 'some', knowledgeLevel: 'beginner', focusAreas: ['prayer'], dailyMinutes: 20 };
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('app store', () => {
  it('completes onboarding with a plan start date', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    const s = store.getState();
    expect(s.profile).toEqual(profile);
    expect(s.planStartDate).toBe('2026-10-09');
    expect(s.cycle).toBe(1);
  });

  it('toggles tasks per cycle/day and marks the date active', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    store.getState().toggleTask(1, '1_fajr', '2026-10-09');
    expect(store.getState().planDays['1:1'].completedTaskIds).toEqual(['1_fajr']);
    expect(store.getState().dates['2026-10-09'].active).toBe(true);
    store.getState().toggleTask(1, '1_fajr', '2026-10-09');
    expect(store.getState().planDays['1:1'].completedTaskIds).toEqual([]);
    expect(store.getState().dates['2026-10-09'].active).toBe(true); // unchecking never clears activity
  });

  it('toggles prayers on a date', () => {
    const store = createAppStore();
    store.getState().togglePrayer('2026-10-09', 'fajr');
    expect(store.getState().dates['2026-10-09']).toEqual({ active: true, prayers: ['fajr'], tasbih: {} });
    store.getState().togglePrayer('2026-10-09', 'fajr');
    expect(store.getState().dates['2026-10-09'].prayers).toEqual([]);
  });

  it('saves journal and mood; blank journal does not mark activity', () => {
    const store = createAppStore();
    store.getState().setJournal(2, '   ', '2026-10-09');
    expect(store.getState().dates['2026-10-09']).toBeUndefined();
    store.getState().setJournal(2, 'Alhamdulillah', '2026-10-09');
    store.getState().setMood(2, 'peaceful');
    expect(store.getState().planDays['1:2']).toEqual({ completedTaskIds: [], journal: 'Alhamdulillah', mood: 'peaceful' });
    store.getState().setMood(2, null);
    expect(store.getState().planDays['1:2'].mood).toBeUndefined();
  });

  it('counts and resets tasbih', () => {
    const store = createAppStore();
    store.getState().incrementTasbih('2026-10-09', 'subhanallah');
    store.getState().incrementTasbih('2026-10-09', 'subhanallah', 32);
    expect(store.getState().dates['2026-10-09'].tasbih.subhanallah).toBe(33);
    store.getState().resetTasbih('2026-10-09', 'subhanallah');
    expect(store.getState().dates['2026-10-09'].tasbih.subhanallah).toBe(0);
  });

  it('starts the next cycle without losing history', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-09-01');
    store.getState().toggleTask(1, '1_fajr', '2026-09-01');
    store.getState().startNextCycle('2026-10-09');
    const s = store.getState();
    expect(s.cycle).toBe(2);
    expect(s.planStartDate).toBe('2026-10-09');
    expect(s.planDays['1:1'].completedTaskIds).toEqual(['1_fajr']);
  });

  it('unlocks milestones once, keeping the first date', () => {
    const store = createAppStore();
    store.getState().unlockMilestones(['first_step'], '2026-10-01');
    store.getState().unlockMilestones(['first_step', 'three_days'], '2026-10-09');
    expect(store.getState().milestones).toEqual({ first_step: '2026-10-01', three_days: '2026-10-09' });
  });

  it('merges settings and keeps language/theme on reset', () => {
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    store.getState().updateSettings({ language: 'ur', theme: 'dark', calcMethod: 'Karachi' });
    store.getState().resetAll();
    const s = store.getState();
    expect(s.profile).toBeNull();
    expect(s.settings.language).toBe('ur');
    expect(s.settings.theme).toBe('dark');
    expect(s.settings.calcMethod).toBeNull();
  });

  it('persists to AsyncStorage and rehydrates', async () => {
    const a = createAppStore();
    a.getState().completeOnboarding(profile, '2026-10-09');
    await flush();
    expect(await AsyncStorage.getItem(STORE_KEY)).toContain('Yusuf');
    const b = createAppStore();
    await b.persist.rehydrate();
    expect(b.getState().profile?.name).toBe('Yusuf');
    expect(getPersisted(b.getState())).not.toHaveProperty('toggleTask');
  });

  it('imports legacy Nafs data once when no profile exists', async () => {
    await AsyncStorage.setItem(LEGACY_NAFS_KEY, JSON.stringify({
      isOnboarded: true,
      userProfile: { name: 'Old', planStartDate: '2026-09-01T00:00:00.000Z' },
      dayProgress: { 1: { completedTaskIds: ['1_fajr'] } },
    }));
    const store = createAppStore();
    await store.persist.rehydrate();
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(true);
    expect(store.getState().profile?.name).toBe('Old');
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(false);
  });

  it('does not import legacy data over an existing profile', async () => {
    await AsyncStorage.setItem(LEGACY_NAFS_KEY, JSON.stringify({ isOnboarded: true, userProfile: { name: 'Old' } }));
    const store = createAppStore();
    store.getState().completeOnboarding(profile, '2026-10-09');
    expect(await importLegacyIfNeeded(store, '2026-10-09')).toBe(false);
    expect(store.getState().profile?.name).toBe('Yusuf');
  });
});
```

- [ ] **Step 6: Run to verify failure**

Run: `npx jest lib/__tests__/store.test.ts`
Expected: FAIL — cannot find module.

- [ ] **Step 7: Implement `lib/store.ts`**

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import { toDateKey, type DateKey } from './day';
import { convertLegacyNafs, LEGACY_NAFS_KEY } from './legacy';
import type { MilestoneId } from './milestones';
import {
  emptyDateLog, initialState, planDayKey,
  type DateLog, type PersistedState, type PlanDayLog, type Profile, type Settings,
} from './model';
import type { MoodType, PrayerName } from './types';

export const STORE_KEY = 'awdah_state';

export interface AppActions {
  completeOnboarding(profile: Profile, today: DateKey): void;
  toggleTask(day: number, taskId: string, today: DateKey): void;
  togglePrayer(date: DateKey, prayer: PrayerName): void;
  setJournal(day: number, text: string, today: DateKey): void;
  setMood(day: number, mood: MoodType | null): void;
  incrementTasbih(date: DateKey, dhikrId: string, by?: number): void;
  resetTasbih(date: DateKey, dhikrId: string): void;
  updateProfile(partial: Partial<Profile>): void;
  updateSettings(partial: Partial<Settings>): void;
  startNextCycle(today: DateKey): void;
  unlockMilestones(ids: MilestoneId[], today: DateKey): void;
  replaceAll(data: PersistedState): void;
  resetAll(): void;
}

export type AppStore = PersistedState & AppActions;

const PERSISTED_KEYS: (keyof PersistedState)[] = [
  'schema', 'profile', 'settings', 'cycle', 'planStartDate', 'planDays', 'dates', 'milestones',
];

export function getPersisted(s: AppStore): PersistedState {
  const out: Record<string, unknown> = {};
  for (const k of PERSISTED_KEYS) out[k] = s[k];
  return out as unknown as PersistedState;
}

function withDate(
  dates: Record<DateKey, DateLog>,
  key: DateKey,
  change: (log: DateLog) => DateLog
): Record<DateKey, DateLog> {
  return { ...dates, [key]: change(dates[key] ?? emptyDateLog()) };
}

const markActive = (log: DateLog): DateLog => ({ ...log, active: true });

export function createAppStore() {
  return createStore<AppStore>()(
    persist(
      (set) => {
        const updateDay = (s: AppStore, day: number, change: (log: PlanDayLog) => PlanDayLog) => {
          const key = planDayKey(s.cycle, day);
          return { ...s.planDays, [key]: change(s.planDays[key] ?? { completedTaskIds: [] }) };
        };

        return {
          ...initialState(),

          completeOnboarding: (profile, today) => set({ profile, planStartDate: today, cycle: 1 }),

          toggleTask: (day, taskId, today) =>
            set((s) => {
              const done = (s.planDays[planDayKey(s.cycle, day)]?.completedTaskIds ?? []).includes(taskId);
              return {
                planDays: updateDay(s, day, (log) => ({
                  ...log,
                  completedTaskIds: done
                    ? log.completedTaskIds.filter((id) => id !== taskId)
                    : [...log.completedTaskIds, taskId],
                })),
                dates: done ? s.dates : withDate(s.dates, today, markActive),
              };
            }),

          togglePrayer: (date, prayer) =>
            set((s) => ({
              dates: withDate(s.dates, date, (log) =>
                log.prayers.includes(prayer)
                  ? { ...log, prayers: log.prayers.filter((p) => p !== prayer) }
                  : { ...log, active: true, prayers: [...log.prayers, prayer] }
              ),
            })),

          setJournal: (day, text, today) =>
            set((s) => ({
              planDays: updateDay(s, day, (log) => ({ ...log, journal: text })),
              dates: text.trim().length > 0 ? withDate(s.dates, today, markActive) : s.dates,
            })),

          setMood: (day, mood) =>
            set((s) => ({
              planDays: updateDay(s, day, (log) => {
                const next: PlanDayLog = { ...log };
                if (mood) next.mood = mood;
                else delete next.mood;
                return next;
              }),
            })),

          incrementTasbih: (date, dhikrId, by = 1) =>
            set((s) => ({
              dates: withDate(s.dates, date, (log) => ({
                ...log,
                active: true,
                tasbih: { ...log.tasbih, [dhikrId]: (log.tasbih[dhikrId] ?? 0) + by },
              })),
            })),

          resetTasbih: (date, dhikrId) =>
            set((s) => ({
              dates: withDate(s.dates, date, (log) => ({ ...log, tasbih: { ...log.tasbih, [dhikrId]: 0 } })),
            })),

          updateProfile: (partial) =>
            set((s) => (s.profile ? { profile: { ...s.profile, ...partial } } : {})),

          updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),

          startNextCycle: (today) => set((s) => ({ cycle: s.cycle + 1, planStartDate: today })),

          unlockMilestones: (ids, today) =>
            set((s) => {
              const milestones = { ...s.milestones };
              for (const id of ids) if (!milestones[id]) milestones[id] = today;
              return { milestones };
            }),

          replaceAll: (data) => set({ ...data }),

          resetAll: () =>
            set((s) => {
              const fresh = initialState();
              fresh.settings.language = s.settings.language;
              fresh.settings.theme = s.settings.theme;
              return fresh;
            }),
        };
      },
      {
        name: STORE_KEY,
        version: 1,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (s) => getPersisted(s),
      }
    )
  );
}

export const appStore = createAppStore();

export function useAppStore<T>(selector: (s: AppStore) => T): T {
  return useStore(appStore, selector);
}

export async function importLegacyIfNeeded(
  store: ReturnType<typeof createAppStore> = appStore,
  today: DateKey = toDateKey(new Date())
): Promise<boolean> {
  if (store.getState().profile) return false;
  try {
    const raw = await AsyncStorage.getItem(LEGACY_NAFS_KEY);
    if (!raw) return false;
    const converted = convertLegacyNafs(JSON.parse(raw), today);
    if (!converted) return false;
    store.getState().replaceAll(converted);
    await AsyncStorage.removeItem(LEGACY_NAFS_KEY);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 8: Run tests**

Run: `npx jest lib/__tests__/store.test.ts lib/__tests__/legacy.test.ts`
Expected: all PASS. If the rehydrate test fails because the `persist` property is missing from the inferred type, keep the code and confirm `store.persist.rehydrate` exists at runtime (zustand 5 vanilla stores expose it).

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: no new errors in `lib/`.

- [ ] **Step 10: Commit**

```bash
git add lib/legacy.ts lib/store.ts lib/__tests__/legacy.test.ts lib/__tests__/store.test.ts
git commit -m "feat(core): persisted Zustand store with legacy Nafs import"
```

---

### Task 7: Backup format (`lib/backup.ts`)

**Files:**
- Create: `lib/backup.ts`
- Test: `lib/__tests__/backup.test.ts`

**Interfaces:**
- Consumes: `PersistedState`, `initialState` from `lib/model.ts`; `convertLegacyNafs` from `lib/legacy.ts`; `toDateKey` from `lib/day.ts`.
- Produces:
  - `serializeBackup(state: PersistedState, now: Date): string`
  - `type BackupError = 'invalid_json' | 'not_awdah' | 'unsupported_version' | 'invalid_shape'`
  - `parseBackup(json: string, today: DateKey): { ok: true; data: PersistedState } | { ok: false; error: BackupError }`

File format: `{ "app": "awdah", "schema": 1, "exportedAt": ISO string, "data": PersistedState }`. Old Nafs exports (`{ state, exportedAt, version: 1 }`) are accepted via `convertLegacyNafs`.

- [ ] **Step 1: Write failing tests**

`lib/__tests__/backup.test.ts`:
```ts
import { parseBackup, serializeBackup } from '../backup';
import { initialState } from '../model';

const sample = () => {
  const s = initialState();
  s.profile = { name: 'Maryam', prayerHabit: 'most', knowledgeLevel: 'intermediate', focusAreas: ['dhikr'], dailyMinutes: 30 };
  s.planStartDate = '2026-10-01';
  s.planDays['1:1'] = { completedTaskIds: ['1_fajr'], journal: 'hi' };
  s.dates['2026-10-01'] = { active: true, prayers: ['fajr'], tasbih: { subhanallah: 33 } };
  return s;
};

describe('backup', () => {
  it('round-trips', () => {
    const json = serializeBackup(sample(), new Date('2026-10-09T10:00:00Z'));
    expect(JSON.parse(json)).toMatchObject({ app: 'awdah', schema: 1, exportedAt: '2026-10-09T10:00:00.000Z' });
    expect(parseBackup(json, '2026-10-09')).toEqual({ ok: true, data: sample() });
  });
  it('rejects invalid json', () => {
    expect(parseBackup('{nope', '2026-10-09')).toEqual({ ok: false, error: 'invalid_json' });
  });
  it('rejects other apps', () => {
    expect(parseBackup(JSON.stringify({ hello: 1 }), '2026-10-09')).toEqual({ ok: false, error: 'not_awdah' });
  });
  it('rejects newer schema versions', () => {
    expect(parseBackup(JSON.stringify({ app: 'awdah', schema: 2, data: {} }), '2026-10-09')).toEqual({ ok: false, error: 'unsupported_version' });
  });
  it('rejects malformed data', () => {
    const bad = { app: 'awdah', schema: 1, data: { ...sample(), dates: 'oops' } };
    expect(parseBackup(JSON.stringify(bad), '2026-10-09')).toEqual({ ok: false, error: 'invalid_shape' });
    const badCycle = { app: 'awdah', schema: 1, data: { ...sample(), cycle: 0 } };
    expect(parseBackup(JSON.stringify(badCycle), '2026-10-09')).toEqual({ ok: false, error: 'invalid_shape' });
  });
  it('accepts old Nafs exports', () => {
    const old = { state: { isOnboarded: true, userProfile: { name: 'Old' }, dayProgress: {} }, exportedAt: 'x', version: 1 };
    const res = parseBackup(JSON.stringify(old), '2026-10-09');
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.profile?.name).toBe('Old');
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx jest lib/__tests__/backup.test.ts`
Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement `lib/backup.ts`**

```ts
import type { DateKey } from './day';
import { convertLegacyNafs } from './legacy';
import type { PersistedState } from './model';

export type BackupError = 'invalid_json' | 'not_awdah' | 'unsupported_version' | 'invalid_shape';
export type BackupResult = { ok: true; data: PersistedState } | { ok: false; error: BackupError };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function serializeBackup(state: PersistedState, now: Date): string {
  return JSON.stringify({ app: 'awdah', schema: 1, exportedAt: now.toISOString(), data: state }, null, 2);
}

function isValidState(d: unknown): d is PersistedState {
  if (!isObj(d)) return false;
  if (d.schema !== 1) return false;
  if (!(d.profile === null || isObj(d.profile))) return false;
  if (!isObj(d.settings)) return false;
  if (typeof d.cycle !== 'number' || !Number.isInteger(d.cycle) || d.cycle < 1) return false;
  if (!(d.planStartDate === null || (typeof d.planStartDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.planStartDate)))) return false;
  if (!isObj(d.planDays) || !Object.values(d.planDays).every((p) => isObj(p) && Array.isArray(p.completedTaskIds))) return false;
  if (!isObj(d.dates) || !Object.values(d.dates).every((x) => isObj(x) && Array.isArray(x.prayers) && isObj(x.tasbih))) return false;
  if (!isObj(d.milestones)) return false;
  return true;
}

export function parseBackup(json: string, today: DateKey): BackupResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }
  if (!isObj(parsed)) return { ok: false, error: 'not_awdah' };

  if (parsed.app !== 'awdah') {
    if ('state' in parsed) {
      const legacy = convertLegacyNafs(parsed.state, today);
      return legacy ? { ok: true, data: legacy } : { ok: false, error: 'invalid_shape' };
    }
    return { ok: false, error: 'not_awdah' };
  }
  if (parsed.schema !== 1) return { ok: false, error: 'unsupported_version' };
  if (!isValidState(parsed.data)) return { ok: false, error: 'invalid_shape' };
  return { ok: true, data: parsed.data };
}
```

- [ ] **Step 4: Run tests**

Run: `npx jest lib/__tests__/backup.test.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/backup.ts lib/__tests__/backup.test.ts
git commit -m "feat(core): validated backup format with Nafs import"
```

---

### Task 8: i18n scaffold (`lib/i18n.ts`, `locales/*.json`)

**Files:**
- Create: `lib/i18n.ts`, `locales/en.json`, `locales/ar.json`, `locales/ur.json`, `locales/id.json`, `locales/tr.json`
- Test: `lib/__tests__/i18n.test.ts`

**Interfaces:**
- Consumes: `Lang` from `lib/model.ts`.
- Produces:
  - `SUPPORTED_LANGS: readonly Lang[]` (`['en', 'ar', 'ur', 'id', 'tr']`)
  - `isRTL(lang: Lang): boolean`
  - `resolveLanguage(pref: Lang | null, deviceLanguageCodes: (string | null)[]): Lang`
  - `initI18n(lang: Lang): Promise<typeof i18n>` (default export of `i18next`)
  - Locale files: identical key sets. Plan 6 fills real translations; until then non-English files contain the English strings.

- [ ] **Step 1: Create `locales/en.json`**

```json
{
  "app": {
    "name": "Awdah",
    "tagline": "Your gentle path back to the deen"
  },
  "common": {
    "continue": "Continue",
    "back": "Back",
    "cancel": "Cancel",
    "save": "Save",
    "done": "Done",
    "retry": "Try again"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "storage": "We couldn't save that change on your device."
  }
}
```

Copy the same file content to `locales/ar.json`, `locales/ur.json`, `locales/id.json`, `locales/tr.json`.

- [ ] **Step 2: Write failing tests**

`lib/__tests__/i18n.test.ts`:
```ts
import { initI18n, isRTL, resolveLanguage, SUPPORTED_LANGS } from '../i18n';
import en from '../../locales/en.json';
import ar from '../../locales/ar.json';
import ur from '../../locales/ur.json';
import id from '../../locales/id.json';
import tr from '../../locales/tr.json';

function keys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? keys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]
  ).sort();
}

describe('i18n', () => {
  it('supports exactly five languages', () => {
    expect(SUPPORTED_LANGS).toEqual(['en', 'ar', 'ur', 'id', 'tr']);
  });
  it('marks Arabic and Urdu as RTL', () => {
    expect(SUPPORTED_LANGS.filter(isRTL)).toEqual(['ar', 'ur']);
  });
  it('prefers the saved choice, then the device, then English', () => {
    expect(resolveLanguage('tr', ['ar'])).toBe('tr');
    expect(resolveLanguage(null, ['fr', 'ur'])).toBe('ur');
    expect(resolveLanguage(null, ['ID'])).toBe('id');
    expect(resolveLanguage(null, ['fr', null])).toBe('en');
    expect(resolveLanguage(null, [])).toBe('en');
  });
  it('has identical keys in every locale', () => {
    const base = keys(en);
    for (const locale of [ar, ur, id, tr]) expect(keys(locale)).toEqual(base);
  });
  it('initializes and switches language', async () => {
    const i18n = await initI18n('en');
    expect(i18n.t('app.name')).toBe('Awdah');
    await initI18n('ar');
    expect(i18n.language).toBe('ar');
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npx jest lib/__tests__/i18n.test.ts`
Expected: FAIL — cannot find module `../i18n`.

- [ ] **Step 4: Implement `lib/i18n.ts`**

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import id from '../locales/id.json';
import tr from '../locales/tr.json';
import ur from '../locales/ur.json';
import type { Lang } from './model';

export const SUPPORTED_LANGS: readonly Lang[] = ['en', 'ar', 'ur', 'id', 'tr'];
const RTL_LANGS: readonly Lang[] = ['ar', 'ur'];

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
  ur: { translation: ur },
  id: { translation: id },
  tr: { translation: tr },
} as const;

export function isRTL(lang: Lang): boolean {
  return RTL_LANGS.includes(lang);
}

export function resolveLanguage(pref: Lang | null, deviceLanguageCodes: (string | null)[]): Lang {
  if (pref) return pref;
  for (const code of deviceLanguageCodes) {
    const c = code?.toLowerCase();
    if (c && (SUPPORTED_LANGS as readonly string[]).includes(c)) return c as Lang;
  }
  return 'en';
}

export async function initI18n(lang: Lang) {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  } else if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }
  return i18n;
}

export default i18n;
```

- [ ] **Step 5: Run tests**

Run: `npx jest lib/__tests__/i18n.test.ts`
Expected: all PASS.

- [ ] **Step 6: Full verification**

Run: `npm test`
Expected: all suites PASS (sanity, day, plan, milestones, hijri, prayerTimes, legacy, store, backup, i18n).

Run: `npm run typecheck`
Expected: no errors in `lib/` or `locales/`; total not above the Task 1 baseline.

Run: `npm run lint`
Expected: no errors in new files.

- [ ] **Step 7: Commit**

```bash
git add lib/i18n.ts locales lib/__tests__/i18n.test.ts
git commit -m "feat(i18n): five-language scaffold with RTL detection"
```

---

## What comes next (separate plans, written when their phase starts)

- **Plan 2 — Content:** verify every narration (Sahih/Hasan, collection + number, Arabic), replace the flagged items, add `titleBeginner`/`titleAdvanced`, Learn Salah content, milestone hadith, `docs/content-review-checklist.md`.
- **Plan 3 — Visual design:** "Fajr" mockups via superdesign/frontend-design, theme tokens, fonts, UI kit.
- **Plan 4 — Screens:** onboarding, five tabs, modals on the new store; delete `lib/storage.ts`, `lib/planGenerator.ts`, `lib/achievements.ts`, points.
- **Plan 5 — Platform:** location + prayer times UI, notifications, file backup, RTL switching.
- **Plan 6 — Localization:** string extraction and translations for ar/ur/id/tr.
- **Plan 7 — ASO + QA:** store listings in five languages, screenshot captions, final review.
