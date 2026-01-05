import { router } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../src/theme/useTheme';

import Logo from '../assets/LOGO.svg';
import GirlFaceBg from '../assets/images/start/girlfacebg.svg';
import LoginBg from '../assets/images/start/loginbg.svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LandingScreen() {
  const { theme } = useTheme();

  return (
    <View style={styles.root}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Logo width={143} height={48.5} />
      </View>

      {/* Background starts BELOW logo */}
      <View style={styles.bgWrapper}>
        <LoginBg style={styles.bgSvg} />

        {/* Content over background */}
        <View style={styles.content}>
          {/* Hero */}
          <View style={styles.heroWrapper}>
            <GirlFaceBg
              width={SCREEN_HEIGHT < 700 ? 240 : 280}
              height={SCREEN_HEIGHT < 700 ? 240 : 280}
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Best food for{'\n'}your taste
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: theme.textPrimary }]}>
            Discover delectable cuisine and unforgettable moments
            in our welcoming, culinary haven.
          </Text>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonPrimary }]}
            onPress={() => router.push('/login')}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>
              Get Started
            </Text>
          </TouchableOpacity>

          {/* Bottom translucent background */}
          <View style={styles.bottomBg} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  logoWrapper: {
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.06,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },

  /* Background wrapper starts below logo */
  bgWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bgSvg: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  heroWrapper: {
    marginTop: SCREEN_HEIGHT * 0.03,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },

  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: SCREEN_HEIGHT < 700 ? 42 : 48,
    lineHeight: SCREEN_HEIGHT < 700 ? 46 : 52,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.025,
    marginTop: SCREEN_HEIGHT * 0.01,
  },

  subtitle: {
    fontFamily: 'Inter_300Light',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: SCREEN_HEIGHT * 0.035,
  },

  button: {
    height: 56,
    paddingHorizontal: 40,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.05,
  },

  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
  },
bottomBg: {
  position: 'absolute',
  top: '99%',
  bottom: 0,
  width: '100%',
  height: SCREEN_HEIGHT * 0.22,   // controls semicircle height
  backgroundColor: '#FB8C0080',
  borderTopLeftRadius: SCREEN_HEIGHT * 0.22,
  borderTopRightRadius: SCREEN_HEIGHT * 0.22,
},
});