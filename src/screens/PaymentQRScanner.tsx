import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

const COUNTDOWN_SECONDS = 30;
const STATIC_QR_URI =
  'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=restoway@upi&pn=RestoWay&am=0';

const PaymentQRScanner = () => {
  const { theme } = useTheme();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.replace('/payment/failure');
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const markPaid = () => {
    router.replace('/payment/success?method=upi');
  };

  const markFailed = () => {
    router.replace('/payment/failure');
  };

    return (
    <Modal visible transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Scan to Pay (UPI)</Text>
          <Text style={[styles.scanLabel, { color: theme.textSecondary }]}>Show this QR to pay</Text>
          <Image source={{ uri: STATIC_QR_URI }} style={styles.qr} resizeMode="contain" />
          <View style={styles.timerPill}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.timerText}>{secondsLeft}s</Text>
      </View>
          <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.payButton, { backgroundColor: theme.success }]} onPress={markPaid}>
              <Text style={styles.payButtonText}>I Paid</Text>
            </TouchableOpacity>
              <TouchableOpacity style={[styles.failButton, { backgroundColor: theme.error }]} onPress={markFailed}>
              <Text style={styles.failButtonText}>Payment Failed</Text>
        </TouchableOpacity>
      </View>
          <TouchableOpacity style={[styles.cancel, { borderColor: theme.divider }]} onPress={() => router.replace('/payment')}>
            <Text style={[styles.cancelText, { color: theme.textPrimary }]}>Cancel</Text>
          </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '90%',
    maxWidth: 340,
  },
  scanLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  qr: {
    width: 220,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
  timerPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  payButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  failButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  failButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default PaymentQRScanner;
