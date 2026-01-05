import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { Address } from '../store/slices/addressSlice';
import { useTheme } from '../theme/useTheme';

const MyAddressesScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ from?: string }>();
  const backToSettings = params.from === 'settings';
  const addresses = useAppSelector((state) => state.address.items);

  const renderAddress = ({ item }: { item: Address }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name="home-outline" size={20} color={theme.buttonPrimary} />
        </View>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.label}</Text>
        <View style={styles.actions}>
          <TouchableOpacity>
            <Ionicons name="pencil" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 12 }}>
            <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.addressText, { color: theme.textSecondary }]}>
        {item.address}
      </Text>
      <Text style={[styles.addressText, { color: theme.textSecondary }]}>
        {item.city}{item.pinCode ? `, ${item.pinCode}` : ''}
      </Text>
      {item.landmark ? (
        <Text style={[styles.addressText, { color: theme.textSecondary }]}>
          {item.landmark}
        </Text>
      ) : null}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No addresses exists add new
      </Text>
    </View>
  );

  const handleAddNew = () => {
    router.push('/settings/delivery-address/add');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>My Address</Text>
        <View style={styles.headerIcon} />
      </View>

      <View style={styles.listWrapper}>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 140 }}
        />
      </View>

      <View style={styles.addButtonWrapper}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleAddNew}>
          <Text style={[styles.addButtonText, { color: theme.buttonText }]}>Add new address</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 140,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  listWrapper: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
  },
  addButtonWrapper: {
    paddingHorizontal: 32,
    paddingBottom: 140,
  },
  addButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 98,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerSvgWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  hexagonContainer: {
    position: 'absolute',
    bottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    height: 72,
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
});

export default MyAddressesScreen;
