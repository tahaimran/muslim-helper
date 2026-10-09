import { DAYS, WEEKS } from '../../content/days';
import { DUA_CATEGORIES } from '../../content/duas';
import {
  DUA_AFTER_WUDU, EVENING_ADHKAR, MORNING_ADHKAR, PILLARS_OF_IMAN, PILLARS_OF_ISLAM,
  PILLARS_SOURCES, RAKAH_COUNTS, SALAH_NOTES, SALAH_STEPS, WUDU_STEPS,
} from '../../content/learn';
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

// Every piece of user-facing content, for blob-wide guards.
const ALL_CONTENT = [
  DAYS, DUA_CATEGORIES, MORNING_ADHKAR, EVENING_ADHKAR, SALAH_STEPS, WUDU_STEPS,
  MILESTONE_CONTENT, WELCOME_BACK,
];
const LEARN_CONTENT = [
  WUDU_STEPS, DUA_AFTER_WUDU, SALAH_STEPS, SALAH_NOTES, PILLARS_OF_ISLAM, PILLARS_OF_IMAN,
  MORNING_ADHKAR, EVENING_ADHKAR,
];
const TANWEEN_ARTIFACT = /[ࣰ-ࣲ] [اى]/;
// Arabic of removed texts, matched with harakat stripped so diacritic variants can't slip through.
const BANNED_ARABIC = [
  /تفكر ساعة/,
  /سلاح المؤمن/,
  /كل أمر ذي بال/,
  /طلب الحلال/,
  /طلب العلم فريضة/,
  /وعلى بركة الله/,
  /وجعلنا من المسلمين/,
];
const stripHarakat = (s: string) => s.replace(/[ً-ٰٟۡ]/g, '');

function checkSource(s: Source, where: string) {
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
  it('has exactly 30 days in 4 weeks', () => {
    expect(DAYS).toHaveLength(30);
    expect(WEEKS.map((w) => w.days)).toEqual([[1, 7], [8, 14], [15, 21], [22, 30]]);
  });

  it('has no tanween-spacing artifacts in Arabic text', () => {
    expect(JSON.stringify(DAYS)).not.toMatch(/[\u08F0-\u08F2] [\u0627\u0649]/);
  });

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

  it('post-salah tasbih is 33 each, and no dhikr count is 34', () => {
    const all: Dhikr[] = [
      ...DAYS.flatMap((d) => [...d.morningDhikr, ...d.eveningDhikr]),
      ...MORNING_ADHKAR, ...EVENING_ADHKAR,
    ];
    const tasbih = all.filter((d) => ['subhanallah', 'alhamdulillah', 'allahuakbar'].includes(d.id));
    expect(tasbih.length).toBeGreaterThan(0);
    tasbih.forEach((d) => expect(d.count).toBe(33));
    all.forEach((d) => expect(d.count).not.toBe(34));
  });

  it('each dhikr id has one Arabic text and one transliteration everywhere', () => {
    const all: Dhikr[] = [
      ...DAYS.flatMap((d) => [...d.morningDhikr, ...d.eveningDhikr]),
      ...MORNING_ADHKAR, ...EVENING_ADHKAR,
    ];
    const arabic = new Map<string, Set<string>>();
    const translit = new Map<string, Set<string>>();
    all.forEach((d) => {
      if (!arabic.has(d.id)) arabic.set(d.id, new Set());
      if (!translit.has(d.id)) translit.set(d.id, new Set());
      arabic.get(d.id)!.add(d.arabic);
      translit.get(d.id)!.add(d.transliteration);
    });
    arabic.forEach((v, id) => expect([id, v.size]).toEqual([id, 1]));
    translit.forEach((v, id) => expect([id, v.size]).toEqual([id, 1]));
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
  it('has no tanween-spacing artifacts in Arabic text', () => {
    expect(JSON.stringify([MILESTONE_CONTENT, WELCOME_BACK])).not.toMatch(/[\u08F0-\u08F2] [\u0627\u0649]/);
  });

  it('covers every milestone id with sourced text', () => {
    MILESTONE_IDS.forEach((id) => {
      expect(MILESTONE_CONTENT[id].title.length).toBeGreaterThan(0);
      checkText(MILESTONE_CONTENT[id].text, id);
    });
    checkText(WELCOME_BACK, 'welcome_back');
  });
});

describe('all content', () => {
  it('contains no banned texts anywhere', () => {
    const blob = JSON.stringify(ALL_CONTENT);
    BANNED.forEach((re) => expect(blob).not.toMatch(re));
  });

  it('contains no banned Arabic texts anywhere (harakat-insensitive)', () => {
    const blob = stripHarakat(JSON.stringify([...ALL_CONTENT, ...LEARN_CONTENT]));
    BANNED_ARABIC.forEach((re) => expect(blob).not.toMatch(re));
  });

  it('has no tanween-spacing artifacts in learn or duas Arabic', () => {
    expect(JSON.stringify(LEARN_CONTENT)).not.toMatch(TANWEEN_ARTIFACT);
    expect(JSON.stringify(DUA_CATEGORIES)).not.toMatch(TANWEEN_ARTIFACT);
  });
});

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
  it("has correct fard rak'ah counts", () => {
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
