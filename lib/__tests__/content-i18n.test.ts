import { DAYS, WEEKS } from '../../content/days';
import { DUA_CATEGORIES } from '../../content/duas';
import * as learn from '../../content/learn';
import { MILESTONE_CONTENT, WELCOME_BACK } from '../../content/milestones';
import {
  CONTENT_TABLES,
  __withTableForTest,
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
    const present = (k: string) => {
      const v = CONTENT_TABLES[lang][k];
      return typeof v === 'string' && (v !== '' || (lang === 'ar' && k.endsWith('.meaning')));
    };
    const missing = Object.keys(en).filter((k) => !present(k));
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

  it('overlays a translated key and falls back for the rest (and for empty strings)', () => {
    __withTableForTest('tr', { 'day.1.theme': 'Niyet', 'day.1.intro': '' }, () => {
      const l = localizeDay(DAYS[0], 'tr');
      expect(l.theme).toBe('Niyet');
      expect(l.intro).toBe(DAYS[0].intro);
    });
  });

  it('caches by identity per language', () => {
    __withTableForTest('tr', { 'day.1.theme': 'Niyet' }, () => {
      expect(localizeDay(DAYS[0], 'tr')).toBe(localizeDay(DAYS[0], 'tr'));
      expect(localizeDuaCategories(DUA_CATEGORIES, 'tr')).toBe(localizeDuaCategories(DUA_CATEGORIES, 'tr'));
      expect(localizeLearn('tr')).toBe(localizeLearn('tr'));
    });
    expect(localizeDay(DAYS[0], 'en')).toBe(DAYS[0]);
  });
});

