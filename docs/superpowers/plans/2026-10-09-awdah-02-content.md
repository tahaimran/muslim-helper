# Awdah Plan 2 — Verified Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unverified Islamic content with a new, typed `content/` module where every hadith/ayah carries Arabic, meaning, and a precise source with grade, plus Learn Salah, milestone, and welcome-back content and a human review checklist.

**Architecture:** Content is static typed data in `content/*.ts`, independent of React. An integrity test (`lib/__tests__/content.test.ts`) enforces the rules mechanically (sources present, grades allowed, Arabic present, banned fabricated texts absent, unique IDs). Old `constants/` files stay until Plan 4 deletes them with the old screens. The source of truth for every religious text is the verification research copied into `docs/content-sources/`.

**Tech Stack:** TypeScript, Jest.

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md` (§5 Content integrity)

## Global Constraints

- Only Sahih or Hasan hadith, Quran ayat, or clearly labeled athar (Companion sayings). Never attribute weak/fabricated text to the Prophet ﷺ.
- Every `Source` has `kind`, `ref` (collection + number, or `Quran s:a`), and `grade`. Muslim numbers use Abd al-Baqi numbering; Ahmad uses the Risalah numbering (as in `docs/content-sources/`).
- Arabic text is always present for hadith/ayah/dhikr/dua; English meaning always present.
- English UI copy: plain, warm, sentence case; no points, no levels, no guilt language.
- No React imports in `content/`.
- `reviewed` status of translations belongs to Plan 6; this plan writes English + Arabic only.
- **Quran Arabic is never hand-typed.** Every Quran ayah's Arabic (milestones, Al-Fatihah, Al-Ikhlas, ayat al-kursi, any dhikr that is an ayah) must be fetched from the canonical Uthmani text: `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf/{surah}/{ayah}.json` (field `text`) — fetch with curl/WebFetch while writing the file.
- Items the research marks as non-prophetic phrasing get `source: null` (shown as personal dhikr/du'a without a virtue claim). Hasbiyallah is sourced as `Quran 9:129` only; never present the ×7 count or its reward as a prophetic promise (count 1, or 7 only with source null).
- Do not delete `constants/islamicContent.ts` or `constants/duas.ts` (old screens still import them until Plan 4).

## Review Focus

1. A banned fabricated/weak text is reintroduced by copy-paste from the old file → integrity test fails. (Task 1 test)
2. A day missing a prayer task (a beginner with little time would then get no salah step) → integrity test fails. (Task 1 test)
3. Duplicate task IDs across days collide in stored progress → integrity test fails. (Task 1 test)
4. Dhikr counts that contradict the source (33/33/34 vs 33/33/33 in the same day) → standardized and tested. (Task 1 test)
5. Arabic field accidentally filled with transliteration → test asserts Arabic script. (Task 1 test)

---

### Task 1: Content types, integrity tests, milestones, generic personalization

**Files:**
- Create: `content/types.ts`, `content/milestones.ts`, `content/days.ts` (empty array export for now), `lib/__tests__/content.test.ts`
- Create: `docs/content-sources/verification-1.md`, `docs/content-sources/verification-2.md` (copied from the research files named below)
- Modify: `lib/plan.ts` (make `personalizeTasks` generic)

**Interfaces:**
- Produces (`content/types.ts`):
```ts
import type { DayTask, PrayerName } from '../lib/types';

export type SourceKind = 'quran' | 'hadith' | 'athar';
export type Grade = 'sahih' | 'hasan';

export interface Source {
  kind: SourceKind;
  ref: string; // e.g. 'Bukhari 6464; Muslim 782' or 'Quran 94:5-6' or 'Athar of Umar ibn al-Khattab (Ibn Abi Shaybah 35600)'
  grade: Grade | null; // required for 'hadith'; null for 'quran' and 'athar'
}

export interface SourcedText {
  arabic: string;
  meaning: string;
  transliteration?: string;
  source: Source;
}

export interface Dhikr {
  id: string; // stable, e.g. 'subhanallah', 'sayyid_istighfar'
  arabic: string;
  transliteration: string;
  meaning: string;
  count: number;
  source: Source | null; // null = general dhikr with no specific virtue claimed
}

export interface TasbihTarget {
  dhikrId: string;
  target: number;
}

export interface ContentTask {
  id: string; // `${day}_${slug}`, globally unique
  title: string;
  titleBeginner?: string;
  titleAdvanced?: string;
  category: DayTask['category'];
  tasbih?: TasbihTarget[]; // auto-completes when today's tasbih counts reach every target
}

