import { Share, Platform } from 'react-native';
import { PuzzleCategory } from '../types';

const DIFFICULTY_EMOJIS: Record<number, string> = {
  1: '🟪',
  2: '🟩',
  3: '🟧',
  4: '🟦',
};

interface ShareParams {
  puzzleId: string;
  isDaily: boolean;
  guessHistory: GuessResult[];
  solvedCount: number;
  maxLives: number;
  livesRemaining: number;
}

export interface GuessResult {
  words: string[];
  correct: boolean;
  /** difficulty of each word's actual category */
  wordDifficulties: number[];
}

/**
 * Build the emoji grid showing how the player solved (or failed) the puzzle.
 * Each row = one guess. Each square = the difficulty color of that word's true category.
 */
const buildEmojiGrid = (guessHistory: GuessResult[]): string => {
  return guessHistory
    .map((guess) =>
      guess.wordDifficulties.map((d) => DIFFICULTY_EMOJIS[d] ?? '⬜').join('')
    )
    .join('\n');
};

export const buildShareText = ({
  puzzleId,
  isDaily,
  guessHistory,
  solvedCount,
  maxLives,
  livesRemaining,
}: ShareParams): string => {
  const title = isDaily ? 'Sort & Solve — Daily' : `Sort & Solve #${puzzleId}`;
  const score = `${solvedCount}/4`;
  const mistakes = maxLives - livesRemaining;
  const grid = buildEmojiGrid(guessHistory);

  return `${title}\n${score} groups found${mistakes > 0 ? ` · ${mistakes} mistake${mistakes !== 1 ? 's' : ''}` : ''}\n\n${grid}`;
};

export const shareResult = async (params: ShareParams): Promise<void> => {
  const message = buildShareText(params);
  try {
    await Share.share(
      Platform.OS === 'ios' ? { message } : { message, title: 'Sort & Solve' }
    );
  } catch {
    // User cancelled or share failed — fail silently
  }
};
