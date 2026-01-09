import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile } from '../store/slices/authSlice';
import { useTheme } from '../theme/useTheme';

const EditProfileScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);

  const activeUser = user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [showPhoneOtpModal, setShowPhoneOtpModal] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [originalVerifiedEmail, setOriginalVerifiedEmail] = useState('');
  const [originalVerifiedPhone, setOriginalVerifiedPhone] = useState('');

  useEffect(() => {
    if (activeUser) {
      setFullName(activeUser.fullName || activeUser.name || '');
      setEmail(activeUser.email || '');
      setPhone(activeUser.phone || '');
      setBio(activeUser.bio || 'I love fast food');
      setAvatarUrl(activeUser.avatarUrl);
      setEmailVerified(activeUser.emailVerified || false);
      setPhoneVerified(activeUser.phoneVerified || false);
      // Store original verified values
      if (activeUser.emailVerified && activeUser.email) {
        setOriginalVerifiedEmail(activeUser.email);
      }
      if (activeUser.phoneVerified && activeUser.phone) {
        setOriginalVerifiedPhone(activeUser.phone.replace(/\D/g, ''));
      }
    }
  }, [activeUser]);

  // Reset email verification if email changes from original verified value
  useEffect(() => {
    if (emailVerified && originalVerifiedEmail) {
      const currentEmail = email.trim().toLowerCase();
      const originalEmail = originalVerifiedEmail.trim().toLowerCase();
      if (currentEmail !== originalEmail) {
        setEmailVerified(false);
      }
    }
  }, [email, emailVerified, originalVerifiedEmail]);

  // Reset phone verification if phone changes from original verified value
  useEffect(() => {
    if (phoneVerified && originalVerifiedPhone) {
      const currentPhone = phone.replace(/\D/g, '');
      const originalPhone = originalVerifiedPhone;
      if (currentPhone !== originalPhone) {
        setPhoneVerified(false);
      }
    }
  }, [phone, phoneVerified, originalVerifiedPhone]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    const payload = {
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''), // Save phone without formatting
      bio: bio.trim(),
      avatarUrl: avatarUrl?.trim() || undefined,
      emailVerified: emailVerified,
      phoneVerified: phoneVerified,
    };

    dispatch(updateProfile(payload));
    router.replace('/settings/personalinfo');
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.length) {
      const uri = result.assets[0].uri;
      setAvatarUrl(uri);
    }
  };

  const handleEmailVerify = () => {
    if (!email.trim()) return;
    setShowEmailOtpModal(true);
    setEmailOtp('');
  };

  const handlePhoneVerify = () => {
    if (!phone.trim()) return;
    setShowPhoneOtpModal(true);
    setPhoneOtp('');
  };

  const handleEmailOtpVerify = () => {
    if (emailOtp.length === 6) {
      setEmailVerified(true);
      setShowEmailOtpModal(false);
      setEmailOtp('');
      // Update profile with verification status
      dispatch(updateProfile({ emailVerified: true }));
    }
  };

  const handlePhoneOtpVerify = () => {
    if (phoneOtp.length === 6) {
      setPhoneVerified(true);
      setShowPhoneOtpModal(false);
      setPhoneOtp('');
      // Update profile with verification status
      dispatch(updateProfile({ phoneVerified: true }));
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format as mobile number (limit to 10 digits for now)
    if (cleaned.length <= 10) {
      if (cleaned.length <= 3) {
        return cleaned;
      } else if (cleaned.length <= 6) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      } else {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
    }
    return text;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Edit Profile</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formWrapper}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarEditWrapper}>
          <View style={[styles.avatarContainer, { backgroundColor: '#FB8C00B8' }]}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-outline" size={48} color={theme.buttonText} />
            )}
          </View>
          <TouchableOpacity
            style={[styles.avatarEditButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={handlePickImage}
          >
            <Ionicons name="pencil" size={16} color={theme.buttonText} />
          </TouchableOpacity>
        </View>

        <InputField label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Type here..." />
        <InputFieldWithVerify
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Type here..."
          onVerify={handleEmailVerify}
          verified={emailVerified}
          verifiedValue={email}
        />
        <InputFieldWithVerify
          label="Phone number"
          value={phone}
          onChangeText={(text) => setPhone(formatPhoneNumber(text))}
          placeholder="Type here..."
          onVerify={handlePhoneVerify}
          verified={phoneVerified}
          verifiedValue={phone}
          isPhone={true}
        />
        <InputField label="BIO" value={bio} onChangeText={setBio} placeholder="Type here..." multiline />

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: theme.buttonText }]}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Email OTP Modal */}
      <Modal visible={showEmailOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.otpModalContainer, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowEmailOtpModal(false)}
            >
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.otpModalTitle, { color: theme.textPrimary }]}>
              An OTP has been sent to email
            </Text>
            <Text style={[styles.otpModalSubtitle, { color: theme.textSecondary }]}>
              Please check your email
            </Text>
            <TextInput
              style={[styles.otpInput, { backgroundColor: theme.inputBackground, color: theme.textPrimary, borderColor: (theme as any).divider || theme.textMuted }]}
              value={emailOtp}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 6);
                setEmailOtp(digits);
              }}
              placeholder="Enter 6 digit OTP"
              placeholderTextColor={theme.inputPlaceholder || theme.textMuted}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={[styles.otpVerifyButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handleEmailOtpVerify}
              disabled={emailOtp.length !== 6}
            >
              <Text style={[styles.otpVerifyButtonText, { color: theme.buttonText }]}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Phone OTP Modal */}
      <Modal visible={showPhoneOtpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.otpModalContainer, { backgroundColor: theme.background }]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPhoneOtpModal(false)}
            >
              <Ionicons name="close" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.otpModalTitle, { color: theme.textPrimary }]}>
              An OTP has been sent to phone
            </Text>
            <Text style={[styles.otpModalSubtitle, { color: theme.textSecondary }]}>
              Please check your phone
            </Text>
            <TextInput
              style={[styles.otpInput, { backgroundColor: theme.inputBackground, color: theme.textPrimary, borderColor: (theme as any).divider || theme.textMuted }]}
              value={phoneOtp}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 6);
                setPhoneOtp(digits);
              }}
              placeholder="Enter 6 digit OTP"
              placeholderTextColor={theme.inputPlaceholder || theme.textMuted}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={[styles.otpVerifyButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={handlePhoneOtpVerify}
              disabled={phoneOtp.length !== 6}
            >
              <Text style={[styles.otpVerifyButtonText, { color: theme.buttonText }]}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav active="home" />
    </View>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
}) => {
  const { theme } = useTheme();
  const inputStyles = useMemo(() => createInputFieldStyles(theme), [theme]);
  return (
    <View style={inputStyles.inputGroup}>
      <Text style={[inputStyles.inputLabel, { color: theme.textPrimary }]}>{label}</Text>
      <TextInput
        style={[
          inputStyles.input,
          multiline && inputStyles.inputMultiline,
          { backgroundColor: theme.inputBackground, color: theme.textPrimary },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        multiline={multiline}
      />
    </View>
  );
};

const InputFieldWithVerify = ({
  label,
  value,
  onChangeText,
  placeholder,
  onVerify,
  verified,
  verifiedValue,
  isPhone = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onVerify: () => void;
  verified: boolean;
  verifiedValue: string;
  isPhone?: boolean;
}) => {
  const { theme } = useTheme();
  const inputStyles = useMemo(() => createInputFieldStyles(theme), [theme]);
  return (
    <View style={inputStyles.inputGroup}>
      <Text style={[inputStyles.inputLabel, { color: theme.textPrimary }]}>{label}</Text>
      <View style={inputStyles.inputWithButton}>
        <TextInput
          style={[
            inputStyles.input,
            inputStyles.inputWithVerify,
            { backgroundColor: theme.inputBackground, color: theme.textPrimary },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          keyboardType={isPhone ? 'phone-pad' : 'email-address'}
        />
        {verified ? (
          <View style={inputStyles.verifiedBadgeContainer}>
            <Ionicons name="checkmark-circle" size={18} color={(theme as any).success || '#00C853'} />
            <Text style={[inputStyles.verifiedLabel, { color: (theme as any).success || '#00C853' }]}>Verified</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[inputStyles.verifyButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={onVerify}
            disabled={!value.trim()}
          >
            <Text style={[inputStyles.verifyButtonText, { color: theme.buttonText }]}>Verify</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const createInputFieldStyles = (theme: any) => StyleSheet.create({
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  inputWithVerify: {
    flex: 1,
  },
  verifyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedContainer: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedText: {
    fontSize: 14,
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  verifiedBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
});

const createStyles = (theme: any) => StyleSheet.create({
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
  formScroll: {
    flex: 1,
  },
  formWrapper: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 140,
  },
  avatarEditWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 68.02,
    borderBottomRightRadius: 68.02,
    borderTopLeftRadius: 68.02,
    borderTopRightRadius: 68.02,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: '28%',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 98,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  footerSvgWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  hexagonContainer: {
    position: 'absolute',
    bottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    height: 72,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  navItemCenter: {
    width: 68,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpModalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    shadowColor: theme.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalCloseButton: {
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
  otpModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 8,
  },
  otpModalSubtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  otpInput: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  otpVerifyButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpVerifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default EditProfileScreen;
