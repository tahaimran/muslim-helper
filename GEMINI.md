
# Muslim Helper (Nafs) Project Context

## Project Overview
**Muslim Helper** (internally referred to as **Nafs**) is a mobile-first spiritual companion app designed to guide users through a 30-day Islamic transformation journey. It provides a local-first, serene experience for spiritual growth.

### Tech Stack
- **Framework:** [Expo](https://expo.dev/) (React Native) with [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing.
- **Language:** TypeScript.
- **Icons:** [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native).
- **Styling:** Custom "Minimalist Zen" theming system (`lib/theme.ts`) with Sage Green and organic shapes.
- **Persistence:** `AsyncStorage` (Local only).
- **Animations:** `react-native-reanimated`.

---

## Architecture & Directory Structure
- `app/`: Expo Router directory.
    - `(onboarding)/`: Initial local user profile setup.
    - `(tabs)/`: Main application navigation (Today, Worship, Journey, Growth, Presence).
    - `(modals)/`: Shared modal screens (Settings, About, etc.).
- `lib/`: Core business logic and utilities.
    - `storage.ts`: Centralized `appStorage` wrapper for state management and persistence.
    - `planGenerator.ts`: Logic for creating personalized 30-day spiritual plans.
    - `theme.ts` & `ThemeProvider.tsx`: Zen-inspired palette (Sage Green, Warm White).
    - `types.ts`: Centralized TypeScript interfaces.
- `constants/`: Static Islamic content.
- `hooks/`: Custom React hooks.

---

## Core Workflows

### State Management
The application is purely local.
- **Persistence:** All state changes are persisted via `appStorage`. No cloud sync or authentication required.
- **Initialization:** On app launch, `app/_layout.tsx` redirects to onboarding if no local profile exists.

### Daily Plan Generation
Personalized plans are generated locally upon completion of the onboarding flow.

### Theming
- Uses a "Minimalist Zen" aesthetic with soft colors, generous whitespace, and organic (rounded) UI elements.
- Always use the `useTheme` hook for color consistency.

---

## Key Commands
- `npm run dev`: Start the Expo development server.
- `npm run lint`: Run ESLint check.
- `npm run typecheck`: Run TypeScript compiler check.

---

## Development Conventions
1. **Local-First:** Never add cloud dependencies or auth requirements without explicit instruction.
2. **Zen Aesthetic:** Maintain the serene, minimal design. Avoid cluttered UI and high-contrast, aggressive colors.
3. **Type Safety:** Maintain strict TypeScript typing in `lib/types.ts`.
4. **Haptics & Motion:** Use subtle haptics and spring animations to enhance the "living" feel of the app.

