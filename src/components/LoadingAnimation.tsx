import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface LoadingAnimationProps {
  onComplete?: () => void;
  rounds?: number;
}

export default function LoadingAnimation({ onComplete, rounds = 3 }: LoadingAnimationProps) {
  const { theme } = useTheme();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate from 0 to rounds (3) over rounds * 1000ms
    Animated.timing(rotation, {
      toValue: rounds,
      duration: rounds * 1000, // Total duration for all rounds
      useNativeDriver: true,
    }).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, rounds],
    outputRange: ['0deg', `${rounds * 360}deg`],
  });

  const dotPositions = [
    { top: 0, left: 0 }, // Top-left
    { top: 0, right: 0 }, // Top-right
    { bottom: 0, right: 0 }, // Bottom-right
    { bottom: 0, left: 0 }, // Bottom-left
  ];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dotsContainer,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      >
        {dotPositions.map((position, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: theme.buttonPrimary,
                ...position,
              },
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
  },
});

