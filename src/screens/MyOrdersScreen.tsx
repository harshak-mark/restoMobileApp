import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

export default function MyOrdersScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ from?: string }>();
  const backToSettings = params.from === 'settings';
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.list);
  const [tab, setTab] = useState<'ongoing' | 'history'>('history');

  const visibleOrders = orders.filter((o) => o.status === tab);

  const handleReorder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    order.items.forEach((item) => {
      dispatch(
        addItem({
          item: {
            id: item.id,
            name: item.name,
            price: item.price,
            image: undefined,
            imageId: item.id,
            imageUri: undefined,
            dishName: item.name,
            category: '',
            description: '',
            sections: [],
          } as any,
          quantity: item.quantity,
        }),
      );
    });
    router.replace('/cart');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => {
            if (backToSettings) {
              router.replace('/settings');
            } else {
              router.back();
            }
          }}
          style={styles.headerIcon}
        >
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>My Orders</Text>
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'ongoing' && styles.tabButtonActive]}
          onPress={() => setTab('ongoing')}
        >
          <Text style={[styles.tabText, tab === 'ongoing' && styles.tabTextActive]}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === 'history' && styles.tabButtonActive]}
          onPress={() => setTab('history')}
        >
          <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visibleOrders.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="file-tray-outline" size={36} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No orders yet</Text>
          </View>
        ) : (
          visibleOrders.map((order) => (
            <View key={order.id} style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
              <View style={styles.row}>
                <Text style={[styles.orderId, { color: theme.textPrimary }]}>#{order.id}</Text>
                <Text style={[styles.totalValue, { color: theme.textPrimary }]}>₹{order.total.toFixed(2)}</Text>
              </View>
              <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
                {new Date(order.placedAt).toLocaleString()}
              </Text>
              <Text style={[styles.meta, { color: theme.textSecondary }]} numberOfLines={1}>
                {order.items.length} items • {order.paymentMethod}
              </Text>
              <View style={styles.itemsList}>
                {order.items.map((it) => (
                  <Text
                    key={it.id}
                    style={[styles.itemLine, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {it.name} x{it.quantity}
                  </Text>
                ))}
              </View>
              <View style={styles.footerActions}>
                <TouchableOpacity style={[styles.reorderButton, { backgroundColor: theme.buttonPrimary }]} onPress={() => handleReorder(order.id)}>
                  <Ionicons name="refresh" size={18} color={theme.buttonText} />
                  <Text style={[styles.reorderText, { color: theme.buttonText }]}>Reorder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.divider }]} onPress={() => {}}>
                  <Ionicons name="document-text-outline" size={18} color={theme.textPrimary} />
                  <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.divider }]} onPress={() => {}}>
                  <Ionicons name="star-outline" size={18} color={theme.textPrimary} />
                  <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Rate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.secondaryBtn, { borderColor: theme.divider }]} onPress={() => {}}>
                  <Ionicons name="call-outline" size={18} color={theme.textPrimary} />
                  <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Support</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

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
  content: {
    padding: 16,
    paddingBottom: 140,
    gap: 12,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FF9700',
    borderColor: '#FF9700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
  },
  emptyText: { fontSize: 14, fontWeight: '600' },
  card: {
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  meta: { fontSize: 12 },
  itemsList: { marginTop: 6, gap: 2 },
  itemLine: { fontSize: 13 },
  totalLabel: { fontSize: 14, fontWeight: '600' },
  totalValue: { fontSize: 16, fontWeight: '800' },
  footerActions: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  reorderText: { fontWeight: '700', fontSize: 14 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: { fontWeight: '700', fontSize: 14 },
});


