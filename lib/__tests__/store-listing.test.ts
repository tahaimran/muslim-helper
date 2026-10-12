import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..', '..', 'store');
const LANGS = ['en', 'ar', 'ur', 'id', 'tr'] as const;
type Lang = (typeof LANGS)[number];

const FILES = [
  'title',
  'short_description',
  'full_description',
  'ios_name',
  'ios_subtitle',
  'ios_keywords',
  'promo_text',
  'screenshot_captions',
] as const;
type FileName = (typeof FILES)[number];

const read = (lang: Lang, file: FileName): string =>
  fs.readFileSync(path.join(ROOT, lang, `${file}.txt`), 'utf8').replace(/^﻿/, '').trim();

const len = (s: string): number => [...s].length;

const LIMITS: Partial<Record<FileName, number>> = {
  title: 30,
  short_description: 80,
  full_description: 4000,
  ios_name: 30,
  ios_subtitle: 30,
  ios_keywords: 100,
  promo_text: 170,
};

const TITLES: Record<Lang, string> = {
  en: 'Awdah: Learn Salah & Deen',
  tr: 'Awdah: Namaz Öğreniyorum',
  id: 'Awdah: Hijrah & Belajar Sholat',
  ur: 'Awdah: نماز سیکھیں، دین کی طرف',
  ar: 'عودة: تعلم الصلاة والعودة',
};

// Market keywords from the plan's keyword table that must appear naturally in the listing.
const KEYWORDS: Record<Lang, string[]> = {
  en: ['new muslim', 'learn salah', 'salah tracker', 'islamic planner', 'better muslim', 'dhikr counter'],
  tr: ['namaz öğreniyorum', 'namaz kılmayı öğren'],
  id: ['hijrah', 'belajar sholat', 'pengingat sholat'],
  ur: ['نماز', 'namaz sikhne ka tarika', 'namaz tracker'],
  ar: ['تعلم الصلاة'],
};

const FORBIDDEN = /\bAI\b|#1|qibla|scholar[- ]reviewed/i;

const words = (s: string, lang: Lang): string[] =>
  s
    .toLocaleLowerCase(lang)
    .split(/[\s,،:&.!?\-–—|/]+/u)
    .filter(Boolean);

describe.each(LANGS)('store listing (%s)', (lang) => {
  it('has every file, non-empty', () => {
    for (const file of FILES) expect(read(lang, file).length).toBeGreaterThan(0);
  });

  it('respects store character limits', () => {
    for (const [file, max] of Object.entries(LIMITS) as [FileName, number][]) {
      const n = len(read(lang, file));
      if (n > max) throw new Error(`${lang}/${file}.txt is ${n} chars (max ${max})`);
    }
  });

  it('full description is a real description (~1,800-2,500 chars)', () => {
    const n = len(read(lang, 'full_description'));
    expect(n).toBeGreaterThanOrEqual(1500);
    expect(n).toBeLessThanOrEqual(3000);
  });

  it('uses the fixed Play title', () => {
    expect(read(lang, 'title')).toBe(TITLES[lang]);
  });

  it('uses the fixed English iOS name and subtitle', () => {
    if (lang !== 'en') return;
    expect(read(lang, 'ios_name')).toBe('Awdah: Return to Deen');
    expect(read(lang, 'ios_subtitle')).toBe('New Muslim & Learn Salah Guide');
  });

  it('iOS keywords: comma-separated, no spaces after commas, no name/subtitle words', () => {
    const kw = read(lang, 'ios_keywords');
    expect(kw).not.toMatch(/,\s/);
    expect(kw).not.toMatch(/\s,/);
    expect(kw).not.toMatch(/,,|^,|,$/);
    const taken = new Set([...words(read(lang, 'ios_name'), lang), ...words(read(lang, 'ios_subtitle'), lang)]);
    const kwWords = kw.split(',').flatMap((k) => words(k, lang));
    const repeated = kwWords.filter((w) => taken.has(w));
    expect(repeated).toEqual([]);
    expect(new Set(kwWords).size).toBe(kwWords.length);
  });

  it('has six screenshot captions', () => {
    const lines = read(lang, 'screenshot_captions')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    expect(lines).toHaveLength(6);
    for (const l of lines) expect(len(l)).toBeLessThanOrEqual(60);
  });

  it('makes no forbidden claims', () => {
    for (const file of FILES) {
      const text = read(lang, file);
      if (FORBIDDEN.test(text)) throw new Error(`${lang}/${file}.txt contains a forbidden claim`);
    }
  });

  it('weaves in the market keywords', () => {
    const all = FILES.map((f) => read(lang, f))
      .join('\n')
      .toLocaleLowerCase(lang);
    for (const k of KEYWORDS[lang]) {
      if (!all.includes(k.toLocaleLowerCase(lang))) throw new Error(`${lang} is missing keyword "${k}"`);
    }
  });
});

it('English short description targets "better muslim"', () => {
  expect(read('en', 'short_description').toLowerCase()).toContain('better muslim');
});
