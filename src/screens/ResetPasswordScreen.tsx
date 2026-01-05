import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Logo from '../../assets/LOGO.svg';
import LoginBg from '../../assets/images/start/loginbg.svg';
import VerificationScreen from '../screens/VerificationScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearPasswordReset, setPasswordResetEmail, updateUserPassword } from '../store/slices/authSlice';
import { useTheme } from '../theme/useTheme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type ResetStep = 'email' | 'password';

export default function ResetPasswordScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);
  const passwordResetState = useAppSelector((state) => state.auth.passwordReset);
  
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showVerification, setShowVerification] = useState(false);
  const [pendingPasswordUpdate, setPendingPasswordUpdate] = useState<{
    emailOrPhone: string;
    newPassword: string;
  } | null>(null);

  const validateEmailOrPhone = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return emailRegex.test(input) || (phoneRegex.test(input) && input.replace(/\D/g, '').length >= 10);
  };

  const checkAccountExists = (emailOrPhone: string): boolean => {
    const user = registeredUsers.find((u) => u.emailOrPhone === emailOrPhone);
    return !!user;
  };

  const validateOldPassword = (emailOrPhone: string, password: string): boolean => {
    const user = registeredUsers.find((u) => u.emailOrPhone === emailOrPhone);
    if (!user) return false;
    return user.password === password;
  };

  const handleEmailSubmit = () => {
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Email or phone number is required');
      return;
    }

    if (!validateEmailOrPhone(email.trim())) {
      setEmailError('Please enter a valid email or phone number');
      return;
    }

    if (!checkAccountExists(email.trim())) {
      setEmailError('No account found with this email/phone');
      return;
    }

    // Store email and go to password step
    dispatch(setPasswordResetEmail(email.trim()));
    setStep('password');
  };

  const handleOtpVerificationSuccess = () => {
    console.log('handleOtpVerificationSuccess called');
    
    // Don't close verification modal - let VerificationScreen handle success modal
    // Just save the password
    
    // Save the password first since OTP is verified
    if (pendingPasswordUpdate) {
      console.log('Saving password for:', pendingPasswordUpdate.emailOrPhone);
      dispatch(updateUserPassword(pendingPasswordUpdate));
      dispatch(clearPasswordReset());
      setPendingPasswordUpdate(null);
    }
    
    // Success modal will be shown by VerificationScreen
  };

  const calculatePasswordStrength = (pwd: string): number => {
    if (!pwd) return 0;
    
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 10;
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20;
    
    return Math.min(strength, 100);
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    const strength = calculatePasswordStrength(text);
    setPasswordStrength(strength);
    const error = validatePassword(text);
    setPasswordError(error);
    
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text !== newPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = () => {
    setOldPasswordError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const userEmail = passwordResetState.email || email.trim();

    // Validate old password
    if (!oldPassword.trim()) {
      setOldPasswordError('Old password is required');
      return;
    }

    // Verify old password is correct
    if (!validateOldPassword(userEmail, oldPassword.trim())) {
      setOldPasswordError('Old password is incorrect');
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError('New password is required');
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }

    // Check if new password is different from old password
    if (oldPassword === newPassword) {
      setPasswordError('New password must be different from old password');
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    // Store pending password update and show OTP verification
    setPendingPasswordUpdate({
      emailOrPhone: userEmail,
      newPassword: newPassword.trim(),
    });
    
    // Show OTP verification popup
    setShowVerification(true);
  };

  // Calculate rgba color for 20% opacity background
  const getBackgroundColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header with background */}
      <View style={styles.headerWrapper}>
        <View style={[styles.headerBackground, { backgroundColor: getBackgroundColor(theme.buttonPrimary) }]} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 'password') {
              setStep('email');
              dispatch(clearPasswordReset());
            } else {
              router.back();
            }
          }}
        >
          <View style={[styles.backButtonCircle, { backgroundColor: theme.background }]}>
            <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
          </View>
        </TouchableOpacity>

        <View style={styles.logoWrapper}>
          <Logo width={143} height={48.5} />
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Reset Password
          </Text>
          <View style={[styles.titleUnderline, { backgroundColor: theme.buttonPrimary }]} />
        </View>
      </View>

      {/* Background starts BELOW header */}
      <View style={styles.bgWrapper}>
        <LoginBg style={styles.bgSvg} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Content */}
        <View style={styles.content}>
          {step === 'email' ? (
            <>
              <Text style={[styles.instruction, { color: theme.textSecondary }]}>
                Enter your email or phone number to receive a verification code.
              </Text>

              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                    E-mail or phone number
                  </Text>
                </View>
                <View style={[styles.passwordInputContainer, { backgroundColor: theme.inputBackground }]}>
                  <TextInput
                    style={[styles.passwordInput, { color: theme.inputText }]}
                    placeholder="Type here..."
                    placeholderTextColor={theme.inputPlaceholder}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {emailError ? (
                  <Text style={[styles.errorText, { color: theme.error }]}>{emailError}</Text>
                ) : null}
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.buttonPrimary }]}
                onPress={handleEmailSubmit}
              >
                <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.instruction, { color: theme.textSecondary }]}>
                * Your new password must be different from previous used passwords.
              </Text>

              {/* Email Display */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                    Email/Phone
                  </Text>
                </View>
                <View style={[styles.passwordInputContainer, { backgroundColor: theme.backgroundSecondary }]}>
                  <Text style={[styles.passwordInput, { color: theme.textSecondary }]}>
                    {passwordResetState.email || email}
                  </Text>
                </View>
              </View>

              {/* Old Password */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                    Enter your old password
                  </Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Type here..."
                    placeholderTextColor={theme.textMuted}
                    value={oldPassword}
                    onChangeText={(text) => {
                      setOldPassword(text);
                      setOldPasswordError('');
                    }}
                    secureTextEntry={!showOldPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowOldPassword(!showOldPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showOldPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {oldPasswordError ? (
                  <Text style={styles.errorText}>{oldPasswordError}</Text>
                ) : null}
              </View>

              {/* New Password */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                    Enter your new password
                  </Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Type here..."
                    placeholderTextColor={theme.textMuted}
                    value={newPassword}
                    onChangeText={handleNewPasswordChange}
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <View style={styles.labelContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                    Confirm Password
                  </Text>
                </View>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Type here..."
                    placeholderTextColor={theme.textMuted}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Password Requirements */}
              <View style={styles.passwordRequirements}>
                <Text style={[styles.passwordRequirementsText, { color: theme.textPrimary }]}>
                  * At least 8 characters * A mixture of letters and numbers.
                </Text>
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.passwordStrengthBar}>
                    <View
                      style={[
                        styles.passwordStrengthFill,
                        {
                          width: `${passwordStrength}%`,
                          backgroundColor:
                            passwordStrength < 30
                              ? theme.error
                              : passwordStrength < 60
                              ? theme.warning
                              : passwordStrength < 80
                              ? theme.buttonPrimary
                              : theme.success,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.passwordStrengthText, { color: theme.buttonPrimary }]}>
                    safety alert
                  </Text>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.buttonPrimary }]}
                onPress={handleSubmit}
              >
                <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      {/* OTP Verification Modal */}
      {showVerification && (
        <VerificationScreen
          emailOrPhone={passwordResetState.email || email}
          context="reset_password"
          onClose={() => {
            setShowVerification(false);
            setPendingPasswordUpdate(null);
          }}
          onVerificationSuccess={handleOtpVerificationSuccess}
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  root: {
    flex: 1,
  },
  headerWrapper: {
    position: 'relative',
    paddingTop: SCREEN_HEIGHT * 0.08,
    //paddingBottom: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: 24,
    zIndex: 10,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgSvg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.06 + 10,
    left: 24,
    zIndex: 2,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.card,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoWrapper: {
    alignItems: 'center',
    zIndex: 1,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  titleContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: SCREEN_HEIGHT < 700 ? 20 : 24,
    marginBottom: 8,
  },
  titleUnderline: {
    width: 100,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.buttonPrimary,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    zIndex: 1,
  },
  instruction: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginBottom: 24,
    lineHeight: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: SCREEN_HEIGHT < 700 ? 14 : 16,
    color: theme.textPrimary,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.inputBackground,
    borderRadius: 8,
    borderWidth: 0,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: SCREEN_HEIGHT < 700 ? 12 : 14,
    paddingHorizontal: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: SCREEN_HEIGHT < 700 ? 14 : 16,
    color: theme.inputText,
  },
  eyeIcon: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  passwordRequirements: {
    marginBottom: 24,
  },
  passwordRequirementsText: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
    color: theme.textSecondary,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordStrengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: theme.divider,
    borderRadius: 2,
    marginRight: 12,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontFamily: 'Inter_300Light',
    fontSize: 12,
    color: theme.textSecondary,
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: theme.error,
    marginTop: 4,
  },
  submitButton: {
    width: SCREEN_HEIGHT < 700 ? 160 : 180,
    height: SCREEN_HEIGHT < 700 ? 45 : 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: SCREEN_HEIGHT < 700 ? 15 : 17,
    lineHeight: SCREEN_HEIGHT < 700 ? 15 : 20,
    color: theme.buttonText,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModalContainer: {
    width: SCREEN_WIDTH * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: theme.card,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
    color: theme.textPrimary,
  },
  successMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    color: theme.textSecondary,
  },
  successButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.buttonPrimary,
  },
  successButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: theme.buttonText,
  },
});

