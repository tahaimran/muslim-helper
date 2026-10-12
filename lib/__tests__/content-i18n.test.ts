import { DAYS, WEEKS } from '../../content/days';
import { DUA_CATEGORIES } from '../../content/duas';
import * as learn from '../../content/learn';
import { MILESTONE_CONTENT, WELCOME_BACK } from '../../content/milestones';
import {
  CONTENT_TABLES,
  localizeDay,
  localizeDuaCategories,
  localizeLearn,
  localizeMilestone,
  localizeWeek,
  localizedWelcomeBack,
  showMeaning,
} from '../../content/i18n';
import type { Lang } from '../model';
import type { MilestoneId } from '../milestones';

const LANGS: Lang[] = ['en', 'ar', 'ur', 'id', 'tr'];
const OTHER: Lang[] = ['ar', 'ur', 'id', 'tr'];
const en = CONTENT_TABLES.en;

// Translators (Plan 6 Tasks 3-4) fill the language files. Full coverage is enforced for a language
// once its file is non-empty, or for all languages when I18N_REQUIRE_FULL=1.
const requireFull = (lang: Lang) =>
  process.env.I18N_REQUIRE_FULL === '1' || Object.keys(CONTENT_TABLES[lang]).length > 0;

describe('content i18n tables', () => {
  it('en.json is non-empty and all values are non-empty strings', () => {
    expect(Object.keys(en).length).toBeGreaterThan(800);
    for (const v of Object.values(en)) expect(typeof v === 'string' && v.length > 0).toBe(true);
  });

  it.each(OTHER)('%s has no keys missing from en.json (no orphans)', (lang) => {
    const orphans = Object.keys(CONTENT_TABLES[lang]).filter((k) => !(k in en));
    expect(orphans).toEqual([]);
  });

  it.each(OTHER)('%s has full coverage once filled', (lang) => {
    if (!requireFull(lang)) return;
    const missing = Object.keys(en).filter((k) => !CONTENT_TABLES[lang][k]);
    expect(missing).toEqual([]);
  });
});

describe('localizeDay', () => {
  it.each(LANGS)('keeps every arabic field identical (%s)', (lang) => {
    for (const d of DAYS) {
      const l = localizeDay(d, lang);
      expect(l.themeArabic).toBe(d.themeArabic);
      expect(l.hadith.arabic).toBe(d.hadith.arabic);
      expect(l.hadith.source).toEqual(d.hadith.source);
      expect(l.character.arabic).toBe(d.character.arabic);
      expect(l.prayerFocus.dua?.arabic).toBe(d.prayerFocus.dua?.arabic);
      expect(l.morningDhikr.map((z) => z.arabic)).toEqual(d.morningDhikr.map((z) => z.arabic));
      expect(l.eveningDhikr.map((z) => z.arabic)).toEqual(d.eveningDhikr.map((z) => z.arabic));
      expect(l.tasks.map((t) => t.id)).toEqual(d.tasks.map((t) => t.id));
    }
  });

  it('returns English for en and for languages with no translation (fallback)', () => {
    const d = DAYS[0];
    expect(localizeDay(d, 'en')).toEqual(d);
    for (const lang of OTHER) {
      if (Object.keys(CONTENT_TABLES[lang]).length === 0) expect(localizeDay(d, lang)).toEqual(d);
    }
  });

  it('overlays a translated key and falls back for the rest', () => {
    const orig = CONTENT_TABLES.tr;
    CONTENT_TABLES.tr = { 'day.1.theme': 'Niyet' };
    try {
      const l = localizeDay(DAYS[0], 'tr');
      expect(l.theme).toBe('Niyet');
      expect(l.intro).toBe(DAYS[0].intro);
    } finally {
      CONTENT_TABLES.tr = orig;
    }
  });
});

describe('other localizers', () => {
  it.each(LANGS)('dua categories, learn, milestones keep arabic (%s)', (lang) => {
    const cats = localizeDuaCategories(DUA_CATEGORIES, lang);
    cats.forEach((c, i) => {
      expect(c.titleArabic).toBe(DUA_CATEGORIES[i].titleArabic);
      c.duas.forEach((u, j) => expect(u.text.arabic).toBe(DUA_CATEGORIES[i].duas[j].text.arabic));
    });
    const l = localizeLearn(lang);
    expect(l.SALAH_STEPS.map((s) => s.recite?.arabic)).toEqual(learn.SALAH_STEPS.map((s) => s.recite?.arabic));
    expect(l.WUDU_STEPS.map((s) => s.id)).toEqual(learn.WUDU_STEPS.map((s) => s.id));
    expect(l.PILLARS_OF_ISLAM.map((p) => p.arabic)).toEqual(learn.PILLARS_OF_ISLAM.map((p) => p.arabic));
    expect(l.MORNING_ADHKAR.map((z) => z.arabic)).toEqual(learn.MORNING_ADHKAR.map((z) => z.arabic));
    expect(l.DUA_AFTER_WUDU.arabic).toBe(learn.DUA_AFTER_WUDU.arabic);
    expect(l.RAKAH_COUNTS).toEqual(learn.RAKAH_COUNTS);
    expect(l.PILLARS_SOURCES).toEqual(learn.PILLARS_SOURCES);
    for (const id of Object.keys(MILESTONE_CONTENT) as MilestoneId[]) {
      const m = localizeMilestone(id, lang);
      expect(m.text.arabic).toBe(MILESTONE_CONTENT[id].text.arabic);
      expect(m.text.source).toEqual(MILESTONE_CONTENT[id].text.source);
    }
    expect(localizedWelcomeBack(lang).arabic).toBe(WELCOME_BACK.arabic);
    WEEKS.forEach((w) => expect(localizeWeek(w, lang).titleArabic).toBe(w.titleArabic));
  });

  it('en.json is in sync with content for sample keys', () => {
    expect(en['welcomeBack.meaning']).toBe(WELCOME_BACK.meaning);
    expect(en['week.1.title']).toBe(WEEKS[0].title);
    expect(en['learn.salah_notes.for_women.title']).toBe(learn.SALAH_NOTES[2].title);
    expect(en['milestone.first_step.title']).toBe(MILESTONE_CONTENT.first_step.title);
    expect(en['duaCat.morning.title']).toBe('Morning');
  });

  it('showMeaning is false only for Arabic', () => {
    expect(LANGS.filter((l) => !showMeaning(l))).toEqual(['ar']);
  });
});
