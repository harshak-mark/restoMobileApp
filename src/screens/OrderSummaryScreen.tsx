import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { selectCartItems } from '../store/slices/cartSlice';
import { useTheme } from '../theme/useTheme';

const OrderSummaryScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ method?: string }>();
  const method = params.method?.toString() || 'online';
  const cartItems = useAppSelector(selectCartItems);
  const orders = useAppSelector((state) => state.orders.list);
  const addresses = useAppSelector((state) => state.address.items);
  
  // Get items from most recent order if cart is empty, otherwise use cart items
  const items = useMemo(() => {
    if (cartItems.length > 0) {
      return cartItems;
    }
    // Get items from most recent order
    if (orders.length > 0) {
      const mostRecentOrder = orders[orders.length - 1];
      return mostRecentOrder.items || [];
    }
    return [];
  }, [cartItems, orders]);

  const [orderNote, setOrderNote] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  const primaryAddress = addresses[0];
  const orderId = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `#ORD${year}${month}${day}`;
  }, []);

  const paymentStatus =
    method === 'cash'
      ? 'Cash on Delivery'
      : method === 'upi'
      ? 'Paid via UPI'
      : method === 'card'
      ? 'Paid via Card'
      : 'Paid via UPI';

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemNames = items
    .map((item) => {
      if (item.quantity > 1) {
        return `${item.name}(${item.quantity}x)`;
      }
      return item.name;
    })
    .join(', ');

  const handleSaveNote = () => {
    setIsEditingNote(false);
  };

  const handleNoteSubmit = () => {
    handleSaveNote();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header with back button */}
      {/* <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => router.replace('/home')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View> */}
      
      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Success Header Section */}
        <View style={styles.successHeader}>
          <View style={[styles.successIcon, { backgroundColor: theme.buttonPrimary }]}>
            <Ionicons name="checkmark" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.successTitle, { color: theme.textPrimary }]}>
            Order Placed Successfully!
          </Text>
          <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
            Thank you for ordering with Resto! We're preparing your meal
          </Text>
        </View>

        {/* Order Details Card */}
        <View style={[styles.orderDetailsCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.orderDetailsTitle, { color: theme.textPrimary }]}>
            Order Details
          </Text>
          
          {/* 2x2 Grid Layout */}
          <View style={styles.detailsGrid}>
            {/* Row 1 */}
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Order ID</Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{orderId}</Text>
              </View>
              
              <View style={styles.gridItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Estimated Delivery</Text>
                <View style={styles.detailValueRow}>
                  <Ionicons name="time-outline" size={16} color={theme.textPrimary} />
                  <Text style={[styles.detailValue, { color: theme.textPrimary, marginLeft: 4 }]}>25-30 mins</Text>
                </View>
              </View>
            </View>

            {/* Row 2 */}
            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Payment Status</Text>
                <View style={styles.detailValueRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#00C853" />
                  <Text style={[styles.detailValue, { color: theme.textPrimary, marginLeft: 4 }]}>{paymentStatus}</Text>
                </View>
              </View>
              
              <View style={styles.gridItem}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Order Type</Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>Delivery</Text>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.orderSummarySection}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Order Summary</Text>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {itemCount} items ({itemNames || 'No items'})
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.divider }]} />

          {/* Order Note */}
          <View style={styles.orderNoteSection}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Order Note</Text>
            {isEditingNote ? (
              <View style={styles.noteEditContainer}>
                <TextInput
                  style={[styles.noteInput, { color: theme.textPrimary, borderColor: theme.divider, backgroundColor: theme.inputBackground }]}
                  value={orderNote}
                  onChangeText={setOrderNote}
                  placeholder="Add a note..."
                  placeholderTextColor={theme.inputPlaceholder}
                  multiline
                  autoFocus
                  onSubmitEditing={handleNoteSubmit}
                  onBlur={handleSaveNote}
                />
              </View>
            ) : (
              <View style={styles.noteDisplayContainer}>
                {orderNote ? (
                  <Text style={[styles.detailValue, styles.italicText, { color: theme.textPrimary }]}>
                    "{orderNote}"
                  </Text>
                ) : (
                  <View style={styles.noNoteContainer}>
                    <Text style={[styles.noNoteText, { color: theme.textSecondary }]}>No notes</Text>
                    <TouchableOpacity
                      onPress={() => setIsEditingNote(true)}
                      style={styles.addNoteButton}
                    >
                      <Text style={[styles.addNoteText, { color: theme.buttonPrimary }]}>Add notes</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.trackButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={() => router.push('/tracking')}
          >
            <Ionicons name="car-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={[styles.trackButtonText, { color: '#FFFFFF' }]}>Track My Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.downloadButton, { borderColor: theme.divider, backgroundColor: theme.card }]}
            onPress={() => {
              // Handle download invoice
              console.log('Download invoice');
            }}
          >
            <Ionicons name="download-outline" size={20} color={theme.textPrimary} style={styles.buttonIcon} />
            <Text style={[styles.downloadButtonText, { color: theme.textPrimary }]}>Download Invoice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 300,
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  orderDetailsCard: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  orderDetailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderSummarySection: {
    marginTop: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  orderNoteSection: {
    marginTop: 0,
  },
  noteEditContainer: {
    marginTop: 4,
  },
  noteInput: {
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  noteDisplayContainer: {
    marginTop: 4,
  },
  noNoteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noNoteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addNoteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addNoteText: {
    fontSize: 12,
    fontWeight: '600',
  },
  italicText: {
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  trackButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default OrderSummaryScreen;
