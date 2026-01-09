import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <View style={[styles.systemButtonsBackground, { height: insets.bottom, backgroundColor: theme.buttonPrimary }]} />
      )}
      
      <View style={[styles.wrapper, { bottom: insets.bottom }]}>
        {/* Background color for nav area */}
        <View style={[styles.navBackground, { height: svgHeight }]} />
        
        <View style={styles.footerSvgWrapper}>
          <SubtractBorderSvg width="100%" height={svgHeight} preserveAspectRatio="none" />
        </View>

        {/* Hexagon button - only show on non-view pages */}
        {active !== 'view' && (
          <View style={[styles.hexagonContainer, { bottom: hexagonBottom }]}>
            <TouchableOpacity style={styles.hexagonButton}>
              <SixSideBoxSvg width={54} height={61} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.bottomNavBar, { height: navBarHeight, paddingBottom: navBarPaddingBottom, paddingTop: navBarPaddingTop }]}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/home')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="home" size={20} color={iconColor('home')} />
            <Text style={[styles.navLabel, { color: iconColor('home') }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/menu')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="restaurant-outline" size={20} color={iconColor('menu')} />
            <Text style={[styles.navLabel, { color: iconColor('menu') }]}>Menu</Text>
          </TouchableOpacity>

          <View style={styles.navItemCenter} />

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/cart')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
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

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/view')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
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
});

export default BottomNav;
