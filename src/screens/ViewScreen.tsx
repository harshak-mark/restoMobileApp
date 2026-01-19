import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const popupOpacity = useSharedValue(0);
  const popupTranslateY = useSharedValue(20);

  useEffect(() => {
    if (isPopupOpen) {
      popupOpacity.value = withTiming(1, { duration: 250 });
      popupTranslateY.value = withTiming(0, { duration: 250 });
    } else {
      popupOpacity.value = withTiming(0, { duration: 200 });
      popupTranslateY.value = withTiming(20, { duration: 200 });
    }
  }, [isPopupOpen]);

  const popupAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: popupOpacity.value,
      transform: [{ translateY: popupTranslateY.value }],
    };
  });

  const handlePhonePress = () => {
    router.push('/contact');
    setIsPopupOpen(false);
  };

  const handlePeoplePress = () => {
    router.push('/aboutus');
    setIsPopupOpen(false);
  };

  const handleLocationPress = () => {
    router.push('/settings/delivery-address');
    setIsPopupOpen(false);
  };

  const handleCirclePress = () => {
    setIsPopupOpen(!isPopupOpen);
  };

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
          <Animated.View style={[styles.popupContainer, { bottom: insets.bottom + 75 }, popupAnimatedStyle]}>
            <View 
              style={styles.popupIconWrapper}
              {...({ onMouseEnter: () => setHoveredIcon('people'), onMouseLeave: () => setHoveredIcon(null) } as any)}
            >
              {hoveredIcon === 'people' && <Text style={styles.popupLabel}>About</Text>}
              <TouchableOpacity
                style={[styles.popupIcon, { backgroundColor: theme.buttonPrimary }]}
                onPress={handlePeoplePress}
              >
                <Ionicons name="people-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View 
              style={[styles.popupIconWrapper, styles.popupIconWrapperMiddle]}
              {...({ onMouseEnter: () => setHoveredIcon('phone'), onMouseLeave: () => setHoveredIcon(null) } as any)}
            >
              {hoveredIcon === 'phone' && <Text style={styles.popupLabelMiddle}>Contact</Text>}
              <TouchableOpacity
                style={[styles.popupIcon, styles.popupIconMiddle, { backgroundColor: theme.buttonPrimary }]}
                onPress={handlePhonePress}
              >
                <Ionicons name="call-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View 
              style={styles.popupIconWrapper}
              {...({ onMouseEnter: () => setHoveredIcon('location'), onMouseLeave: () => setHoveredIcon(null) } as any)}
            >
              {hoveredIcon === 'location' && <Text style={styles.popupLabel}>Location</Text>}
              <TouchableOpacity 
                style={[styles.popupIcon, { backgroundColor: theme.buttonPrimary }]}
                onPress={handleLocationPress}
              >
                <Ionicons name="location-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ImageBackground>

      <BottomNav 
        active="view" 
        buttonType="circle" 
        onCirclePress={handleCirclePress}
        isPopupOpen={isPopupOpen}
      />
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
    zIndex: 1001, // Above BottomNav (z-index 1000)
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
    marginTop: -40,
  },
  popupIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  popupIconWrapperMiddle: {
    marginTop: -40,
  },
  popupLabel: {
    position: 'absolute',
    top: -28,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  popupLabelMiddle: {
    position: 'absolute',
    top: -68,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});

