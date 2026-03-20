import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';
import { getTodayDateString } from '../../utils/dailyPuzzle';

interface DailyPuzzleCardProps {
  isCompleted: boolean;
  onPress: () => void;
}

export const DailyPuzzleCard: React.FC<DailyPuzzleCardProps> = ({
  isCompleted,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.dailyCardBg }]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: colors.dailyCardText }]}>
            {'\uD83E\uDDE9'} Daily puzzle
          </Text>
          <Text style={[styles.date, { color: colors.dailyCardSubtext }]}>
            {getTodayDateString()}
          </Text>
        </View>
        {isCompleted ? (
          <Text style={[styles.completed, { color: shared.success }]}>
            Completed
          </Text>
        ) : (
          <Text style={[styles.arrow, { color: colors.dailyCardSubtext }]}>
            {'\u203A'}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 3,
  },
  completed: {
    fontSize: 13,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
});
