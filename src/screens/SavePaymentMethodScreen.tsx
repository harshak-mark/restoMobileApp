import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { CardPayment, removeCard, removeUpi, setDefaultCard, setDefaultUpi, UpiAccount } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

const SavePaymentMethodScreen = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ tab?: string; next?: string; from?: string }>();
  const [tab, setTab] = useState<'upi' | 'card'>(params.tab === 'card' ? 'card' : 'upi');
  const next = (params.next as string | undefined) || undefined;
  const backToSettings = params.from === 'settings';

  const upiList = useAppSelector((state) => state.payment.upiList);
  const cardList = useAppSelector((state) => state.payment.cardList);
  const defaultUpiId = useAppSelector((state) => state.payment.defaultUpiId);
  const defaultCardId = useAppSelector((state) => state.payment.defaultCardId);

  const activeColor = theme.buttonPrimary;
  const inactiveBg = theme.backgroundSecondary;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'upi' | 'card'; id: string } | null>(null);

  const handleEditUpi = (item: UpiAccount, e: any) => {
    e?.stopPropagation?.();
    if (backToSettings) {
      router.push(`/settings/payment/upi?edit=true&upiId=${item.id}&provider=${item.provider}&upiIdValue=${encodeURIComponent(item.upiId)}&from=settings&next=${encodeURIComponent('/settings/payment?tab=upi&from=settings')}`);
    } else {
      router.push(`/settings/payment/upi?edit=true&upiId=${item.id}&provider=${item.provider}&upiIdValue=${encodeURIComponent(item.upiId)}&next=${encodeURIComponent(next || '/payment')}`);
    }
  };

  const handleDeleteUpi = (item: UpiAccount, e: any) => {
    e?.stopPropagation?.();
    setItemToDelete({ type: 'upi', id: item.id });
    setShowDeleteModal(true);
  };

  const handleEditCard = (item: CardPayment, e: any) => {
    e?.stopPropagation?.();
    if (backToSettings) {
      router.push(`/settings/payment/card?edit=true&cardId=${item.id}&brand=${item.brand}&name=${encodeURIComponent(item.name)}&number=${encodeURIComponent(item.maskedNumber)}&expires=${item.expires}&from=settings&next=${encodeURIComponent('/settings/payment?tab=card&from=settings')}`);
    } else {
      router.push(`/settings/payment/card?edit=true&cardId=${item.id}&brand=${item.brand}&name=${encodeURIComponent(item.name)}&number=${encodeURIComponent(item.maskedNumber)}&expires=${item.expires}&next=${encodeURIComponent(next || '/payment')}`);
    }
  };

  const handleDeleteCard = (item: CardPayment, e: any) => {
    e?.stopPropagation?.();
    setItemToDelete({ type: 'card', id: item.id });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const deletedType = itemToDelete.type;
      if (itemToDelete.type === 'upi') {
        dispatch(removeUpi(itemToDelete.id));
      } else {
        dispatch(removeCard(itemToDelete.id));
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      
      // Stay on Save Payment Method page after deletion
      if (backToSettings) {
        router.replace(`/settings/payment?tab=${deletedType}&from=settings`);
      } else if (next) {
        router.replace(next as any);
      } else {
        router.replace(`/settings/payment?tab=${deletedType}`);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const renderUpiItem = (item: UpiAccount) => {
    const isDefault = item.id === defaultUpiId;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.listCard, { backgroundColor: theme.card }]}
        onPress={() => dispatch(setDefaultUpi(item.id))}
        activeOpacity={0.7}
      >
        <View style={styles.listRow}>
          <View style={styles.listLeft}>
            <Ionicons name="logo-google" size={24} color={theme.textPrimary} />
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>{providerLabel(item.provider)}</Text>
          </View>
          <Verification status={item.status} />
        </View>
        <View style={styles.upiIdRow}>
          <Text style={[styles.subText, { color: theme.textSecondary }]}>UPI ID : {item.upiId}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Ionicons name="checkmark-circle" size={16} color={(theme as any).success || '#00C853'} />
              <Text style={[styles.defaultBadgeText, { color: (theme as any).success || '#00C853' }]}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={(e) => handleEditUpi(item, e)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="pencil" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={(e) => handleDeleteUpi(item, e)} style={{ marginLeft: 16 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCardItem = (item: CardPayment) => {
    const isDefault = item.id === defaultCardId;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.listCard, { backgroundColor: theme.card }]}
        onPress={() => dispatch(setDefaultCard(item.id))}
        activeOpacity={0.7}
      >
        <View style={styles.listRow}>
          <View style={styles.listLeft}>
            <Ionicons name="card-outline" size={24} color={theme.textPrimary} />
            <Text style={[styles.titleText, { color: theme.textPrimary }]}>{cardTitle(item.brand)}</Text>
          </View>
        </View>
        <View style={styles.cardNumberRow}>
          <Text style={[styles.subText, { color: theme.textSecondary }]}>Card no : {item.maskedNumber}</Text>
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Ionicons name="checkmark-circle" size={16} color={(theme as any).success || '#00C853'} />
              <Text style={[styles.defaultBadgeText, { color: (theme as any).success || '#00C853' }]}>Default</Text>
            </View>
          )}
        </View>
        <Text style={[styles.subText, { color: theme.textSecondary }]}>Expires : {item.expires}</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={(e) => handleEditCard(item, e)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="pencil" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={(e) => handleDeleteCard(item, e)} style={{ marginLeft: 16 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = ({ text }: { text: string }) => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{text}</Text>
    </View>
  );

  const handleAdd = () => {
    if (backToSettings) {
      // When from settings, always navigate back to Save Payment Method
      if (tab === 'upi') {
        router.push(`/settings/payment/upi?from=settings&next=${encodeURIComponent('/settings/payment?tab=upi&from=settings')}`);
      } else {
        router.push(`/settings/payment/card?from=settings&next=${encodeURIComponent('/settings/payment?tab=card&from=settings')}`);
      }
    } else {
      const targetNext = next || '/payment';
      if (tab === 'upi') {
        router.push(`/settings/payment/upi?next=${encodeURIComponent(targetNext)}`);
      } else {
        router.push(`/settings/payment/card?next=${encodeURIComponent(targetNext)}`);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => {
            if (backToSettings) {
              router.replace('/settings');
            } else if (next) {
              router.replace(next as any);
            } else {
              router.back();
            }
          }}
          style={styles.headerIcon}
        >
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Save Payment Method</Text>
        <View style={styles.headerIcon} />
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: tab === 'upi' ? theme.card : inactiveBg, borderColor: tab === 'upi' ? activeColor : 'transparent' },
          ]}
          onPress={() => setTab('upi')}
        >
          <Text style={[styles.tabLabel, { color: tab === 'upi' ? activeColor : theme.textPrimary }]}>UPI</Text>
          <Text style={[styles.tabSub, { color: tab === 'upi' ? activeColor : theme.textSecondary }]}>UPI Payment method</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: tab === 'card' ? theme.card : inactiveBg, borderColor: tab === 'card' ? activeColor : 'transparent' },
          ]}
          onPress={() => setTab('card')}
        >
          <Text style={[styles.tabLabel, { color: tab === 'card' ? activeColor : theme.textPrimary }]}>Cards payment method</Text>
          <Text style={[styles.tabSub, { color: tab === 'card' ? activeColor : theme.textSecondary }]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 160 }}>
        {tab === 'upi' ? (
          upiList.length === 0 ? (
            <EmptyState text="No UPI ID exists. Add new." />
          ) : (
            upiList.map(renderUpiItem)
          )
        ) : cardList.length === 0 ? (
          <EmptyState text="No cards saved. Add new." />
        ) : (
          cardList.map(renderCardItem)
        )}
      </ScrollView>

      <View style={styles.addWrapper}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleAdd}>
          <Text style={[styles.addText, { color: theme.buttonText }]}>
            {tab === 'upi' ? 'Add New UPI' : 'Add New Card'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal transparent animationType="fade" visible onRequestClose={cancelDelete}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Delete {itemToDelete?.type === 'card' ? 'Card' : 'UPI'}?</Text>
              <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                Are you sure you want to delete this {itemToDelete?.type === 'card' ? 'card' : 'UPI'}?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: theme.buttonSecondary || theme.backgroundSecondary }]}
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

      <BottomNav active="home" />
    </View>
  );
};

