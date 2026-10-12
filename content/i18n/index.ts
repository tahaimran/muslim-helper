import type { Lang } from '../../lib/model';
import type { MilestoneId } from '../../lib/milestones';
import type { DayContent, Dhikr, SourcedText, WeekInfo } from '../types';
import type { DuaCategory } from '../duas';
import * as learnEn from '../learn';
import { MILESTONE_CONTENT, WELCOME_BACK } from '../milestones';
import en from './en.json';
import ar from './ar.json';
import ur from './ur.json';
import id from './id.json';
import tr from './tr.json';

// Overlay translations keyed by the stable scheme produced by scripts/extract-content-strings.js.
// English (en.json) is the source of truth; a missing key in another language falls back to the
// English text already present on the source object. Arabic, transliteration and source refs are
// never overlaid.

type Table = Record<string, string>;
const tables: Record<Lang, Table> = { en, ar, ur, id, tr } as Record<Lang, Table>;
export const CONTENT_TABLES: Readonly<Record<Lang, Readonly<Table>>> = tables;

let dayCache = new WeakMap<DayContent, Map<Lang, DayContent>>();
let duaCache = new WeakMap<DuaCategory[], Map<Lang, DuaCategory[]>>();
let learnCache = new Map<Lang, LearnModule>();
function clearCaches(): void {
  dayCache = new WeakMap();
  duaCache = new WeakMap();
  learnCache = new Map();
}

/** Test-only seam: temporarily replaces one language table (e.g. with a tracking Proxy). */
export function __withTableForTest<T>(lang: Lang, table: Table, fn: () => T): T {
  const prev = tables[lang];
  tables[lang] = table;
  clearCaches();
  try {
    return fn();
  } finally {
    tables[lang] = prev;
    clearCaches();
  }
}

function pick(lang: Lang, key: string, fallback: string): string {
  if (lang === 'en') return fallback;
  const v = tables[lang]?.[key];
  return typeof v === 'string' && v !== '' ? v : fallback;
}

function cached<K extends object, V>(
  cache: WeakMap<K, Map<Lang, V>>,
  k: K,
  lang: Lang,
  make: () => V,
): V {
  let m = cache.get(k);
  if (!m) cache.set(k, (m = new Map()));
  let v = m.get(lang);
  if (v === undefined) m.set(lang, (v = make()));
  return v;
}
function pickOpt(lang: Lang, key: string, fallback: string | undefined): string | undefined {
  return fallback === undefined ? undefined : pick(lang, key, fallback);
}

/** Arabic-UI users read the Arabic source directly; the "meaning" line is hidden for them. */
export function showMeaning(lang: Lang): boolean {
  return lang !== 'ar';
}

/** Arabic-script readers (ar, ur) see the Arabic itself rather than a Latin transliteration. */
export function showTransliteration(lang: Lang): boolean {
  return lang !== 'ar' && lang !== 'ur';
}

function dhikrs(list: Dhikr[], prefix: string, lang: Lang): Dhikr[] {
  return list.map((z) => ({ ...z, meaning: pick(lang, `${prefix}.${z.id}.meaning`, z.meaning) }));
}

export function localizeDay(day: DayContent, lang: Lang): DayContent {
  if (lang === 'en') return day;
  return cached(dayCache, day, lang, () => buildDay(day, lang));
}

function buildDay(day: DayContent, lang: Lang): DayContent {
  if (lang === 'en') return day;
  const p = `day.${day.day}`;
  const dua = day.prayerFocus.dua;
  return {
    ...day,
    theme: pick(lang, `${p}.theme`, day.theme),
    intro: pick(lang, `${p}.intro`, day.intro),
    reflection: pick(lang, `${p}.reflection`, day.reflection),
    morningDhikr: dhikrs(day.morningDhikr, `${p}.dhikr`, lang),
    eveningDhikr: dhikrs(day.eveningDhikr, `${p}.dhikr`, lang),
    quran: { ...day.quran, note: pick(lang, `${p}.quran.note`, day.quran.note) },
    prayerFocus: {
      ...day.prayerFocus,
      tip: pick(lang, `${p}.prayer.tip`, day.prayerFocus.tip),
      ...(dua ? { dua: { ...dua, meaning: pick(lang, `${p}.prayer.dua.meaning`, dua.meaning) } } : {}),
    },
    sunnah: {
      ...day.sunnah,
      title: pick(lang, `${p}.sunnah.title`, day.sunnah.title),
      description: pick(lang, `${p}.sunnah.description`, day.sunnah.description),
    },
    character: {
      ...day.character,
      trait: pick(lang, `${p}.character.trait`, day.character.trait),
      description: pick(lang, `${p}.character.description`, day.character.description),
      action: pick(lang, `${p}.character.action`, day.character.action),
    },
    hadith: { ...day.hadith, meaning: pick(lang, `${p}.hadith.meaning`, day.hadith.meaning) },
    tasks: day.tasks.map((t) => {
      const tp = `${p}.task.${t.id}`;
      const out = { ...t, title: pick(lang, `${tp}.title`, t.title) };
      if (t.titleBeginner !== undefined) out.titleBeginner = pickOpt(lang, `${tp}.titleBeginner`, t.titleBeginner);
      if (t.titleAdvanced !== undefined) out.titleAdvanced = pickOpt(lang, `${tp}.titleAdvanced`, t.titleAdvanced);
      return out;
    }),
  };
}

