import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Address, removeAddress, setDefaultAddress } from '../store/slices/addressSlice';
import { useTheme } from '../theme/useTheme';

const MyAddressesScreen = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ from?: string }>();
  const backToSettings = params.from === 'settings';
  const addresses = useAppSelector((state) => state.address.items);
  const defaultAddressId = useAppSelector((state) => state.address.defaultAddressId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleEditAddress = (item: Address, e: any) => {
    e?.stopPropagation?.();
    const landmarkParam = item.landmark ? `&landmark=${encodeURIComponent(item.landmark)}` : '';
    router.push(
      `/settings/delivery-address/add?edit=true&addressId=${item.id}&address=${encodeURIComponent(item.address)}&city=${encodeURIComponent(item.city)}&pinCode=${item.pinCode}${landmarkParam}&label=${item.label}&from=settings`
    );
  };

  const handleDeleteAddress = (item: Address, e: any) => {
    e?.stopPropagation?.();
    setAddressToDelete(item.id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(removeAddress(addressToDelete));
      setShowDeleteModal(false);
      setAddressToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  const renderAddress = ({ item }: { item: Address }) => {
    const isDefault = item.id === defaultAddressId;
    const addressText = `${item.city}${item.pinCode ? `, ${item.pinCode}` : ''}`;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card }]}
        onPress={() => dispatch(setDefaultAddress(item.id))}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="home-outline" size={20} color={theme.buttonPrimary} />
          </View>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.label}</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={(e) => handleEditAddress(item, e)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil" size={18} color={theme.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => handleDeleteAddress(item, e)}
              style={{ marginLeft: 12 }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.addressText, { color: theme.textSecondary }]}>
          {item.address}
        </Text>
        <View style={styles.addressRow}>
          <Text style={[styles.addressText, { color: theme.textSecondary }]}>
            {addressText}
          </Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Ionicons name="checkmark-circle" size={16} color={(theme as any).success || '#00C853'} />
              <Text style={[styles.defaultBadgeText, { color: (theme as any).success || '#00C853' }]}>Default</Text>
            </View>
          )}
        </View>
        {item.landmark ? (
          <Text style={[styles.addressText, { color: theme.textSecondary }]}>
            {item.landmark}
          </Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No addresses exists add new
      </Text>
    </View>
  );

  const handleAddNew = () => {
    const fromParam = backToSettings ? '?from=settings' : '';
    router.push(`/settings/delivery-address/add${fromParam}`);
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal transparent animationType="fade" visible onRequestClose={cancelDelete}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Delete Address?</Text>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                Are you sure you want to delete this address?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: (theme as any).buttonSecondary || (theme as any).backgroundSecondary || theme.card }]}
                  onPress={cancelDelete}
                >
                  <Text style={[styles.modalButtonText, { color: theme.textPrimary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.error || '#D10505' }]}
                  onPress={confirmDelete}
                >
                  <Text style={[styles.modalButtonText, { color: theme.buttonText || '#FFFFFF' }]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

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
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '500',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '90%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MyAddressesScreen;
