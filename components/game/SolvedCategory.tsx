import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { PuzzleCategory } from '../../types';
import { categoryColors, shared } from '../../constants/colors';

interface SolvedCategoryProps {
  category: PuzzleCategory;
  index: number;
}

export const SolvedCategory: React.FC<SolvedCategoryProps> = ({
  category,
  index,
}) => {
  const bgColor = categoryColors[category.difficulty - 1];

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(index * 50)}
      style={[styles.bar, { backgroundColor: bgColor }]}
    >
      <Text style={styles.label}>{category.label}</Text>
      <Text style={styles.words}>{category.words.join('  \u00B7  ')}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bar: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 56,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: shared.categoryTextPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  words: {
    fontSize: 12,
    color: shared.categoryTextSecondary,
    marginTop: 3,
    fontWeight: '400',
  },
});
