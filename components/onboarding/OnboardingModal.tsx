import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface OnboardingModalProps {
  onDismiss: () => void;
}

const SCREENS = [
  {
    title: 'How to play',
    description: 'Find 4 groups of 4 words that share something in common.',
    details: 'Tap words to select them, then hit Submit to check your guess.',
    visual: '\uD83D\uDFEA \uD83D\uDFE9 \uD83D\uDFE7 \uD83D\uDFE6',
  },
  {
    title: 'Be careful!',
    description: 'You only get 4 mistakes before the game is over.',
    details: 'Some words may seem to fit in multiple groups \u2014 look for the connection that links exactly 4.',
    visual: '\u25CF \u25CF \u25CF \u25CF',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onDismiss }) => {
  const { colors } = useTheme();
  const [page, setPage] = useState(0);
  const screen = SCREENS[page];
  const isLast = page === SCREENS.length - 1;

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={styles.visual}>{screen.visual}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{screen.title}</Text>
        <Text style={[styles.description, { color: colors.text }]}>{screen.description}</Text>
        <Text style={[styles.details, { color: colors.textSecondary }]}>{screen.details}</Text>

        <View style={styles.dots}>
          {SCREENS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === page ? colors.text : colors.divider },
                i === page && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: colors.submitBg }]}
          onPress={() => {
            if (isLast) {
              onDismiss();
            } else {
              setPage(page + 1);
            }
          }}
        >
          <Text style={[styles.buttonText, { color: colors.submitText }]}>
            {isLast ? 'Got it' : 'Next'}
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
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  visual: {
    fontSize: 28,
    marginBottom: 16,
    letterSpacing: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  details: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
