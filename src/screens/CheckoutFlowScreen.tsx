import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Address, setSelectedAddress } from '../store/slices/addressSlice';
import { selectCartTotals } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

type TabKey = 'delivery' | 'takeaway' | 'dinein';
type FloorId = 'ground' | 'first' | 'second' | 'third' | 'rooftop';

const TAB_CONFIG: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'delivery', label: 'Home Delivery', icon: 'home' },
  { key: 'takeaway', label: 'Take away', icon: 'bag-handle-outline' },
  { key: 'dinein', label: 'Dine-In', icon: 'restaurant-outline' },
];

const timeSlots = ['9/20', '10/20', '11/20'];

const floorTabs: { id: FloorId; label: string }[] = [
  { id: 'ground', label: 'Ground Floor' },
  { id: 'first', label: '1st Floor' },
  { id: 'second', label: '2nd Floor' },
  { id: 'third', label: '3rd Floor' },
  { id: 'rooftop', label: 'Rooftop' },
];

export default function CheckoutFlowScreen() {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const totals = useAppSelector(selectCartTotals);
  const addresses = useAppSelector((state) => state.address.items);
  const defaultAddressId = useAppSelector((state) => state.address.defaultAddressId);

  const [activeTab, setActiveTab] = useState<TabKey>('delivery');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddressId || null);
  const [selectedSlot, setSelectedSlot] = useState<string>(timeSlots[1]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [activeFloor, setActiveFloor] = useState<FloorId>('ground');
  const restaurantPhone = '+1 234 567 8900';
  
  // Table data - simplified version for checkout
  const [tableData] = useState([
    { id: 'T-1', status: 'available' },
    { id: 'T-2', status: 'reserved' },
    { id: 'T-3', status: 'available' },
    { id: 'T-4', status: 'reserved' },
    { id: 'T-5', status: 'available' },
    { id: 'T-6', status: 'reserved' },
    { id: 'T-7', status: 'available' },
    { id: 'T-8', status: 'reserved' },
    { id: 'T-9', status: 'available' },
    { id: 'T-10', status: 'available' },
    { id: 'T-11', status: 'reserved' },
    { id: 'T-12', status: 'available' },
    { id: 'T-13', status: 'reserved' },
    { id: 'T-14', status: 'available' },
    { id: 'T-15', status: 'available' },
  ]);

  const addressList = useMemo(() => {
    return addresses;
  }, [addresses]);

  // Keep selection in sync with store and redirect to add screen when empty
  useEffect(() => {
    if (addressList.length === 0) {
      setSelectedAddressId(null);
      dispatch(setSelectedAddress(null));
    } else if (!selectedAddressId) {
      // Use default address if available, otherwise use first address
      const addressToSelect = defaultAddressId && addressList.some((addr) => addr.id === defaultAddressId)
        ? defaultAddressId
        : addressList[0].id;
      setSelectedAddressId(addressToSelect);
      dispatch(setSelectedAddress(addressToSelect));
    }
  }, [addressList, selectedAddressId, defaultAddressId, dispatch]);

  // Update selected address when default changes
  useEffect(() => {
    if (defaultAddressId && addressList.some((addr) => addr.id === defaultAddressId)) {
      if (!selectedAddressId || selectedAddressId === defaultAddressId) {
        setSelectedAddressId(defaultAddressId);
        dispatch(setSelectedAddress(defaultAddressId));
      }
    }
  }, [defaultAddressId, addressList, selectedAddressId, dispatch]);

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

  const renderAddressCard = (address: Address) => {
    const isSelected = selectedAddressId === address.id;
    const isDefault = address.id === defaultAddressId;
    return (
      <TouchableOpacity
        key={address.id}
        style={[
          styles.addressCard,
          { borderColor: isSelected ? theme.buttonPrimary : theme.divider, backgroundColor: theme.background },
        ]}
        onPress={() => {
          setSelectedAddressId(address.id);
          dispatch(setSelectedAddress(address.id));
        }}
        activeOpacity={0.9}
      >
        <View style={styles.addressRow}>
          <Ionicons
            name={isSelected ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color={isSelected ? theme.buttonPrimary : theme.textSecondary}
          />
          <Text style={[styles.addressLabel, { color: theme.textPrimary }]}>{address.label}</Text>
          {isDefault && (
            <View style={[styles.defaultBadge, { backgroundColor: (theme as any).success || '#00C853' }]}>
              <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
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

  const handleQRCodeScan = () => {
    // QR Code scan functionality - can be implemented later
    console.log('QR Code scan for Dine-in');
  };

  const handleCallRestaurant = async () => {
    try {
      const phoneUrl = `tel:${restaurantPhone.replace(/\s/g, '')}`;
      const canOpen = await Linking.canOpenURL(phoneUrl);
      if (canOpen) {
        await Linking.openURL(phoneUrl);
      }
    } catch (error) {
      console.error('Error making phone call:', error);
    }
  };

  const renderDineIn = () => (
    <View style={styles.sectionCard}>
      <View style={styles.dineInRow}>
        <TouchableOpacity 
          style={[styles.dineInButton, { backgroundColor: theme.buttonPrimary }]}
          onPress={handleQRCodeScan}
        >
          <Text style={[styles.dineInButtonText, { color: theme.buttonText }]}>
            QR Code for{'\n'}Dine-in
          </Text>
        </TouchableOpacity>
        
        <View style={styles.dineInDivider} />
        
        <View style={styles.dineInCenterContent}>
          <Text style={[styles.dineInSlotText, { color: theme.textPrimary }]}>{selectedSlot}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.dineInCallButton, { backgroundColor: theme.buttonPrimary }]}
          onPress={() => setShowAvailabilityModal(true)}
        >
          <Text style={[styles.dineInCallText, { color: theme.buttonText }]}>Check availability</Text>
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
        <Text style={[styles.headerTitle, { color: theme.buttonText, flex: 1 }]}>Your Cart</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push({ pathname: '/notifications', params: { from: 'checkout' } })}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
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

      {/* Availability Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showAvailabilityModal}
        onRequestClose={() => setShowAvailabilityModal(false)}
      >
        <View style={styles.availabilityOverlay}>
          <View style={[styles.availabilityCard, { backgroundColor: theme.background }]}>
            <View style={styles.availabilityHeader}>
              <Text style={[styles.availabilityTitle, { color: theme.textPrimary }]}>
                Select Table
              </Text>
              <TouchableOpacity onPress={() => setShowAvailabilityModal(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Floor Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.floorTabsContainer}
              contentContainerStyle={styles.floorTabsContent}
            >
              {floorTabs.map((floor) => (
                <TouchableOpacity
                  key={floor.id}
                  style={[
                    styles.floorTab,
                    {
                      backgroundColor: activeFloor === floor.id ? theme.buttonPrimary : theme.backgroundSecondary,
                    },
                  ]}
                  onPress={() => setActiveFloor(floor.id)}
                >
                  <Text
                    style={[
                      styles.floorTabText,
                      { color: activeFloor === floor.id ? theme.buttonText : theme.textPrimary },
                    ]}
                  >
                    {floor.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSquare, { backgroundColor: '#007A59' }]} />
                <Text style={[styles.legendText, { color: theme.textPrimary }]}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSquare, { backgroundColor: '#D10505' }]} />
                <Text style={[styles.legendText, { color: theme.textPrimary }]}>Reserved</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSquare, { backgroundColor: '#FFB500' }]} />
                <Text style={[styles.legendText, { color: theme.textPrimary }]}>Available soon</Text>
              </View>
            </View>

            {/* Table Grid */}
            <ScrollView style={styles.tableGridScroll}>
              <View style={styles.tableGrid}>
                {tableData.map((table, index) => {
                  const isReserved = table.status === 'reserved';
                  const backgroundColor = isReserved ? '#D10505' : '#007A59';
                  const isLastInRow = (index + 1) % 5 === 0;

                  return (
                    <View
                      key={table.id}
                      style={[
                        styles.tableItem,
                        {
                          backgroundColor,
                          marginRight: isLastInRow ? 0 : 8,
                        },
                      ]}
                    >
                      <Text style={styles.tableItemText}>{table.id}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  notificationButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 300,
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
  emptyAddress: {
    paddingVertical: 16,
    alignItems: 'center',
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
    flexWrap: 'wrap',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  dineInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dineInButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dineInButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  dineInDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme?.divider || '#E0E0E0',
  },
  dineInCenterContent: {
    paddingHorizontal: 8,
  },
  dineInSlotText: {
    fontSize: 18,
    fontWeight: '700',
  },
  dineInCallButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  dineInCallText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkAvailabilityButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkAvailabilityText: {
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
  availabilityOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  availabilityCard: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  availabilityTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  floorTabsContainer: {
    marginBottom: 16,
  },
  floorTabsContent: {
    gap: 8,
    paddingRight: 20,
  },
  floorTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  floorTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme?.divider || '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSquare: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tableGridScroll: {
    maxHeight: 300,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tableItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tableItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
