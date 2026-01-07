import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch } from '../store/hooks';
import { addUpi } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

const PROVIDERS = [
  { key: 'gpay', label: 'Google Pay', icon: 'logo-google' as const },
  { key: 'phonepe', label: 'Phone Pe', icon: 'wallet' as const },
  { key: 'paytm', label: 'Paytm', icon: 'cash-outline' as const },
];

const AddUpiScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ next?: string }>();
  const next = (params.next as string | undefined) || undefined;
  const dispatch = useAppDispatch();

  const [provider, setProvider] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');

  const handleSave = () => {
    if (!upiId.trim()) return;
    dispatch(
      addUpi({
        provider,
        upiId: upiId.trim(),
        status: 'verified',
      })
    );
    if (next === '/payment') {
      router.replace('/payment?tab=upi');
    } else if (next) {
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
          <TouchableOpacity style={[styles.verifyButton, { backgroundColor: theme.buttonPrimary }]}>
            <Text style={[styles.verifyText, { color: theme.buttonText }]}>Verify</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleSave}>
          <Text style={[styles.saveText, { color: theme.buttonText }]}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

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
});

export default AddUpiScreen;
