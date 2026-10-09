# Awdah Plan 3 — "Fajr" Design System & UI Kit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the "Fajr" visual identity as code — color tokens with a tested contrast floor, a time-of-day sky, language-aware typography, a theme provider, and a small UI kit including the signature Prayer Horizon — so Plan 4 screens compose from it.

**Architecture:** Pure, tested design logic in `theme/` (tokens, sky phase, font roles, contrast); a `ThemeProvider` that reads `settings.theme` from the store; presentational components in `components/` that take data via props and never touch the store. Directional layout uses logical `start`/`end` styles so RTL (Arabic, Urdu) works without per-screen code.

**Tech Stack:** React Native 0.81, expo-font + @expo-google-fonts (Readex Pro, Amiri, Noto Nastaliq Urdu), expo-linear-gradient, react-native-svg, react-native-reanimated, expo-haptics, lucide-react-native.

**Spec:** `docs/superpowers/specs/2026-10-09-awdah-design.md` (§7 Visual design)

## Design decisions (from the frontend-design pass — binding)

- **One bold element:** the Prayer Horizon sky on Today. Everything else is quiet: no identical card stacks, no gradient washes elsewhere, no all-caps eyebrow labels, no mono labels, no "→" on buttons, no middle-dot meta strings.
- **Palette** (`theme/tokens.ts`):

| Token | Hex | Role |
|---|---|---|
| layl | `#161A33` | dark background (night ink) |
| laylRaised | `#20254A` | dark raised surface |
| mist | `#F2F4F9` | light background (cool, not cream) |
| cloud | `#FFFFFF` | light raised surface |
| ink | `#1F2340` | light-mode text |
| inkMuted | `#565B78` | light-mode secondary text |
| starlight | `#E9EBF5` | dark-mode text |
| starMuted | `#A7ACC9` | dark-mode secondary text |
| zaytun | `#4F7D5B` | completion / primary action (light) |
| zaytunNight | `#8CC09A` | completion / primary action (dark) |
| dawnGold | `#C8901F` | Arabic highlights (light) |
| dawnGoldNight | `#E3B65A` | Arabic highlights (dark) |
| lineLight | `#DCE0EC` | hairlines (light) |
| lineDark | `#30365E` | hairlines (dark) |
| danger | `#B4444F` / `#E8848C` | errors (light / dark) |

- **Type:** Readex Pro for UI in en/ar/id/tr (it was designed for Arabic+Latin together); Noto Nastaliq Urdu for Urdu UI; Amiri for Quran/hadith/dua Arabic in every language and for display headings in en/ar/id/tr. Scale (px): 12, 14, 16, 20, 25, 31, 39. Body 16. Line height ×1.45 (Latin/Arabic naskh), ×2.0 for Nastaliq.
- **Shape:** radius 28 for the sky panel and sheets, 14 for rows/buttons, 999 for prayer nodes and chips. Shadows only on the floating tab bar.
- **Motion:** one orchestrated moment — the sky fades in and the sun marker settles on Today mount. Everything else responds only to touch (press scale 0.97, check fill). Respect reduce-motion (`AccessibilityInfo.isReduceMotionEnabled`).

## Global Constraints

- Screens/components never hardcode colors or font families — always from `useTheme()` / `theme/fonts.ts`.
- Components in `components/` are presentational: props in, callbacks out; they do not import `lib/store`.
- All user-visible strings come in via props or `t()`; no literal English in components except accessibility fallbacks passed by props.
- Use `marginStart/marginEnd/paddingStart/paddingEnd/start/end` (never Left/Right) so RTL mirrors automatically.
- Minimum touch target 44×44.
- Text contrast ≥ 4.5:1 for body text on its background, ≥ 3:1 for large text (≥ 20px) — enforced by a test.

## Review Focus

