# Awdah

Awdah is a free, private, ad-free guide back to your deen: a gentle 30-day path, salah, dhikr and reflection. There are no accounts, no ads and no analytics. Everything is stored on your phone; Awdah never sends anything to us (your phone's own system backup may include it, and that backup is yours).

## Features

- A gentle 30-day journey with daily tasks and milestones
- Prayer times calculated on-device (adhan), with optional local reminders
- Dhikr and adhkar, daily duas, and a Learn section with trusted links
- Journal and reflection, backups as files you keep
- Light and dark themes; English, Arabic, Urdu, Indonesian and Turkish (with RTL)

## Tech stack

Expo SDK 54, React Native 0.81, TypeScript, Expo Router, AsyncStorage, Jest.

## Commands

```
npm install
npm run dev        # start Expo
npm test           # Jest
npm run typecheck  # tsc --noEmit
npm run lint       # expo lint
```

## Project structure

- `app/` - screens and routes (Expo Router)
- `components/` - UI components
- `theme/` - colors, fonts, spacing
- `lib/` - pure logic, store and i18n (with tests in `lib/__tests__/`)
- `content/` - journey days, duas, learn links, milestones, cities
- `locales/` - translation files (`en.json` is the source)
- `store/` - app store listing text per language
- `docs/` - privacy policy, review checklists, screenshots

## Content sources and review

Religious content is sourced and checked as recorded in `docs/content-sources/`. Every content change should be reviewed against `docs/content-review-checklist.md`. A translation review checklist will be added later.

## Testing RTL on device

The layout direction follows the language chosen inside Awdah, not the phone's language. The native RTL flags are written by `lib/platform/direction.ts` (`allowRTL` and `forceRTL` both follow the in-app language); `expo-localization` is configured without `supportsRTL`, so it never overrides them. A direction change applies after a restart in release builds. On a real device (release or preview build), check these four combinations:

1. English phone, switch Awdah to Arabic: after the restart, the layout is right-to-left.
2. Arabic phone, switch Awdah to English: after the restart, the layout is left-to-right.
3. Switch Awdah to Urdu: after the restart, the layout is right-to-left with Urdu text.
4. Switch back to the phone's own language: after the restart, the layout matches it again.

## Building with EAS

You need a free Expo account (the owner must create one). No backend is required.

```
npm install -g eas-cli
eas login
eas build -p android
eas build -p ios
```

Store listing text lives in `store/<language>/`; screenshots are in `docs/screenshots/`.

## Hosting the privacy policy

The policy is `docs/privacy-policy.md`. To publish it for the stores:

1. On GitHub, open the repository Settings, then Pages.
2. Set the source to the `main` branch and the `/docs` folder.
3. The policy will be served at `https://<user>.github.io/<repo>/privacy-policy`.
4. Add that URL to `app.json` as `expo.extra.privacyPolicyUrl` and use it in the App Store and Google Play listings.

Contact: nafs.app.support@gmail.com