export function localizeWeek(week: WeekInfo, lang: Lang): WeekInfo {
  if (lang === 'en') return week;
  return { ...week, title: pick(lang, `week.${week.week}.title`, week.title) };
}

export function localizeDuaCategories(cats: DuaCategory[], lang: Lang): DuaCategory[] {
  if (lang === 'en') return cats;
  return cached(duaCache, cats, lang, () => buildDuas(cats, lang));
}

function buildDuas(cats: DuaCategory[], lang: Lang): DuaCategory[] {
  if (lang === 'en') return cats;
  return cats.map((c) => ({
    ...c,
    title: pick(lang, `duaCat.${c.id}.title`, c.title),
    duas: c.duas.map((u) => ({
      ...u,
      title: pick(lang, `dua.${u.id}.title`, u.title),
      occasion: pickOpt(lang, `dua.${u.id}.occasion`, u.occasion),
      text: { ...u.text, meaning: pick(lang, `dua.${u.id}.meaning`, u.text.meaning) },
    })),
  }));
}

type LearnModule = typeof learnEn;

export function localizeLearn(lang: Lang): LearnModule {
  if (lang === 'en') return learnEn;
  let v = learnCache.get(lang);
  if (!v) learnCache.set(lang, (v = buildLearn(lang)));
  return v;
}

function buildLearn(lang: Lang): LearnModule {
  if (lang === 'en') return learnEn;
  const steps = (name: string, list: LearnModule['WUDU_STEPS']) =>
    list.map((s) => ({
      ...s,
      title: pick(lang, `learn.${name}.${s.id}.title`, s.title),
      body: pick(lang, `learn.${name}.${s.id}.body`, s.body),
      ...(s.recite
        ? { recite: { ...s.recite, meaning: pick(lang, `learn.${name}.${s.id}.recite.meaning`, s.recite.meaning) } }
        : {}),
    }));
  const pillars = (list: LearnModule['PILLARS_OF_ISLAM']) =>
    list.map((p) => ({
      ...p,
      name: pick(lang, `learn.pillar.${p.id}.name`, p.name),
      meaning: pick(lang, `learn.pillar.${p.id}.meaning`, p.meaning),
    }));
  return {
    ...learnEn,
    WUDU_STEPS: steps('wudu_steps', learnEn.WUDU_STEPS),
    SALAH_STEPS: steps('salah_steps', learnEn.SALAH_STEPS),
    DUA_AFTER_WUDU: {
      ...learnEn.DUA_AFTER_WUDU,
      meaning: pick(lang, 'learn.dua_after_wudu.meaning', learnEn.DUA_AFTER_WUDU.meaning),
    },
    SALAH_NOTES: learnEn.SALAH_NOTES.map((n) => ({
      ...n,
      title: pick(lang, `learn.salah_notes.${n.id}.title`, n.title),
      body: pick(lang, `learn.salah_notes.${n.id}.body`, n.body),
    })),
    PILLARS_OF_ISLAM: pillars(learnEn.PILLARS_OF_ISLAM),
    PILLARS_OF_IMAN: pillars(learnEn.PILLARS_OF_IMAN),
    MORNING_ADHKAR: dhikrs(learnEn.MORNING_ADHKAR, 'learn.morning_adhkar', lang),
    EVENING_ADHKAR: dhikrs(learnEn.EVENING_ADHKAR, 'learn.evening_adhkar', lang),
  };
}

export function localizeMilestone(mid: MilestoneId, lang: Lang): { title: string; text: SourcedText } {
  const m = MILESTONE_CONTENT[mid];
  if (lang === 'en') return m;
  return {
    title: pick(lang, `milestone.${mid}.title`, m.title),
    text: { ...m.text, meaning: pick(lang, `milestone.${mid}.meaning`, m.text.meaning) },
  };
}

export function localizedWelcomeBack(lang: Lang): SourcedText {
  if (lang === 'en') return WELCOME_BACK;
  return { ...WELCOME_BACK, meaning: pick(lang, 'welcomeBack.meaning', WELCOME_BACK.meaning) };
}
