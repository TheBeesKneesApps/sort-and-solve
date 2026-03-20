import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { APP_CONFIG } from '../../config/appConfig';

interface LivesIndicatorProps {
  remaining: number;
}

const LifeDot: React.FC<{ active: boolean; justLost: boolean }> = ({
  active,
  justLost,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (justLost) {
      scale.value = withSequence(
        withTiming(1.6, { duration: 100 }),
        withSpring(1, { damping: 8, stiffness: 300 })
      );
    }
  }, [justLost, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        { backgroundColor: active ? colors.lifeDot : colors.lifeDotEmpty },
      ]}
    />
  );
};

export const LivesIndicator: React.FC<LivesIndicatorProps> = ({ remaining }) => {
  const prevRemaining = useRef(remaining);
  const justLostIndex = prevRemaining.current > remaining ? remaining : -1;

  useEffect(() => {
    prevRemaining.current = remaining;
  }, [remaining]);

  return (
    <View style={styles.container}>
      {Array.from({ length: APP_CONFIG.maxLives }).map((_, i) => (
        <LifeDot key={i} active={i < remaining} justLost={i === justLostIndex} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
