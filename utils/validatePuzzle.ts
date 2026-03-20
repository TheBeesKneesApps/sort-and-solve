import { Puzzle, PuzzleCategory } from '../types';

interface ValidationError {
  puzzleId: string;
  error: string;
}

export const validatePuzzle = (puzzle: Puzzle): ValidationError[] => {
  const errors: ValidationError[] = [];
  const id = puzzle.id;

  if (!puzzle.id) {
    errors.push({ puzzleId: id, error: 'Missing puzzle ID' });
  }

  if (!puzzle.categories || puzzle.categories.length !== 4) {
    errors.push({ puzzleId: id, error: `Expected 4 categories, got ${puzzle.categories?.length ?? 0}` });
    return errors;
  }

  const allWords = new Set<string>();
  const difficulties = new Set<number>();

  for (const cat of puzzle.categories) {
    if (!cat.label) {
      errors.push({ puzzleId: id, error: 'Category missing label' });
    }

    if (!cat.words || cat.words.length !== 4) {
      errors.push({ puzzleId: id, error: `Category "${cat.label}" should have 4 words, got ${cat.words?.length ?? 0}` });
      continue;
    }

    if (cat.difficulty < 1 || cat.difficulty > 4) {
      errors.push({ puzzleId: id, error: `Category "${cat.label}" has invalid difficulty: ${cat.difficulty}` });
    }

    difficulties.add(cat.difficulty);

    for (const word of cat.words) {
      if (allWords.has(word)) {
        errors.push({ puzzleId: id, error: `Duplicate word: "${word}"` });
      }
      allWords.add(word);
    }
  }

  if (allWords.size !== 16) {
    errors.push({ puzzleId: id, error: `Expected 16 unique words, got ${allWords.size}` });
  }

  if (difficulties.size !== 4) {
    errors.push({ puzzleId: id, error: `Expected 4 unique difficulties, got ${difficulties.size}` });
  }

  return errors;
};

export const validatePuzzleSet = (puzzles: Puzzle[]): ValidationError[] => {
  const allErrors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const puzzle of puzzles) {
    if (ids.has(puzzle.id)) {
      allErrors.push({ puzzleId: puzzle.id, error: 'Duplicate puzzle ID' });
    }
    ids.add(puzzle.id);
    allErrors.push(...validatePuzzle(puzzle));
  }

  return allErrors;
};
