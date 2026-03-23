import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface HintModalProps {
  adLoaded: boolean;
  hints10Price: string;
  hints25Price: string;
  onWatchAd: () => void;
  onBuyHints10: () => void;
  onBuyHints25: () => void;
  onDismiss: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  adLoaded,
  hints10Price,
  hints25Price,
  onWatchAd,
  onBuyHints10,
  onBuyHints25,
  onDismiss,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Out of hints! {'\uD83D\uDCA1'}
        </Text>

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
            {adLoaded ? '\u25B6 Watch ad for 1 free hint' : 'Loading ad...'}
          </Text>
        </Pressable>

        {hints10Price ? (
          <Pressable
            style={[styles.option, { backgroundColor: colors.priceBtnBg }]}
            onPress={onBuyHints10}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              Buy 10 hints \u2014 {hints10Price}
            </Text>
          </Pressable>
        ) : null}

        {hints25Price ? (
          <Pressable
            style={[styles.option, { backgroundColor: colors.priceBtnBg }]}
            onPress={onBuyHints25}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              Buy 25 hints \u2014 {hints25Price}
            </Text>
          </Pressable>
        ) : null}

        <Pressable style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={[styles.dismissText, { color: colors.textTertiary }]}>
            No thanks
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
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  option: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionTextWhite: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dismissBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 14,
  },
});
