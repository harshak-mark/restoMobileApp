import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../theme/useTheme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper function to detect if value is email or phone number
const isEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

interface VerificationScreenProps {
  emailOrPhone: string;
  onClose?: () => void;
  context?: 'signup' | 'login' | 'reset_password'; // 'signup' = from signup flow, 'login' = from forgot password flow, 'reset_password' = from password reset
  onResetPasswordFromSignup?: () => void; // Callback to clear password fields in signup
  onNavigateToResetPassword?: () => void; // Callback to navigate to reset password screen
  onVerificationSuccess?: () => void; // Callback when OTP verification succeeds
}

export default function VerificationScreen({
  emailOrPhone,
  onClose,
  context = 'signup',
  onResetPasswordFromSignup,
  onNavigateToResetPassword,
  onVerificationSuccess,
}: VerificationScreenProps) {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showMobileInputModal, setShowMobileInputModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'sms' | 'call' | null>(null);
  const [currentDeliveryMethod, setCurrentDeliveryMethod] = useState<'email' | 'mobile'>(
    isEmail(emailOrPhone) ? 'email' : 'mobile'
  );
  const [mobileNumberForDelivery, setMobileNumberForDelivery] = useState<string>('');
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mobileInputRef = useRef<TextInput | null>(null);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();

    return () => stopTimer();
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    // Clear error when user starts typing
    if (otpError) {
      setOtpError('');
    }

    if (text.length > 1) {
      // Handle paste
      const pastedOtp = text.slice(0, 4).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < 4) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      // Focus on last input or next empty
      const nextIndex = Math.min(index + pastedOtp.length, 3);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Stop timer once all digits are entered
    if (newOtp.every((digit) => digit.length === 1)) {
      stopTimer();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    // Resend OTP logic
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    startTimer();
    // Call API to resend OTP
    console.log('Resending OTP to:', emailOrPhone);
  };

  const handleVerify = () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 4) {
      setOtpError('Please enter OTP');
      return;
    }

    // Clear error if OTP is complete
    setOtpError('');

    // Call the verification success callback first (to register user/save password)
    if (context === 'signup' || context === 'reset_password') {
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }
      // OTP verified successfully - show success UI
      console.log('Setting showSuccess to true');
      setShowSuccess(true);
    } else {
      // For login context (forgot password flow) - navigate to reset password
      if (onClose) {
        onClose();
      }
      if (onNavigateToResetPassword) {
        setTimeout(() => {
          onNavigateToResetPassword();
        }, 200);
      } else {
        setTimeout(() => {
          router.replace('/reset-password');
        }, 200);
      }
    }
  };

  const handleChangeEmail = () => {
    // Close verification modal
    if (onClose) {
      onClose();
    }
    // Navigate to login/signup page
    router.replace({
      pathname: '/login',
      params: { tab: 'signup' },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate mobile number
  const validateMobileNumber = (number: string): boolean => {
    // Remove spaces, dashes, and other non-digit characters except +
    const cleaned = number.replace(/[\s\-\(\)]/g, '');
    // Check if it has at least 10 digits
    const digitsOnly = cleaned.replace(/\+/g, '');
    return digitsOnly.length >= 10 && /^[\d\+]+$/.test(cleaned);
  };

  const handleSmsClick = () => {
    if (isEmail(emailOrPhone) && timer === 0) {
      setDeliveryMethod('sms');
      setShowMobileInputModal(true);
      setMobileNumber('');
      setMobileNumberError('');
    }
  };

  const handleCallClick = () => {
    if (isEmail(emailOrPhone) && timer === 0) {
      setDeliveryMethod('call');
      setShowMobileInputModal(true);
      setMobileNumber('');
      setMobileNumberError('');
    }
  };

  const handleMobileNumberSubmit = async () => {
    // Clear previous errors
    setMobileNumberError('');

    // Validate mobile number
    if (!mobileNumber.trim()) {
      setMobileNumberError('Please enter mobile number');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      setMobileNumberError('Please enter a valid mobile number');
      return;
    }

    // Format phone number (remove spaces, dashes, etc.)
    const formattedNumber = mobileNumber.replace(/[\s\-\(\)]/g, '');

    // Close modal
    setShowMobileInputModal(false);

    // Update delivery method
    setCurrentDeliveryMethod('mobile');
    setMobileNumberForDelivery(formattedNumber);

    // Restart timer
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    startTimer();

    // If CALL was clicked, initiate phone call
    if (deliveryMethod === 'call') {
      try {
        const phoneUrl = `tel:${formattedNumber}`;
        const canOpen = await Linking.canOpenURL(phoneUrl);
        if (canOpen) {
          await Linking.openURL(phoneUrl);
        } else {
          console.log('Cannot make phone call');
        }
      } catch (error) {
        console.error('Error making phone call:', error);
      }
    } else if (deliveryMethod === 'sms') {
      // Send OTP via SMS (mock for now)
      console.log('Sending OTP via SMS to:', formattedNumber);
    }

    // Reset delivery method
    setDeliveryMethod(null);
    setMobileNumber('');
  };

  const handleMobileModalCancel = () => {
    setShowMobileInputModal(false);
    setMobileNumber('');
    setMobileNumberError('');
    setDeliveryMethod(null);
  };

  const [showSuccess, setShowSuccess] = useState(false);

  // Debug log when showSuccess changes
  useEffect(() => {
    console.log('showSuccess state changed:', showSuccess);
  }, [showSuccess]);

  // Auto-focus mobile input when modal opens
  useEffect(() => {
    if (showMobileInputModal && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [showMobileInputModal]);

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={handleChangeEmail}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleChangeEmail}
          >
            <Ionicons name="close" size={24} color={theme.buttonPrimary} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Verification Code
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            A verification code has been sent to your {currentDeliveryMethod === 'mobile' ? 'mobile' : isEmail(emailOrPhone) ? 'email' : 'mobile'}.
          </Text>

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor: theme.backgroundSecondary,
                    borderColor: otpError
                      ? '#FF3B30'
                      : value
                        ? theme.buttonPrimary
                        : theme.cardBorder,
                    color: theme.textPrimary,
                  },
                ]}
                value={value}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Error Message */}
          {otpError ? (
            <Text style={[styles.errorText, { color: '#FF3B30' }]}>
              {otpError}
            </Text>
          ) : null}

          {/* Timer or Resend Button */}
          {timer > 0 || otp.some((digit) => digit.length > 0) ? (
            <View style={styles.timerContainer}>
              <Text style={[styles.timerText, { color: theme.textSecondary }]}>
                Recent OTP in
              </Text>
              <Ionicons
                name="time-outline"
                size={16}
                color={theme.buttonPrimary}
                style={styles.timerIcon}
              />
              <Text style={[styles.timerValue, { color: theme.buttonPrimary }]}>
                {formatTime(timer)}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.resendButton, { borderColor: theme.buttonPrimary }]}
              onPress={handleResend}
            >
              <Text style={[styles.resendButtonText, { color: theme.buttonPrimary }]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}

          {/* SMS and CALL options - only show when timer expired and user signed up with email */}
          {isEmail(emailOrPhone) && timer === 0 && !otp.some((digit) => digit.length > 0) && (
            <View style={[styles.deliveryOptions, { borderColor: theme.divider }]}>
              <TouchableOpacity
                style={styles.deliveryOption}
                onPress={handleSmsClick}
              >
                <Ionicons name="phone-portrait-outline" size={20} color={theme.textPrimary} />
                <Text style={[styles.deliveryOptionText, { color: theme.textPrimary }]}>SMS</Text>
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: theme.divider }]} />
              <TouchableOpacity
                style={styles.deliveryOption}
                onPress={handleCallClick}
              >
                <Ionicons name="call-outline" size={20} color={theme.textPrimary} />
                <Text style={[styles.deliveryOptionText, { color: theme.textPrimary }]}>CALL</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={handleVerify}
          >
            <Text style={[styles.resetButtonText, { color: theme.buttonText }]}>
              Verify
            </Text>
          </TouchableOpacity>

          {/* Success Message and Login Button - shown after verification */}
          {showSuccess && (
            <>
              <Text style={[styles.successMessage, { color: theme.textPrimary, marginTop: 20, textAlign: 'center' }]}>
                {context === 'reset_password'
                  ? 'Password reset successful!'
                  : 'Account created successfully!'}
              </Text>
              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: theme.buttonPrimary, marginTop: 20 }]}
                onPress={() => {
                  setShowSuccess(false);
                  // Close verification screen
                  if (onClose) {
                    onClose();
                  }
                  // Navigate to login page with login tab active
                  router.replace({
                    pathname: '/login',
                    params: { tab: 'login' },
                  });
                }}
              >
                <Text style={[styles.resetButtonText, { color: theme.buttonText }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Change Email Link - hidden when showSuccess is true */}
          {!showSuccess && (
            <TouchableOpacity onPress={handleChangeEmail}>
              <Text style={[styles.changeEmailText, { color: theme.buttonPrimary }]}>
                Change Email
              </Text>
            </TouchableOpacity>
          )}

          {/* Mobile Number Input Modal */}
          {showMobileInputModal && (
            <View style={styles.mobileModalOverlay}>
              <View style={[styles.mobileModalContainer, { backgroundColor: theme.background }]}>
                <Text style={[styles.mobileModalTitle, { color: theme.textPrimary }]}>
                  Enter Mobile Number
                </Text>
                <Text style={[styles.mobileModalSubtitle, { color: theme.textSecondary }]}>
                  {deliveryMethod === 'call'
                    ? 'We will call you with the verification code'
                    : 'We will send you an SMS with the verification code'}
                </Text>
                <TextInput
                  ref={mobileInputRef}
                  style={[
                    styles.mobileInput,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: mobileNumberError
                        ? '#FF3B30'
                        : mobileNumber
                          ? theme.buttonPrimary
                          : theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                  placeholder="Enter mobile number"
                  placeholderTextColor={theme.textSecondary}
                  value={mobileNumber}
                  onChangeText={(text) => {
                    setMobileNumber(text);
                    if (mobileNumberError) {
                      setMobileNumberError('');
                    }
                  }}
                  keyboardType="phone-pad"
                  autoFocus
                />
                {mobileNumberError ? (
                  <Text style={[styles.mobileErrorText, { color: '#FF3B30' }]}>
                    {mobileNumberError}
                  </Text>
                ) : null}
                <View style={styles.mobileModalButtons}>
                  <TouchableOpacity
                    style={[styles.mobileModalButton, styles.mobileModalCancelButton, { borderColor: theme.divider }]}
                    onPress={handleMobileModalCancel}
                  >
                    <Text style={[styles.mobileModalButtonText, { color: theme.textPrimary }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.mobileModalButton, styles.mobileModalSendButton, { backgroundColor: theme.buttonPrimary }]}
                    onPress={handleMobileNumberSubmit}
                  >
                    <Text style={[styles.mobileModalButtonText, { color: theme.buttonText }]}>
                      Send
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#000',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginRight: 8,
  },
  timerIcon: {
    marginRight: 4,
  },
  timerValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  deliveryOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  deliveryOptionText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#000',
    marginLeft: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
  },
  resetButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  changeEmailText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  successMessage: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  resendButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  mobileModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mobileModalContainer: {
    width: SCREEN_WIDTH * 0.85,
    maxWidth: 350,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  mobileModalTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  mobileModalSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  mobileInput: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginBottom: 8,
  },
  mobileErrorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
  },
  mobileModalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  mobileModalButton: {
    flex: 1,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileModalCancelButton: {
    borderWidth: 1,
  },
  mobileModalSendButton: {
    // backgroundColor set inline
  },
  mobileModalButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});

