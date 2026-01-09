import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addUpi, updateUpi } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

const PROVIDERS = [
  { key: 'gpay', label: 'Google Pay', icon: 'logo-google' as const },
  { key: 'phonepe', label: 'Phone Pe', icon: 'wallet' as const },
  { key: 'paytm', label: 'Paytm', icon: 'cash-outline' as const },
];

const AddUpiScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ next?: string; from?: string; edit?: string; upiId?: string; provider?: string; upiIdValue?: string }>();
  const pathname = usePathname();
  const next = (params.next as string | undefined) || undefined;
  const from = params.from;
  const dispatch = useAppDispatch();
  const upiList = useAppSelector((state) => state.payment.upiList);
  
  // Check if we're coming from settings flow
  const isFromSettings = pathname?.includes('/settings/payment') || from === 'settings';
  const isEditMode = params.edit === 'true';
  const editUpiId = params.upiId;

  const [provider, setProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const initializedRef = useRef(false);

  // Pre-fill form if editing (only run once when entering edit mode)
  useEffect(() => {
    if (isEditMode && editUpiId && !initializedRef.current) {
      const upiToEdit = upiList.find((upi) => upi.id === editUpiId);
      if (upiToEdit) {
        setProvider(upiToEdit.provider);
        setUpiId(upiToEdit.upiId);
        setIsVerified(upiToEdit.status === 'verified');
        initializedRef.current = true;
      } else if (params.provider && params.upiIdValue) {
        // Fallback to URL params if UPI not found in store
        setProvider(params.provider as any);
        setUpiId(decodeURIComponent(params.upiIdValue));
        initializedRef.current = true;
      }
    }
    // Reset initialization flag when not in edit mode
    if (!isEditMode) {
      initializedRef.current = false;
    }
  }, [isEditMode, editUpiId, upiList, params]);
  
  // Reset verification if UPI ID changes while editing
  useEffect(() => {
    if (isEditMode && editUpiId && initializedRef.current) {
      const upiToEdit = upiList.find((upi) => upi.id === editUpiId);
      if (upiToEdit && upiId !== '' && upiId !== upiToEdit.upiId) {
        // UPI ID was changed, allow reverification
        setIsVerified(false);
      }
    }
  }, [upiId, isEditMode, editUpiId, upiList]);

  const handleVerify = () => {
    if (!upiId.trim()) return;
    
    setIsVerifying(true);
    
    // Show loading for 5 seconds
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 5000);
  };

  const handleSave = () => {
    if (!upiId.trim() || !isVerified) return;
    
    if (isEditMode && editUpiId) {
      // Update existing UPI
      dispatch(
        updateUpi({
          id: editUpiId,
          provider,
          upiId: upiId.trim(),
          status: 'verified',
        })
      );
    } else {
      // Add new UPI
      dispatch(
        addUpi({
          provider,
          upiId: upiId.trim(),
          status: 'verified',
        })
      );
    }
    
    // Navigate based on where we came from
    if (from === 'settings') {
      // Always return to Save Payment Method when from settings
      router.replace('/settings/payment?tab=upi&from=settings');
    } else if (isFromSettings) {
      router.replace('/settings/payment?tab=upi');
    } else if (next && next !== '/payment') {
      router.replace(next as any);
    } else {
      router.replace('/settings/payment?tab=upi');
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
              router.back();
            }
          }}
          style={styles.headerIcon}
        >
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>UPI</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>UPI (GPay / PhonePe / Paytm)</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Pay when your order arrives</Text>

        <View style={styles.providersRow}>
          {PROVIDERS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.providerIconWrapper,
                provider === p.key && { borderColor: theme.buttonPrimary, borderWidth: 2, backgroundColor: theme.backgroundSecondary },
              ]}
              onPress={() => setProvider(p.key as any)}
            >
              <Ionicons
                name={p.icon}
                size={28}
                color={provider === p.key ? theme.buttonPrimary : theme.textPrimary}
              />
              <Text style={{ marginTop: 4, color: provider === p.key ? theme.buttonPrimary : theme.textPrimary, fontWeight: '600' }}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.input, { borderColor: theme.divider, color: theme.textPrimary, backgroundColor: theme.inputBackground }]}
          placeholder="your-upi-id@bank"
          placeholderTextColor={theme.textMuted}
          value={upiId}
          onChangeText={setUpiId}
        />

        <View style={styles.actionsRow}>
          {isVerified ? (
            <View style={styles.verifiedContainer}>
              <Ionicons name="checkmark-circle" size={20} color={(theme as any).success || '#00C853'} />
              <Text style={[styles.verifiedText, { color: (theme as any).success || '#00C853' }]}>Verified</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.verifyButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleVerify}
              disabled={!upiId.trim() || isVerifying}
            >
              <Text style={[styles.verifyText, { color: theme.buttonText }]}>Verify</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { 
              backgroundColor: theme.buttonPrimary,
              opacity: (!upiId.trim() || !isVerified) ? 0.5 : 1,
            }
          ]} 
          onPress={handleSave}
          disabled={!upiId.trim() || !isVerified}
        >
          <Text style={[styles.saveText, { color: theme.buttonText }]}>{isEditMode ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Modal */}
      <Modal visible={isVerifying} transparent animationType="fade">
        <View style={styles.loadingModalOverlay}>
          <View style={[styles.loadingModalContent, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.buttonPrimary} />
            <Text style={[styles.loadingText, { color: theme.textPrimary }]}>Verifying UPI ID...</Text>
          </View>
        </View>
      </Modal>

      <BottomNav active="home" />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 140,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40,
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
  contentContainer: {
    padding: 20,
    paddingBottom: 160,
    gap: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
      color: theme.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
      color: theme.textSecondary,
  },
  providersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  providerIconWrapper: {
    padding: 10,
    borderRadius: 12,
      backgroundColor: theme.card,
    alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.divider,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
      borderColor: theme.divider,
      backgroundColor: theme.inputBackground,
      color: theme.inputText,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  verifyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  verifyText: {
    fontSize: 14,
    fontWeight: '700',
      color: theme.buttonText,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
      color: theme.buttonText,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: '700',
  },
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContent: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddUpiScreen;
