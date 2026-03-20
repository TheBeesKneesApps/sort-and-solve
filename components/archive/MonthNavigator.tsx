import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';

interface MonthNavigatorProps {
  year: number;
  month: number;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
  year,
  month,
  canGoNext,
  onPrevious,
  onNext,
}) => {
  const { colors } = useTheme();
  const monthLabel = format(new Date(year, month, 1), 'MMMM yyyy');

  return (
    <View style={styles.container}>
      <Pressable onPress={onPrevious} style={styles.arrow} hitSlop={12}>
        <Text style={[styles.arrowText, { color: colors.textSecondary }]}>{'\u2039'}</Text>
      </Pressable>
      <Text style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</Text>
      <Pressable
        onPress={onNext}
        style={styles.arrow}
        hitSlop={12}
        disabled={!canGoNext}
      >
        <Text
          style={[
            styles.arrowText,
            { color: canGoNext ? colors.textSecondary : colors.textTertiary },
          ]}
        >
          {'\u203A'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  arrow: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 28,
    fontWeight: '300',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