export interface DayContent {
  day: number;
  theme: string;
  themeArabic: string;
  intro: string;
  morningDhikr: Dhikr[];
  eveningDhikr: Dhikr[];
  quran: { surah: string; surahNumber: number; ayahs: string; note: string };
  prayerFocus: { prayer: PrayerName | 'all'; tip: string; dua?: SourcedText };
  sunnah: { title: string; description: string; source: Source | null };
  character: { trait: string; arabic: string; description: string; action: string };
  hadith: SourcedText;
  reflection: string;
  tasks: ContentTask[];
}

export interface WeekInfo {
  week: number;
  title: string;
  titleArabic: string;
  days: [number, number]; // inclusive range
}
```
- Produces (`content/milestones.ts`): `MILESTONE_CONTENT: Record<MilestoneId, { title: string; text: SourcedText }>`, `WELCOME_BACK: SourcedText`
- Produces (`lib/plan.ts`): `personalizeTasks<T extends PersonalizableTask>(tasks: T[], profile: Profile, cycle: number): T[]` with `type PersonalizableTask = Pick<DayTask, 'title' | 'titleBeginner' | 'titleAdvanced' | 'category'>`
- Produces (`content/days.ts`): `export const DAYS: DayContent[]` and `export const WEEKS: WeekInfo[]` (filled by Tasks 2–4)

- [ ] **Step 1: Copy research into the repo**

```bash
mkdir -p docs/content-sources
cp "C:/Users/tahai/AppData/Local/Temp/claude/E--muslim-helper/be3f72a9-d90b-4027-9216-a80b5b2dc7fd/scratchpad/content-verification.md" docs/content-sources/verification-1.md
cp "C:/Users/tahai/AppData/Local/Temp/claude/E--muslim-helper/be3f72a9-d90b-4027-9216-a80b5b2dc7fd/scratchpad/content-verification-2.md" docs/content-sources/verification-2.md
```

- [ ] **Step 2: Create `content/types.ts`** exactly as in Interfaces above.

- [ ] **Step 3: Make `personalizeTasks` generic in `lib/plan.ts`**

Change only the signature and the internal types:
```ts
export type PersonalizableTask = Pick<DayTask, 'title' | 'titleBeginner' | 'titleAdvanced' | 'category'>;

