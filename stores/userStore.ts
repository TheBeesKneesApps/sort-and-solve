import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState, PuzzleResult } from '../types';

const STORAGE_KEY = '@user_state';

interface UserActions {
  hydrate: () => Promise<void>;
  completePuzzle: (puzzleId: string, isDaily: boolean, result: PuzzleResult) => void;
  failPuzzle: (puzzleId: string, result: PuzzleResult) => void;
  useHint: () => void;
  addHints: (count: number) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  toggleNotifications: () => void;
  setOnboardingComplete: () => void;
  setNotificationPromptShown: () => void;
  incrementInterstitialCounter: () => void;
  resetInterstitialCounter: () => void;
  grantArchivePass: () => void;
  unlockPack: (packId: string) => void;
  unlockAll: () => void;
  addFreezes: (count: number) => void;
  checkAndApplyFreeze: () => string | null;
  resetToDefault: () => void;
  _persist: () => void;
}

type UserStore = UserState & UserActions & { isHydrated: boolean };

const defaultState: UserState = {
  completedPuzzles: [],
  puzzleResults: {},
  currentStreak: 0,
  longestStreak: 0,
  lastDailyDate: null,
  totalPuzzlesSolved: 0,
  totalPuzzlesFailed: 0,
  hintsRemaining: 5,
  soundEnabled: true,
  hapticEnabled: true,
  notificationsEnabled: false,
  hasArchivePass: false,
  unlockedPacks: [],
  onboardingComplete: false,
  notificationPromptShown: false,
  interstitialCounter: 0,
  freezesRemaining: 0,
  freezesUsedDates: [],
  consecutiveFreezeCount: 0,
  totalPuzzlesPlayed: 0,
  totalPuzzlesWon: 0,
  guessDistribution: [0, 0, 0, 0, 0],
  totalSolveTimeSeconds: 0,
  fastestSolveSeconds: 0,
  slowestSolveSeconds: 0,
  totalHintsUsed: 0,
  dailyHistory: {},
};

let persistTimeout: ReturnType<typeof setTimeout> | null = null;

