# CLAUDE.md — Sort & Solve

## What This Project Is
A word-sorting puzzle game (React Native + Expo) where players find 4 hidden groups of 4 words from a grid of 16. One app with many themed IAP puzzle packs (music, movies, sports, general knowledge).

## Design Doc
Read `sort-and-solve-design-doc.md` BEFORE writing any code. It contains the complete spec: every screen, every component, all game logic, data models, monetization, and the recommended build order. Follow it closely.

## Tech Stack
- React Native + Expo (managed workflow, no ejecting)
- TypeScript (strict mode)
- expo-router (file-based routing)
- zustand (state management)
- AsyncStorage (persistence)
- react-native-reanimated (animations)
- react-native-google-mobile-ads (AdMob)
- react-native-purchases (RevenueCat)
- @react-native-firebase (analytics + crashlytics)

## Project Conventions

### Code Style
- TypeScript strict mode, no `any` types
- Functional components only, no class components
- Use named exports for components, default exports for screens
- Prefer `const` arrow functions for components
- Keep components under 200 lines — extract sub-components if larger

### File Naming
- Components: `PascalCase.tsx` (e.g. `WordTile.tsx`)
- Utilities: `camelCase.ts` (e.g. `puzzleLoader.ts`)
- Stores: `camelCaseStore.ts` (e.g. `gameStore.ts`)
- Types: defined alongside the code that uses them, or in a `types.ts` file if shared across 3+ files

### Styling
- Use `StyleSheet.create()` at the bottom of each component file
- Colors come from `constants/colors.ts` — never hardcode hex values in components
- Spacing comes from `constants/layout.ts`
- No inline styles except for dynamic values (e.g. `backgroundColor` based on state)

### State Management
- `gameStore` — current puzzle state (selection, lives, solved categories). Ephemeral, not persisted.
- `userStore` — user progress (completed puzzles, streaks, hints, preferences). Persisted to AsyncStorage.
- `purchaseStore` — IAP entitlements. Synced with RevenueCat.
- Components read from stores via hooks. Never mutate store state directly from components — call store actions.

### Config
- `config/appConfig.ts` holds all configurable values: pack definitions, ad unit IDs, IAP product IDs, app metadata
- Use test ad unit IDs during development (listed in the design doc)
- Never commit production ad IDs or API keys to the repo

### Data
- Puzzle data is bundled JSON in `data/puzzles/`
- Every puzzle must pass validation (see design doc Section 16 for rules)
- Generate puzzles with Claude using the prompt template in the design doc

## Build Order
Follow the 20-step build order in the design doc (Section "Implementation Notes for Claude Code"). Build and test each step before moving to the next. Get a playable game working (steps 1-6) before adding monetization or polish.

## Common Pitfalls
- Do NOT use `expo eject` or bare workflow — stay managed
- Do NOT persist game state — if the app is killed mid-puzzle, the puzzle restarts on reopen
- Do NOT show interstitial ads after sharing — only after "Next puzzle" tap
- Do NOT block gameplay if an ad fails to load — ads fail silently
- Do NOT grant IAP purchases without RevenueCat server confirmation
- Test on a real device, not just the simulator — especially for ads, IAP, and haptics