1. Urdu Nastaliq text clipped vertically (Nastaliq needs tall line height) → `lineHeightFor('ur', size)` returns 2.0×; tested. (Task 1)
2. Dark-mode text unreadable on raised surfaces → contrast test over every text/background pair. (Task 1)
3. Sky phase wrong right after midnight (before Fajr should still be night, not "morning") → tested. (Task 1)
4. No location set (no prayer times) → sky falls back to clock-hour phases and the Horizon shows names without times. (Tasks 1, 4)
5. RTL: the Horizon order must read right-to-left in Arabic/Urdu (Fajr on the right) → `SkyHeader` mirrors positions when `I18nManager.isRTL`. (Task 4)

---

### Task 1: Tokens, sky phase, font roles (pure, tested)

**Files:**
- Create: `theme/tokens.ts`, `theme/sky.ts`, `theme/fonts.ts`, `theme/contrast.ts`
- Test: `theme/__tests__/theme.test.ts`

**Interfaces:**
- Consumes: `DailyPrayerTimes` from `lib/prayerTimes.ts`; `Lang` from `lib/model.ts`.
- Produces:
  - `palette` (object of the hex values above), `type ColorScheme = 'light' | 'dark'`
  - `interface ThemeColors { bg; surface; text; textMuted; accent; onAccent; gold; line; danger }` and `colorsFor(scheme: ColorScheme): ThemeColors`
  - `type SkyPhase = 'night' | 'fajr' | 'morning' | 'afternoon' | 'asr' | 'maghrib'`
  - `getSkyPhase(now: Date, times: DailyPrayerTimes | null): SkyPhase`
  - `SKY: Record<SkyPhase, { gradient: [string, string, string]; text: string; textMuted: string; isDark: boolean }>`
  - `type FontRole = 'ui' | 'uiMedium' | 'uiBold' | 'display' | 'arabic'`
  - `fontFamily(lang: Lang, role: FontRole): string`, `lineHeightFor(lang: Lang, size: number): number`, `TYPE_SCALE = { caption: 12, small: 14, body: 16, heading: 20, title: 25, display: 31, hero: 39 }`
  - `contrastRatio(hexA: string, hexB: string): number`
  - `FONT_ASSETS` — the object passed to `useFonts` (from the @expo-google-fonts packages)

- [ ] **Step 1: Install fonts**

```bash
npx expo install @expo-google-fonts/readex-pro @expo-google-fonts/amiri @expo-google-fonts/noto-nastaliq-urdu expo-linear-gradient react-native-svg
npm uninstall @expo-google-fonts/inter @expo-google-fonts/playfair-display
```
If old screens import Inter/Playfair (grep first: `grep -rn "google-fonts" app lib`), keep the old packages and note it; otherwise uninstall.

- [ ] **Step 2: Write failing tests** `theme/__tests__/theme.test.ts`:

