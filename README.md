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
npm run build:web  # static web build (expo export --platform web) into dist/
npm run i18n:extract           # regenerate content/i18n/en.json from content/
node scripts/sync-locales.js   # copy new keys from locales/en.json into the other locales
node scripts/render-icons.mjs  # render the app icon, adaptive icon, splash and favicon PNGs
```

## Project structure

- `app/` - screens and routes (Expo Router)
- `components/` - UI components
- `theme/` - colors, fonts, spacing
- `lib/` - pure logic, store and i18n (with tests in `lib/__tests__/`)
- `content/` - journey days, duas, learn links, milestones, cities
- `locales/` - translation files (`en.json` is the source); `locales/native/` holds the localized app name (iOS + Android) and iOS location permission text; keep iOS keys under `ios` and Android string resources under `android` — top-level keys get written to both platforms and break Android release lint
- `store/` - app store listing text per language
- `docs/` - privacy policy, review checklists, screenshots

## Content sources and review

Religious content is sourced and checked as recorded in `docs/content-sources/`. Every content change should be reviewed against `docs/content-review-checklist.md`. Translations are listed for a native-speaking reviewer in [`docs/translation-review-checklist.md`](docs/translation-review-checklist.md).

## Testing RTL on device

The layout direction follows the language chosen inside Awdah, not the phone's language. The native RTL flags are written by `lib/platform/direction.ts` (`allowRTL` and `forceRTL` both follow the in-app language); `expo-localization` is configured without `supportsRTL`, so it never overrides them. A direction change applies after a restart in release builds. On a real device (release or preview build), check these four combinations:

1. English phone, switch Awdah to Arabic: after the restart, the layout is right-to-left.
2. Arabic phone, switch Awdah to English: after the restart, the layout is left-to-right.
3. Switch Awdah to Urdu: after the restart, the layout is right-to-left with Urdu text.
4. Switch back to the phone's own language: after the restart, the layout matches it again.

## Building with EAS

You need a free Expo account (the owner must create one). No backend is required.

```
npm i -g eas-cli
eas login
eas build:configure     # creates eas.json and links the project
eas build -p android    # Play Store build (AAB)
eas build -p ios        # App Store build (needs an Apple Developer account)
```

The Play feature graphic brief is `store/feature_graphic_brief.txt`. The iOS build is phone-only (`ios.supportsTablet: false`, so no iPad screenshots are needed); the owner can turn tablets back on in `app.json`.

Store listing text lives in `store/<language>/`; screenshots are in `docs/screenshots/`.

## Hosting the privacy policy

The policy is `docs/privacy-policy.md`. To publish it for the stores:

1. On GitHub, open the repository Settings, then Pages.
2. Set the source to the `main` branch and the `/docs` folder.
3. The policy will be served at `https://<user>.github.io/<repo>/privacy-policy`.
4. Add that URL to `app.json` as `expo.extra.privacyPolicyUrl` and use it in the App Store and Google Play listings.

## Support

Contact: nafs.app.support@gmail.com. To change the support address, update `expo.extra.supportEmail` in `app.json` and the address in `docs/privacy-policy.md`, `docs/content-review-checklist.md`, `docs/translation-review-checklist.md`, this README and the store listing contact fields. The app screens do not show an email address.
