import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SixSideBoxWhiteSvg from '../../assets/images/6sidebox-white.svg';
import SixSideBoxSvg from '../../assets/images/6sidebox.svg';
import SubtractBorderSvg from '../../assets/images/food/icons/Subtractborder.svg';
import { useAppSelector } from '../store/hooks';
import { selectCartCount } from '../store/slices/cartSlice';
import type { RootState } from '../store/store';
import { useTheme } from '../theme/useTheme';

type TabKey = 'home' | 'menu' | 'cart' | 'view';

interface BottomNavProps {
  active?: TabKey;
}

const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const { theme } = useTheme();
  const cartCount = useAppSelector((state) => selectCartCount(state as RootState));
  const insets = useSafeAreaInsets();
  const hasNavButtons = insets.bottom > 0;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Calculate dynamic spacing based on navigation buttons
  // Ensure nav is positioned above system navigation buttons
  const baseNavHeight = 60; // Base height without safe area
  const svgHeight = baseNavHeight; // SVG height without safe area - we position above system buttons
  const hexagonBottom = 25; // Hexagon position relative to nav
  // Increase nav bar height to accommodate icons and labels properly
  const navBarHeight = 50;
  const navBarPaddingBottom = 0; // No padding bottom since we're positioned above system buttons
  const navBarPaddingTop = 8; // Add padding top to ensure visibility

  const iconColor = (key: TabKey) => (active === key ? theme.iconActive : theme.iconColor);

  return (
    <>
      {/* Orange background for system navigation buttons area */}
      {hasNavButtons && (
        <View style={[styles.systemButtonsBackground, { height: insets.bottom }]} />
      )}
      
      <View style={[styles.wrapper, { bottom: insets.bottom }]}>
        {/* Background color for nav area */}
        <View style={[styles.navBackground, { height: svgHeight }]} />
        
        <View style={styles.footerSvgWrapper}>
          <SubtractBorderSvg width="100%" height={svgHeight} preserveAspectRatio="none" />
        </View>

        {/* Popup Icons - shown when popup is open */}
        {isPopupOpen && (
          <View style={[styles.popupContainer, { bottom: hexagonBottom + 70 }]}>
            <TouchableOpacity style={[styles.popupIcon, { backgroundColor: theme.buttonPrimary }]}>
              <Ionicons name="people-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.popupIcon, styles.popupIconMiddle, { backgroundColor: theme.buttonPrimary }]}>
              <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.popupIcon, { backgroundColor: theme.buttonPrimary }]}>
              <Ionicons name="location-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.hexagonContainer, { bottom: hexagonBottom }]}>
          <TouchableOpacity onPress={() => setIsPopupOpen(!isPopupOpen)} style={styles.hexagonButton}>
            {isPopupOpen ? (
              <View style={styles.hexagonWrapper}>
                <SixSideBoxWhiteSvg width={54} height={61} />
                <View style={styles.iconOverlay}>
                  <Ionicons name="close" size={24} color={theme.buttonPrimary} />
                </View>
              </View>
            ) : (
              <SixSideBoxSvg width={54} height={61} />
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.bottomNavBar, { height: navBarHeight, paddingBottom: navBarPaddingBottom, paddingTop: navBarPaddingTop }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
            <Ionicons name="home" size={20} color={iconColor('home')} />
            <Text style={[styles.navLabel, { color: iconColor('home') }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/menu')}>
            <Ionicons name="restaurant-outline" size={20} color={iconColor('menu')} />
            <Text style={[styles.navLabel, { color: iconColor('menu') }]}>Menu</Text>
          </TouchableOpacity>

          <View style={styles.navItemCenter} />

          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/cart')}>
            <View>
              <Ionicons name="cart-outline" size={20} color={iconColor('cart')} />
              {cartCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.buttonPrimary }]}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navLabel, { color: iconColor('cart') }]}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="storefront-outline" size={20} color={iconColor('view')} />
            <Text style={[styles.navLabel, { color: iconColor('view') }]}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  systemButtonsBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FB8C00', // Orange background for system buttons area
    zIndex: 999,
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000, // High z-index to ensure nav is always on top
  },
  navBackground: {
    position: 'absolute',
    bottom: 0, // Position at bottom of wrapper (above system buttons)
    left: 0,
    right: 0,
    zIndex: 0,
  },
  footerSvgWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  hexagonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hexagonButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'center', // Center alignment for proper vertical centering
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    width: '100%',
    zIndex: 2,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    paddingBottom: 10,
  },
  navItemCenter: {
    width: 68,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  popupContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
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
    marginTop: -10, // Position phone icon slightly above the other two
  },
});

export default BottomNav;