describe('full-table overlay', () => {
  const mark = (k: string) => '«X:' + k + '»';
  const table: Record<string, string> = {};
  for (const k of Object.keys(en)) table[k] = mark(k);

  it('consumes every en key, changes every translatable field, preserves the rest', () => {
    const used = new Set<string>();
    const proxy = new Proxy(table, {
      get(t, prop) {
        if (typeof prop === 'string') used.add(prop);
        return Reflect.get(t, prop);
      },
    });
    const bad: string[] = [];
    const changed = (label: string, val: string | undefined, key: string) => {
      if (val !== mark(key)) bad.push(label + ' ' + key + ' -> ' + val);
    };
    __withTableForTest('tr', proxy, () => {
      for (const d of DAYS) {
        const l = localizeDay(d, 'tr');
        const p = 'day.' + d.day;
        changed('d', l.theme, p + '.theme');
        changed('d', l.intro, p + '.intro');
        changed('d', l.reflection, p + '.reflection');
        changed('d', l.quran.note, p + '.quran.note');
        changed('d', l.prayerFocus.tip, p + '.prayer.tip');
        if (d.prayerFocus.dua) changed('d', l.prayerFocus.dua?.meaning, p + '.prayer.dua.meaning');
        changed('d', l.sunnah.title, p + '.sunnah.title');
        changed('d', l.sunnah.description, p + '.sunnah.description');
        changed('d', l.character.trait, p + '.character.trait');
        changed('d', l.character.description, p + '.character.description');
        changed('d', l.character.action, p + '.character.action');
        changed('d', l.hadith.meaning, p + '.hadith.meaning');
        d.tasks.forEach((t, i) => {
          const lt = l.tasks[i];
          changed('d', lt.title, p + '.task.' + t.id + '.title');
          if (t.titleBeginner) changed('d', lt.titleBeginner, p + '.task.' + t.id + '.titleBeginner');
          if (t.titleAdvanced) changed('d', lt.titleAdvanced, p + '.task.' + t.id + '.titleAdvanced');
          expect(lt.id).toBe(t.id);
          expect(lt.category).toBe(t.category);
          expect(lt.tasbih).toEqual(t.tasbih);
        });
        for (const [src, got] of [
          [d.morningDhikr, l.morningDhikr],
          [d.eveningDhikr, l.eveningDhikr],
        ] as const) {
          src.forEach((z, i) => {
            changed('d', got[i].meaning, p + '.dhikr.' + z.id + '.meaning');
            expect(got[i]).toEqual({ ...z, meaning: got[i].meaning });
          });
        }
        expect(l.themeArabic).toBe(d.themeArabic);
        expect(l.hadith.arabic).toBe(d.hadith.arabic);
        expect(l.hadith.source).toEqual(d.hadith.source);
        expect(l.sunnah.source).toEqual(d.sunnah.source);
        expect(l.character.arabic).toBe(d.character.arabic);
        expect(l.quran.surah).toBe(d.quran.surah);
        expect(l.prayerFocus.prayer).toBe(d.prayerFocus.prayer);
        expect(l.prayerFocus.dua?.arabic).toBe(d.prayerFocus.dua?.arabic);
        expect(l.prayerFocus.dua?.transliteration).toBe(d.prayerFocus.dua?.transliteration);
        expect(l.prayerFocus.dua?.source).toEqual(d.prayerFocus.dua?.source);
      }
      for (const w of WEEKS) {
        const lw = localizeWeek(w, 'tr');
        changed('w', lw.title, 'week.' + w.week + '.title');
        expect(lw.titleArabic).toBe(w.titleArabic);
        expect(lw.days).toEqual(w.days);
      }
      const cats = localizeDuaCategories(DUA_CATEGORIES, 'tr');
      cats.forEach((c, i) => {
        const sc = DUA_CATEGORIES[i];
        changed('c', c.title, 'duaCat.' + sc.id + '.title');
        expect(c.id).toBe(sc.id);
        expect(c.titleArabic).toBe(sc.titleArabic);
        c.duas.forEach((u, j) => {
          const su = sc.duas[j];
          changed('u', u.title, 'dua.' + su.id + '.title');
          if (su.occasion) changed('u', u.occasion, 'dua.' + su.id + '.occasion');
          changed('u', u.text.meaning, 'dua.' + su.id + '.meaning');
          expect(u.id).toBe(su.id);
          expect(u.titleArabic).toBe(su.titleArabic);
          expect(u.text.arabic).toBe(su.text.arabic);
          expect(u.text.transliteration).toBe(su.text.transliteration);
          expect(u.text.source).toEqual(su.text.source);
        });
      });
      const L = localizeLearn('tr');
      for (const [name, list, src] of [
        ['wudu_steps', L.WUDU_STEPS, learn.WUDU_STEPS],
        ['salah_steps', L.SALAH_STEPS, learn.SALAH_STEPS],
      ] as const) {
        list.forEach((s, i) => {
          const o = src[i];
          changed('l', s.title, 'learn.' + name + '.' + o.id + '.title');
          changed('l', s.body, 'learn.' + name + '.' + o.id + '.body');
          expect(s.id).toBe(o.id);
          if (o.recite) {
            changed('l', s.recite?.meaning, 'learn.' + name + '.' + o.id + '.recite.meaning');
            expect(s.recite?.arabic).toBe(o.recite.arabic);
            expect(s.recite?.transliteration).toBe(o.recite.transliteration);
            expect(s.recite?.source).toEqual(o.recite.source);
          } else expect(s.recite).toBeUndefined();
        });
      }
      changed('l', L.DUA_AFTER_WUDU.meaning, 'learn.dua_after_wudu.meaning');
      expect(L.DUA_AFTER_WUDU.arabic).toBe(learn.DUA_AFTER_WUDU.arabic);
      expect(L.DUA_AFTER_WUDU.source).toEqual(learn.DUA_AFTER_WUDU.source);
      L.SALAH_NOTES.forEach((n, i) => {
        changed('l', n.title, 'learn.salah_notes.' + n.id + '.title');
        changed('l', n.body, 'learn.salah_notes.' + n.id + '.body');
        expect(n.id).toBe(learn.SALAH_NOTES[i].id);
      });
      for (const [list, src] of [
        [L.PILLARS_OF_ISLAM, learn.PILLARS_OF_ISLAM],
        [L.PILLARS_OF_IMAN, learn.PILLARS_OF_IMAN],
      ] as const) {
        list.forEach((p, i) => {
          changed('l', p.name, 'learn.pillar.' + src[i].id + '.name');
          changed('l', p.meaning, 'learn.pillar.' + src[i].id + '.meaning');
          expect(p.id).toBe(src[i].id);
          expect(p.arabic).toBe(src[i].arabic);
        });
      }
      for (const [name, list, src] of [
        ['morning_adhkar', L.MORNING_ADHKAR, learn.MORNING_ADHKAR],
        ['evening_adhkar', L.EVENING_ADHKAR, learn.EVENING_ADHKAR],
      ] as const) {
        list.forEach((z, i) => {
          changed('l', z.meaning, 'learn.' + name + '.' + src[i].id + '.meaning');
          expect(z).toEqual({ ...src[i], meaning: z.meaning });
        });
      }
      expect(L.RAKAH_COUNTS).toEqual(learn.RAKAH_COUNTS);
      expect(L.PILLARS_SOURCES).toEqual(learn.PILLARS_SOURCES);
      for (const id of Object.keys(MILESTONE_CONTENT) as MilestoneId[]) {
        const m = localizeMilestone(id, 'tr');
        changed('m', m.title, 'milestone.' + id + '.title');
        changed('m', m.text.meaning, 'milestone.' + id + '.meaning');
        expect(m.text.arabic).toBe(MILESTONE_CONTENT[id].text.arabic);
        expect(m.text.source).toEqual(MILESTONE_CONTENT[id].text.source);
      }
      const wb = localizedWelcomeBack('tr');
      changed('wb', wb.meaning, 'welcomeBack.meaning');
      expect(wb.arabic).toBe(WELCOME_BACK.arabic);
    });
    expect(bad).toEqual([]);
    const unused = Object.keys(en).filter((k) => !used.has(k));
    expect(unused).toEqual([]);
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
