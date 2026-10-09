# Awdah Plan 6 — Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Awdah fully in English, Arabic, Urdu, Indonesian, and Turkish — UI strings and all non-Arabic content — with Arabic religious text always shown in the original and translated meanings flagged for human review.

**Architecture:** UI strings live in `locales/{lang}.json` (i18next). Content strings are extracted by `scripts/extract-content-strings.js` into `content/i18n/en.json` with stable keys; translators fill `content/i18n/{ar,ur,id,tr}.json`; `content/i18n/index.ts` overlays translations onto content at runtime (`localizeDay`, `localizeDua`, …) with English fallback. A parity test guarantees every language covers every key.

**Tech Stack:** i18next, TypeScript, Jest, Node scripts.

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md` (§5, §6)

## Global Constraints

- Arabic religious text (Quran, hadith, dhikr, dua) is never translated or altered; only `meaning`, titles, and app copy are translated.
- In Arabic UI, `meaning` of a hadith/ayah/dhikr is not shown (the original is already Arabic); app copy is in Arabic.
- Terminology per language:
  - ur: نماز (salah), وضو, ذکر, دعا, قرآن, حدیث; respectful, simple Urdu; Nastaliq-friendly punctuation (۔ ، ؟).
  - id: sholat (the spelling Indonesian users search and read most), wudhu, dzikir, doa, Al-Qur'an, hadis; "hijrah" for the journey of coming back; friendly informal "kamu".
  - tr: namaz, abdest, zikir, dua, Kur'an, hadis; warm informal "sen".
  - ar: Modern Standard Arabic, warm and simple; Islamic terms in their usual Arabic forms.
- Tone in all languages: gentle, encouraging, never shaming; no gamification words.
- Every translated religious meaning is marked unreviewed in `docs/translation-review-checklist.md` — the app never claims scholarly review.
- Keep `{{placeholders}}` exactly as in English.

## Review Focus

1. A placeholder dropped or renamed in a translation → runtime shows raw `{{name}}`. Test checks placeholder sets match English. (Task 1)
2. Missing content key in one language → English shows mid-sentence in that language. Parity test. (Task 2)
3. Arabic religious text altered by a translator → test compares every `arabic` field between source content and localized content (must be identical). (Task 2)
4. Urdu text clipped (Nastaliq) on Today/Journey → screenshots in Task 5.
5. Pluralization: Arabic/Turkish/Indonesian/Urdu plural forms for counts (days, prayers) → use i18next `_one/_other` (+ Arabic `_zero/_two/_few/_many`) keys. (Task 1)

---

### Task 1: UI string translations (+ placeholder test)

**Files:** Modify `locales/{ar,ur,id,tr}.json`; extend `lib/__tests__/i18n.test.ts`

- [ ] **Step 1: Test** — add: for every key, the set of `{{…}}` placeholders in each locale equals English's; and no locale value (except brand "Awdah"/numbers) equals the English value for more than 5% of keys (catches untranslated files).
- [ ] **Step 2:** Translate `locales/ar.json` and `locales/ur.json` (one implementer, most capable model) and `locales/id.json`, `locales/tr.json` (second implementer). Count-based keys use i18next plural suffixes (`_one`, `_other`; Arabic also `_zero`, `_two`, `_few`, `_many`); add the English `_one/_other` variants first in `en.json` and run `node scripts/sync-locales.js`.
- [ ] **Step 3:** `npm test`; commit `feat(i18n): Arabic, Urdu, Indonesian, Turkish UI strings`.

---

### Task 2: Content localization layer

**Files:**
- Create: `scripts/extract-content-strings.js`, `content/i18n/en.json` (generated), `content/i18n/index.ts`, `lib/__tests__/content-i18n.test.ts`
- Modify: screens that render content (`app/(tabs)/*.tsx`, `app/(modals)/day/[n].tsx`, `app/(modals)/duas.tsx`, `app/(modals)/milestone/[id].tsx`) to use the localized accessors.

**Interfaces:**
```ts
export function localizeDay(day: DayContent, lang: Lang): DayContent;
export function localizeDuaCategories(cats: DuaCategory[], lang: Lang): DuaCategory[];
export function localizeLearn(lang: Lang): typeof import('../learn'); // returns localized copies of all learn exports
export function localizeMilestone(id: MilestoneId, lang: Lang): { title: string; text: SourcedText };
export function localizedWelcomeBack(lang: Lang): SourcedText;
export function showMeaning(lang: Lang): boolean; // false for 'ar'
```
Key scheme (stable): `day.{n}.theme|intro|reflection|quran.note|prayer.tip|sunnah.title|sunnah.description|character.trait|character.description|character.action|hadith.meaning|prayer.dua.meaning`, `day.{n}.task.{taskId}.title|titleBeginner|titleAdvanced`, `day.{n}.dhikr.{dhikrId}.meaning`, `week.{n}.title`, `dua.{id}.title|occasion|meaning`, `duaCat.{id}.title`, `learn.{list}.{id}.title|body|recite.meaning`, `learn.pillar.{id}.name|meaning`, `milestone.{id}.title|meaning`, `welcomeBack.meaning`.
- [ ] **Step 1:** Write the extractor (Node, reads compiled content via `ts-node`-free approach: use `npx tsx` (add as devDependency) to import `content/*.ts`) → writes sorted `content/i18n/en.json`.
- [ ] **Step 2: Tests:** (a) every key in each `content/i18n/{lang}.json` exists in `en.json` and coverage is 100%; (b) `localizeDay(DAYS[i], lang)` keeps every `arabic` field byte-identical to the source; (c) placeholders none (content has none) ; (d) fallback: an unknown lang key returns English.
- [ ] **Step 3:** Implement `content/i18n/index.ts` (imports the 5 JSON files; overlay by key).
- [ ] **Step 4:** Wire screens: content shown via the localize functions using `useLang()`; in Arabic UI hide `meaning` lines for Arabic sources (`showMeaning`).
- [ ] **Step 5:** Commit `feat(i18n): content localization layer`.

---

### Task 3: Content translations — Arabic and Urdu

**Files:** Create `content/i18n/ar.json`, `content/i18n/ur.json`
- [ ] Translate every key of `content/i18n/en.json` per the terminology rules. For religious `meaning` keys in Urdu: render the meaning faithfully from the Arabic (not from the English paraphrase), concise. Arabic file: app copy in Arabic; for `*.meaning` keys of Arabic-sourced texts use an empty string (they are hidden in Arabic UI) — the coverage test treats empty strings as present.
- [ ] `npx jest lib/__tests__/content-i18n.test.ts`; commit `feat(i18n): Arabic and Urdu content`.

### Task 4: Content translations — Indonesian and Turkish

**Files:** Create `content/i18n/id.json`, `content/i18n/tr.json`
- [ ] Same rules. Prefer established renderings: Indonesian meanings close to the Kemenag style; Turkish close to the Diyanet style — but written fresh, not copied.
- [ ] Test; commit `feat(i18n): Indonesian and Turkish content`.

---

### Task 5: Translation review checklist and RTL/Nastaliq QA

- [ ] Generate `docs/translation-review-checklist.md`: per language, every religious `meaning` key with the Arabic, the English, and the translation side by side; header explaining how a native-speaking reviewer marks `[x]` / `[!]`.
- [ ] Web QA (Chrome DevTools MCP): switch to Urdu and Arabic, screenshot Today, Journey, Worship, Learn, Me, onboarding step 1 → `docs/screenshots/plan6/`. Fix clipped Nastaliq lines, mirrored icons, overflow. Commit `docs: translation review checklist; fix RTL QA issues`.
