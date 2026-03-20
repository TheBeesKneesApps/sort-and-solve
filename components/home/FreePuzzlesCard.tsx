import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface FreePuzzlesCardProps {
  completed: number;
  total: number;
  onPress: () => void;
}

export const FreePuzzlesCard: React.FC<FreePuzzlesCardProps> = ({
  completed,
  total,
  onPress,
}) => {
  const { colors } = useTheme();
  const progress = total > 0 ? completed / total : 0;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      <View style={styles.row}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Free puzzles</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {completed} of {total} completed
          </Text>
        </View>
        <Text style={[styles.arrow, { color: colors.textTertiary }]}>{'\u203A'}</Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
        <View
          style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: shared.success }]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  progressTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
