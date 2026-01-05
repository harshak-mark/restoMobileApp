import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

const TrackingScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={() => router.replace('/order-summary')} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Live tracking</Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Live Order Tracking</Text>

        <View style={styles.timeline}>
          <TimelineItem label="Preparing" sub="Your meal is being cooked" active />
          <TimelineItem label="Out for Delivery" sub="Driver is on the way" active icon="radio-button-on" />
          <TimelineItem label="Delivered" sub="Enjoy your meal!" />
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={[styles.mapText, { color: theme.textSecondary }]}>Mini Map Placeholder</Text>
        </View>

        <View style={styles.driverRow}>
          <Ionicons name="person-circle" size={36} color={theme.textPrimary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.driverName, { color: theme.textPrimary }]}>Alex Ray</Text>
            <Text style={[styles.helper, { color: theme.textSecondary }]}>ETA: 12 mins</Text>
          </View>
          <Ionicons name="call-outline" size={22} color={theme.buttonPrimary} style={{ marginHorizontal: 8 }} />
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.buttonPrimary} />
        </View>
      </View>

      <BottomNav active="cart" />
    </View>
  );
};

const TimelineItem = ({
  label,
  sub,
  active,
  icon = 'checkmark-circle',
}: {
  label: string;
  sub: string;
  active?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) => {
  return (
    <View style={styles.timelineRow}>
      <Ionicons
        name={active ? icon : 'radio-button-off'}
        size={20}
        color={active ? '#F6A600' : '#CFCFCF'}
        style={{ marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.timelineLabel, { color: active ? '#111' : '#999' }]}>{label}</Text>
        <Text style={[styles.timelineSub, { color: active ? '#555' : '#B0B0B0' }]}>{sub}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  card: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  title: { fontSize: 16, fontWeight: '700' },
  timeline: { gap: 10 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timelineLabel: { fontSize: 14, fontWeight: '700' },
  timelineSub: { fontSize: 12 },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: { fontWeight: '600' },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  driverName: { fontSize: 14, fontWeight: '700' },
  helper: { fontSize: 12 },
});

export default TrackingScreen;
