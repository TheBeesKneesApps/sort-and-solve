export interface PuzzleCategory {
  label: string;
  words: [string, string, string, string];
  difficulty: 1 | 2 | 3 | 4;
}

export interface Puzzle {
  id: string;
  categories: [PuzzleCategory, PuzzleCategory, PuzzleCategory, PuzzleCategory];
}

export interface GameState {
  puzzleId: string;
  puzzle: Puzzle;
  allWords: string[];
  selectedWords: string[];
  solvedCategories: PuzzleCategory[];
  remainingLives: number;
  previousGuesses: string[][];
  gameStatus: 'playing' | 'won' | 'lost';
  hintsUsed: number;
  startTime: number;
  endTime: number | null;
  hintedWord: string | null;
  toastMessage: string | null;
}

export interface PuzzleResult {
  mistakes: number;
  timeSeconds: number;
  hintsUsed: number;
  solvedCategories: number;
}

export interface UserState {
  completedPuzzles: string[];
  puzzleResults: Record<string, PuzzleResult>;
  currentStreak: number;
  longestStreak: number;
  lastDailyDate: string | null;
  totalPuzzlesSolved: number;
  totalPuzzlesFailed: number;
  hintsRemaining: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
  hasArchivePass: boolean;
  unlockedPacks: string[];
  onboardingComplete: boolean;
  notificationPromptShown: boolean;
  interstitialCounter: number;

  // Streak freezes
  freezesRemaining: number;
  freezesUsedDates: string[];
  consecutiveFreezeCount: number;

  // Stats
  totalPuzzlesPlayed: number;
  totalPuzzlesWon: number;
  guessDistribution: [number, number, number, number, number];
  totalSolveTimeSeconds: number;
  fastestSolveSeconds: number;
  slowestSolveSeconds: number;
  totalHintsUsed: number;

  // Daily play history (date string -> 'solved' | 'failed')
  dailyHistory: Record<string, 'solved' | 'failed'>;
}

export interface PackDefinition {
  id: string;
  name: string;
  puzzleCount: number;
  price: string;
  category: 'free' | 'general' | 'music' | 'movies' | 'sports';
  dataFile: string;
  productId: string;
}

export interface PackCategoryDefinition {
  name: string;
  packs: PackDefinition[];
  bundlePrice: string;
  bundleProductId: string;
}
