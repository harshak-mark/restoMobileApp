// 1. Imports
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

import Logo from '../../assets/LOGO.svg';
import GirlFaceBg from '../../assets/images/start/girlfacebg.svg';
import LoginBg from '../../assets/images/start/loginbg.svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// 2. Component
export default function LandingScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <LoginBg style={StyleSheet.absoluteFill} />

      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Logo width={SCREEN_HEIGHT < 700 ? 130 : 150} height={SCREEN_HEIGHT < 700 ? 38 : 44} />
        </View>

        <View style={styles.heroWrapper}>
          <GirlFaceBg
            width={SCREEN_HEIGHT < 700 ? 240 : 280}
            height={SCREEN_HEIGHT < 700 ? 240 : 280}
          />
        </View>

        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Best food for{'\n'}your taste
        </Text>

        <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
          Discover delectable cuisine and unforgettable moments
          in our welcoming, culinary haven.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.buttonPrimary }]}
        >
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 3. Styles (AT THE BOTTOM of the SAME FILE)
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logoWrapper: {
    marginTop: SCREEN_HEIGHT * 0.06,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },

  heroWrapper: {
    marginBottom: SCREEN_HEIGHT * 0.03,
  },

  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: SCREEN_HEIGHT < 700 ? 42 : 48,
    lineHeight: SCREEN_HEIGHT < 700 ? 46 : 52,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },

  subtitle: {
    fontFamily: 'Inter_300Light',
    fontSize: SCREEN_HEIGHT < 700 ? 12 : 13,
    lineHeight: SCREEN_HEIGHT < 700 ? 16 : 18,
    textAlign: 'center',
    maxWidth: SCREEN_HEIGHT < 700 ? 300 : 320,
    marginBottom: SCREEN_HEIGHT * 0.035,
  },

  button: {
    height: SCREEN_HEIGHT < 700 ? 50 : 56,
    paddingHorizontal: SCREEN_HEIGHT < 700 ? 35 : 40,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: SCREEN_HEIGHT < 700 ? 18 : 20,
  },
});