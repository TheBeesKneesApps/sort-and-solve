import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { triggerHaptic } from '../../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WordTileProps {
  word: string;
  isSelected: boolean;
  isHinted: boolean;
  isShaking: boolean;
  onPress: (word: string) => void;
}

export const WordTile: React.FC<WordTileProps> = ({
  word,
  isSelected,
  isHinted,
  isShaking,
  onPress,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 50 }),
      withSpring(1, { damping: 15, stiffness: 400 })
    );
    triggerHaptic('selection');
    onPress(word);
  }, [word, onPress, scale]);

  React.useEffect(() => {
    if (isShaking) {
      translateX.value = withSequence(
        withTiming(-6, { duration: 40 }),
        withTiming(6, { duration: 40 }),
        withTiming(-4, { duration: 40 }),
        withTiming(4, { duration: 40 }),
        withTiming(-2, { duration: 40 }),
        withTiming(0, { duration: 40 })
      );
    }
  }, [isShaking, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const backgroundColor = isSelected
    ? colors.tileSelected
    : isHinted
    ? colors.tileHintBg
    : colors.tileBg;

  const textColor = isSelected ? colors.tileSelectedText : colors.text;
  const borderColor = isSelected
    ? colors.tileSelectedBorder
    : isHinted
    ? colors.tileHintBorder
    : 'transparent';

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.tile, animatedStyle, { backgroundColor, borderColor }]}
    >
      <Text
        style={[styles.text, { color: textColor }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {word}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
