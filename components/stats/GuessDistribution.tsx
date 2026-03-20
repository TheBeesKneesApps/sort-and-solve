import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface GuessDistributionProps {
  distribution: Record<string, number>;
}

const BAR_COLORS: Record<string, string> = {
  '0': shared.category1,
  '1': shared.category2,
  '2': shared.category3,
  '3': shared.category4,
  'X': shared.error,
};

const LABELS: Record<string, string> = {
  '0': '0 mistakes',
  '1': '1 mistake',
  '2': '2 mistakes',
  '3': '3 mistakes',
  'X': 'Failed',
};

export const GuessDistribution: React.FC<GuessDistributionProps> = ({ distribution }) => {
  const { colors } = useTheme();
  const maxValue = Math.max(...Object.values(distribution), 1);

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.title, { color: colors.text }]}>Guess Distribution</Text>
      {(['0', '1', '2', '3', 'X'] as const).map((key) => {
        const count = distribution[key] ?? 0;
        const widthPercent = maxValue > 0 ? Math.max((count / maxValue) * 100, 8) : 8;

        return (
          <View key={key} style={styles.row}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {LABELS[key]}
            </Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: BAR_COLORS[key],
                    width: `${widthPercent}%`,
                  },
                ]}
              >
                <Text style={styles.barText}>{count}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    width: 80,
  },
  barContainer: {
    flex: 1,
  },
  bar: {
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    minWidth: 28,
  },
  barText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
