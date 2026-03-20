import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface NotificationPromptProps {
  onAccept: () => void;
  onDismiss: () => void;
}

export const NotificationPrompt: React.FC<NotificationPromptProps> = ({
  onAccept,
  onDismiss,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Daily reminder?</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Get a gentle nudge at 9 AM so you never miss the daily puzzle.
        </Text>
        <Pressable style={[styles.acceptBtn, { backgroundColor: colors.submitBg }]} onPress={onAccept}>
          <Text style={[styles.acceptText, { color: colors.submitText }]}>Yes, remind me</Text>
        </Pressable>
        <Pressable style={styles.dismissBtn} onPress={onDismiss}>
          <Text style={[styles.dismissText, { color: colors.textTertiary }]}>No thanks</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  acceptBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  acceptText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dismissBtn: {
    paddingVertical: 10,
  },
  dismissText: {
    fontSize: 14,
  },
});
