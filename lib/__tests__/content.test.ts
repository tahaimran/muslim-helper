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