export const useUserStore = create<UserStore>((set, get) => ({
  ...defaultState,
  isHydrated: false,

  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserState>;
        set({ ...defaultState, ...parsed, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  _persist: () => {
    if (persistTimeout) clearTimeout(persistTimeout);
    persistTimeout = setTimeout(() => {
      const state = get();
      const toSave: UserState = {
        completedPuzzles: state.completedPuzzles,
        puzzleResults: state.puzzleResults,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastDailyDate: state.lastDailyDate,
        totalPuzzlesSolved: state.totalPuzzlesSolved,
        totalPuzzlesFailed: state.totalPuzzlesFailed,
        hintsRemaining: state.hintsRemaining,
        soundEnabled: state.soundEnabled,
        hapticEnabled: state.hapticEnabled,
        notificationsEnabled: state.notificationsEnabled,
        hasArchivePass: state.hasArchivePass,
        unlockedPacks: state.unlockedPacks,
        onboardingComplete: state.onboardingComplete,
        notificationPromptShown: state.notificationPromptShown,
        interstitialCounter: state.interstitialCounter,
        freezesRemaining: state.freezesRemaining,
        freezesUsedDates: state.freezesUsedDates,
        consecutiveFreezeCount: state.consecutiveFreezeCount,
        totalPuzzlesPlayed: state.totalPuzzlesPlayed,
        totalPuzzlesWon: state.totalPuzzlesWon,
        guessDistribution: state.guessDistribution,
        totalSolveTimeSeconds: state.totalSolveTimeSeconds,
        fastestSolveSeconds: state.fastestSolveSeconds,
        slowestSolveSeconds: state.slowestSolveSeconds,
        totalHintsUsed: state.totalHintsUsed,
        dailyHistory: state.dailyHistory,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
    }, 300);
  },

  completePuzzle: (puzzleId: string, isDaily: boolean, result: PuzzleResult) => {
    const state = get();
    if (state.completedPuzzles.includes(puzzleId)) return;

    const newGuessDistribution: [number, number, number, number, number] = [...state.guessDistribution];
    const mistakeIdx = Math.min(result.mistakes, 3);
    newGuessDistribution[mistakeIdx] += 1;

    const updates: Partial<UserState> = {
      completedPuzzles: [...state.completedPuzzles, puzzleId],
      puzzleResults: { ...state.puzzleResults, [puzzleId]: result },
      totalPuzzlesSolved: state.totalPuzzlesSolved + 1,
      totalPuzzlesPlayed: state.totalPuzzlesPlayed + 1,
      totalPuzzlesWon: state.totalPuzzlesWon + 1,
      guessDistribution: newGuessDistribution,
      totalSolveTimeSeconds: state.totalSolveTimeSeconds + result.timeSeconds,
      fastestSolveSeconds: state.fastestSolveSeconds === 0
        ? result.timeSeconds
        : Math.min(state.fastestSolveSeconds, result.timeSeconds),
      slowestSolveSeconds: Math.max(state.slowestSolveSeconds, result.timeSeconds),
      totalHintsUsed: state.totalHintsUsed + result.hintsUsed,
    };

    if (isDaily) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      updates.dailyHistory = { ...state.dailyHistory, [today]: 'solved' };

      if (state.lastDailyDate === today) {
        // Already played today
      } else if (
        state.lastDailyDate === yesterday ||
        state.freezesUsedDates.includes(yesterday)
      ) {
        const newStreak = state.currentStreak + 1;
        updates.currentStreak = newStreak;
        updates.longestStreak = Math.max(newStreak, state.longestStreak);
        updates.lastDailyDate = today;
        updates.consecutiveFreezeCount = 0;

        // Award a freeze every 7-day streak
        if (newStreak > 0 && newStreak % 7 === 0 && state.freezesRemaining < 3) {
          updates.freezesRemaining = Math.min(state.freezesRemaining + 1, 3);
        }
      } else {
        updates.currentStreak = 1;
        updates.lastDailyDate = today;
        updates.consecutiveFreezeCount = 0;
      }
    }

    set(updates);
    get()._persist();
  },

  failPuzzle: (puzzleId: string, result: PuzzleResult) => {
    const state = get();
    const newGuessDistribution: [number, number, number, number, number] = [...state.guessDistribution];
    newGuessDistribution[4] += 1;

    const isDaily = puzzleId.startsWith('daily_');
    const updates: Partial<UserState> = {
      totalPuzzlesFailed: state.totalPuzzlesFailed + 1,
      totalPuzzlesPlayed: state.totalPuzzlesPlayed + 1,
      guessDistribution: newGuessDistribution,
      totalSolveTimeSeconds: state.totalSolveTimeSeconds + result.timeSeconds,
      totalHintsUsed: state.totalHintsUsed + result.hintsUsed,
      puzzleResults: { ...state.puzzleResults, [puzzleId]: result },
    };

    if (isDaily) {
      const today = new Date().toISOString().split('T')[0];
      updates.dailyHistory = { ...state.dailyHistory, [today]: 'failed' };
    }

    set(updates);
    get()._persist();
  },

  useHint: () => {
    const state = get();
    if (state.hintsRemaining > 0) {
      set({ hintsRemaining: state.hintsRemaining - 1 });
      get()._persist();
    }
  },

  addHints: (count: number) => {
    set({ hintsRemaining: get().hintsRemaining + count });
    get()._persist();
  },

  toggleSound: () => {
    set({ soundEnabled: !get().soundEnabled });
    get()._persist();
  },

  toggleHaptic: () => {
    set({ hapticEnabled: !get().hapticEnabled });
    get()._persist();
  },

  toggleNotifications: () => {
    set({ notificationsEnabled: !get().notificationsEnabled });
    get()._persist();
  },

  setOnboardingComplete: () => {
    set({ onboardingComplete: true });
    get()._persist();
  },

  setNotificationPromptShown: () => {
    set({ notificationPromptShown: true });
    get()._persist();
  },

  incrementInterstitialCounter: () => {
    set({ interstitialCounter: get().interstitialCounter + 1 });
    get()._persist();
  },

  resetInterstitialCounter: () => {
    set({ interstitialCounter: 0 });
    get()._persist();
  },

  grantArchivePass: () => {
    set({ hasArchivePass: true });
    get()._persist();
  },

  unlockPack: (packId: string) => {
    const state = get();
    if (!state.unlockedPacks.includes(packId)) {
      set({ unlockedPacks: [...state.unlockedPacks, packId] });
      get()._persist();
    }
  },

  unlockAll: () => {
    set({ unlockedPacks: ['all'], hasArchivePass: true });
    get()._persist();
  },

  addFreezes: (count: number) => {
    const state = get();
    set({ freezesRemaining: Math.min(state.freezesRemaining + count, 3) });
    get()._persist();
  },

  checkAndApplyFreeze: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If they played yesterday or today, no freeze needed
    if (state.lastDailyDate === today || state.lastDailyDate === yesterday) {
      if (state.consecutiveFreezeCount > 0) {
        set({ consecutiveFreezeCount: 0 });
        get()._persist();
      }
      return null;
    }

    // If no streak to protect, skip
    if (state.currentStreak === 0) return null;

    // They missed yesterday. Can we freeze?
    if (state.freezesRemaining > 0 && state.consecutiveFreezeCount < 2) {
      set({
        freezesRemaining: state.freezesRemaining - 1,
        freezesUsedDates: [...state.freezesUsedDates, yesterday],
        consecutiveFreezeCount: state.consecutiveFreezeCount + 1,
        lastDailyDate: yesterday,
      });
      get()._persist();
      return yesterday;
    }

    // Can't freeze — streak breaks
    set({
      currentStreak: 0,
      consecutiveFreezeCount: 0,
    });
    get()._persist();
    return null;
  },

  resetToDefault: () => {
    set({ ...defaultState, isHydrated: true });
    get()._persist();
  },
}));