```ts
import { colorsFor, palette } from '../tokens';
import { getSkyPhase, SKY } from '../sky';
import { fontFamily, lineHeightFor } from '../fonts';
import { contrastRatio } from '../contrast';
import type { DailyPrayerTimes } from '../../lib/prayerTimes';

const at = (h: number, m = 0) => new Date(2026, 9, 9, h, m);
const times: DailyPrayerTimes = {
  fajr: at(5, 0), sunrise: at(6, 20), dhuhr: at(12, 10),
  asr: at(15, 30), maghrib: at(18, 5), isha: at(19, 25),
};

describe('contrast', () => {
  it('computes known ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
  });
  it.each(['light', 'dark'] as const)('%s theme text passes AA on bg and surface', (scheme) => {
    const c = colorsFor(scheme);
    for (const bg of [c.bg, c.surface]) {
      expect(contrastRatio(c.text, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.textMuted, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c.accent, bg)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(c.gold, bg)).toBeGreaterThanOrEqual(3);
    }
    expect(contrastRatio(c.onAccent, c.accent)).toBeGreaterThanOrEqual(4.5);
  });
  it('sky text passes AA on every gradient stop', () => {
    for (const s of Object.values(SKY)) {
      for (const stop of s.gradient) expect(contrastRatio(s.text, stop)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('exposes the palette', () => {
    expect(palette.layl).toBe('#161A33');
  });
});

describe('getSkyPhase', () => {
  it('follows prayer times', () => {
    expect(getSkyPhase(at(1), times)).toBe('night');
    expect(getSkyPhase(at(5, 30), times)).toBe('fajr');
    expect(getSkyPhase(at(9), times)).toBe('morning');
    expect(getSkyPhase(at(13), times)).toBe('afternoon');
    expect(getSkyPhase(at(16), times)).toBe('asr');
    expect(getSkyPhase(at(18, 30), times)).toBe('maghrib');
    expect(getSkyPhase(at(22), times)).toBe('night');
  });
  it('falls back to clock hours without times', () => {
    expect(getSkyPhase(at(2), null)).toBe('night');
    expect(getSkyPhase(at(5, 30), null)).toBe('fajr');
    expect(getSkyPhase(at(10), null)).toBe('morning');
    expect(getSkyPhase(at(13), null)).toBe('afternoon');
    expect(getSkyPhase(at(16), null)).toBe('asr');
    expect(getSkyPhase(at(19), null)).toBe('maghrib');
    expect(getSkyPhase(at(21), null)).toBe('night');
  });
});

describe('fonts', () => {
  it('uses Nastaliq for Urdu UI and Amiri for Arabic text everywhere', () => {
    expect(fontFamily('ur', 'ui')).toMatch(/NotoNastaliqUrdu/);
    expect(fontFamily('en', 'ui')).toMatch(/ReadexPro/);
    expect(fontFamily('ar', 'ui')).toMatch(/ReadexPro/);
    for (const l of ['en', 'ar', 'ur', 'id', 'tr'] as const) expect(fontFamily(l, 'arabic')).toMatch(/Amiri/);
    expect(fontFamily('en', 'display')).toMatch(/Amiri/);
  });
  it('gives Nastaliq extra line height', () => {
    expect(lineHeightFor('ur', 16)).toBe(32);
    expect(lineHeightFor('en', 16)).toBe(23);
  });
});
```

- [ ] **Step 3: Run** `npx jest theme` — FAIL (modules missing).

- [ ] **Step 4: Implement**

`theme/contrast.ts`:
```ts
function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
export function contrastRatio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
```

`theme/tokens.ts`:
```ts
export const palette = {
  layl: '#161A33', laylRaised: '#20254A', mist: '#F2F4F9', cloud: '#FFFFFF',
  ink: '#1F2340', inkMuted: '#565B78', starlight: '#E9EBF5', starMuted: '#A7ACC9',
  zaytun: '#4F7D5B', zaytunNight: '#8CC09A', dawnGold: '#C8901F', dawnGoldNight: '#E3B65A',
  lineLight: '#DCE0EC', lineDark: '#30365E', danger: '#B4444F', dangerNight: '#E8848C',
} as const;

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  bg: string; surface: string; text: string; textMuted: string;
  accent: string; onAccent: string; gold: string; line: string; danger: string;
}

export function colorsFor(scheme: ColorScheme): ThemeColors {
  return scheme === 'dark'
    ? { bg: palette.layl, surface: palette.laylRaised, text: palette.starlight, textMuted: palette.starMuted,
        accent: palette.zaytunNight, onAccent: palette.layl, gold: palette.dawnGoldNight, line: palette.lineDark, danger: palette.dangerNight }
    : { bg: palette.mist, surface: palette.cloud, text: palette.ink, textMuted: palette.inkMuted,
        accent: palette.zaytun, onAccent: palette.cloud, gold: palette.dawnGold, line: palette.lineLight, danger: palette.danger };
}
```
If the contrast test fails for any pair, adjust ONLY the failing token's lightness minimally (keep hue) until it passes, and record the final hex in the report.

