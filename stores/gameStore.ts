import { create } from 'zustand';
import { GameState, Puzzle, PuzzleCategory } from '../types';
import { fisherYatesShuffle } from '../utils/shuffle';
import { APP_CONFIG } from '../config/appConfig';
import { GuessResult } from '../utils/share';

interface GameActions {
  initGame: (puzzle: Puzzle) => void;
  toggleWord: (word: string) => void;
  submitGuess: () => { result: 'correct' | 'incorrect' | 'already_guessed'; matchedCategory?: PuzzleCategory; closestMatch?: number };
  shuffleWords: () => void;
  deselectAll: () => void;
  useHint: (hintsRemaining: number) => { word: string; categoryLabel: string } | null;
  clearToast: () => void;
  retryAfterAd: () => void;
  reset: () => void;
}

interface HintState {
  guessHistory: GuessResult[];
  hintedCategoryLabel: string | null;
  hintedWords: string[];
}

type GameStore = GameState & HintState & GameActions;

const initialState: GameState & HintState = {
  puzzleId: '',
  puzzle: { id: '', categories: [] as unknown as Puzzle['categories'] },
  allWords: [],
  selectedWords: [],
  solvedCategories: [],
  remainingLives: APP_CONFIG.maxLives,
  previousGuesses: [],
  gameStatus: 'playing',
  hintsUsed: 0,
  startTime: 0,
  endTime: null,
  hintedWord: null,
  toastMessage: null,
  guessHistory: [],
  hintedCategoryLabel: null,
  hintedWords: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initGame: (puzzle: Puzzle) => {
    const allWords = fisherYatesShuffle(
      puzzle.categories.flatMap((c) => c.words)
    );
    set({
      ...initialState,
      puzzleId: puzzle.id,
      puzzle,
      allWords,
      startTime: Date.now(),
    });
  },

  toggleWord: (word: string) => {
    const { selectedWords, gameStatus } = get();
    if (gameStatus !== 'playing') return;

    if (selectedWords.includes(word)) {
      set({
        selectedWords: selectedWords.filter((w) => w !== word),
        hintedWord: null,
      });
    } else if (selectedWords.length < 4) {
      set({
        selectedWords: [...selectedWords, word],
        hintedWord: null,
      });
    }
  },

  submitGuess: () => {
    const state = get();
    const { selectedWords, solvedCategories, previousGuesses, remainingLives, puzzle } = state;

    if (selectedWords.length !== 4 || state.gameStatus !== 'playing') {
      return { result: 'incorrect' as const };
    }

    // Check for duplicate guess
    const sortedGuess = [...selectedWords].sort();
    const isDuplicate = previousGuesses.some((prev) => {
      const sortedPrev = [...prev].sort();
      return sortedPrev.every((w, i) => w === sortedGuess[i]);
    });

    if (isDuplicate) {
      set({ toastMessage: 'Already guessed!' });
      return { result: 'already_guessed' as const };
    }

    // Check against unsolved categories
    const solvedLabels = new Set(solvedCategories.map((c) => c.label));
    const unsolvedCategories = puzzle.categories.filter(
      (c) => !solvedLabels.has(c.label)
    );

    // Helper: find difficulty of a word's true category
    const getWordDifficulty = (word: string): number => {
      for (const cat of puzzle.categories) {
        if (cat.words.includes(word)) return cat.difficulty;
      }
      return 1;
    };

    for (const category of unsolvedCategories) {
      const categoryWords = new Set(category.words);
      if (selectedWords.every((w) => categoryWords.has(w))) {
        // CORRECT
        const newSolved = [...solvedCategories, category];
        const newStatus = newSolved.length === 4 ? 'won' : 'playing';
        const guessResult: GuessResult = {
          words: [...selectedWords],
          correct: true,
          wordDifficulties: selectedWords.map(getWordDifficulty),
        };
        // Clear hint state if the solved category was the one being hinted
        const clearHint = category.label === state.hintedCategoryLabel;
        set({
          selectedWords: [],
          solvedCategories: newSolved,
          allWords: state.allWords.filter((w) => !categoryWords.has(w)),
          gameStatus: newStatus,
          endTime: newStatus === 'won' ? Date.now() : null,
          hintedWord: null,
          toastMessage: null,
          guessHistory: [...state.guessHistory, guessResult],
          ...(clearHint ? { hintedCategoryLabel: null, hintedWords: [] } : {}),
        });
        return { result: 'correct' as const, matchedCategory: category };
      }
    }

    // INCORRECT — find closest match
    let closestMatch = 0;
    for (const category of unsolvedCategories) {
      const matchCount = selectedWords.filter((w) =>
        category.words.includes(w)
      ).length;
      closestMatch = Math.max(closestMatch, matchCount);
    }

    const newLives = remainingLives - 1;
    const newStatus = newLives === 0 ? 'lost' : 'playing';

    const guessResult: GuessResult = {
      words: [...selectedWords],
      correct: false,
      wordDifficulties: selectedWords.map(getWordDifficulty),
    };

    set({
      selectedWords: [],
      remainingLives: newLives,
      previousGuesses: [...previousGuesses, selectedWords],
      gameStatus: newStatus,
      endTime: newStatus === 'lost' ? Date.now() : null,
      hintedWord: null,
      toastMessage:
        closestMatch === 3
          ? 'one_away'
          : closestMatch === 2
          ? '2 of 4 are in the same group'
          : closestMatch <= 1
          ? 'Spread across different groups'
          : `${closestMatch} of 4 in the same group`,
      guessHistory: [...state.guessHistory, guessResult],
    });

    return { result: 'incorrect' as const, closestMatch };
  },

  shuffleWords: () => {
    const { allWords, gameStatus } = get();
    if (gameStatus !== 'playing') return;
    set({
      allWords: fisherYatesShuffle(allWords),
      selectedWords: [],
      hintedWord: null,
    });
  },

  deselectAll: () => {
    set({ selectedWords: [], hintedWord: null });
  },

  useHint: (hintsRemaining: number) => {
    if (hintsRemaining <= 0) return null;

    const { solvedCategories, allWords, puzzle, gameStatus, hintedCategoryLabel, hintedWords } = get();
    if (gameStatus !== 'playing') return null;

    const solvedLabels = new Set(solvedCategories.map((c) => c.label));
    const unsolved = puzzle.categories
      .filter((c) => !solvedLabels.has(c.label))
      .sort((a, b) => a.difficulty - b.difficulty); // easiest first

    if (unsolved.length === 0) return null;

    // Continue hinting the current category if it's still unsolved and has unrevealed words
    let targetCategory = unsolved.find((c) => c.label === hintedCategoryLabel);
    let currentHintedWords = hintedWords;

    if (targetCategory) {
      // Check if there are unrevealed words left in this category
      const unrevealed = targetCategory.words.filter(
        (w) => allWords.includes(w) && !currentHintedWords.includes(w)
      );
      if (unrevealed.length === 0) {
        // All words in current hint category revealed — move to next easiest
        targetCategory = unsolved.find((c) => c.label !== hintedCategoryLabel);
        currentHintedWords = [];
      }
    }

    if (!targetCategory) {
      // No current hint category — start with easiest unsolved
      targetCategory = unsolved[0];
      currentHintedWords = [];
    }

    const unrevealed = targetCategory.words.filter(
      (w) => allWords.includes(w) && !currentHintedWords.includes(w)
    );

    if (unrevealed.length === 0) return null;

    const word = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    const newHintedWords = [...currentHintedWords, word];
    const isFirst = currentHintedWords.length === 0;

    set({
      hintedWord: word,
      hintedCategoryLabel: targetCategory.label,
      hintedWords: newHintedWords,
      hintsUsed: get().hintsUsed + 1,
      toastMessage: isFirst
        ? `hint:${targetCategory.label}: ${word} is in this group`
        : `hint:${targetCategory.label}: ${word} is also in this group`,
    });

    return { word, categoryLabel: targetCategory.label };
  },

  clearToast: () => {
    set({ toastMessage: null });
  },

  retryAfterAd: () => {
    set({
      remainingLives: APP_CONFIG.maxLives,
      gameStatus: 'playing',
      endTime: null,
      previousGuesses: [],
    });
  },

  reset: () => {
    set(initialState);
  },
}));
