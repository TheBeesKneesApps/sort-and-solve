import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface TimeStatsProps {
  averageTime: string;
  fastestTime: string;
  slowestTime: string;
}

export const TimeStats: React.FC<TimeStatsProps> = ({
  averageTime,
  fastestTime,
  slowestTime,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.title, { color: colors.text }]}>Solve Times</Text>
      <View style={styles.row}>
        <TimeItem label="Average" value={averageTime} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <TimeItem label="Fastest" value={fastestTime} colors={colors} />
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <TimeItem label="Slowest" value={slowestTime} colors={colors} />
      </View>
    </View>
  );
};

interface TimeItemProps {
  label: string;
  value: string;
  colors: { text: string; textTertiary: string };
}

const TimeItem: React.FC<TimeItemProps> = ({ label, value, colors }) => (
  <View style={styles.timeItem}>
    <Text style={[styles.timeValue, { color: colors.text }]}>{value}</Text>
    <Text style={[styles.timeLabel, { color: colors.textTertiary }]}>{label}</Text>
  </View>
);

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
    justifyContent: 'space-around',
  },
  timeItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
  },
});
