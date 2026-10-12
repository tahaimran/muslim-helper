# Awdah: project context

## Overview

**Awdah** (عودة, "the return") is a free, private, ad-free guide back to your deen: a gentle 30-day path, salah, dhikr and reflection, then an open-ended Istiqamah mode. It is fully local: no accounts, no backend, no ads, no analytics. Everything is stored on the phone. The UI ships in English, Arabic, Urdu, Indonesian and Turkish (Arabic and Urdu are right-to-left).

The Android package / iOS bundle id is still `com.nafs.transformation` (the app was previously called Nafs; old Nafs data is migrated on first launch).

## Tech stack

- Expo SDK 54, React Native 0.81 (new architecture), TypeScript, Expo Router (file-based routes).
- State: one Zustand store persisted to AsyncStorage (`lib/store.ts`), with a schema version and migrations.
- i18n: i18next + react-i18next + expo-localization.
- Prayer times: `adhan`, calculated on-device. Hijri dates: Umm al-Qura.
- Icons: lucide-react-native. Fonts: Amiri (Arabic), Noto Nastaliq Urdu (Urdu UI), Readex Pro (Latin UI).
- Tests: Jest with `jest-expo` (TZ forced to America/New_York, AsyncStorage mocked).

## Directory structure

- `app/` - Expo Router screens. Screens are thin: read the store with `useAppStore`, compute with pure builders in `lib/view/`, render `components/`.
  - `(onboarding)/` - onboarding steps.
  - `(tabs)/` - Today, Worship, Learn, Journey, Me.
  - `(modals)/` - day/[n], milestone/[id], duas, settings, edit-profile, about, privacy, terms, help.
- `components/` - UI kit (AppText, Button, ArabicBlock, Section, ListRow, SkyHeader, PrayerHorizon, Toast, ...) plus feature folders (`day/`, `worship/`, `learn/`, `journey/`, `me/`, `settings/`, `profile/`). Components never import `lib/store`.
- `theme/` - design tokens (`tokens.ts`), fonts, the dawn sky (`sky.ts`), `ThemeProvider`/`useTheme`, `useLang`.
- `lib/` - pure logic (day derivation, plan, milestones, prayer times, Hijri, backup, source refs, view builders) with tests in `lib/__tests__/`; `lib/store.ts` (Zustand + AsyncStorage), `lib/i18n.ts`, and `lib/platform/` (native wrappers: RTL direction, location, notifications, backup files).
- `content/` - religious content: the 30 days, duas, Learn (salah steps), milestones, cities; `content/i18n/` holds per-language content translations keyed by stable ids.
- `locales/` - UI strings; `en.json` is the source of truth.
- `store/` - app store listing text per language (title, descriptions, keywords, captions).
- `scripts/` - `sync-locales.js`, `extract-content-strings.js`, `render-icons.mjs`.
- `docs/` - privacy policy, content sources and review checklists, translation review checklist, screenshots.

## Commands

```
npm install
npm run dev                    # start Expo
npm test                       # Jest
npm run typecheck              # tsc --noEmit
npm run lint                   # expo lint
npm run build:web              # expo export --platform web
npm run i18n:extract           # regenerate content/i18n/en.json from content/
node scripts/sync-locales.js   # merge new en.json keys into the other locales
node scripts/render-icons.mjs  # render the app icons
```

## Conventions

- **Local only.** No network calls with user data, no auth, no analytics, no ads. Location is used once on-device to calculate prayer times and never reverse-geocoded or sent.
- **Strings.** Every user-visible string goes through `t()` with a key in `locales/en.json`; then run `node scripts/sync-locales.js` and write real translations for ar, ur, id and tr (never leave English in another locale). No literal strings in components.
- **Layout.** Use logical properties (`start`/`end`, `marginStart`, `paddingEnd`), never Left/Right; directional icons mirror via `DirectionalIcon`. The native RTL flag follows the in-app language (`lib/platform/direction.ts`).
- **Styling.** Colors and fonts only via `useTheme()` and the theme files; no raw colors in screens. 44x44 minimum touch targets, no ALL-CAPS labels, gradients only in the sky.
- **Pure logic.** Files in `lib/` (except `store.ts`, `i18n.ts` and `lib/platform/`) do not import React or React Native. No `console.log`.
- **Tone.** Gentle; no points, levels or streak guilt.
- **Content integrity.** Only sahih or hasan hadith, each with Arabic, meaning, a reference with a number, and a grade; Quran refs as `Quran surah:ayah`; Companion sayings are labelled athar, not hadith. Captions under texts use `sourceLabel()` (localized ref plus translated grade). Arabic is always shown; the Arabic UI shows the original text without a meaning translation. Translations are not claimed as scholar-reviewed: changes are tracked in `docs/content-review-checklist.md` and `docs/translation-review-checklist.md`.
- **Tests.** Write a failing test first for pure logic in `lib/__tests__/`; run `npm test`, `npm run typecheck` and `npm run lint` before committing.
