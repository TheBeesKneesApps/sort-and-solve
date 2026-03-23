import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface ArchiveUnlockModalProps {
  puzzleDate: string;
  archivePassPrice: string;
  adLoaded: boolean;
  onWatchAd: () => void;
  onBuyArchivePass: () => void;
  onDismiss: () => void;
}

export const ArchiveUnlockModal: React.FC<ArchiveUnlockModalProps> = ({
  puzzleDate,
  archivePassPrice,
  adLoaded,
  onWatchAd,
  onBuyArchivePass,
  onDismiss,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This puzzle is from
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>{puzzleDate}</Text>

        <Pressable
          style={[
            styles.option,
            {
              backgroundColor: shared.accent,
              opacity: adLoaded ? 1 : 0.5,
            },
          ]}
          onPress={onWatchAd}
          disabled={!adLoaded}
        >
          <Text style={styles.optionTextWhite}>
            {adLoaded ? '\u25B6 Watch ad to play' : 'Loading ad...'}
          </Text>
        </Pressable>

        {archivePassPrice ? (
          <Pressable
            style={[styles.passOption, { backgroundColor: colors.submitBg }]}
            onPress={onBuyArchivePass}
          >
            <Text style={[styles.passTitle, { color: colors.submitText }]}>
              Get Archive Pass
            </Text>
            <Text style={[styles.passSub, { color: colors.submitText, opacity: 0.6 }]}>
              Ad-free + all past puzzles \u2014 {archivePassPrice}
            </Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={[styles.dismissText, { color: colors.textTertiary }]}>
            Go back
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  card: {
    borderRadius: 14,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    gap: 10,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 13,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  option: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  optionTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  passOption: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  passTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  passSub: {
    fontSize: 11,
    marginTop: 2,
  },
  dismissBtn: {
    paddingVertical: 10,
  },
  dismissText: {
    fontSize: 14,
  },
});
