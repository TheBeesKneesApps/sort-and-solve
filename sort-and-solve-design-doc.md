# Sort & Solve — Word Sorting Puzzle Game
## Complete Technical Design Document

> **Purpose**: This document is a full implementation spec for Claude Code or any AI coding agent. It contains everything needed to build, test, and ship this app to both the Apple App Store and Google Play Store.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Content Strategy](#2-content-strategy-one-app-many-packs)
3. [Tech Stack & Dependencies](#3-tech-stack--dependencies)
4. [Project Structure](#4-project-structure)
5. [Data Models](#5-data-models)
6. [Screen Specifications](#6-screen-specifications)
7. [Game Logic](#7-game-logic)
8. [Navigation & Routing](#8-navigation--routing)
9. [Theming & Styling](#9-theming--styling)
10. [Monetization Integration](#10-monetization-integration)
11. [Analytics Events](#11-analytics-events)
12. [Push Notifications](#12-push-notifications)
13. [Share Functionality](#13-share-functionality)
14. [Sound Effects](#14-sound-effects)
15. [Storage & Persistence](#15-storage--persistence)
16. [Content Pipeline](#16-content-pipeline)
17. [App Store Assets & Metadata](#17-app-store-assets--metadata)
18. [Performance & Error Handling](#18-performance--error-handling)
19. [Testing Checklist](#19-testing-checklist)

---

## 1. Product Overview

### Concept
A word-sorting puzzle game where the player is shown 16 words and must find 4 hidden groups of 4 related words. Each group shares a common theme/category. The player taps words to select them, submits a group of 4, and either reveals a correct category or loses a life. 4 incorrect guesses = game over.

### Target Audience
Adults 18-45 who enjoy casual word puzzles. Players of NYT Connections, Wordle, crossword puzzles.

### Core Loop
1. Player sees 16 words in a 4×4 grid
2. Player taps 4 words they think belong together
3. Player taps "Submit"
4. If correct → category reveals and locks at top with color and label
5. If incorrect → lose one life, words shake, show "X of 4 matched" hint
6. Repeat until all 4 categories found (win) or 4 wrong guesses (lose)
7. Win/lose screen → share result → next puzzle or buy more

### Monetization
- Banner ads on home and game screens (AdMob)
- Interstitial ads between puzzles (AdMob)
- Rewarded video ads on lose screen for retry (AdMob)
- Remove Ads IAP — $2.99 one-time (RevenueCat)
- Hint Pack IAP — 10 hints for $2.99, 25 hints for $4.99 (RevenueCat)
- Level Pack IAPs — themed packs of 40 puzzles, $1.99 each (RevenueCat)
- Unlock All Packs IAP — $4.99 one-time (RevenueCat)

### Platforms
- iOS (App Store) — minimum iOS 15.1
- Android (Google Play) — minimum API 24 (Android 7.0)

---

## 2. Content Strategy: One App, Many Packs

### Why One App

Apple's Guideline 4.3(a) explicitly prohibits creating multiple Bundle IDs of the same app with only the content changed. Reskinned apps get flagged as spam and can lead to removal from the Developer Program. Instead, all themed content (music, movies, sports, general knowledge) lives inside a single app as purchasable packs. This is what Apple recommends and it's actually better for business: one app accumulates all your ratings, reviews, downloads, and search ranking in one place instead of splitting them across four thin apps.

### Content Architecture

Sort & Solve ships with one free pack (50 puzzles of mixed general topics) and a daily puzzle. All other content is organized into themed packs sold as IAPs. Packs are grouped into categories on the packs screen for easy browsing.

**Pack Categories & Packs:**

| Category | Pack Name | Puzzles | Price | Content |
|----------|-----------|---------|-------|---------|
| **Free** | Mixed Topics | 50 | Free | Broad mix of science, culture, food, geography, etc. |
| **General** | Pop Culture | 40 | $1.99 | Movies, music, TV, celebrities |
| **General** | Science & Nature | 40 | $1.99 | Biology, chemistry, animals, space |
| **General** | Food & Drink | 40 | $1.99 | Cuisine, ingredients, restaurants, drinks |
| **General** | Geography | 40 | $1.99 | Countries, cities, landmarks, maps |
| **General** | Tricky Mix | 40 | $2.99 | Hard puzzles with misleading words |
| **Music** | Rap & Hip Hop | 40 | $1.99 | Artists, albums, lyrics, producers |
| **Music** | Rock | 40 | $1.99 | Bands, songs, guitar legends, festivals |
| **Music** | Country | 40 | $1.99 | Nashville icons, modern country, classics |
| **Music** | 80s Music | 40 | $1.99 | Synth pop, hair metal, new wave, MTV |
| **Music** | 90s Music | 40 | $1.99 | Grunge, boy bands, one-hit wonders |
| **Movies** | Action & Sci-Fi | 40 | $1.99 | Blockbusters, franchises, directors, actors |
| **Movies** | Horror & Thriller | 40 | $1.99 | Slashers, monsters, suspense, jump scares |
| **Movies** | Comedy | 40 | $1.99 | Comedians, sitcoms, stand-up, rom-coms |
| **Movies** | 90s Movies | 40 | $1.99 | Cult classics, blockbusters, quotes, actors |
| **Sports** | NFL | 40 | $1.99 | Teams, players, history, stadiums |
| **Sports** | NBA | 40 | $1.99 | Teams, legends, records, draft picks |
| **Sports** | Soccer | 40 | $1.99 | Clubs, World Cup, players, leagues |
| **Sports** | Olympics | 40 | $1.99 | Events, athletes, host cities, records |

That's 50 free + 720 paid puzzles across 18 packs at launch. Each pack is generated with Claude and can be added via OTA updates without app store review.

### Bundle IAPs

In addition to individual packs, offer category bundles and a master unlock:

| Bundle | Includes | Price | Discount vs Individual |
|--------|----------|-------|----------------------|
| General Bundle | All 5 general packs | $5.99 | ~40% off |
| Music Bundle | All 5 music packs | $5.99 | ~40% off |
| Movies Bundle | All 4 movie packs | $4.99 | ~38% off |
| Sports Bundle | All 4 sports packs | $4.99 | ~38% off |
| **Unlock Everything** | **All packs, current + future** | **$14.99** | **~58% off** |

Bundles drive higher average revenue per user because the discount makes them feel like a deal. The "Unlock Everything" option is your whale capture — a small percentage of users will buy it and it's your highest single-transaction revenue.

### Adding New Packs Over Time

New puzzle packs can be added with zero code changes:
1. Generate 40 puzzles with Claude using the content pipeline prompt
2. Validate with the validation script
3. Add the JSON file to `data/puzzles/`
4. Add the pack definition to the `packs` array in config
5. Create the IAP product in RevenueCat
6. Push via `expo publish` (OTA update — no app store review needed)

This means you can ship a new pack every week or two indefinitely. Announce new packs in the daily puzzle notification: "New pack available: Classic Rock! 🎸"

### Future Expansion: Second Game

When you want a second App Store listing for more keyword coverage, build a **mechanically different game** — not a reskin. Ideas that are safe from 4.3:

- **5-Clue Word Guess** (PinPoints model) — progressive clue reveal, totally different UI and gameplay
- **Word Chain Links** — connect words in sequence where each shares an association, different mechanic
- **Trivia Blitz** — multiple choice timed trivia, different genre entirely

These are legitimately different apps with different gameplay, different screens, and different user experiences. Apple has no issue with the same developer publishing a word sorting game AND a trivia game — that's just having a portfolio.

### How the Packs Screen Is Organized

The packs screen groups packs by category with collapsible sections:

```
[Daily Puzzle — March 17, 2026]              ← always at top

FREE
  Mixed Topics (23/50 completed)             ← progress bar

GENERAL                           [Bundle $5.99]
  Pop Culture (40 puzzles)            [$1.99]
  Science & Nature (40 puzzles)       [$1.99]
  Food & Drink (40 puzzles)           [$1.99]
  Geography (40 puzzles)              [$1.99]
  Tricky Mix (40 puzzles)             [$2.99]

MUSIC                             [Bundle $5.99]
  Rap & Hip Hop (40 puzzles)          [$1.99]
  Rock (40 puzzles)                   [$1.99]
  Country (40 puzzles)                [$1.99]
  80s Music (40 puzzles)              [$1.99]
  90s Music (40 puzzles)              [$1.99]

MOVIES                            [Bundle $4.99]
  Action & Sci-Fi (40 puzzles)        [$1.99]
  Horror & Thriller (40 puzzles)      [$1.99]
  Comedy (40 puzzles)                 [$1.99]
  90s Movies (40 puzzles)             [$1.99]

SPORTS                            [Bundle $4.99]
  NFL (40 puzzles)                    [$1.99]
  NBA (40 puzzles)                    [$1.99]
  Soccer (40 puzzles)                 [$1.99]
  Olympics (40 puzzles)               [$1.99]

[🔓 Unlock Everything — $14.99]              ← sticky at bottom
```

Purchased packs show a progress bar and "Play" button instead of a price. The bundle button disappears if all packs in that category are owned.

---

## 3. Tech Stack & Dependencies

### Framework
- **React Native** via **Expo** (managed workflow)
- **Expo SDK 52+** (latest stable)
- **TypeScript** — strict mode enabled

### Navigation
- `expo-router` (file-based routing)

### State Management
- `zustand` — lightweight global state for game state, user preferences, and purchase status
- `AsyncStorage` via `@react-native-async-storage/async-storage` — persistence layer

### Ads
- `react-native-google-mobile-ads` — banner, interstitial, rewarded video
- AdMob account required. Use test ad unit IDs during development:
  - Banner: `ca-app-pub-3940256099942544/6300978111`
  - Interstitial: `ca-app-pub-3940256099942544/1033173712`
  - Rewarded: `ca-app-pub-3940256099942544/5224354917`

### In-App Purchases
- `react-native-purchases` (RevenueCat SDK)
- RevenueCat project required with entitlements:
  - `remove_ads` — non-consumable
  - `hint_pack_10` — consumable
  - `hint_pack_25` — consumable
  - `pack_pop_culture` — non-consumable
  - `pack_science` — non-consumable
  - `pack_food` — non-consumable
  - `pack_geography` — non-consumable
  - `pack_tricky` — non-consumable
  - `pack_rap` — non-consumable
  - `pack_rock` — non-consumable
  - `pack_country` — non-consumable
  - `pack_80s_music` — non-consumable
  - `pack_90s_music` — non-consumable
  - `pack_action_scifi` — non-consumable
  - `pack_horror` — non-consumable
  - `pack_comedy` — non-consumable
  - `pack_90s_movies` — non-consumable
  - `pack_nfl` — non-consumable
  - `pack_nba` — non-consumable
  - `pack_soccer` — non-consumable
  - `pack_olympics` — non-consumable
  - `bundle_general` — non-consumable (unlocks all 5 general packs)
  - `bundle_music` — non-consumable (unlocks all 5 music packs)
  - `bundle_movies` — non-consumable (unlocks all 4 movie packs)
  - `bundle_sports` — non-consumable (unlocks all 4 sports packs)
  - `unlock_everything` — non-consumable (unlocks all packs, current + future)

### Analytics
- `@react-native-firebase/app`
- `@react-native-firebase/analytics`
- `@react-native-firebase/crashlytics`

### Notifications
- `expo-notifications` — daily puzzle reminder

### Haptics
- `expo-haptics` — tactile feedback on correct/incorrect guesses

### Animations
- `react-native-reanimated` — smooth category reveal animations
- `react-native-gesture-handler` — tap handling

### Image Generation (for sharing)
- `react-native-view-shot` — capture result card as image
- `expo-sharing` — native share sheet

### Audio
- `expo-av` — short sound effects

### Additional
- `expo-font` — custom fonts if needed
- `expo-splash-screen` — splash screen control
- `expo-constants` — environment config
- `date-fns` — date formatting for daily puzzles

---

## 3. Project Structure

```
sort-and-solve/
├── app/                          # expo-router pages
│   ├── _layout.tsx               # root layout with navigation container
│   ├── index.tsx                 # home screen
│   ├── game/
│   │   ├── [puzzleId].tsx        # gameplay screen (dynamic route)
│   │   └── daily.tsx             # daily puzzle (redirects to game with today's puzzle)
│   ├── packs.tsx                 # level packs store screen
│   ├── settings.tsx              # settings screen
│   └── more-apps.tsx             # cross-promotion screen
├── components/
│   ├── game/
│   │   ├── WordGrid.tsx          # 4x4 grid of tappable word tiles
│   │   ├── WordTile.tsx          # individual word tile (handles selection state)
│   │   ├── SolvedCategory.tsx    # revealed category bar (locked at top)
│   │   ├── LivesIndicator.tsx    # remaining lives display (dots)
│   │   ├── GameControls.tsx      # Shuffle / Deselect / Submit buttons
│   │   ├── HintButton.tsx        # hint trigger with remaining count
│   │   ├── WinScreen.tsx         # puzzle complete overlay
│   │   ├── LoseScreen.tsx        # game over overlay with retry option
│   │   └── ResultCard.tsx        # shareable result image layout
│   ├── home/
│   │   ├── DailyPuzzleCard.tsx   # today's puzzle CTA
│   │   ├── FreePuzzlesCard.tsx   # free puzzles progress
│   │   └── PacksCard.tsx         # level packs upsell
│   ├── ads/
│   │   ├── BannerAd.tsx          # banner ad wrapper (respects remove_ads)
│   │   ├── InterstitialAd.tsx    # interstitial controller
│   │   └── RewardedAd.tsx        # rewarded video controller
│   ├── packs/
│   │   ├── PackCard.tsx          # individual pack listing
│   │   └── UnlockAllBanner.tsx   # unlock-all upsell
│   └── common/
│       ├── Button.tsx            # reusable button component
│       ├── Header.tsx            # screen header with back button
│       └── MoreAppsLink.tsx      # cross-promotion link row
├── stores/
│   ├── gameStore.ts              # zustand store: current puzzle state, selection, lives
│   ├── userStore.ts              # zustand store: hints, streaks, completed puzzles, preferences
│   └── purchaseStore.ts          # zustand store: purchase status, entitlements
├── config/
│   └── appConfig.ts              # Central config: pack definitions, ad IDs, IAP IDs, etc.
├── data/
│   ├── puzzles/
│   │   ├── free.json             # 50 free mixed-topic puzzles
│   │   ├── daily.json            # 365 daily puzzles
│   │   ├── pop-culture.json      # General packs
│   │   ├── science.json
│   │   ├── food.json
│   │   ├── geography.json
│   │   ├── tricky.json
│   │   ├── rap.json              # Music packs
│   │   ├── rock.json
│   │   ├── country.json
│   │   ├── 80s-music.json
│   │   ├── 90s-music.json
│   │   ├── action-scifi.json     # Movie packs
│   │   ├── horror.json
│   │   ├── comedy.json
│   │   ├── 90s-movies.json
│   │   ├── nfl.json              # Sports packs
│   │   ├── nba.json
│   │   ├── soccer.json
│   │   └── olympics.json
│   └── more-apps.json            # Cross-promotion data for your other apps
├── utils/
│   ├── puzzleLoader.ts           # loads and validates puzzle data
│   ├── dailyPuzzle.ts            # determines today's puzzle by date
│   ├── shuffle.ts                # Fisher-Yates shuffle for word grid
│   ├── analytics.ts              # analytics event helpers
│   ├── sharing.ts                # result image generation and share
│   ├── sounds.ts                 # sound effect player
│   └── haptics.ts                # haptic feedback helpers
├── hooks/
│   ├── useGame.ts                # game logic hook (orchestrates gameStore)
│   ├── usePurchases.ts           # RevenueCat hook
│   ├── useAds.ts                 # ad loading/showing hook
│   └── useDailyPuzzle.ts         # daily puzzle date logic
├── constants/
│   ├── colors.ts                 # color palette
│   ├── layout.ts                 # spacing, sizing constants
│   ├── adUnits.ts                # AdMob unit IDs (test + production)
│   └── iap.ts                    # RevenueCat product IDs
├── assets/
│   ├── sounds/
│   │   ├── correct.mp3           # category solved sound
│   │   ├── incorrect.mp3         # wrong guess sound
│   │   ├── win.mp3               # puzzle complete sound
│   │   ├── tap.mp3               # tile tap sound
│   │   └── shuffle.mp3           # shuffle sound
│   ├── fonts/                    # custom fonts if used
│   └── images/
│       ├── icon.png              # 1024x1024 app icon
│       ├── splash.png            # splash screen
│       └── adaptive-icon.png     # Android adaptive icon
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── tsconfig.json
└── package.json
```

---

## 4. Data Models

### Puzzle Format (JSON)

Each puzzle is a JSON object. All puzzle files contain an array of these objects.

```typescript
interface PuzzleCategory {
  label: string;         // category name shown after solving, e.g. "Shades of red"
  words: [string, string, string, string];  // exactly 4 words, ALL CAPS
  difficulty: 1 | 2 | 3 | 4;  // 1 = easiest (most obvious), 4 = hardest (trickiest)
}

interface Puzzle {
  id: string;            // unique ID, e.g. "free_001", "daily_2026-03-17", "pop_012"
  categories: [PuzzleCategory, PuzzleCategory, PuzzleCategory, PuzzleCategory]; // exactly 4
  trapWords: string[];   // words that plausibly belong to 2+ categories (minimum 4)
  falseGroups: string[]; // descriptions of misleading patterns (for QA, not shown to player)
}
```

**Example puzzle (well-designed with trap words):**
```json
{
  "id": "free_001",
  "categories": [
    {
      "label": "Candy bars",
      "words": ["MARS", "SNICKERS", "TWIX", "BOUNTY"],
      "difficulty": 1
    },
    {
      "label": "Golf terms",
      "words": ["DRIVER", "EAGLE", "BIRDIE", "PUTTER"],
      "difficulty": 2
    },
    {
      "label": "Things you hit",
      "words": ["DRUM", "IRON", "BASS", "CLUB"],
      "difficulty": 3
    },
    {
      "label": "___ wood(s)",
      "words": ["TIGER", "DRIFT", "ROBIN", "WEDGE"],
      "difficulty": 4
    }
  ],
  "trapWords": ["MARS", "EAGLE", "BIRDIE", "BASS", "IRON", "CLUB", "DRIVER", "TIGER", "ROBIN", "WEDGE"],
  "falseGroups": [
    "Birds: ROBIN, EAGLE, BIRDIE — but EAGLE and BIRDIE are golf terms",
    "Golf: DRIVER, EAGLE, IRON, CLUB, WEDGE, PUTTER — 6 words look like golf, only 4 are real",
    "Animals: TIGER, ROBIN, EAGLE, BASS — scattered across all 4 categories"
  ]
}
```

**Why this puzzle works:**
- 10 of 16 words are trap words with double meanings
- The player sees "birds" (ROBIN, EAGLE, BIRDIE) but 2 are golf terms
- The player sees "golf" (DRIVER, EAGLE, IRON, CLUB, WEDGE, PUTTER) — 6 candidates for 4 slots
- Difficulty 4 ("___ wood(s)") is only solvable by elimination — the theme is hidden
- MARS is the easiest trap to resolve (candy bar category is the most obvious group)

**Validation rules for puzzle data:**
- Every puzzle must have exactly 4 categories
- Every category must have exactly 4 words
- All 16 words in a puzzle must be unique (case-insensitive)
- No word should appear in more than one category within a puzzle
- Words should be 3-12 characters, ALL CAPS, letters only (no spaces, hyphens, or numbers)
- Difficulty 1-4 maps to category reveal colors (see theming section)

### Game State

```typescript
interface GameState {
  puzzleId: string;
  allWords: string[];              // shuffled array of all 16 words
  selectedWords: string[];         // currently tapped words (0-4)
  solvedCategories: PuzzleCategory[]; // categories solved so far (0-4)
  remainingLives: number;          // starts at 4, decremented on wrong guess
  previousGuesses: string[][];     // history of incorrect guesses (for preventing duplicates)
  gameStatus: 'playing' | 'won' | 'lost';
  hintsUsed: number;               // hints used this puzzle
  startTime: number;               // timestamp when puzzle started
  endTime: number | null;          // timestamp when puzzle ended
}
```

### User State (Persisted)

```typescript
interface UserState {
  // Progress
  completedPuzzles: string[];       // array of puzzle IDs completed
  currentStreak: number;            // consecutive days with a completed daily puzzle
  longestStreak: number;
  lastDailyDate: string | null;     // ISO date string "2026-03-17"
  totalPuzzlesSolved: number;
  totalPuzzlesFailed: number;

  // Hints
  hintsRemaining: number;           // starts at 5 free hints

  // Preferences
  soundEnabled: boolean;            // default: true
  hapticEnabled: boolean;           // default: true
  notificationsEnabled: boolean;    // default: false (ask after 3rd puzzle)

  // Purchases
  adsRemoved: boolean;
  unlockedPacks: string[];          // array of pack IDs purchased, or ["all"] for unlock-all
}
```

---

## 5. Screen Specifications

### 5.1 Home Screen (`app/index.tsx`)

**Layout (top to bottom):**

1. **App title** — "Sort & Solve" centered, large bold text (28px), with subtitle "Find the 4 hidden groups" in muted text (14px)

2. **Daily Puzzle Card** — prominent blue-tinted card
   - Title: "Daily puzzle"
   - Subtitle: today's date formatted as "March 17, 2026"
   - If already completed today: show checkmark and "Completed ✓" in green
   - If not completed: show as primary CTA
   - Tapping navigates to `game/daily`

3. **Free Puzzles Card** — neutral card
   - Title: "Free puzzles"
   - Subtitle: "X / 50 completed" with a subtle progress indicator
   - Tapping navigates to the next unsolved free puzzle

4. **Level Packs Card** — neutral card
   - Title: "Level packs"
   - Subtitle: "X packs available"
   - Tapping navigates to `packs`

5. **Stats Row** — small horizontal stat display
   - Current streak (flame icon + number)
   - Total solved (checkmark icon + number)
   - Best streak (trophy icon + number)

6. **Footer links** — "Settings" and "More Apps" as tappable text links

7. **Banner Ad** — pinned to bottom of screen, 320x50 banner. Hidden if ads removed.

**Behavior:**
- On first launch ever, show a brief 2-screen onboarding explaining the rules (tap to select 4 words, find the groups, you have 4 lives). Dismiss with a "Got it" button. Set a flag so this only shows once.
- After completing 3 puzzles, if notifications are not enabled, show a single prompt: "Want a daily puzzle reminder?" with Accept/No thanks buttons. Only ask once.

---

### 5.2 Gameplay Screen (`app/game/[puzzleId].tsx`)

This is the core screen. It must feel responsive and smooth.

**Layout (top to bottom):**

1. **Header Row**
   - Back arrow (left) — returns to home. If game is in progress, show "Quit puzzle?" confirmation alert
   - Puzzle label (center) — "Daily Puzzle", "Free #24", or "Pop Culture #7"
   - Hint button (right) — shows remaining hint count, e.g. "💡 3"

2. **Solved Categories Area** (top, grows downward as categories are solved)
   - Each solved category renders as a colored bar (full width, rounded corners, 56px tall)
   - Category label in white bold text (13px uppercase tracking)
   - Words listed in white regular text below the label (12px)
   - Colors assigned by difficulty: difficulty 1 = purple (#7F77DD), 2 = teal (#1D9E75), 3 = coral (#D85A30), 4 = blue (#378ADD)
   - Animation: when a category is solved, the 4 selected tiles should animate upward and merge into the colored bar. Use `react-native-reanimated` for a smooth 400ms slide-up + fade-in.

3. **Word Grid**
   - 4 columns × N rows (N decreases as categories are solved: starts at 4 rows, then 3, 2, 1)
   - Each tile: rounded rectangle, 8px border-radius, centered text
   - **Unselected state**: light gray background (#F1F5F9), dark text (#1E293B)
   - **Selected state**: blue background (#2563EB), white text
   - Tile size: equal width filling the screen with 8px gaps between tiles. Height = 48px.
   - Text should auto-size to fit: start at 14px bold, scale down to 10px for longer words. Use `adjustsFontSizeToFit` and `numberOfLines={1}`.
   - Tap behavior: toggle selection. If already selected, deselect. If selecting a 5th word, do nothing (max 4 selected at a time). Play tap sound and light haptic on each tap.

4. **Lives Indicator**
   - Row of 4 dots below the grid
   - Filled dot = remaining life (red #E24B4A), empty dot = lost life (light gray #E2E8F0)
   - Text below: "X lives left" or "X mistakes remaining"

5. **Action Buttons Row**
   - **Shuffle** (left) — shuffles remaining unsolved words in the grid. Always enabled. Plays shuffle sound.
   - **Deselect All** (center) — clears current selection. Disabled if nothing selected.
   - **Submit** (right, primary style) — submits current selection. Disabled unless exactly 4 words selected. Primary blue background when active, gray when disabled.

6. **Banner Ad** — pinned to bottom, below the buttons. Hidden if ads removed.

**Gameplay Behavior — Submit Logic:**

When the player taps Submit with 4 words selected:

1. Check if this exact combination of 4 words (order-independent) has been guessed before. If yes, show a brief toast: "Already guessed!" and do nothing.

2. Check if the 4 selected words match any unsolved category (order-independent match).

3. **If correct:**
   - Play correct sound + success haptic
   - Animate the 4 tiles up into a new solved category bar
   - Remove those 4 words from the grid
   - Add category to `solvedCategories`
   - If all 4 categories solved → transition to Win Screen

4. **If incorrect:**
   - Play incorrect sound + error haptic
   - Shake the selected tiles (horizontal oscillation, 300ms)
   - Check how many of the 4 selected words belong to the same category. Show toast: "X of 4 in the same group" (this is the "closeness" hint)
   - Decrement lives
   - Add this guess to `previousGuesses`
   - Deselect all words
   - If lives reach 0 → transition to Lose Screen (reveal all categories)

**Hint Behavior:**

When the player taps the Hint button:
1. If `hintsRemaining` > 0:
   - Pick one random unsolved word from the hardest unsolved category
   - Briefly highlight that word's tile (golden glow, 1.5 seconds) and show which category it belongs to in a small tooltip
   - Decrement `hintsRemaining`
   - Log analytics event
2. If `hintsRemaining` === 0:
   - Show a modal: "Out of hints! Get more?" with options to buy 10 ($2.99) or 25 ($4.99), plus a "Watch ad for 1 free hint" rewarded video option
   - If purchase succeeds, increment `hintsRemaining` by purchased amount
   - If rewarded video completes, increment `hintsRemaining` by 1

---

### 5.3 Win Screen (`WinScreen.tsx` — overlay on game screen)

Displayed as a full-screen overlay/modal after the 4th category is solved.

**Layout:**
1. **Title**: "Solved!" (24px bold)
2. **Subtitle**: "Puzzle #X complete" (14px muted)
3. **All 4 solved category bars** — same colored bars as during gameplay, stacked vertically
4. **Stats row**:
   - Time taken (formatted as M:SS)
   - Mistakes: X/4
   - Hints used: X
5. **Streak display**: "🔥 Streak: X days" (only for daily puzzles)
6. **Action buttons**:
   - **"Share result"** (primary, blue) — generates and shares result image
   - **"Next puzzle"** (secondary, outlined) — loads next puzzle in current pack, or goes home if pack complete
7. **Play win sound on mount**

**Between-puzzle interstitial:**
After tapping "Next puzzle", show an interstitial ad (if ads not removed) before loading the next puzzle. Do NOT show an interstitial after sharing.

---

### 5.4 Lose Screen (`LoseScreen.tsx` — overlay on game screen)

Displayed when the player runs out of lives (4 incorrect guesses).

**Layout:**
1. **Title**: "So close!" (24px bold)
2. **Subtitle**: "You found X of 4 groups" (14px muted)
3. **All 4 category bars** — solved ones in their earned colors, unsolved ones in muted gray with the correct words shown
4. **Retry option**: "Watch ad to retry" button (amber/warning styled). Shows a rewarded video ad. If completed, reset lives to 4 and resume the puzzle with solved categories intact.
5. **Action buttons**:
   - **"Share result"** (primary) — share even a partial result
   - **"Next puzzle"** (secondary)

---

### 5.5 Level Packs Screen (`app/packs.tsx`)

**Layout:**
1. **Header**: "Level Packs" with back button
2. **Unlock All Banner** — prominent card at top: "Unlock all packs — $4.99" (shown only if not already purchased)
3. **Pack list** — vertical scrollable list of pack cards:

Each pack card shows:
- Pack name (e.g. "Pop Culture")
- Puzzle count: "40 puzzles"
- Progress: "X / 40 completed" (if owned)
- Price button: "$1.99" (if not owned) or "Owned ✓" (if owned) or "Play" (if owned with unsolved puzzles)
- Tapping the price triggers a RevenueCat purchase flow
- Tapping "Play" navigates to the next unsolved puzzle in that pack

**Pack definitions are loaded from `config/appConfig.ts`.** The full list of packs with prices is in Section 2 (Content Strategy). 

**Layout:** The packs screen groups packs by category (General, Music, Movies, Sports) with collapsible sections. See the wireframe in Section 2 for the exact layout. Key elements:

- Each category section has a header with the category name and a "Bundle" purchase button
- Each pack row shows: name, puzzle count, progress (if owned), and price or "Play" button
- "Unlock Everything — $14.99" is pinned at the bottom of the scroll view
- Purchased packs show progress bar and "Play" button instead of price
- Bundle button disappears when all packs in that category are owned
- Tapping "Play" navigates to the next unsolved puzzle in that pack
- Tapping a price triggers the RevenueCat purchase flow

---

### 5.6 Settings Screen (`app/settings.tsx`)

**Layout — list of settings rows:**

| Setting | Type | Default |
|---------|------|---------|
| Remove Ads | Purchase button ($2.99) or "Purchased ✓" | Not purchased |
| Sound Effects | Toggle switch | On |
| Haptic Feedback | Toggle switch | On |
| Daily Reminder | Toggle switch (requests notification permission) | Off |
| Reminder Time | Time picker (only shown if reminder enabled) | 9:00 AM |
| Rate This App | Link → opens App Store / Play Store rating page | — |
| Privacy Policy | Link → opens privacy policy URL in browser | — |
| Terms of Service | Link → opens ToS URL in browser | — |
| Contact Us | Link → opens email compose to support email | — |
| Restore Purchases | Button → calls RevenueCat restorePurchases() | — |
| App Version | Display text (non-interactive) | — |

Below settings, show a **"More Apps"** section — see 5.7.

---

### 5.7 More Apps Screen (`app/more-apps.tsx`)

A simple cross-promotion screen. Data loaded from `data/more-apps.json`.

Each app entry shows:
- App icon placeholder (colored square, 48x48, rounded corners)
- App name
- Short tagline
- "Get" button → deep links to App Store / Play Store listing

Update this file via OTA whenever you ship a new app (Spotted, Is It Worth It, Rate My Fridge, Red Flag, future games, etc.).

---

## 6. Game Logic

### Initialization

```typescript
function initializeGame(puzzle: Puzzle): GameState {
  // Flatten all 16 words from 4 categories
  const allWords = puzzle.categories.flatMap(cat => cat.words);

  // Shuffle using Fisher-Yates
  const shuffled = fisherYatesShuffle([...allWords]);

  return {
    puzzleId: puzzle.id,
    allWords: shuffled,
    selectedWords: [],
    solvedCategories: [],
    remainingLives: 4,
    previousGuesses: [],
    gameStatus: 'playing',
    hintsUsed: 0,
    startTime: Date.now(),
    endTime: null,
  };
}
```

### Selection Logic

```typescript
function toggleWordSelection(word: string, state: GameState): GameState {
  const { selectedWords } = state;

  if (selectedWords.includes(word)) {
    // Deselect
    return { ...state, selectedWords: selectedWords.filter(w => w !== word) };
  }

  if (selectedWords.length >= 4) {
    // Already have 4 selected, do nothing
    return state;
  }

  // Select
  return { ...state, selectedWords: [...selectedWords, word] };
}
```

### Submit Logic

```typescript
function submitGuess(state: GameState, puzzle: Puzzle): {
  newState: GameState;
  result: 'correct' | 'incorrect' | 'already_guessed';
  matchedCategory?: PuzzleCategory;
  closestMatch?: number; // how many of the 4 words belong to the same category
} {
  const { selectedWords, solvedCategories, previousGuesses, remainingLives } = state;

  // Exactly 4 must be selected
  if (selectedWords.length !== 4) return { newState: state, result: 'incorrect' };

  // Check for duplicate guess
  const sortedGuess = [...selectedWords].sort();
  const isDuplicate = previousGuesses.some(prev => {
    const sortedPrev = [...prev].sort();
    return sortedPrev.every((w, i) => w === sortedGuess[i]);
  });
  if (isDuplicate) return { newState: state, result: 'already_guessed' };

  // Check against unsolved categories
  const solvedLabels = solvedCategories.map(c => c.label);
  const unsolvedCategories = puzzle.categories.filter(c => !solvedLabels.includes(c.label));

  for (const category of unsolvedCategories) {
    const categoryWords = new Set(category.words);
    if (selectedWords.every(w => categoryWords.has(w))) {
      // CORRECT MATCH
      const newSolved = [...solvedCategories, category];
      const newStatus = newSolved.length === 4 ? 'won' : 'playing';
      return {
        newState: {
          ...state,
          selectedWords: [],
          solvedCategories: newSolved,
          allWords: state.allWords.filter(w => !categoryWords.has(w)),
          gameStatus: newStatus,
          endTime: newStatus === 'won' ? Date.now() : null,
        },
        result: 'correct',
        matchedCategory: category,
      };
    }
  }

  // INCORRECT — find closest match (most words from the same category)
  let closestMatch = 0;
  for (const category of unsolvedCategories) {
    const matchCount = selectedWords.filter(w => category.words.includes(w)).length;
    closestMatch = Math.max(closestMatch, matchCount);
  }

  const newLives = remainingLives - 1;
  const newStatus = newLives === 0 ? 'lost' : 'playing';

  return {
    newState: {
      ...state,
      selectedWords: [],
      remainingLives: newLives,
      previousGuesses: [...previousGuesses, selectedWords],
      gameStatus: newStatus,
      endTime: newStatus === 'lost' ? Date.now() : null,
    },
    result: 'incorrect',
    closestMatch,
  };
}
```

### Shuffle Logic

```typescript
function shuffleRemainingWords(state: GameState): GameState {
  const solvedWords = new Set(state.solvedCategories.flatMap(c => c.words));
  const remaining = state.allWords.filter(w => !solvedWords.has(w));
  const shuffled = fisherYatesShuffle([...remaining]);
  return { ...state, allWords: shuffled, selectedWords: [] };
}
```

### Hint Logic

```typescript
function useHint(state: GameState, puzzle: Puzzle, userState: UserState): {
  word: string;
  categoryLabel: string;
} | null {
  if (userState.hintsRemaining <= 0) return null;

  const solvedLabels = state.solvedCategories.map(c => c.label);
  const unsolved = puzzle.categories
    .filter(c => !solvedLabels.includes(c.label))
    .sort((a, b) => b.difficulty - a.difficulty); // hardest first

  if (unsolved.length === 0) return null;

  const hardest = unsolved[0];
  const remainingWords = hardest.words.filter(w => state.allWords.includes(w));

  if (remainingWords.length === 0) return null;

  const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];

  return { word: randomWord, categoryLabel: hardest.label };
}
```

### Daily Puzzle Logic

```typescript
function getDailyPuzzleIndex(): number {
  // Deterministic: same puzzle for everyone on the same day
  const epoch = new Date('2026-03-01'); // app launch date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays % DAILY_PUZZLES_COUNT; // wraps around after exhausting all daily puzzles
}

function getDailyPuzzleId(): string {
  const today = new Date().toISOString().split('T')[0]; // "2026-03-17"
  return `daily_${today}`;
}
```

### Streak Logic

```typescript
function updateStreak(userState: UserState): UserState {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (userState.lastDailyDate === today) {
    // Already played today, no change
    return userState;
  }

  if (userState.lastDailyDate === yesterday) {
    // Consecutive day
    const newStreak = userState.currentStreak + 1;
    return {
      ...userState,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, userState.longestStreak),
      lastDailyDate: today,
    };
  }

  // Streak broken
  return {
    ...userState,
    currentStreak: 1,
    lastDailyDate: today,
  };
}
```

---

## 7. Navigation & Routing

Using `expo-router` file-based routing:

| Route | Screen | Notes |
|-------|--------|-------|
| `/` | Home | Default screen |
| `/game/daily` | Daily Puzzle | Resolves today's puzzle ID, redirects to `/game/[puzzleId]` |
| `/game/[puzzleId]` | Gameplay | Dynamic route, loads puzzle by ID |
| `/packs` | Level Packs | IAP store |
| `/settings` | Settings | Preferences + IAP |
| `/more-apps` | Cross-promotion | Links to other apps |

**Back navigation**: hardware back button and swipe-back gesture should work on all screens. On the game screen, intercept back navigation to show a "Quit puzzle?" confirmation if the game is in progress.

---

## 8. Theming & Styling

### Color Palette

```typescript
// constants/colors.ts

export const colors = {
  // Backgrounds
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceHover: '#F1F5F9',

  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Interactive
  primary: '#2563EB',       // blue — buttons, links, selected tiles
  primaryLight: '#EFF6FF',  // blue tint — card highlights

  // Category colors (assigned by difficulty)
  category1: '#7F77DD',     // purple — easiest
  category2: '#1D9E75',     // teal
  category3: '#D85A30',     // coral
  category4: '#378ADD',     // blue — hardest

  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  errorLight: '#FEE2E2',

  // Lives
  lifeActive: '#E24B4A',
  lifeEmpty: '#E2E8F0',

  // Borders
  border: '#E2E8F0',

  // Tile states
  tileDefault: '#F1F5F9',
  tileSelected: '#2563EB',
  tileHint: '#F59E0B',     // golden glow for hinted words

  // Ads
  adBackground: '#F8FAFC',
};
```

### Typography

Use the system font (no custom font needed for v1):
```typescript
export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const },
  heading: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyBold: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
  tileText: { fontSize: 14, fontWeight: '600' as const },
  categoryLabel: { fontSize: 13, fontWeight: '700' as const, textTransform: 'uppercase', letterSpacing: 0.5 },
  categoryWords: { fontSize: 12, fontWeight: '400' as const },
};
```

### Spacing

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
```

### Layout Constants

```typescript
export const layout = {
  screenPadding: 16,
  tileGap: 8,
  tileHeight: 48,
  tileBorderRadius: 8,
  categoryBarHeight: 56,
  categoryBarBorderRadius: 10,
  cardBorderRadius: 12,
  bannerAdHeight: 60, // 50px ad + 10px padding
};
```

---

## 9. Monetization Integration

### AdMob Setup

**Banner ads:**
- Show on Home screen (bottom) and Game screen (bottom)
- Use adaptive banner size
- Do NOT show if user has purchased `remove_ads`
- Ad unit IDs stored in `constants/adUnits.ts`

**Interstitial ads:**
- Preload on game screen mount
- Show AFTER win screen "Next puzzle" tap (not after share)
- Show at most once every 3 puzzles (track with a counter in state)
- Do NOT show if user has purchased `remove_ads`

**Rewarded video ads:**
- Preload on game screen mount
- Trigger from: lose screen retry button, out-of-hints modal (1 free hint)
- Always available regardless of `remove_ads` status (user is choosing to watch)
- On reward callback: grant retry or 1 hint respectively

### RevenueCat Setup

Initialize RevenueCat in the root layout (`_layout.tsx`):
```typescript
import Purchases from 'react-native-purchases';

// In useEffect on mount:
Purchases.configure({ apiKey: REVENUECAT_API_KEY });
```

**Product catalog:**
| Product ID | Type | Price | Entitlement |
|------------|------|-------|-------------|
| `sort_remove_ads` | Non-consumable | $2.99 | `remove_ads` |
| `sort_hints_10` | Consumable | $2.99 | — (add 10 to hintsRemaining) |
| `sort_hints_25` | Consumable | $4.99 | — (add 25 to hintsRemaining) |
| `sort_pack_pop_culture` | Non-consumable | $1.99 | `pack_pop_culture` |
| `sort_pack_science` | Non-consumable | $1.99 | `pack_science` |
| `sort_pack_food` | Non-consumable | $1.99 | `pack_food` |
| `sort_pack_geography` | Non-consumable | $1.99 | `pack_geography` |
| `sort_pack_tricky` | Non-consumable | $2.99 | `pack_tricky` |
| `sort_pack_unlock_all` | Non-consumable | $4.99 | `pack_unlock_all` |

**Restore purchases**: always available in Settings. On restore, re-check all entitlements and update local state.

---

## 10. Analytics Events

Track these events via Firebase Analytics. Every event should include `puzzle_id` and `pack_id` where applicable.

| Event | Parameters | When |
|-------|-----------|------|
| `app_open` | — | App launched |
| `puzzle_started` | `puzzle_id`, `pack_id`, `is_daily` | Puzzle loaded |
| `puzzle_completed` | `puzzle_id`, `pack_id`, `is_daily`, `time_seconds`, `mistakes`, `hints_used` | Win |
| `puzzle_failed` | `puzzle_id`, `pack_id`, `is_daily`, `categories_found`, `mistakes`, `hints_used` | Lose |
| `guess_correct` | `puzzle_id`, `category_label`, `category_difficulty` | Correct guess |
| `guess_incorrect` | `puzzle_id`, `closest_match` | Incorrect guess |
| `hint_used` | `puzzle_id`, `hints_remaining` | Hint consumed |
| `hint_purchase` | `product_id`, `quantity` | Hint pack purchased |
| `result_shared` | `puzzle_id`, `is_daily`, `result` (`won`/`lost`) | Share button tapped |
| `pack_purchased` | `pack_id`, `price` | Level pack purchased |
| `ads_removed` | — | Remove ads purchased |
| `rewarded_video_started` | `placement` (`retry`/`hint`) | Rewarded video begins |
| `rewarded_video_completed` | `placement` | Rewarded video completed |
| `rewarded_video_skipped` | `placement` | Rewarded video dismissed early |
| `interstitial_shown` | — | Interstitial ad displayed |
| `daily_streak_updated` | `streak_length` | Daily puzzle completed |
| `notification_enabled` | — | User enables daily reminder |
| `notification_disabled` | — | User disables daily reminder |

---

## 11. Push Notifications

### Daily Puzzle Reminder

- Uses `expo-notifications`
- Scheduled as a repeating local notification (not server-pushed)
- Default time: 9:00 AM local time
- Title: "Your daily puzzle is ready! 🧩"
- Body: "Can you find all 4 groups today?"
- Only enabled if user opts in via Settings

**Setup:**
```typescript
import * as Notifications from 'expo-notifications';

async function scheduleDailyReminder(hour: number = 9, minute: number = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your daily puzzle is ready! 🧩",
      body: "Can you find all 4 groups today?",
    },
    trigger: {
      type: 'daily',
      hour,
      minute,
    },
  });
}
```

---

## 12. Share Functionality

### Result Card Format

Generate a shareable image that shows the player's result without spoiling the puzzle answers.

**Visual format** (similar to Wordle's emoji grid):
```
Sort & Solve — Daily Puzzle
March 17, 2026

🟪🟪🟪🟪
🟩🟩🟩🟩
🟧❌🟧🟧 (mistake on 3rd guess)
🟧🟧🟧🟧
🟦🟦🟦🟦

Solved in 3:42 | 1 mistake | 🔥 5-day streak
```

Each row represents a guess in order:
- 🟪 (purple) = category 1 word in guess
- 🟩 (teal) = category 2 word in guess
- 🟧 (coral) = category 3 word in guess
- 🟦 (blue) = category 4 word in guess
- ❌ = incorrect guess row

**Implementation:**
1. Render a React Native View with this layout (not visible on screen)
2. Use `react-native-view-shot` to capture it as a PNG
3. Use `expo-sharing` to open the native share sheet with the image

**Also copy text to clipboard** for users who want to paste into messaging apps:
```
Sort & Solve — Daily Puzzle 🧩
March 17, 2026

🟪🟪🟪🟪
🟩🟩🟩🟩
❌
🟧🟧🟧🟧
🟦🟦🟦🟦

1 mistake | 🔥 5 streak
Play → [app store link]
```

---

## 13. Sound Effects

Keep sounds short (under 1 second), subtle, and satisfying.

| Sound | File | When | Description |
|-------|------|------|-------------|
| Tap | `tap.mp3` | Word tile tapped | Soft click, 50ms |
| Correct | `correct.mp3` | Category solved | Rising chime, 400ms |
| Incorrect | `incorrect.mp3` | Wrong guess | Low soft buzz, 300ms |
| Win | `win.mp3` | All 4 categories solved | Celebratory jingle, 800ms |
| Shuffle | `shuffle.mp3` | Shuffle button tapped | Card shuffle swoosh, 300ms |

**Implementation:**
- Use `expo-av` Audio API
- Preload all sounds on app mount
- Respect `soundEnabled` user preference
- Keep volume moderate (0.5-0.7) — these play alongside ads which have their own audio

---

## 14. Storage & Persistence

### AsyncStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `@user_state` | JSON string | Full UserState object |
| `@completed_puzzles` | JSON string (string[]) | Array of completed puzzle IDs |
| `@onboarding_complete` | `"true"` | Whether onboarding has been shown |
| `@notification_prompt_shown` | `"true"` | Whether notification prompt was shown |
| `@interstitial_counter` | number string | Puzzles since last interstitial |

### Persistence Strategy

- On every state change in `userStore`, debounce-write to AsyncStorage (300ms debounce)
- On app launch, hydrate `userStore` from AsyncStorage before rendering any screens
- Use a loading/splash screen while hydrating
- Game state (`gameStore`) is NOT persisted — if the app is killed mid-puzzle, the puzzle restarts. This is intentional and simpler.

---

## 15. Content Pipeline & Puzzle Design

### Puzzle Design Philosophy

A good word-sorting puzzle is NOT a trivia test. It is a trap. The fun comes from the player thinking they see a pattern, committing to it, and being wrong — then having the "aha" moment when the real pattern reveals itself.

**The four rules of puzzle design:**

1. **Every puzzle must have at least 4 "trap words"** — words that plausibly belong to 2+ categories. Without trap words, the puzzle is trivially solvable and not fun. Example: BASS (fish? instrument? music genre?), MARS (planet? candy bar? god?), EAGLE (bird? golf term?), CLUB (weapon? venue? card suit? golf club?).

2. **Difficulty levels describe trap density, not topic obscurity.** Difficulty 1 = the category with the fewest trap words and the most obvious grouping. Difficulty 4 = the category that can only be reliably solved by elimination after the others are found. Usually because its theme is non-obvious or its words all have stronger associations with other categories.

3. **The difficulty 4 category should have a clever or non-obvious theme.** Not "types of fish" but "things that can follow 'sword'" (FISH, PLAY, FIGHT, SMITH). Not "colors" but "also types of music" (BLUES, METAL, SOUL, PUNK). The reveal of this category is the emotional peak of the puzzle.

4. **There should be at least one "false group"** — a set of 4+ words across the puzzle that look like a category but aren't all in the same group. Example: a puzzle contains ROBIN, EAGLE, BIRDIE, HAWK, JAY. The player sees 5 "birds" but only ROBIN, HAWK, JAY are in the birds category. EAGLE and BIRDIE are golf terms. The player has to figure out which "birds" are real.

### Anatomy of a Good Puzzle

```
PUZZLE: "Double meanings"

Category 1 (difficulty 1 — easiest, most obvious):
  "Candy bars" → MARS, SNICKERS, TWIX, BOUNTY
  Why easiest: SNICKERS, TWIX, BOUNTY are unambiguously candy bars.
  Only MARS is a trap word (also a planet).

Category 2 (difficulty 2):
  "Golf terms" → DRIVER, EAGLE, BIRDIE, PUTTER
  Why medium: DRIVER (car?), EAGLE (bird?), BIRDIE (bird?) are all trap words.
  Only PUTTER is unambiguous.

Category 3 (difficulty 3):
  "Things you hit" → DRUM, IRON, BASS, CLUB
  Why hard: IRON (metal? golf club?), BASS (fish? guitar?), CLUB (venue? card suit?)
  all have strong competing associations. DRUM is the only giveaway.

Category 4 (difficulty 4 — hardest):
  "___ wood(s)" → TIGER, DRIFT, ROBIN, WEDGE
  Why hardest: The theme itself is hidden (compound words ending in "wood/woods").
  TIGER → Tigerwoods, DRIFT → Driftwood, ROBIN → Robin Hood (stretch),
  WEDGE → Wedgewood. Player would never guess this theme without elimination.

Trap words (words with 2+ plausible categories):
  MARS (candy bar / planet)
  EAGLE (golf / bird)
  BIRDIE (golf / bird)  
  BASS (things you hit / fish / music)
  IRON (things you hit / metal / golf)
  CLUB (things you hit / venue / golf)
  DRIVER (golf / car)
  TIGER (___woods / animal)
  ROBIN (___woods / bird)
  WEDGE (___woods / golf / cheese)

False groups the player might see:
  "Birds" → ROBIN, EAGLE, BIRDIE, ... but only ROBIN is not a golf term
  "Golf" → DRIVER, EAGLE, IRON, CLUB, WEDGE, PUTTER — 6 words! Only 4 are real.
  "Animals" → TIGER, ROBIN, EAGLE, BASS — scattered across all 4 categories.

This puzzle has 10 trap words out of 16. That's what makes it fun.
```

### Generation Prompt Template (REVISED)

Use this prompt to generate puzzle content. Generate in small batches (5-10 at a time) for higher quality. Review every puzzle manually.

```
Generate [N] word-sorting puzzles for a mobile game. Each puzzle has 4 categories of 4 words (16 words total).

CRITICAL DESIGN RULES — these are what make the puzzles fun:

1. TRAP WORDS: At least 4 of the 16 words must plausibly belong to 2 or more categories. These words with double meanings are the core of the gameplay. Examples: CLUB (weapon/venue/card suit/golf), MARS (planet/candy/god), BASS (fish/instrument/music), CRANE (bird/machine), SEAL (animal/verb/stamp), MINT (herb/candy/condition).

2. FALSE GROUPS: The puzzle should contain at least one "false group" — 4+ words that look like they form a category but are actually spread across different real categories. For example, if ROBIN, EAGLE, BIRDIE, HAWK all appear, not all of them should be in a "birds" category — some should be in other categories (EAGLE = golf, BIRDIE = golf).

3. DIFFICULTY 4 CATEGORY: The hardest category should have a non-obvious or clever theme. Good examples:
   - "Words that follow 'fire'" (WORK, PLACE, FIGHTER, TRUCK)
   - "___ board" (SKATE, CARD, CHALK, SURF)
   - "Also a type of dance" (SWING, TAP, BREAK, TWIST)
   - "Things with keys" (PIANO, MAP, COMPUTER, LOCK)
   Bad examples (too obvious): "Types of tree", "Colors", "Animals", "Countries"

4. DIFFICULTY LEVELS:
   - Difficulty 1: The most straightforward group. 3-4 of its words are unambiguous. Should be solvable first.
   - Difficulty 2: Slightly tricky. 1-2 words that could belong elsewhere.
   - Difficulty 3: Multiple words with competing associations. Requires careful elimination.
   - Difficulty 4: Theme is hidden or surprising. Words all have stronger surface associations with other categories. Often only solvable by elimination.

5. WORD CONSTRAINTS:
   - Single words only, no spaces or hyphens
   - 3-12 letters, ALL CAPS
   - All 16 words must be unique within the puzzle
   - Avoid obscure or archaic words — players should know all 16 words
   - No proper nouns UNLESS they also function as common words (CLUB, VENUS, IRIS are ok; SHAKESPEARE is not)

Theme for this batch: [THEME or "general/mixed"]

For each puzzle, output JSON AND a brief "trap analysis" explaining which words are trap words and what false groups exist.

JSON format:
{
  "id": "[pack]_001",
  "categories": [
    { "label": "Category name", "words": ["WORD1", "WORD2", "WORD3", "WORD4"], "difficulty": 1 },
    { "label": "Category name", "words": ["WORD1", "WORD2", "WORD3", "WORD4"], "difficulty": 2 },
    { "label": "Category name", "words": ["WORD1", "WORD2", "WORD3", "WORD4"], "difficulty": 3 },
    { "label": "Category name", "words": ["WORD1", "WORD2", "WORD3", "WORD4"], "difficulty": 4 }
  ],
  "trapWords": ["WORD1", "WORD2", ...],
  "falseGroups": ["Description of false group 1", "Description of false group 2"]
}
```

### Quality Review Process

AI-generated puzzles MUST be reviewed before shipping. Here is the review process:

**Step 1: Automated validation** (script checks structural correctness)
- Every puzzle has exactly 4 categories with exactly 4 words
- All 16 words per puzzle are unique (case-insensitive)
- No duplicate words across the entire pack
- All words match regex `/^[A-Z]{3,12}$/`
- No duplicate puzzle IDs
- All difficulty levels 1-4 are represented
- `trapWords` array is present and has at least 4 entries

**Step 2: Automated trap scoring** (script checks puzzle quality)
For each word in the puzzle, check how many categories it could plausibly belong to. A word is a "trap" if it has a common meaning or association that overlaps with another category's theme. The script can't fully automate this, but it CAN flag puzzles with fewer than 3 trap words for manual review.

Scoring heuristic (run by a second Claude pass):
```
For each puzzle, ask Claude:
"Here are 16 words: [words]. For each word, list every category from this list 
[category labels] that it could plausibly belong to. A word is a trap if it fits 
2+ categories."

Count trap words. If < 4, flag for revision.
```

**Step 3: Human playtesting** (you solve the puzzle yourself)
- Open the puzzle JSON in a simple web-based test harness (build this as a dev tool)
- Actually try to solve it
- If you solve it with 0 mistakes in under 90 seconds, it's too easy — revise or discard
- If you cannot solve it after 5 minutes, it may be too hard or have an ambiguous assignment — revise
- Target: most puzzles should take 2-4 minutes with 1-2 mistakes for an average player

**Step 4: Difficulty re-ordering**
After playtesting, you may need to reassign difficulty levels. The category you solved first should be difficulty 1. The one you needed elimination for should be difficulty 4. Your experience as a first-time solver is the most accurate difficulty signal.

### Content Quality Tiers

Not all packs need the same rigor:

| Tier | Quality Bar | Applies To | Process |
|------|------------|------------|---------|
| **A-tier** | Every puzzle playtested, trap-scored, hand-tuned | Daily puzzles, Free pack | Generate → score → playtest → revise → ship |
| **B-tier** | Trap-scored, spot-checked (playtest 1 in 5) | General packs, Music packs | Generate → score → spot-check → ship |
| **C-tier** | Automated validation only, fix obvious errors | Large themed packs added later | Generate → validate → ship, fix in OTA updates |

Daily puzzles and the free pack are what new users see first. These must be A-tier. Paid packs can be B-tier since the player has already bought in and has higher tolerance. Future expansion packs can ship as C-tier and be improved over time via OTA.

### Playtest Dev Tool

Build a simple web-based puzzle tester (can be a React app or even a local HTML file) that:
1. Loads a puzzle JSON file
2. Renders the 16 words in a grid
3. Lets you tap to select 4 and submit
4. Shows correct/incorrect with the same rules as the game
5. Tracks your solve time and mistake count
6. Outputs a quality rating: Easy (0 mistakes, <90s), Good (1-2 mistakes, 2-4min), Hard (3+ mistakes or >4min)

This tool is NOT shipped to users. It's a dev-only quality assurance tool. Build it before generating puzzle content.

### Validation Script

```typescript
// scripts/validatePuzzles.ts
// Run: npx ts-node scripts/validatePuzzles.ts data/puzzles/free.json

interface ValidationResult {
  puzzleId: string;
  errors: string[];       // structural errors (must fix)
  warnings: string[];     // quality warnings (should review)
}

function validatePuzzleFile(filepath: string): ValidationResult[] {
  const puzzles = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  const allWordsInPack = new Set<string>();
  const results: ValidationResult[] = [];

  for (const puzzle of puzzles) {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Structural checks
    if (!puzzle.id) errors.push('Missing puzzle ID');
    if (!puzzle.categories || puzzle.categories.length !== 4)
      errors.push('Must have exactly 4 categories');

    const puzzleWords: string[] = [];
    const difficulties = new Set<number>();

    for (const cat of puzzle.categories) {
      if (!cat.words || cat.words.length !== 4)
        errors.push(`Category "${cat.label}" must have exactly 4 words`);
      if (!cat.label) errors.push('Category missing label');
      if (![1, 2, 3, 4].includes(cat.difficulty))
        errors.push(`Invalid difficulty ${cat.difficulty}`);

      difficulties.add(cat.difficulty);
      for (const word of cat.words) {
        if (!/^[A-Z]{3,12}$/.test(word))
          errors.push(`Invalid word format: "${word}"`);
        if (puzzleWords.includes(word))
          errors.push(`Duplicate word within puzzle: "${word}"`);
        if (allWordsInPack.has(word))
          warnings.push(`Word "${word}" appears in multiple puzzles`);

        puzzleWords.push(word);
        allWordsInPack.add(word);
      }
    }

    if (difficulties.size !== 4)
      errors.push('Must have all 4 difficulty levels (1, 2, 3, 4)');

    // Quality checks
    if (!puzzle.trapWords || puzzle.trapWords.length < 4)
      warnings.push(`Only ${puzzle.trapWords?.length || 0} trap words identified (minimum 4)`);

    if (!puzzle.falseGroups || puzzle.falseGroups.length === 0)
      warnings.push('No false groups identified — puzzle may be too easy');

    results.push({ puzzleId: puzzle.id, errors, warnings });
  }

  return results;
}
```

### OTA Content Updates

Puzzle JSON files can be updated via Expo OTA updates (`expo publish`) without going through app store review. This means you can:
- Add new packs without app review
- Fix puzzle errors (wrong category assignments, typos)
- Rebalance difficulty levels based on player analytics
- Ship daily puzzle content ahead of schedule

---

## 16. App Store Assets & Metadata

### App Name
**Sort & Solve — Word Puzzle**

### Subtitle (iOS) / Short Description (Android)
**Find the 4 hidden word groups!**

### Keywords (iOS, 100 char max)
`word,puzzle,sort,connections,brain,trivia,groups,categories,guess,daily,music,movies,sports,game`

### Full Description
```
Can you find the 4 hidden groups?

Sort & Solve gives you 16 words and one challenge: figure out which 4 belong together. Sounds simple — until you realize the words are designed to trick you.

HOW TO PLAY
• Look at 16 words in a grid
• Tap 4 words you think share a hidden connection
• If you're right, the category reveals itself
• If you're wrong, you lose a life — and you only get 4
• Find all 4 groups to win!

PUZZLE PACKS FOR EVERY INTEREST
• General Knowledge — science, food, geography, pop culture
• Music — rap, rock, country, 80s hits, 90s anthems
• Movies — action, horror, comedy, 90s classics
• Sports — NFL, NBA, soccer, Olympics
• New packs added regularly!

FEATURES
• New daily puzzle every day — keep your streak alive
• 50 free puzzles to get you hooked
• 18+ themed puzzle packs with 700+ puzzles
• Share your results — show off (or commiserate) with friends
• No timer — play at your own pace
• Hints when you're stuck

Whether you're a music nerd, a sports fanatic, or a movie buff — there's a pack for you. And if you just want a brain workout with no specific theme, the general packs have you covered.

Download now. Your daily brain workout is waiting.
```

### Category
Word (iOS) / Word (Android)

### Age Rating
4+ (no objectionable content)

### Privacy Policy URL
Required. Host at `https://[yourdomain].vercel.app/privacy`

### App Icon
- 1024x1024 PNG, no transparency, no rounded corners (stores add rounding)
- Design: clean, minimal. A 4-color grid of squares (purple, teal, coral, blue) on a white background with subtle rounded corners on each square. No text on the icon.

### Screenshots
Create screenshots for:
- iPhone 6.7" (1290 × 2796)
- iPhone 6.5" (1284 × 2778)
- iPad 12.9" (2048 × 2732)

Screenshot sequence:
1. Gameplay screen with a few tiles selected
2. Category being revealed (animation mid-state)
3. Win screen with all 4 categories solved
4. Daily puzzle card on home screen
5. Level packs screen showing the themed categories (music, movies, sports, etc.)

### Feature Graphic (Android)
1024 × 500 PNG. Same visual language as app icon but wider format.

---

## 17. Performance & Error Handling

### Performance Targets
- App cold start to interactive home screen: under 2 seconds
- Tile tap to visual feedback: under 50ms
- Category reveal animation: 400ms
- Puzzle load from JSON: under 100ms

### Error Handling
- **Puzzle load failure**: if a puzzle JSON file is corrupt or missing, show a friendly error screen with a "Go Home" button. Log to Crashlytics.
- **Ad load failure**: silently fail. Never block gameplay because an ad didn't load. Preload ads but don't depend on them.
- **IAP failure**: show a retry prompt with the RevenueCat error message. Never grant a purchase without server confirmation from RevenueCat.
- **Network offline**: the entire game works offline. Puzzles are bundled JSON. Ads and IAP gracefully degrade. Only the share feature requires connectivity (and expo-sharing handles this).
- **AsyncStorage failure**: if hydration fails on launch, start with default state. Log to Crashlytics.

### Crash Reporting
- Initialize `@react-native-firebase/crashlytics` in root layout
- Log non-fatal errors for: ad failures, IAP failures, puzzle validation errors
- Include `puzzle_id` in crash context when on the game screen

---

## 18. Testing Checklist

Before every release, manually verify:

### Core Gameplay
- [ ] Can start a daily puzzle
- [ ] Can start a free puzzle
- [ ] Tapping a word selects it (visual + sound + haptic)
- [ ] Tapping a selected word deselects it
- [ ] Cannot select more than 4 words
- [ ] Submit button disabled with <4 or >4 words selected
- [ ] Correct guess: tiles animate up, category bar appears, words removed from grid
- [ ] Incorrect guess: tiles shake, lives decrement, toast shows "X of 4"
- [ ] Cannot submit the same 4-word combination twice
- [ ] Winning shows Win Screen with correct stats
- [ ] Losing shows Lose Screen with all categories revealed
- [ ] Shuffle randomizes remaining words
- [ ] Deselect All clears selection
- [ ] Hint highlights a word and shows category name
- [ ] Hint count decrements correctly
- [ ] Out-of-hints modal appears with purchase options

### Navigation
- [ ] Home → Daily Puzzle → back to Home
- [ ] Home → Free Puzzle → back to Home
- [ ] Home → Packs → select pack → game → back flow works
- [ ] Home → Settings → back
- [ ] Quit puzzle confirmation dialog appears when backing out mid-game
- [ ] Hardware back button works correctly on Android

### Monetization
- [ ] Banner ad displays on home and game screens
- [ ] Banner ad hidden when ads removed
- [ ] Interstitial shows between puzzles (not after every one)
- [ ] Interstitial does not show if ads removed
- [ ] Rewarded video plays on lose screen retry
- [ ] Rewarded video grants retry/hint after completion
- [ ] Remove Ads purchase works and persists
- [ ] Hint pack purchase increments hint count
- [ ] Level pack purchase unlocks puzzles
- [ ] Unlock All purchase unlocks everything
- [ ] Restore Purchases works correctly

### Sharing
- [ ] Share button generates result image
- [ ] Share sheet opens with image
- [ ] Text copied to clipboard
- [ ] Share works for both win and lose states
- [ ] Result card does not spoil puzzle answers

### Persistence
- [ ] Completed puzzles persist across app restarts
- [ ] Streak count persists and updates correctly
- [ ] Hint count persists
- [ ] Purchases persist (via RevenueCat)
- [ ] Sound/haptic preferences persist

### Edge Cases
- [ ] App kill during gameplay → puzzle restarts on reopen
- [ ] No internet → game works, ads fail silently, IAP shows error
- [ ] Very long words display correctly in tiles (text scales down)
- [ ] All 50 free puzzles completed → UI shows "All done!" with link to packs
- [ ] Daily puzzle already completed today → show "Completed ✓" on home

---

## Implementation Notes for Claude Code

### Build Order (recommended)

Build and test in this order for the fastest path to a working prototype:

1. **Project scaffolding** — Expo init, install all dependencies, configure TypeScript, set up file structure
2. **Config file** — Create `config/appConfig.ts` with pack definitions, ad unit IDs, IAP product IDs, and app metadata. All configurable values live here.
3. **Data layer** — Puzzle types, sample puzzle JSON (5-10 puzzles), puzzle loader utility that reads pack definitions from config
4. **Game store** — Zustand store with all game state logic (init, select, submit, shuffle, hint)
5. **Game screen UI** — WordGrid, WordTile, SolvedCategory, GameControls, LivesIndicator
6. **Game screen logic** — Wire up the store to the UI, get a playable game working
7. **Win/Lose screens** — Overlay components with stats display
8. **Home screen** — Navigation to daily and free puzzles
9. **User store** — Persistence with AsyncStorage, streaks, completed puzzles
10. **Animations** — Category reveal slide-up, incorrect guess shake, tile selection scale
11. **Sound + Haptics** — Audio preloading and playback, haptic triggers
12. **Share functionality** — Result card generation and sharing
13. **Packs screen + IAP** — RevenueCat integration, grouped pack categories with bundle purchases, unlock-everything
14. **Ads** — AdMob banner, interstitial, rewarded video
15. **Settings screen** — Preferences, restore purchases, links
16. **Notifications** — Daily reminder scheduling
17. **Analytics** — Firebase event tracking
18. **More Apps screen** — Cross-promotion to your other apps (Spotted, Is It Worth It, etc.)
19. **Polish** — Loading states, error handling, onboarding, edge cases
20. **Generate all puzzle content** — Use Claude to generate all 18 packs (720 puzzles) + 50 free + 365 daily. Validate with the validation script. This can happen in parallel with coding.

### Key Decisions Already Made

- **Single app, many packs**: all themed content (music, movies, sports, general) lives inside one app as IAP packs. This avoids Apple's Guideline 4.3 spam rejections and concentrates all downloads, ratings, and search ranking into one listing. See Section 2 for the full content strategy.
- **No user accounts**: everything is local. No Firebase Auth, no cloud sync. Keeps it simple.
- **No dark mode for v1**: single light theme. Can add later.
- **No leaderboard for v1**: streaks are private. Can add Game Center / Google Play Games later.
- **No multiplayer for v1**: single player only.
- **Puzzle data is bundled**: shipped with the app as JSON files. No server needed. Content updates via Expo OTA.
- **Game state is not persisted**: if you kill the app mid-puzzle, it restarts. This is intentional.
- **Expo managed workflow**: no ejecting. All dependencies must be Expo-compatible.
- **Future second app must be mechanically different**: if you want another App Store listing, build a different game type (5-clue word guess, trivia, word chains) — not a reskin of this one.

---

*End of design document. This spec should contain everything needed to build Sort & Solve from scratch. If any detail is ambiguous, prefer the simpler implementation.*
