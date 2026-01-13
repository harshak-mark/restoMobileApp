import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LogoWhiteSvg from '../../assets/images/LOGOwhite.svg';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ViewScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const rotation = useSharedValue(0);

  const handlePhonePress = () => {
    router.push('/contact');
    setIsPopupOpen(false);
  };

  const handlePeoplePress = () => {
    router.push('/aboutus');
    setIsPopupOpen(false);
  };

  const handleCirclePress = () => {
    setIsPopupOpen(!isPopupOpen);
    rotation.value = withTiming(isPopupOpen ? 0 : 45, { duration: 250 });
  };

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require('../../assets/images/contactbg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Logo */}
        <View style={[styles.logoContainer, { paddingTop: insets.top + 80 }]}>
          <LogoWhiteSvg width={268} height={120} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.textLine}>world</Text>
          <Text style={styles.textLine}>greatest</Text>
          <Text style={styles.textLine}>food.</Text>
          <Text style={styles.textLine}>...</Text>
        </View>

        {/* Popup Icons - shown when circle is clicked */}
        {isPopupOpen && (
          <View style={[styles.popupContainer, { bottom: insets.bottom + 95 }]}>
            <TouchableOpacity
              style={[styles.popupIcon, { backgroundColor: theme.buttonPrimary }]}
              onPress={handlePeoplePress}
            >
              <Ionicons name="people-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.popupIcon, styles.popupIconMiddle, { backgroundColor: theme.buttonPrimary }]}
              onPress={handlePhonePress}
            >
              <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.popupIcon, { backgroundColor: theme.buttonPrimary }]}>
              <Ionicons name="location-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Circular Button */}
        <View style={[styles.circleContainer, { bottom: insets.bottom + 29 }]}>
          <TouchableOpacity
            onPress={handleCirclePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[
              styles.circleButton,
              isPopupOpen
                ? { backgroundColor: '#FFFFFF' }
                : { backgroundColor: theme.buttonPrimary },
            ]}
          >
            <Animated.View style={animatedIconStyle}>
              <Ionicons
                name={isPopupOpen ? 'close' : 'add'}
                size={24}
                color={isPopupOpen ? theme.buttonPrimary : '#FFFFFF'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <BottomNav active="view" buttonType="circle" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 110,
  },
  textLine: {
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    fontSize: 55,
    lineHeight: 55,
    letterSpacing: 0.55,
    textTransform: 'capitalize',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  popupContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  popupIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  popupIconMiddle: {
    marginTop: -10,
  },
  circleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
  circleButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

