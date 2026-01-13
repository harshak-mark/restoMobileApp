import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Logo from '../../assets/LOGO.svg';
import LogoWhite from '../../assets/images/LOGOwhite.svg';
import { useTheme } from '../theme/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Phase = 'orange' | 'white-empty' | 'white-logo';

export default function SplashScreen() {
  const { theme } = useTheme();
  const [phase, setPhase] = useState<Phase>('orange');

  const logoOpacity = useSharedValue(0);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    // 1️⃣ Orange screen — 1s
    const t1 = setTimeout(() => {
      setPhase('white-empty');
    }, 1000);

    // 2️⃣ White screen (no logo) — 1s
    const t2 = setTimeout(() => {
      setPhase('white-logo');
      logoOpacity.value = withTiming(1, { duration: 600 });
    }, 2000);

    // 3️⃣ White + logo visible — 3s
    const t3 = setTimeout(() => {
      splashOpacity.value = withTiming(
        0,
        { duration: 600 },
        () => {
          runOnJS(navigateToLanding)();
        }
      );
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const navigateToLanding = () => {
    router.replace('/landing');
  };

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const getBackgroundColor = () => {
    if (phase === 'orange') {
      return theme.buttonPrimary;
    }
    return theme.background;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        splashStyle,
        {
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      {phase === 'white-logo' && (
        <Animated.View style={logoStyle}>
          {(theme as any).mode === 'dark' ? (
            <LogoWhite
              width={SCREEN_HEIGHT < 700 ? 150 : 180}
              height={SCREEN_HEIGHT < 700 ? 150 : 180}
            />
          ) : (
            <Logo
              width={SCREEN_HEIGHT < 700 ? 150 : 180}
              height={SCREEN_HEIGHT < 700 ? 150 : 180}
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});