import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface StatItemProps {
  value: string | number;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{label}</Text>
    </View>
  );
};

interface TopStatsRowProps {
  played: number;
  winPercent: number;
  currentStreak: number;
  bestStreak: number;
}

export const TopStatsRow: React.FC<TopStatsRowProps> = ({
  played,
  winPercent,
  currentStreak,
  bestStreak,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <StatItem value={played} label="Played" />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <StatItem value={`${winPercent}%`} label="Win %" />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <StatItem value={currentStreak} label="Current" />
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <StatItem value={bestStreak} label="Best" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 32,
  },
});
