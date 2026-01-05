import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { Address } from '../store/slices/addressSlice';
import { selectCartTotals } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

type TabKey = 'delivery' | 'takeaway' | 'dinein';

const TAB_CONFIG: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'delivery', label: 'Home Delivery', icon: 'home' },
  { key: 'takeaway', label: 'Take away', icon: 'bag-handle-outline' },
  { key: 'dinein', label: 'Dine-In', icon: 'restaurant-outline' },
];

const timeSlots = ['9/20', '10/20', '11/20'];

export default function CheckoutFlowScreen() {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const totals = useAppSelector(selectCartTotals);
  const addresses = useAppSelector((state) => state.address.items);

  const [activeTab, setActiveTab] = useState<TabKey>('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addresses[0]?.id || null);
  const [selectedSlot, setSelectedSlot] = useState<string>(timeSlots[1]);

  const addressList = useMemo(() => {
    return addresses;
  }, [addresses]);

  // Keep selection in sync with store and redirect to add screen when empty
  useEffect(() => {
    if (addressList.length === 0) {
      setSelectedAddressId(null);
    } else if (!selectedAddressId) {
      setSelectedAddressId(addressList[0].id);
    }
  }, [addressList, selectedAddressId]);

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  const renderAddressCard = (address: Address) => {
    const isSelected = selectedAddressId === address.id;
    return (
      <TouchableOpacity
        key={address.id}
        style={[
          styles.addressCard,
          { borderColor: isSelected ? theme.buttonPrimary : theme.divider, backgroundColor: theme.background },
        ]}
        onPress={() => setSelectedAddressId(address.id)}
        activeOpacity={0.9}
      >
        <View style={styles.addressRow}>
          <Ionicons
            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={isSelected ? theme.buttonPrimary : theme.textSecondary}
          />
          <Text style={[styles.addressLabel, { color: theme.textPrimary }]}>{address.label}</Text>
        </View>
        <Text style={[styles.addressText, { color: theme.textSecondary }]} numberOfLines={2}>
          {address.address} , {address.city} - {address.pinCode}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDelivery = () => (
    <View style={styles.sectionCard}>
      <View style={styles.deliveryInfoRow}>
        <InfoPill icon="bicycle-outline" label="Min Order" value="Up to ₹100.00" />
        <InfoPill icon="time-outline" label="Delivery Time" value="30 - 40 Minutes" />
        <InfoPill icon="cash-outline" label="Delivery Fee" value="₹60.00" />
      </View>
      {addressList.length === 0 ? (
        <View style={styles.emptyAddress}>
          <Text style={[styles.addressText, { color: theme.textSecondary }]}>
            No saved addresses. Add one to continue.
          </Text>
          <TouchableOpacity
            style={[styles.addAddressRow, { marginTop: 8 }]}
            onPress={() => router.push('/settings/delivery-address/add?next=/checkout')}
          >
            <Ionicons name="add" size={16} color={theme.buttonPrimary} />
            <Text style={[styles.addAddressText, { color: theme.buttonPrimary }]}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
      <View style={styles.addressList}>{addressList.map(renderAddressCard)}</View>
      <TouchableOpacity
        style={styles.addAddressRow}
        onPress={() => router.push('/settings/delivery-address/add?next=/checkout')}
      >
        <Ionicons name="add" size={16} color={theme.buttonPrimary} />
        <Text style={[styles.addAddressText, { color: theme.buttonPrimary }]}>Add New Address</Text>
      </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderTakeAway = () => (
    <View style={styles.sectionCard}>
      <View style={styles.deliveryInfoRow}>
        <InfoPill icon="time-outline" label="Prefering time" value="5-15 Minutes" />
        <InfoPill icon="walk-outline" label="Distance" value="5-15 Minutes" />
        <InfoPill icon="navigate-outline" label="Get Direction" value="Open map" />
      </View>
      <View style={styles.mapCard}>
        <View style={styles.mapHeader}>
          <Ionicons name="location-outline" size={18} color={theme.textPrimary} />
          <Text style={[styles.mapHeaderText, { color: theme.textPrimary }]}>Pickup location</Text>
        </View>
        <View style={styles.mapPlaceholder}>
          <Text style={[styles.mapPlaceholderText, { color: theme.textSecondary }]}>
            Map preview
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDineIn = () => (
    <View style={styles.sectionCard}>
      <View style={styles.deliveryInfoRow}>
        <InfoPill icon="restaurant-outline" label="Dine-In" value="Reserve table" />
        <InfoPill icon="time-outline" label="Slots" value="Select timing" />
        <InfoPill icon="shield-checkmark-outline" label="Check availability" value="Live" />
      </View>
      <View style={styles.slotRow}>
        {timeSlots.map((slot) => {
          const selected = slot === selectedSlot;
          return (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slotButton,
                { borderColor: selected ? theme.buttonPrimary : theme.divider, backgroundColor: selected ? '#FFF4E5' : theme.background },
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Text style={[styles.slotText, { color: selected ? theme.buttonPrimary : theme.textPrimary }]}>{slot}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={[styles.slotButton, styles.checkButton, { borderColor: theme.buttonPrimary }]}>
          <Text style={[styles.slotText, { color: theme.buttonPrimary }]}>Check availability</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const InfoPill = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
  }) => (
    <View style={[styles.infoPill, { backgroundColor: theme.background }]}>
      <View style={[styles.infoPillRow, { justifyContent: 'center' }]}>
        <Ionicons name={icon} size={16} color={theme.textSecondary} />
      </View>
      <Text
        style={[styles.infoPillLabel, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {label}
      </Text>
      <Text
        style={[styles.infoPillValue, { color: theme.textPrimary }]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );

  const renderActiveTab = () => {
    if (activeTab === 'delivery') return renderDelivery();
    if (activeTab === 'takeaway') return renderTakeAway();
    return renderDineIn();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Your Cart</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.tabRow}>
          {TAB_CONFIG.map((tab) => {
            const selected = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: selected ? theme.backgroundSecondary : theme.background,
                    backgroundColor: selected ? theme.backgroundSecondary : theme.background,
                    borderColor: selected ? theme.buttonPrimary : theme.divider,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={selected ? theme.buttonPrimary : theme.textSecondary}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: selected ? theme.buttonPrimary : theme.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {renderActiveTab()}

        <View style={[styles.summaryCard, { backgroundColor: theme.buttonPrimary }]}>
          <Text style={[styles.summaryTitle, { color: theme.buttonText }]}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>GST (5%)</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.gst)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Service Charge</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.serviceCharge)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.buttonText }]}>Discount</Text>
            <Text style={[styles.summaryValue, { color: theme.buttonText }]}>{formatCurrency(totals.discount)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.buttonText }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: theme.buttonText }]}>{formatCurrency(totals.total)}</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={16} color={theme.buttonText} />
            <Text style={[styles.deliveryText, { color: theme.buttonText }]}>
              Your order will be ready in 25 mins
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { backgroundColor: activeTab === 'delivery' && !selectedAddressId ? theme.divider : theme.buttonText },
            ]}
            disabled={activeTab === 'delivery' && !selectedAddressId}
            onPress={() => router.push('/payment')}
          >
            <Text style={[styles.checkoutText, { color: theme.buttonPrimary }]}>Continue order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
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
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
    gap: 14,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    flex: 1,
      flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  tabIcon: {
    marginTop: -1,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
      textAlign: 'center',
      flexWrap: 'wrap',
  },
  sectionCard: {
      backgroundColor: theme?.card || '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoPill: {
    flex: 1,
    minWidth: 0, // Allow flex items to shrink below content size
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
      borderColor: theme?.divider || '#F1F1F1',
    gap: 4,
      alignItems: 'center',
  },
  infoPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoPillLabel: {
    fontSize: 12,
    fontWeight: '500',
      textAlign: 'center',
    flexShrink: 1, // Allow text to shrink and wrap
  },
  infoPillValue: {
    fontSize: 13,
    fontWeight: '600',
      textAlign: 'center',
    flexShrink: 1, // Allow text to shrink and wrap
  },
  addressList: {
    gap: 10,
  },
  addressCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  addAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addAddressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapCard: {
    gap: 8,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapHeaderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
      borderColor: theme?.divider || '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
      backgroundColor: theme?.backgroundSecondary || '#F8F8F8',
  },
  mapPlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  slotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  checkButton: {
    flexGrow: 1,
    alignItems: 'center',
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
      backgroundColor: theme?.divider || 'rgba(255,255,255,0.6)',
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  checkoutButton: {
    marginTop: 6,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
