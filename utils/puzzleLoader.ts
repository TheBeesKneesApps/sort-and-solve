import { Puzzle } from '../types';

const puzzleCache: Record<string, Puzzle[]> = {};

const puzzleFiles: Record<string, Puzzle[]> = {
  free: require('../data/puzzles/free.json'),
  daily: require('../data/puzzles/daily.json'),
  nfl: require('../data/puzzles/nfl.json'),
  'pop-culture': require('../data/puzzles/pop-culture.json'),
  science: require('../data/puzzles/science.json'),
  rap: require('../data/puzzles/rap.json'),
  rock: require('../data/puzzles/rock.json'),
  '90s-movies': require('../data/puzzles/90s-movies.json'),
};

export function loadPuzzles(packId: string): Puzzle[] {
  if (puzzleCache[packId]) {
    return puzzleCache[packId];
  }

  const data = puzzleFiles[packId];
  if (!data) {
    return [];
  }

  puzzleCache[packId] = data;
  return data;
}

export function getPuzzleById(puzzleId: string): Puzzle | null {
  for (const packId of Object.keys(puzzleFiles)) {
    const puzzles = loadPuzzles(packId);
    const puzzle = puzzles.find((p) => p.id === puzzleId);
    if (puzzle) return puzzle;
  }
  return null;
}

export function getNextUnsolvedPuzzle(
  packId: string,
  completedPuzzles: string[]
): Puzzle | null {
  const puzzles = loadPuzzles(packId);
  const completedSet = new Set(completedPuzzles);
  return puzzles.find((p) => !completedSet.has(p.id)) ?? null;
}

export function getPackProgress(
  packId: string,
  completedPuzzles: string[]
): { completed: number; total: number } {
  const puzzles = loadPuzzles(packId);
  const completedSet = new Set(completedPuzzles);
  const completed = puzzles.filter((p) => completedSet.has(p.id)).length;
  return { completed, total: puzzles.length };
}
