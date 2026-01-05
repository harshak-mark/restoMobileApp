import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch } from '../store/hooks';
import { addCard } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

const CARD_BRANDS = ['visa', 'mastercard', 'discover', 'amex'];

const AddCardScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ next?: string }>();
  const pathname = usePathname();
  const next = (params.next as string | undefined) || undefined;
  const dispatch = useAppDispatch();
  
  // Check if we're coming from settings flow
  const isFromSettings = pathname?.includes('/settings/payment');

  const [brand, setBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover' | 'other'>('visa');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{ name?: string; number?: string; expiry?: string; cvv?: string }>({});

  const maskedNumber = () => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 4) return '****';
    return `**** ${digits.slice(-4)}`;
  };

  const handleSave = () => {
    const nextErrors: typeof errors = {};

    const nameLetters = name.replace(/[^a-zA-Z\s]/g, '').trim();
    if (!nameLetters) nextErrors.name = 'Name required (letters only)';

    const numberDigits = number.replace(/\D/g, '');
    if (numberDigits.length !== 16) nextErrors.number = 'Card number must be 16 digits';

    const expiryClean = expiry.replace(/[^0-9/]/g, '').slice(0, 5);
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryClean)) nextErrors.expiry = 'Use MM/YY';

    const cvvDigits = cvv.replace(/\D/g, '');
    if (cvvDigits.length !== 3) nextErrors.cvv = 'CVV must be 3 digits';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    dispatch(
      addCard({
        brand,
        name: nameLetters,
        maskedNumber: maskedNumber(),
        expires: expiryClean,
        status: 'verified',
      })
    );
    
    // If coming from settings flow, always go to /settings/payment
    // Otherwise, use the next parameter or default to /settings/payment
    if (isFromSettings || next === '/payment') {
      router.replace('/settings/payment?tab=card');
    } else if (next) {
      router.replace(next as any);
    } else {
      router.replace('/settings/payment?tab=card');
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
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Card</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cardLogos}>
          {CARD_BRANDS.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.cardIconWrapper,
                brand === key && { borderColor: theme.buttonPrimary, borderWidth: 2, backgroundColor: theme.backgroundSecondary },
              ]}
              onPress={() => setBrand(key as any)}
            >
              <Ionicons name="card-outline" size={28} color={brand === key ? theme.buttonPrimary : theme.textPrimary} />
              <Text style={{ marginTop: 4, color: brand === key ? theme.buttonPrimary : theme.textPrimary, fontWeight: '600' }}>
                {key.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: theme.textPrimary }]}>Name on Card</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.divider, color: theme.textPrimary, backgroundColor: theme.inputBackground }]}
          placeholder="Name on Card"
          placeholderTextColor={theme.textMuted}
          value={name}
          onChangeText={(txt) => setName(txt)}
        />
        {!!errors.name && <Text style={[styles.errorText, { color: theme.error }]}>{errors.name}</Text>}

        <Text style={[styles.label, { color: theme.textPrimary }]}>Card Number</Text>
        <TextInput
          style={[styles.input, { borderColor: errors.number ? theme.error : theme.divider, color: theme.textPrimary, backgroundColor: theme.inputBackground }]}
          placeholder="xxxx xxxx xxxx xxxx"
          placeholderTextColor={theme.textMuted}
          value={number}
          onChangeText={(txt) => setNumber(txt.replace(/[^0-9\s]/g, ''))}
          keyboardType="number-pad"
          maxLength={19}
        />
        {!!errors.number && <Text style={[styles.errorText, { color: theme.error }]}>{errors.number}</Text>}

        <View style={styles.inlineRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>Expiry Date (MM/YY)</Text>
            <TextInput
              style={[styles.input, { borderColor: errors.expiry ? theme.error : theme.divider, color: theme.textPrimary, backgroundColor: theme.inputBackground }]}
              placeholder="MM/YY"
              placeholderTextColor={theme.textMuted}
              value={expiry}
              onChangeText={(txt) => setExpiry(txt.replace(/[^0-9/]/g, ''))}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
            {!!errors.expiry && <Text style={[styles.errorText, { color: theme.error }]}>{errors.expiry}</Text>}
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.label, { color: theme.textPrimary }]}>CVV</Text>
            <TextInput
              style={[styles.input, { borderColor: errors.cvv ? theme.error : theme.divider, color: theme.textPrimary, backgroundColor: theme.inputBackground }]}
              placeholder="CVV"
              placeholderTextColor={theme.textMuted}
              value={cvv}
              onChangeText={(txt) => setCvv(txt.replace(/[^0-9]/g, ''))}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={3}
            />
            {!!errors.cvv && <Text style={[styles.errorText, { color: theme.error }]}>{errors.cvv}</Text>}
          </View>
        </View>

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
    paddingBottom: 140,
    gap: 12,
  },
  cardLogos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 8,
  },
  cardIconWrapper: {
    padding: 10,
    borderRadius: 12,
      backgroundColor: theme.card,
    alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.divider,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
      color: theme.textPrimary,
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
  inlineRow: {
    flexDirection: 'row',
    gap: 8,
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});

export default AddCardScreen;
