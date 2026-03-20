import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  label: string;
  onPress: () => void;
  primary?: boolean;
  warning?: boolean;
  small?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  primary,
  warning,
  small,
  disabled,
  style,
}) => {
  const { colors } = useTheme();

  const backgroundColor = disabled && primary
    ? colors.submitDisabledBg
    : primary
    ? colors.submitBg
    : warning
    ? colors.warningBg
    : 'transparent';

  const textColor = disabled && primary
    ? colors.submitDisabledText
    : primary
    ? colors.submitText
    : warning
    ? colors.warningText
    : colors.text;

  const borderColor =
    primary || warning ? 'transparent' : colors.buttonBorder;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        small && styles.small,
        {
          backgroundColor,
          borderColor,
          borderWidth: primary || warning ? 0 : 1.5,
          opacity: disabled && !primary ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          small && styles.smallLabel,
          { color: textColor },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  smallLabel: {
    fontSize: 13,
  },
});
