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
  const svgHeight = 82 + (hasNavButtons ? insets.bottom : 0);
  const hexagonBottom = 30 + (hasNavButtons ? insets.bottom / 2 : 0);
  const navBarHeight = 28 + (hasNavButtons ? insets.bottom / 2 : 0);
  const navBarPaddingBottom = hasNavButtons ? insets.bottom : 0;

  const iconColor = (key: TabKey) => (active === key ? theme.iconActive : theme.iconColor);

  return (
    <View style={styles.wrapper}>
      <View style={styles.footerSvgWrapper}>
        <SubtractBorderSvg width="100%" height={svgHeight} preserveAspectRatio="none" />
      </View>

      <View style={[styles.hexagonContainer, { bottom: hexagonBottom }]}>
        <TouchableOpacity>
          <SixSideBoxSvg width={54} height={61} />
        </TouchableOpacity>
      </View>

      <View style={[styles.bottomNavBar, { height: navBarHeight, paddingBottom: navBarPaddingBottom }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="home" size={24} color={iconColor('home')} />
          <Text style={[styles.navLabel, { color: iconColor('home') }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/menu')}>
          <Ionicons name="restaurant-outline" size={24} color={iconColor('menu')} />
          <Text style={[styles.navLabel, { color: iconColor('menu') }]}>Menu</Text>
        </TouchableOpacity>

        <View style={styles.navItemCenter} />

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/cart')}>
          <View>
            <Ionicons name="cart-outline" size={24} color={iconColor('cart')} />
            {cartCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.buttonPrimary }]}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, { color: iconColor('cart') }]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="storefront-outline" size={24} color={iconColor('view')} />
          <Text style={[styles.navLabel, { color: iconColor('view') }]}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSvgWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  hexagonContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    height: 28,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
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
