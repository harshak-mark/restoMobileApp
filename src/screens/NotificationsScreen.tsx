import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ from?: string }>();
  const backToSettings = params.from === 'settings';
  const backToCheckout = params.from === 'checkout';

  const handleBack = () => {
    if (backToSettings || backToCheckout) {
      router.replace('/settings');
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Notification</Text>
      </View>

      <View style={styles.emptyState}>
        <Ionicons name="notifications-outline" size={48} color={theme.textPrimary} />
        <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>Item not found</Text>
        <Text style={[styles.emptySub, { color: theme.textSecondary }]}>No notification</Text>
      </View>

      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 16,
  },
});

