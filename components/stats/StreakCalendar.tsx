import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

export type DayStatus = 'solved' | 'failed' | 'missed' | 'freeze' | 'future';

interface StreakCalendarProps {
  days: { date: string; status: DayStatus }[];
}

const STATUS_COLORS: Record<DayStatus, string> = {
  solved: shared.success,
  failed: shared.accent,
  missed: '#4A4A4E',
  freeze: shared.category4,
  future: '#2A2A2E',
};

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ days }) => {
  const { colors, isDark } = useTheme();

  const getColor = (status: DayStatus): string => {
    if (status === 'missed') return isDark ? '#4A4A4E' : '#D5D5D3';
    if (status === 'future') return isDark ? '#2A2A2E' : '#ECECEA';
    return STATUS_COLORS[status];
  };

  // Organize into rows of 7
  const rows: { date: string; status: DayStatus }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.title, { color: colors.text }]}>30-Day Streak</Text>
      <View style={styles.dayLabels}>
        {DAY_LABELS.map((label, i) => (
          <Text key={i} style={[styles.dayLabel, { color: colors.textTertiary }]}>
            {label}
          </Text>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((day, dayIndex) => (
            <View
              key={dayIndex}
              style={[styles.cell, { backgroundColor: getColor(day.status) }]}
            />
          ))}
          {/* Fill remaining cells if row is incomplete */}
          {row.length < 7 &&
            Array.from({ length: 7 - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.cellPlaceholder} />
            ))}
        </View>
      ))}
      <View style={styles.legend}>
        <LegendItem color={shared.success} label="Solved" textColor={colors.textTertiary} />
        <LegendItem color={shared.accent} label="Failed" textColor={colors.textTertiary} />
        <LegendItem color={isDark ? '#4A4A4E' : '#D5D5D3'} label="Missed" textColor={colors.textTertiary} />
        <LegendItem color={shared.category4} label="Freeze" textColor={colors.textTertiary} />
      </View>
    </View>
  );
};

interface LegendItemProps {
  color: string;
  label: string;
  textColor: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label, textColor }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={[styles.legendText, { color: textColor }]}>{label}</Text>
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
    marginBottom: 10,
  },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '600',
    width: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  cell: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  cellPlaceholder: {
    width: 20,
    height: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
