import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { CardPayment, UpiAccount } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

const SavePaymentMethodScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ tab?: string; next?: string; from?: string }>();
  const [tab, setTab] = useState<'upi' | 'card'>(params.tab === 'card' ? 'card' : 'upi');
  const next = (params.next as string | undefined) || undefined;
  const backToSettings = params.from === 'settings';

  const upiList = useAppSelector((state) => state.payment.upiList);
  const cardList = useAppSelector((state) => state.payment.cardList);

  const activeColor = theme.buttonPrimary;
  const inactiveBg = theme.backgroundSecondary;

  const renderUpiItem = (item: UpiAccount) => (
    <View key={item.id} style={[styles.listCard, { backgroundColor: theme.card }]}>
      <View style={styles.listRow}>
        <View style={styles.listLeft}>
          <Ionicons name="logo-google" size={24} color={theme.textPrimary} />
          <Text style={[styles.titleText, { color: theme.textPrimary }]}>{providerLabel(item.provider)}</Text>
        </View>
        <Verification status={item.status} />
      </View>
      <Text style={[styles.subText, { color: theme.textSecondary }]}>UPI ID : {item.upiId}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity>
          <Ionicons name="pencil" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCardItem = (item: CardPayment) => (
    <View key={item.id} style={[styles.listCard, { backgroundColor: theme.card }]}>
      <View style={styles.listRow}>
        <View style={styles.listLeft}>
          <Ionicons name="card-outline" size={24} color={theme.textPrimary} />
          <Text style={[styles.titleText, { color: theme.textPrimary }]}>{cardTitle(item.brand)}</Text>
        </View>
        <Verification status={item.status} />
      </View>
      <Text style={[styles.subText, { color: theme.textSecondary }]}>Card no : {item.maskedNumber}</Text>
      <Text style={[styles.subText, { color: theme.textSecondary }]}>Expires : {item.expires}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity>
          <Ionicons name="pencil" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="trash-outline" size={18} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = ({ text }: { text: string }) => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{text}</Text>
    </View>
  );

  const handleAdd = () => {
    const targetNext = backToSettings ? '/settings/payment' : next || '/payment';
    if (tab === 'upi') {
      router.push(`/settings/payment/upi?next=${encodeURIComponent(targetNext)}`);
    } else {
      router.push(`/settings/payment/card?next=${encodeURIComponent(targetNext)}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => {
            if (next) {
              router.replace(next as any);
            } else {
              if (backToSettings) {
                router.replace('/settings');
            } else {
              router.back();
              }
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
});

export default SavePaymentMethodScreen;
