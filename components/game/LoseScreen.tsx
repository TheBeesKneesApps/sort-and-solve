import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PuzzleCategory } from '../../types';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { categoryColors, shared } from '../../constants/colors';

interface LoseScreenProps {
  allCategories: PuzzleCategory[];
  solvedCategories: PuzzleCategory[];
  onRetry: () => void;
  onShare: () => void;
  onNext: () => void;
}

export const LoseScreen: React.FC<LoseScreenProps> = ({
  allCategories,
  solvedCategories,
  onRetry,
  onShare,
  onNext,
}) => {
  const { colors } = useTheme();
  const solvedLabels = new Set(solvedCategories.map((c) => c.label));
  const foundCount = solvedCategories.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: shared.error }]}>OUT OF LIVES</Text>
        <Text style={[styles.title, { color: colors.text }]}>So close!</Text>
        <Text style={[styles.found, { color: colors.textSecondary }]}>
          You found {foundCount} of 4 groups
        </Text>
      </View>

      <View style={styles.categories}>
        {allCategories.map((cat) => {
          const isSolved = solvedLabels.has(cat.label);
          return (
            <View key={cat.label} style={{ opacity: isSolved ? 1 : 0.55 }}>
              <View
                style={[
                  styles.categoryBar,
                  { backgroundColor: categoryColors[cat.difficulty - 1] },
                ]}
              >
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <Text style={styles.categoryWords}>
                  {cat.words.join('  \u00B7  ')}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <Button
        label="Watch ad to retry"
        onPress={onRetry}
        warning
        style={styles.retryBtn}
      />

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
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  found: {
    fontSize: 13,
    marginTop: 4,
  },
  categories: {
    gap: 6,
    marginBottom: 16,
  },
  categoryBar: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 56,
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: shared.categoryTextPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  categoryWords: {
    fontSize: 12,
    color: shared.categoryTextSecondary,
    marginTop: 3,
    fontWeight: '400',
  },
  retryBtn: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});