`theme/sky.ts`:
```ts
import type { DailyPrayerTimes } from '../lib/prayerTimes';

export type SkyPhase = 'night' | 'fajr' | 'morning' | 'afternoon' | 'asr' | 'maghrib';

const NIGHT_TEXT = '#F4F1FA';
const DAY_TEXT = '#17203A';

export const SKY: Record<SkyPhase, { gradient: [string, string, string]; text: string; textMuted: string; isDark: boolean }> = {
  night:     { gradient: ['#0E1028', '#1B1F45', '#2C3163'], text: NIGHT_TEXT, textMuted: '#B9BCDA', isDark: true },
  fajr:      { gradient: ['#1E2250', '#3E3A72', '#6A5A8E'], text: NIGHT_TEXT, textMuted: '#D3CCE6', isDark: true },
  morning:   { gradient: ['#BFD8EE', '#D9E8F5', '#F1F6FB'], text: DAY_TEXT, textMuted: '#3A4565', isDark: false },
  afternoon: { gradient: ['#A9CBEA', '#C8DDF1', '#E6EFF8'], text: DAY_TEXT, textMuted: '#3A4565', isDark: false },
  asr:       { gradient: ['#E9CF9E', '#F0DDB6', '#F7EBD3'], text: DAY_TEXT, textMuted: '#4A4232', isDark: false },
  maghrib:   { gradient: ['#2E2850', '#5A3F6E', '#7E5577'], text: NIGHT_TEXT, textMuted: '#E2D2E2', isDark: true },
};

function byClock(h: number): SkyPhase {
  if (h < 5) return 'night';
  if (h < 7) return 'fajr';
  if (h < 12) return 'morning';
  if (h < 15) return 'afternoon';
  if (h < 18) return 'asr';
  if (h < 20) return 'maghrib';
  return 'night';
}

export function getSkyPhase(now: Date, times: DailyPrayerTimes | null): SkyPhase {
  if (!times) return byClock(now.getHours());
  const t = now.getTime();
  if (t < times.fajr.getTime()) return 'night';
  if (t < times.sunrise.getTime()) return 'fajr';
  if (t < times.dhuhr.getTime()) return 'morning';
  if (t < times.asr.getTime()) return 'afternoon';
  if (t < times.maghrib.getTime()) return 'asr';
  if (t < times.isha.getTime()) return 'maghrib';
  return 'night';
}
```
(Same rule: if a sky text/stop pair fails, adjust that gradient stop's lightness minimally.)

`theme/fonts.ts`:
```ts
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu';
import { ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_700Bold } from '@expo-google-fonts/readex-pro';
import type { Lang } from '../lib/model';

export const FONT_ASSETS = {
  ReadexPro_400Regular, ReadexPro_500Medium, ReadexPro_700Bold,
  Amiri_400Regular, Amiri_700Bold,
  NotoNastaliqUrdu_400Regular, NotoNastaliqUrdu_700Bold,
};

export type FontRole = 'ui' | 'uiMedium' | 'uiBold' | 'display' | 'arabic';

export const TYPE_SCALE = { caption: 12, small: 14, body: 16, heading: 20, title: 25, display: 31, hero: 39 } as const;

export function fontFamily(lang: Lang, role: FontRole): string {
  if (role === 'arabic') return 'Amiri_400Regular';
  if (lang === 'ur') return role === 'ui' ? 'NotoNastaliqUrdu_400Regular' : 'NotoNastaliqUrdu_700Bold';
  switch (role) {
    case 'ui': return 'ReadexPro_400Regular';
    case 'uiMedium': return 'ReadexPro_500Medium';
    case 'uiBold': return 'ReadexPro_700Bold';
    case 'display': return 'Amiri_700Bold';
  }
}

export function lineHeightFor(lang: Lang, size: number): number {
  return Math.round(size * (lang === 'ur' ? 2.0 : 1.45));
}
```
(Check the exact export names in `node_modules/@expo-google-fonts/*/index.js` and adjust if they differ.)

- [ ] **Step 5: Run** `npx jest theme` — PASS. `npm run typecheck`.
- [ ] **Step 6: Commit** `git add theme package.json package-lock.json && git commit -m "feat(design): Fajr tokens, sky phases, font roles with contrast tests"`

---

### Task 2: Theme provider and app-level hooks

**Files:**
- Create: `theme/ThemeProvider.tsx`, `theme/useLang.ts`

**Interfaces:**
- Consumes: `useAppStore` from `lib/store.ts` (`s.settings.theme`, `s.settings.language`), `colorsFor`, `fontFamily`, `lineHeightFor`, `resolveLanguage` from `lib/i18n.ts`, `getLocales` from `expo-localization`.
- Produces:
  - `<AppThemeProvider>{children}</AppThemeProvider>` — computes scheme: `settings.theme === 'system' ? useColorScheme() ?? 'light' : settings.theme`.
  - `useTheme(): { scheme: ColorScheme; colors: ThemeColors; lang: Lang; isRTL: boolean; font: (role: FontRole) => string; lineHeight: (size: number) => number; reduceMotion: boolean }`
  - `useLang(): Lang` — `resolveLanguage(settings.language, getLocales().map(l => l.languageCode))`.

- [ ] **Step 1:** Implement both files. `isRTL` = `I18nManager.isRTL`. `reduceMotion` from `AccessibilityInfo.isReduceMotionEnabled()` + `reduceMotionChanged` listener.
- [ ] **Step 2:** `npm run typecheck` clean.
- [ ] **Step 3:** Commit `git add theme && git commit -m "feat(design): theme provider with language-aware fonts"`

---

### Task 3: UI kit primitives

**Files:** Create in `components/`: `AppText.tsx`, `Screen.tsx`, `Button.tsx`, `Chip.tsx`, `Section.tsx`, `ThreadList.tsx`, `CheckNode.tsx`, `ArabicBlock.tsx`, `ListRow.tsx`, `Toast.tsx`, `DirectionalIcon.tsx`, `index.ts`

**Interfaces (Produces):**
```ts
// AppText: variant sets size/font/color; arabic variant uses Amiri, RTL writingDirection, center by default
type TextVariant = 'hero' | 'display' | 'title' | 'heading' | 'body' | 'small' | 'caption' | 'arabic' | 'arabicLarge';
AppText(props: TextProps & { variant?: TextVariant; muted?: boolean; color?: string; weight?: 'regular' | 'medium' | 'bold'; center?: boolean })

Screen(props: { children; scroll?: boolean; padded?: boolean; edges?: Edge[]; contentStyle?: ViewStyle })
// SafeAreaView + colors.bg + optional ScrollView with bottom inset for the floating tab bar (paddingBottom 120)

Button(props: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; disabled?: boolean; icon?: ReactNode; accessibilityHint?: string })
// height 52, radius 14, press scale 0.97 (reanimated), haptic selection on press (native only)

Chip(props: { label: string; selected: boolean; onPress: () => void })   // radius 999, min height 44

Section(props: { title?: string; subtitle?: string; children; action?: { label: string; onPress: () => void } })
// a titled block separated by space (marginTop 32), NOT a card

ThreadList(props: { children }) + ThreadItem(props: { node: ReactNode; children; last?: boolean })
// vertical hairline (colors.line) runs through node centers on the start side; content beside node

CheckNode(props: { checked: boolean; onPress: () => void; label: string; size?: number })
// 28px circle node; checked = filled colors.accent with check icon (onAccent); unchecked = 2px colors.line ring;
// whole row pressable via parent; accessibilityRole="checkbox", accessibilityState={{checked}}

ArabicBlock(props: { arabic: string; transliteration?: string; meaning: string; sourceRef?: string; size?: 'normal' | 'large' })
// Arabic in Amiri (gold for large), then transliteration (muted, italic), then meaning, then source (caption, muted)

ListRow(props: { title: string; subtitle?: string; onPress?: () => void; trailing?: ReactNode; leading?: ReactNode; destructive?: boolean })
// min height 56, hairline divider at bottom, chevron (DirectionalIcon) when onPress and no trailing

Toast: `ToastHost` component + `showToast(message: string, kind?: 'info' | 'error')` module-level emitter

DirectionalIcon(props: { icon: LucideIcon; size?: number; color?: string })  // scaleX -1 when isRTL
```
- [ ] **Step 1:** Implement all components using `useTheme()` only for colors/fonts; logical start/end spacing; no literal user-facing strings.
- [ ] **Step 2:** `components/index.ts` re-exports all.
- [ ] **Step 3:** `npm run typecheck && npm run lint` (no new warnings).
- [ ] **Step 4:** Commit `git add components && git commit -m "feat(design): UI kit primitives"`

---

### Task 4: Prayer Horizon (signature component)

**Files:** Create `components/SkyHeader.tsx`, `components/PrayerHorizon.tsx`

**Interfaces:**
- Consumes: `SKY`, `SkyPhase`, `PRAYER_ORDER`, `DailyPrayerTimes`, `useTheme`.
- Produces:
```ts
SkyHeader(props: {
  phase: SkyPhase;
  greeting: string;          // e.g. "Assalamu alaikum, Aisha"
  title: string;             // day theme, e.g. "Niyyah"
  titleArabic: string;       // "النية"
  dateLine: string;          // localized Hijri + Gregorian, built by caller
  nextPrayerLine?: string;   // e.g. "Asr in 1 h 20 min" (caller builds); omitted when no location
  children?: ReactNode;      // the PrayerHorizon goes here
})
PrayerHorizon(props: {
  labels: Record<PrayerName, string>;            // localized names
  times: DailyPrayerTimes | null;                // null → no time labels, no sun marker
  timeLabel?: (d: Date) => string;               // localized HH:mm formatter
  done: PrayerName[];
  now: Date;
  textColor: string; mutedColor: string; accent: string;
  onToggle: (p: PrayerName) => void;
})
```
**Visual spec:**
- SkyHeader: full-bleed `LinearGradient` (the phase's 3 stops, vertical) under the status bar, bottom corners radius 28. Content padding 24. Greeting (small, muted sky text), Arabic title (Amiri 39, sky text, start-aligned, then the transliterated theme title (Readex 20) beneath it), date line (caption). Subtle girih texture: an SVG pattern of 8-point stars at 6% opacity in the top-end corner, ~140px, not repeated across the whole sky.
- PrayerHorizon: an SVG arc (semi-ellipse, stroke = sky muted color at 40% opacity, width 1.5) spanning the panel width minus 24px each side, height 72. Five nodes evenly spaced along the arc (fixed angles 170°, 130°, 90°, 50°, 10° measured so Fajr sits low at the start, Dhuhr at the top). Each node: 44×44 touch target, 18px circle — filled `accent` with a small check when done, else 2px ring in sky text color. Under each node: name (caption, sky text) and time (caption, muted) if `times`.
- Sun marker: a 10px dawnGold circle with soft glow on the arc at the position interpolated by `now` between the surrounding prayer times (before Fajr → at Fajr node; after Isha → at Isha node). Hidden when `times` is null.
- RTL: when `isRTL`, mirror x positions so Fajr sits at the right end.
- On mount: sky fades from opacity 0.6→1 and the sun marker moves along the arc to its position over 900ms (skip when reduceMotion).
- Tap a node → `Haptics.selectionAsync()` (native only) then `onToggle(p)`. `accessibilityRole="checkbox"`, label = prayer name (+ time), state checked.

- [ ] **Step 1:** Implement both components to the spec.
- [ ] **Step 2:** `npm run typecheck && npm run lint`.
- [ ] **Step 3:** Commit `git add components && git commit -m "feat(design): Prayer Horizon sky header"`

Visual verification of Tasks 3–4 happens in Plan 4 on real screens via web screenshots (Chrome DevTools MCP), light and dark, en and ar.
