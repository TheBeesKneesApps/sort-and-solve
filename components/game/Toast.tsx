import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { shared } from '../../constants/colors';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  const { colors } = useTheme();
  const isOneAway = message === 'one_away';
  const isHint = message.startsWith('hint:');

  let displayText = message;
  let textColor = colors.text;
  let borderColor = colors.cardBorder;

  if (isOneAway) {
    displayText = 'One away! \uD83D\uDD25';
    textColor = shared.accent;
    borderColor = shared.accent;
  } else if (isHint) {
    // Format: "hint:CATEGORY NAME: WORD is in this group"
    const content = message.slice(5); // remove "hint:"
    const colonIdx = content.indexOf(':');
    const categoryName = content.slice(0, colonIdx);
    const rest = content.slice(colonIdx + 1).trim();
    displayText = `${categoryName}: ${rest}`;
    textColor = shared.category1;
    borderColor = shared.category1;
  }

  return (
    <Animated.View
      entering={SlideInDown.duration(200)}
      exiting={FadeOut.duration(300)}
      style={[
        styles.toast,
        {
          backgroundColor: colors.card,
          borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.toastText,
          { color: textColor },
          (isOneAway || isHint) && styles.toastTextBold,
        ]}
      >
        {displayText}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 4,
    borderWidth: 1,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '500',
  },
  toastTextBold: {
    fontWeight: '600',
  },
});
