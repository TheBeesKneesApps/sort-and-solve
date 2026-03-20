import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

export type DayCellState = 'today' | 'solved' | 'missed_free' | 'missed_locked' | 'future';

interface DayInfo {
  day: number;
  state: DayCellState;
  puzzleId: string | null;
}

interface CalendarGridProps {
  year: number;
  month: number;
  days: DayInfo[];
  onDayPress: (puzzleId: string) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  days,
  onDayPress,
}) => {
  const { colors, isDark } = useTheme();

  // First day of the month (0 = Sunday)
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const getCellStyle = (state: DayCellState) => {
    switch (state) {
      case 'today':
        return { borderWidth: 2, borderColor: shared.accent };
      case 'solved':
        return { backgroundColor: shared.success };
      case 'missed_free':
        return { backgroundColor: isDark ? '#2A2A2E' : '#ECECEA' };
      case 'missed_locked':
        return { backgroundColor: isDark ? '#1A1A1E' : '#F0F0EE', opacity: 0.5 };
      case 'future':
        return { backgroundColor: isDark ? '#1A1A1E' : '#F5F5F3', opacity: 0.3 };
      default:
        return {};
    }
  };

  const getTextColor = (state: DayCellState): string => {
    if (state === 'solved') return '#FFFFFF';
    if (state === 'future' || state === 'missed_locked') return colors.textTertiary;
    return colors.text;
  };

  const isPlayable = (state: DayCellState): boolean =>
    state === 'today' || state === 'missed_free' || state === 'solved';

  return (
    <View style={styles.container}>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={[styles.weekdayLabel, { color: colors.textTertiary }]}>
            {label}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {blanks.map((i) => (
          <View key={`blank-${i}`} style={styles.cellWrapper} />
        ))}
        {days.map((day) => {
          const cellStyle = getCellStyle(day.state);
          const textColor = getTextColor(day.state);
          const playable = isPlayable(day.state);

          return (
            <View key={day.day} style={styles.cellWrapper}>
              <Pressable
                style={[styles.cell, { backgroundColor: colors.card }, cellStyle]}
                onPress={() => {
                  if (playable && day.puzzleId) {
                    onDayPress(day.puzzleId);
                  }
                }}
                disabled={!playable || !day.puzzleId}
              >
                <Text style={[styles.dayText, { color: textColor }]}>{day.day}</Text>
                {day.state === 'solved' && (
                  <Text style={styles.checkmark}>{'\u2713'}</Text>
                )}
                {day.state === 'missed_locked' && (
                  <Text style={[styles.lockIcon, { color: colors.textTertiary }]}>
                    {'\uD83D\uDD12'}
                  </Text>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekdayLabel: {
    fontSize: 11,
    fontWeight: '600',
    width: 44,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellWrapper: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 3,
  },
  cell: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -2,
  },
  lockIcon: {
    fontSize: 8,
    marginTop: -2,
  },
});
