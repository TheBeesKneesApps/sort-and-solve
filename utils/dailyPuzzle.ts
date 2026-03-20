import { APP_CONFIG } from '../config/appConfig';
import { loadPuzzles } from './puzzleLoader';
import { Puzzle } from '../types';

export function getDaysSinceEpoch(date?: Date): number {
  const epoch = new Date(APP_CONFIG.dailyPuzzleEpoch);
  epoch.setHours(0, 0, 0, 0);
  const target = date ?? new Date();
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDailyPuzzleForDate(date: Date): Puzzle | null {
  const daysSince = getDaysSinceEpoch(date);
  if (daysSince < 0) return null;
  const puzzles = loadPuzzles('daily');
  if (puzzles.length === 0) return null;
  const index = daysSince % puzzles.length;
  return puzzles[index] ?? null;
}

export function getDailyPuzzle(): Puzzle | null {
  return getDailyPuzzleForDate(new Date());
}

export function getDailyPuzzleIndex(): number {
  const puzzles = loadPuzzles('daily');
  if (puzzles.length === 0) return 0;
  return Math.abs(getDaysSinceEpoch()) % puzzles.length;
}

export function getTodayDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
