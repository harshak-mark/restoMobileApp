import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addCard, updateCard } from '../store/slices/paymentSlice';
import { useTheme } from '../theme/useTheme';

const CARD_BRANDS = ['visa', 'mastercard', 'discover', 'amex'];

const AddCardScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ next?: string; from?: string; edit?: string; cardId?: string; brand?: string; name?: string; number?: string; expires?: string }>();
  const pathname = usePathname();
  const next = (params.next as string | undefined) || undefined;
  const from = params.from;
  const dispatch = useAppDispatch();
  const cardList = useAppSelector((state) => state.payment.cardList);
  
  // Check if we're coming from settings flow
  const isFromSettings = pathname?.includes('/settings/payment') || from === 'settings';
  const isEditMode = params.edit === 'true';
  const editCardId = params.cardId;

  const [brand, setBrand] = useState<'visa' | 'mastercard' | 'amex' | 'discover' | 'other'>('visa');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{ name?: string; number?: string; expiry?: string; cvv?: string }>({});
  const initializedRef = useRef(false);

  // Pre-fill form if editing (only run once when entering edit mode)
  useEffect(() => {
    if (isEditMode && editCardId && !initializedRef.current) {
      const cardToEdit = cardList.find((card) => card.id === editCardId);
      if (cardToEdit) {
        setBrand(cardToEdit.brand);
        setName(cardToEdit.name);
        // Extract numbers from masked number (e.g., "**** 1234" -> "1234")
        const digits = cardToEdit.maskedNumber.replace(/\D/g, '');
        if (digits.length >= 4) {
          // Show masked format for editing - user can edit from here
          setNumber(formatCardNumber(digits));
        }
        setExpiry(cardToEdit.expires);
        // CVV is not stored, so leave it empty
        initializedRef.current = true;
      } else if (params.brand && params.name && params.number && params.expires) {
        // Fallback to URL params if card not found in store
        setBrand(params.brand as any);
        setName(decodeURIComponent(params.name));
        setNumber(formatCardNumber(params.number.replace(/\D/g, '')));
        setExpiry(params.expires);
        initializedRef.current = true;
      }
    }
    // Reset initialization flag when not in edit mode
    if (!isEditMode) {
      initializedRef.current = false;
    }
  }, [isEditMode, editCardId, cardList, params]);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setNumber(formatted);
    // Clear number error when user starts typing
    if (errors.number) {
      setErrors((prev) => ({ ...prev, number: undefined }));
    }
  };

  const validateExpiryDate = (expiryValue: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(expiryValue)) {
      return false;
    }
    
    const [month, year] = expiryValue.split('/');
    const expiryDate = new Date(2000 + parseInt(year, 10), parseInt(month, 10) - 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return expiryDate >= today;
  };

  const handleExpiryChange = (text: string) => {
    let formatted = text.replace(/[^0-9/]/g, '');
    
    // Auto-add slash after 2 digits
    if (formatted.length === 2 && !formatted.includes('/')) {
      formatted = formatted + '/';
    }
    
    formatted = formatted.slice(0, 5);
    setExpiry(formatted);
    
    // Validate expiry date
    if (formatted.length === 5) {
      if (!validateExpiryDate(formatted)) {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (expiryRegex.test(formatted)) {
          setErrors((prev) => ({ ...prev, expiry: 'Card expired' }));
        } else {
          setErrors((prev) => ({ ...prev, expiry: 'Use MM/YY' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, expiry: undefined }));
      }
    } else {
      setErrors((prev) => ({ ...prev, expiry: undefined }));
    }
  };

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
    if (!validateExpiryDate(expiryClean)) {
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (expiryRegex.test(expiryClean)) {
        nextErrors.expiry = 'Card expired';
      } else {
        nextErrors.expiry = 'Use MM/YY';
      }
    }

    const cvvDigits = cvv.replace(/\D/g, '');
    // CVV validation only required when adding new card, not when editing
    if (!isEditMode && cvvDigits.length !== 3) {
      nextErrors.cvv = 'CVV must be 3 digits';
    } else if (isEditMode && cvvDigits.length > 0 && cvvDigits.length !== 3) {
      // If CVV is entered in edit mode, it must be valid (but it's optional)
      nextErrors.cvv = 'CVV must be 3 digits';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    if (isEditMode && editCardId) {
      // Update existing card
      dispatch(
        updateCard({
          id: editCardId,
          brand,
          name: nameLetters,
          maskedNumber: maskedNumber(),
          expires: expiryClean,
          status: 'verified',
        })
      );
    } else {
      // Add new card
      dispatch(
        addCard({
          brand,
          name: nameLetters,
          maskedNumber: maskedNumber(),
          expires: expiryClean,
          status: 'verified',
        })
      );
    }
    
    // Navigate based on where we came from
    if (from === 'settings') {
      // Always return to Save Payment Method when from settings
      router.replace('/settings/payment?tab=card&from=settings');
    } else if (isFromSettings) {
      router.replace('/settings/payment?tab=card');
    } else if (next && next !== '/payment') {
      router.replace(next as any);
    } else {
      router.replace('/settings/payment?tab=card');
    }
  };

    // Check if all required fields are filled and valid
    // In edit mode, CVV is optional since it's not stored
    const isFormValid = () => {
      const nameLetters = name.replace(/[^a-zA-Z\s]/g, '').trim();
      const numberDigits = number.replace(/\D/g, '');
      const expiryClean = expiry.replace(/[^0-9/]/g, '').slice(0, 5);
      const cvvDigits = cvv.replace(/\D/g, '');
      
      if (isEditMode) {
        // For edit mode, CVV is optional
        return (
          nameLetters.length > 0 &&
          numberDigits.length === 16 &&
          validateExpiryDate(expiryClean)
        );
      } else {
        // For new cards, CVV is required
        return (
          nameLetters.length > 0 &&
          numberDigits.length === 16 &&
          validateExpiryDate(expiryClean) &&
          cvvDigits.length === 3
        );
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

      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
          onChangeText={handleCardNumberChange}
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
              onChangeText={handleExpiryChange}
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

        <TouchableOpacity 
          style={[
            styles.saveButton, 
            { 
              backgroundColor: theme.buttonPrimary,
              opacity: isFormValid() ? 1 : 0.5,
            }
          ]} 
          onPress={handleSave}
          disabled={!isFormValid()}
        >
          <Text style={[styles.saveText, { color: theme.buttonText }]}>{isEditMode ? 'Update' : 'Save'}</Text>
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
    paddingBottom: 300,
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
