import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface PacksCardProps {
  onPress: () => void;
  showNewBadge?: boolean;
}

export const PacksCard: React.FC<PacksCardProps> = ({ onPress, showNewBadge }) => {
  const { colors, isDark } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>Puzzle packs</Text>
            {showNewBadge && (
              <View style={[styles.newBadge, { backgroundColor: isDark ? shared.accentLightDark : shared.accentLight }]}>
                <Text style={[styles.newBadgeText, { color: shared.accent }]}>NEW</Text>
              </View>
            )}
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Music, movies, sports & more
          </Text>
        </View>
        <Text style={[styles.arrow, { color: colors.textTertiary }]}>{'\u203A'}</Text>
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
  left: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    fontSize: 11,
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
});