const Verification = ({ status }: { status: 'verified' | 'unverified' }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.verification}>
      <Ionicons
        name={status === 'verified' ? 'checkmark-circle' : 'alert-circle-outline'}
        size={16}
        color={status === 'verified' ? theme.buttonPrimary : theme.textSecondary}
      />
      <Text style={[styles.verificationText, { color: status === 'verified' ? theme.buttonPrimary : theme.textSecondary }]}>
        {status === 'verified' ? 'Verified' : 'Unverified'}
      </Text>
    </View>
  );
};

const providerLabel = (provider: string) => {
  switch (provider) {
    case 'gpay':
      return 'Google Pay';
    case 'phonepe':
      return 'Phone Pe';
    case 'paytm':
      return 'Paytm';
    default:
      return 'UPI';
  }
};

const cardTitle = (brand: string) => {
  switch (brand) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'MasterCard';
    case 'amex':
      return 'AmEx';
    case 'discover':
      return 'Discover';
    default:
      return 'Card';
  }
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
    paddingTop: 60,
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
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabSub: {
    fontSize: 12,
    marginTop: 4,
  },
  listCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  subText: {
    fontSize: 13,
    marginTop: 2,
  },
  upiIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardNumberRow: {
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
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  providerIcon: {
    width: 32,
    height: 32,
  },
  verification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
  },
  addWrapper: {
    paddingHorizontal: 32,
    paddingBottom: 140,
  },
  addButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addText: {
    fontSize: 16,
    fontWeight: '700',
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

export default SavePaymentMethodScreen;
