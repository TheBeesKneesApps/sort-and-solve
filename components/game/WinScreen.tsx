import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PuzzleCategory } from '../../types';
import { SolvedCategory } from './SolvedCategory';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface WinScreenProps {
  categories: PuzzleCategory[];
  timeTaken: number;
  mistakes: number;
  hintsUsed: number;
  streak: number;
  isDaily: boolean;
  onShare: () => void;
  onNext: () => void;
}

export const WinScreen: React.FC<WinScreenProps> = ({
  categories,
  timeTaken,
  mistakes,
  hintsUsed,
  streak,
  isDaily,
  onShare,
  onNext,
}) => {
  const { colors } = useTheme();
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{'\uD83C\uDF89'}</Text>
        <Text style={[styles.title, { color: colors.text }]}>Solved!</Text>
      </View>

      <View style={styles.categories}>
        {categories.map((cat, i) => (
          <SolvedCategory key={cat.label} category={cat} index={i} />
        ))}
      </View>

      <View style={[styles.statsRow, { borderColor: colors.divider }]}>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>{timeStr}</Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>time</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>{mistakes}</Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>mistakes</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.text }]}>{hintsUsed}</Text>
          <Text style={[styles.statLabel, { color: colors.textTertiary }]}>hints</Text>
        </View>
        {isDaily && (
          <>
            <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: shared.accent }]}>{streak}</Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                {'\uD83D\uDD25'} streak
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Button label="Share result" onPress={onShare} primary style={styles.actionBtn} />
        <Button label="Next puzzle" onPress={onNext} style={styles.actionBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  categories: {
    gap: 6,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
  },
  statDivider: {
    width: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
