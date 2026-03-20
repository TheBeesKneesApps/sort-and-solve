import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { categoryColors, shared } from '../../constants/colors';
import { Puzzle, PuzzleResult } from '../../types';

interface PuzzleGridProps {
  puzzles: Puzzle[];
  puzzleResults: Record<string, PuzzleResult>;
  completedPuzzles: string[];
  onPuzzlePress: (puzzle: Puzzle) => void;
}

const CELLS_PER_ROW = 5;

const getCellColor = (result: PuzzleResult | undefined, isDark: boolean): string | null => {
  if (!result) return null;
  if (result.solvedCategories < 4) return isDark ? '#3A3A3E' : '#D5D5D3';
  const idx = Math.min(result.mistakes, 3);
  return categoryColors[idx];
};

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  puzzles,
  puzzleResults,
  completedPuzzles,
  onPuzzlePress,
}) => {
  const { colors, isDark } = useTheme();
  const completedSet = new Set(completedPuzzles);
  const firstUnplayed = puzzles.find((p) => !completedSet.has(p.id));

  const rows: Puzzle[][] = [];
  for (let i = 0; i < puzzles.length; i += CELLS_PER_ROW) {
    rows.push(puzzles.slice(i, i + CELLS_PER_ROW));
  }

  return (
    <ScrollView
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
    >
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((puzzle, ci) => {
            const num = ri * CELLS_PER_ROW + ci + 1;
            const isCompleted = completedSet.has(puzzle.id);
            const isNext = puzzle.id === firstUnplayed?.id;
            const result = puzzleResults[puzzle.id];
            const bgColor = getCellColor(result, isDark);
            const isPerfect = result && result.mistakes === 0 && result.solvedCategories === 4;
            const isFailed = result && result.solvedCategories < 4;

            return (
              <Pressable
                key={puzzle.id}
                style={[
                  styles.cell,
                  {
                    backgroundColor: bgColor ?? colors.card,
                    borderColor: isNext ? shared.accent : colors.cardBorder,
                    borderWidth: isNext ? 2 : 1,
                  },
                ]}
                onPress={() => onPuzzlePress(puzzle)}
              >
                <Text
                  style={[
                    styles.cellNumber,
                    {
                      color: isCompleted ? '#FFFFFF' : colors.text,
                      fontWeight: isNext ? '700' : '600',
                    },
                  ]}
                >
                  {num}
                </Text>
                {isPerfect && <Text style={styles.starIcon}>{'\u2605'}</Text>}
                {isFailed && <Text style={styles.failIcon}>{'\u2715'}</Text>}
              </Pressable>
            );
          })}
          {row.length < CELLS_PER_ROW &&
            Array.from({ length: CELLS_PER_ROW - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.cellEmpty} />
            ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellEmpty: {
    flex: 1,
    aspectRatio: 1,
  },
  cellNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  starIcon: {
    position: 'absolute',
    top: 3,
    right: 4,
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
  },
  failIcon: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 8,
    color: 'rgba(255,255,255,0.5)',
  },
});
