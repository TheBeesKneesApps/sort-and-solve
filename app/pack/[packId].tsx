import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/common/Header';
import { PuzzleGrid } from '../../components/packs/PuzzleGrid';
import { useUserStore } from '../../stores/userStore';
import { useTheme } from '../../contexts/ThemeContext';
import { loadPuzzles } from '../../utils/puzzleLoader';
import { PACK_CATEGORIES } from '../../config/appConfig';
import { Puzzle } from '../../types';

const getPackName = (packId: string): string => {
  for (const cat of PACK_CATEGORIES) {
    for (const pack of cat.packs) {
      if (pack.id === packId) return pack.name;
    }
  }
  return 'Puzzles';
};

const getPackDataFile = (packId: string): string => {
  for (const cat of PACK_CATEGORIES) {
    for (const pack of cat.packs) {
      if (pack.id === packId) return pack.dataFile;
    }
  }
  return packId;
};

export default function PackBrowserScreen() {
  const { packId } = useLocalSearchParams<{ packId: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const completedPuzzles = useUserStore((s) => s.completedPuzzles);
  const puzzleResults = useUserStore((s) => s.puzzleResults);

  if (!packId) return null;

  const dataFile = getPackDataFile(packId);
  const puzzles = loadPuzzles(dataFile);
  const packName = getPackName(packId);
  const completedCount = puzzles.filter((p) => completedPuzzles.includes(p.id)).length;

  const handlePuzzlePress = (puzzle: Puzzle) => {
    const isCompleted = completedPuzzles.includes(puzzle.id);
    if (isCompleted) {
      router.push(`/game/${puzzle.id}?pack=${packId}&review=true`);
    } else {
      router.push(`/game/${puzzle.id}?pack=${packId}`);
    }
  };

  if (puzzles.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <Header title={packName} />
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
            Coming soon
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Header
        title={packName}
        rightElement={
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {completedCount}/{puzzles.length}
          </Text>
        }
      />
      <PuzzleGrid
        puzzles={puzzles}
        puzzleResults={puzzleResults}
        completedPuzzles={completedPuzzles}
        onPuzzlePress={handlePuzzlePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progress: {
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
