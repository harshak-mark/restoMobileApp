import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { selectCartTotals } from '../store/slices/cartSlice';
import type { RootState } from '../store/store';
import { useTheme } from '../theme/useTheme';

const COUNTDOWN_SECONDS = 600; // 10 minutes
const STATIC_QR_URI =
  'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=restoway@upi&pn=RestoWay&am=0';

const PaymentQRScanner = () => {
  const { theme } = useTheme();
  const cartTotals = useAppSelector((state) => selectCartTotals(state as RootState));
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace('/payment/failure?method=upi&type=qr');
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m: ${secs.toString().padStart(2, '0')}s`;
  };

  const handlePaid = () => {
    router.replace('/payment/success?method=upi');
  };

  const handleCancel = () => {
    router.replace('/payment/failure?method=upi&type=qr');
  };

    return (
    <Modal visible transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: theme.shadow || 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.card, { backgroundColor: (theme as any).card || theme.background }]}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.replace('/payment/failure?method=upi&type=qr')}
          >
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.headerTitle, { color: theme.buttonPrimary }]}>Pay Using QR Code</Text>

          {/* Merchant Name and Payment Amount */}
          <View style={[styles.infoCard, { backgroundColor: (theme as any).backgroundSecondary }]}>
            <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Merchant name</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>Resto</Text>
            </View>
            <View style={[styles.infoDivider, { backgroundColor: theme.divider || '#D0D0D0' }]} />
            <View style={styles.infoColumn}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Payment amount</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>₹{Math.round(cartTotals.total)}</Text>
            </View>
          </View>

          {/* Instruction */}
          <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
            Scan the QR code mentioned below with supported UPI apps
          </Text>

          {/* UPI Logos Row */}
          <View style={styles.upiLogosContainer}>
            {/* PhonePe */}
            <View style={[styles.upiIconContainer, { backgroundColor: '#5F259F' }]}>
              <Text style={styles.phonepeText}>पे</Text>
            </View>
            {/* Google Pay */}
            <View style={styles.googlePayContainer}>
              <View style={[styles.googlePayShape, { backgroundColor: '#4285F4' }]} />
              <View style={[styles.googlePayShape, styles.googlePayShapeYellow, { backgroundColor: '#FABC05' }]} />
              <View style={[styles.googlePayShape, styles.googlePayShapeRed, { backgroundColor: '#EA4335' }]} />
            </View>
            {/* Paytm */}
            <View style={styles.paytmContainer}>
              <Text style={[styles.paytmText, { color: '#002970' }]}>Pay</Text>
              <Text style={[styles.paytmText, { color: '#00BAF2' }]}>tm</Text>
            </View>
            {/* Amazon Pay */}
            <View style={styles.amazonPayContainer}>
              <Text style={[styles.amazonPayText, { color: '#232F3E' }]}>pay</Text>
              <View style={styles.amazonArrow}>
                <Ionicons name="arrow-forward" size={12} color="#FF9900" />
              </View>
            </View>
            {/* WhatsApp */}
            <View style={[styles.upiIconContainer, { backgroundColor: '#25D366' }]}>
              <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
            </View>
            {/* Airtel
            <View style={styles.airtelContainer}>
              <View style={[styles.airtelShape, { backgroundColor: '#E60012' }]} />
            </View> */}
            {/* Security/Shield */}
            <View style={[styles.upiIconContainer, { backgroundColor: '#1E3A8A' }]}>
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
            </View>
          </View>

          {/* QR Code */}
          <Image source={{ uri: STATIC_QR_URI }} style={styles.qr} resizeMode="contain" />

          {/* Timer */}
          <View style={[styles.timerContainer, { backgroundColor: (theme as any).backgroundSecondary }]}>
            <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>
              Complete your payment before it time out!
            </Text>
            <View style={[styles.timerPill, { backgroundColor: theme.buttonPrimary }]}>
              <Ionicons name="time-outline" size={16} color={theme.buttonText} />
              <Text style={[styles.timerText, { color: theme.buttonText }]}>
                {formatTimer(secondsLeft)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.paidButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handlePaid}
            >
              <Text style={[styles.paidButtonText, { color: theme.buttonText }]}>Paid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: (theme as any).backgroundSecondary, borderColor: theme.buttonPrimary }]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    borderRadius: 12,
    //padding: 4,
    alignItems: 'center',
  },
  infoColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: 16,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  upiLogosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  upiIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonepeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  googlePayContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  googlePayShape: {
    position: 'absolute',
    width: 16,
    height: 22,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    left: 4,
    top: 4,
    transform: [{ rotate: '-15deg' }],
  },
  googlePayShapeYellow: {
    left: 8,
    top: 6,
    transform: [{ rotate: '5deg' }],
  },
  googlePayShapeRed: {
    left: 11,
    top: 4,
    transform: [{ rotate: '25deg' }],
  },
  paytmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  paytmText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  amazonPayContainer: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  amazonPayText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  amazonArrow: {
    marginTop: 1,
  },
  airtelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  airtelShape: {
    width: 20,
    height: 20,
    borderRadius: 10,
    transform: [{ rotate: '45deg' }],
  },
  qr: {
    width: 240,
    height: 240,
    borderRadius: 12,
    //marginBottom: 8,
  },
  timerContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 6,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontWeight: '700',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  paidButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PaymentQRScanner;