export function personalizeTasks<T extends PersonalizableTask>(tasks: T[], profile: Profile, cycle: number): T[] {
```
(`rank` takes `T`; the body is unchanged.) Run `npx jest lib/__tests__/plan.test.ts` — must still pass.

- [ ] **Step 4: Create `content/milestones.ts`** from `docs/content-sources/verification-1.md` section "Milestones and welcome-back" (all 10 ids + welcome_back, using the Bukhari 6464 text; ref `'Bukhari 6464; Muslim 782'`). Titles (English, warm, short):

| id | title |
|---|---|
| first_step | Your first step |
| first_full_salah_day | All five prayers in one day |
| three_days | Three days of showing up |
| week_one | One week on the path |
| streak_7 | Seven days in a row |
| fajr_7 | Seven Fajr prayers |
| first_reflection | Your first reflection |
| tasbih_1000 | A thousand glorifications |
| halfway | Halfway through your journey |
| journey_complete | Thirty days complete |

Example entry shape:
```ts
first_step: {
  title: 'Your first step',
  text: {
    arabic: 'وَإِنْ تَقَرَّبَ إِلَىَّ بِشِبْرٍ تَقَرَّبْتُ إِلَيْهِ ذِرَاعًا ... وَإِنْ أَتَانِي يَمْشِي أَتَيْتُهُ هَرْوَلَةً',
    meaning: 'Allah says: "If he draws near to Me a hand-span, I draw near to him an arm\'s length… and if he comes to Me walking, I come to him running."',
    source: { kind: 'hadith', ref: 'Bukhari 7405; Muslim 2675', grade: 'sahih' },
  },
},
```
Quran entries use `{ kind: 'quran', ref: 'Quran 29:69', grade: null }`.

- [ ] **Step 5: Create `content/days.ts` scaffold**

```ts
import type { DayContent, WeekInfo } from './types';

export const WEEKS: WeekInfo[] = [];
export const DAYS: DayContent[] = [];
```

- [ ] **Step 6: Write the integrity test `lib/__tests__/content.test.ts`**

```ts
import { DAYS, WEEKS } from '../../content/days';
import { MILESTONE_CONTENT, WELCOME_BACK } from '../../content/milestones';
import { MILESTONE_IDS } from '../milestones';
import type { Dhikr, Source, SourcedText } from '../../content/types';

const ARABIC = /[\u0600-\u06FF]/;

// Texts removed for being fabricated, weak, unsourced or misapplied. Must never return.
const BANNED = [
  /seventy years of worship/i,
  /weapon of the believer/i,
  /does not begin with bismillah/i,
  /lawful (sustenance|earning) is (an )?obligat/i,
  /waqi'?ah.*poverty/i,
  /companions would walk in nature/i,
  /seeking knowledge is (an )?obligat/i,
  /salat al-shukr/i,
];

export function checkSource(s: Source, where: string) {
  expect(s.ref.trim().length).toBeGreaterThan(0);
  if (s.kind === 'hadith') expect(['sahih', 'hasan']).toContain(s.grade);
  else expect(s.grade).toBeNull();
  if (s.kind === 'quran') expect(s.ref).toMatch(/^Quran \d+:\d+(-\d+)?$/);
  if (s.kind === 'hadith') expect(s.ref).toMatch(/\d/); // has a number
  void where;
}

function checkText(t: SourcedText, where: string) {
  expect(ARABIC.test(t.arabic)).toBe(true);
  expect(t.meaning.trim().length).toBeGreaterThan(0);
  checkSource(t.source, where);
}

function checkDhikr(d: Dhikr) {
  expect(ARABIC.test(d.arabic)).toBe(true);
  expect(d.transliteration.trim().length).toBeGreaterThan(0);
  expect(d.meaning.trim().length).toBeGreaterThan(0);
  expect(Number.isInteger(d.count) && d.count >= 1).toBe(true);
  if (d.source) checkSource(d.source, d.id);
}

describe('day content integrity', () => {
  it('has sequential day numbers', () => {
    DAYS.forEach((d, i) => expect(d.day).toBe(i + 1));
  });

  it('every day has a sourced hadith with Arabic', () => {
    DAYS.forEach((d) => checkText(d.hadith, `day ${d.day}`));
  });

  it('every dhikr, dua and sunnah source is valid', () => {
    DAYS.forEach((d) => {
      [...d.morningDhikr, ...d.eveningDhikr].forEach(checkDhikr);
      if (d.prayerFocus.dua) checkText(d.prayerFocus.dua, `day ${d.day} dua`);
      if (d.sunnah.source) checkSource(d.sunnah.source, `day ${d.day} sunnah`);
    });
  });

  it('every day has at least one prayer task and 4-6 tasks', () => {
    DAYS.forEach((d) => {
      expect(d.tasks.some((t) => t.category === 'prayer')).toBe(true);
      expect(d.tasks.length).toBeGreaterThanOrEqual(4);
      expect(d.tasks.length).toBeLessThanOrEqual(6);
    });
  });

  it('task ids are globally unique and prefixed with the day', () => {
    const ids = DAYS.flatMap((d) => d.tasks.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
    DAYS.forEach((d) => d.tasks.forEach((t) => expect(t.id.startsWith(`${d.day}_`)).toBe(true)));
  });

  it('tasbih targets point at dhikr ids that exist that day', () => {
    DAYS.forEach((d) => {
      const ids = new Set([...d.morningDhikr, ...d.eveningDhikr].map((x) => x.id));
      d.tasks.forEach((t) => t.tasbih?.forEach((x) => expect(ids.has(x.dhikrId)).toBe(true)));
    });
  });

  it('contains no banned texts', () => {
    const blob = JSON.stringify(DAYS);
    BANNED.forEach((re) => expect(blob).not.toMatch(re));
  });

  it('uses Fussilat for surah 41', () => {
    DAYS.filter((d) => d.quran.surahNumber === 41).forEach((d) => expect(d.quran.surah).toBe('Fussilat'));
  });

  it('weeks cover the days that exist without gaps', () => {
    if (DAYS.length === 0) return;
    const covered = WEEKS.flatMap((w) => Array.from({ length: w.days[1] - w.days[0] + 1 }, (_, i) => w.days[0] + i));
    expect(covered).toEqual(Array.from({ length: covered.length }, (_, i) => i + 1));
  });
});

describe('milestone content', () => {
  it('covers every milestone id with sourced text', () => {
    MILESTONE_IDS.forEach((id) => {
      expect(MILESTONE_CONTENT[id].title.length).toBeGreaterThan(0);
      checkText(MILESTONE_CONTENT[id].text, id);
    });
    checkText(WELCOME_BACK, 'welcome_back');
  });
});
```

- [ ] **Step 7: Run tests**

Run: `npx jest lib/__tests__/content.test.ts lib/__tests__/plan.test.ts`
Expected: PASS (day tests pass vacuously on the empty array; milestone tests pass).

- [ ] **Step 8: Typecheck and commit**

```bash
npm run typecheck
git add content docs/content-sources lib/plan.ts lib/__tests__/content.test.ts
git commit -m "feat(content): typed content model, integrity tests, milestone texts"
```

---

### Task 2: Days 1–10

**Files:** Modify `content/days.ts`

**Interfaces:** Consumes `DayContent`, `Dhikr`, `ContentTask`, `WeekInfo` from `content/types.ts`.

**How to build each day** (applies to Tasks 2–4):
- Start from the same day in `constants/islamicContent.ts` (`THIRTY_DAY_PLANS`): keep its theme, themeArabic, Quran goal, character goal, reflection question, and task set — rewritten in warm plain English where clumsy.
- Apply every verdict for that day from `docs/content-sources/verification-1.md` (hadith, sunnahPractice, prayerFocus) and `docs/content-sources/verification-2.md` section A (dhikr). KEEP → copy; FIX → use the corrected reference/wording; REPLACE → use the given replacement with all its fields.
- `intro` = the old `themeDescription`, tightened to ≤ 2 sentences. No mention of "30-day transformation" marketing language.
- Tasks: drop `points`. Keep 6 tasks (one must be `category: 'prayer'`). Give `titleBeginner` to the prayer task and to any task that is hard for a newcomer (e.g. "Pray Fajr on time" for a task asking for all sunnah rak'ah); give `titleAdvanced` to the prayer task (e.g. add the sunnah rak'ah and post-prayer adhkar). Dhikr tasks with a count get `tasbih` targets referencing dhikr ids defined in that day's morning/evening lists (e.g. evening tasbih → `[{dhikrId:'subhanallah',target:33},{dhikrId:'alhamdulillah',target:33},{dhikrId:'allahuakbar',target:33}]`).
- Dhikr ids are stable and shared across days for the same words: `subhanallah`, `alhamdulillah`, `allahuakbar`, `tahlil` (lā ilāha illā Allāh wahdahu…), `astaghfirullah`, `subhanallahi_wa_bihamdihi`, `sayyid_istighfar`, `salawat`, `hasbiyallah`, `bismillah_alladhi`, `radhitu`, `ayat_al_kursi` — add new ids in snake_case only when the words differ.
- Tasbih standard: 33/33/33 + tahlil to complete 100 (Muslim 597). Where a day mentions 33/33/34, change it to match.
- Every `Source` follows the Global Constraints. `prayerFocus.prayer` is lowercase `PrayerName` or `'all'`.
- Fill `WEEKS` entries for the weeks this task covers, using `WEEK_TITLES` from the old file, with week 4 = days 22–30.

- [ ] **Step 1:** Write days 1–10 into `DAYS` and only week 1 (`days: [1, 7]`) into `WEEKS` (week 2 is added in Task 3).
- [ ] **Step 2:** Run `npx jest lib/__tests__/content.test.ts` — PASS.
- [ ] **Step 3:** Commit: `git add content/days.ts && git commit -m "feat(content): verified days 1-10"`

---

### Task 3: Days 11–20

**Files:** Modify `content/days.ts`

Same rules as Task 2 ("How to build each day" — re-read it in the Task 2 section of this plan; the brief extraction includes only this task, so the rules are repeated here):
- Start from the same day in `constants/islamicContent.ts`; keep theme, themeArabic, Quran goal, character goal, reflection, tasks (warm plain English).
- Apply every verdict for that day from `docs/content-sources/verification-1.md` and section A of `verification-2.md`. KEEP copy; FIX corrected ref/wording; REPLACE use the replacement.
- `intro` ≤ 2 sentences. Drop `points`. Exactly one or more `prayer` tasks, 6 tasks total. `titleBeginner`/`titleAdvanced` on the prayer task (and other hard tasks). Dhikr tasks get `tasbih` targets referencing that day's dhikr ids.
- Shared dhikr ids: `subhanallah`, `alhamdulillah`, `allahuakbar`, `tahlil`, `astaghfirullah`, `subhanallahi_wa_bihamdihi`, `sayyid_istighfar`, `salawat`, `hasbiyallah`, `bismillah_alladhi`, `radhitu`, `ayat_al_kursi`.
- Tasbih standard 33/33/33 + tahlil (Muslim 597). Day 12 sunnah/hadith and Day 14's "Salat al-Shukr" claim must follow the verification (sujud al-shukr only, Abu Dawud 2774).
- Add week 2 (days 8–14) to `WEEKS` now, and week 3 (days 15–21) once Task 4 adds day 21 — i.e. in this task add only week 2.

- [ ] **Step 1:** Write days 11–20 and week 2.
- [ ] **Step 2:** `npx jest lib/__tests__/content.test.ts` — PASS.
- [ ] **Step 3:** `git add content/days.ts && git commit -m "feat(content): verified days 11-20"`

---

### Task 4: Days 21–30 and completeness

**Files:** Modify `content/days.ts`, `lib/__tests__/content.test.ts`

Rules (same as Tasks 2–3):
- Start from the same day in `constants/islamicContent.ts`; keep theme, themeArabic, Quran goal, character goal, reflection, tasks (warm plain English).
- Apply every verdict for that day from `docs/content-sources/verification-1.md` and section A of `verification-2.md`. Days 21, 22, 23, 24, 27, 28 have REPLACE/FIX items: "most beneficial to people" (disputed — replace per verification), "seeking knowledge is an obligation" (very weak as a whole — replace), "one hour of reflection" (replace), Tirmidhi 2333 vs Bukhari 6416 attribution, ghusl-for-tawbah (replace), Umar's saying → `kind: 'athar'`.
- `intro` ≤ 2 sentences. Drop `points`. 6 tasks with ≥1 `prayer`. `titleBeginner`/`titleAdvanced`. `tasbih` targets with that day's dhikr ids. Surah 41 named `Fussilat`.
- Add weeks 3 (15–21) and 4 (22–30) to `WEEKS`.

- [ ] **Step 1:** Write days 21–30 and weeks 3–4.
- [ ] **Step 2: Add completeness assertions** to `lib/__tests__/content.test.ts` inside `describe('day content integrity')`:
```ts
  it('has exactly 30 days in 4 weeks', () => {
    expect(DAYS).toHaveLength(30);
    expect(WEEKS.map((w) => w.days)).toEqual([[1, 7], [8, 14], [15, 21], [22, 30]]);
  });
```
- [ ] **Step 3:** `npx jest lib/__tests__/content.test.ts` — PASS.
- [ ] **Step 4:** `git add content/days.ts lib/__tests__/content.test.ts && git commit -m "feat(content): verified days 21-30"`

---

### Task 5: Duas library and Learn content

**Files:**
- Create: `content/duas.ts`, `content/learn.ts`
- Modify: `lib/__tests__/content.test.ts`

**Interfaces:**
- Produces (`content/duas.ts`):
```ts
export interface DuaEntry { id: string; title: string; titleArabic: string; occasion?: string; text: SourcedText }
export interface DuaCategory { id: string; title: string; titleArabic: string; duas: DuaEntry[] }
export const DUA_CATEGORIES: DuaCategory[];
```
- Produces (`content/learn.ts`):
```ts
export interface LearnStep { id: string; title: string; body: string; recite?: { arabic: string; transliteration: string; meaning: string; source: Source | null } }
export const WUDU_STEPS: LearnStep[];
export const DUA_AFTER_WUDU: SourcedText;
export const SALAH_STEPS: LearnStep[]; // a 2-rak'ah prayer, start to finish
export const SALAH_NOTES: { id: string; title: string; body: string }[]; // 3rd/4th rak'ah, madhhab differences
export const RAKAH_COUNTS: { prayer: PrayerName; fard: number }[];
export const PILLARS_OF_ISLAM: { id: string; name: string; arabic: string; meaning: string }[];
export const PILLARS_OF_IMAN: { id: string; name: string; arabic: string; meaning: string }[];
export const PILLARS_SOURCES: { islam: Source; iman: Source };
export const MORNING_ADHKAR: Dhikr[];
export const EVENING_ADHKAR: Dhikr[];
```

- [ ] **Step 1:** Write `content/duas.ts` from `constants/duas.ts` applying the "Duas" section verdicts of `verification-1.md` (replace before-eating with "Bismillah" — Abu Dawud 3767 / Tirmidhi 1858 per the verification, after-eating per verification, remove "Before reading Quran" or replace with the verified isti'adhah (Quran 16:98), fix Sayyid al-Istighfar Arabic missing «لَكَ»). Ids in snake_case, unique.
- [ ] **Step 2:** Write `content/learn.ts` from `verification-2.md` sections B1–B4. Keep body text short (≤ 2 sentences per step), beginner-friendly, no fiqh debates beyond one short "Hanafi/Shafi'i differ here" note where the research marks it.
- [ ] **Step 3: Extend the integrity test**
```ts
import { DUA_CATEGORIES } from '../../content/duas';
import {
  DUA_AFTER_WUDU, EVENING_ADHKAR, MORNING_ADHKAR, PILLARS_OF_IMAN, PILLARS_OF_ISLAM,
  PILLARS_SOURCES, RAKAH_COUNTS, SALAH_STEPS, WUDU_STEPS,
} from '../../content/learn';

describe('duas and learn content', () => {
  it('every dua is sourced, Arabic, with unique ids', () => {
    const ids = DUA_CATEGORIES.flatMap((c) => c.duas.map((d) => d.id));
    expect(new Set(ids).size).toBe(ids.length);
    DUA_CATEGORIES.forEach((c) => c.duas.forEach((d) => checkText(d.text, d.id)));
  });
  it('has the learn salah building blocks', () => {
    expect(WUDU_STEPS.length).toBeGreaterThanOrEqual(8);
    expect(SALAH_STEPS.length).toBeGreaterThanOrEqual(10);
    checkText(DUA_AFTER_WUDU, 'dua_after_wudu');
    [...WUDU_STEPS, ...SALAH_STEPS].forEach((s) => {
      if (s.recite) {
        expect(ARABIC.test(s.recite.arabic)).toBe(true);
        if (s.recite.source) checkSource(s.recite.source, s.id);
      }
    });
  });
  it('has correct fard rak'ah counts', () => {
    expect(RAKAH_COUNTS).toEqual([
      { prayer: 'fajr', fard: 2 }, { prayer: 'dhuhr', fard: 4 }, { prayer: 'asr', fard: 4 },
      { prayer: 'maghrib', fard: 3 }, { prayer: 'isha', fard: 4 },
    ]);
  });
  it('has 5 pillars of Islam and 6 of iman, sourced', () => {
    expect(PILLARS_OF_ISLAM).toHaveLength(5);
    expect(PILLARS_OF_IMAN).toHaveLength(6);
    checkSource(PILLARS_SOURCES.islam, 'islam');
    checkSource(PILLARS_SOURCES.iman, 'iman');
  });
  it('has sourced morning and evening adhkar', () => {
    expect(MORNING_ADHKAR.length).toBeGreaterThanOrEqual(5);
    expect(EVENING_ADHKAR.length).toBeGreaterThanOrEqual(5);
    [...MORNING_ADHKAR, ...EVENING_ADHKAR].forEach((d) => {
      checkDhikr(d);
      expect(d.source).not.toBeNull();
    });
  });
  it('duas contain no banned texts', () => {
    const blob = JSON.stringify(DUA_CATEGORIES);
    expect(blob).not.toMatch(/wa ja'?alana minal[- ]muslimin/i);
    expect(blob).not.toMatch(/'ala barakatillah/i);
  });
});
```
(`checkDhikr` and `checkText` are already defined in this file; move them above both `describe` blocks if needed and drop the `export` keyword from `checkSource`.)
- [ ] **Step 4:** `npx jest lib/__tests__/content.test.ts` — PASS; `npm run typecheck`.
- [ ] **Step 5:** `git add content lib/__tests__/content.test.ts && git commit -m "feat(content): verified duas and Learn Salah content"`

---

### Task 6: Human review checklist

**Files:** Create `docs/content-review-checklist.md`

- [ ] **Step 1:** Write a checklist a qualified reviewer (imam / student of knowledge) can work through. Generate it from the content files (a short Node script run once is fine; do not commit the script): one line per religious item — location (e.g. `Day 7 · hadith`), first 60 chars of the meaning, `source.ref`, grade, and the confidence from `docs/content-sources/` (H/M). Put every **M** item and every item listed under "Open doubts" in both verification files at the top under "Please check first". Add a short header: purpose, how to mark items (`[x]` ok / `[!]` problem + note), and that translations (Plan 6) get their own checklist.
- [ ] **Step 2:** Commit: `git add docs/content-review-checklist.md && git commit -m "docs: content review checklist for qualified reviewer"`
