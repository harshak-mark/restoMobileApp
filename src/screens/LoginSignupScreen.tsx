import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../../assets/LOGO.svg';
import LogoWhite from '../../assets/images/LOGOwhite.svg';
import GoogleIcon from '../../assets/images/Google.svg';
import LoginBg from '../../assets/images/start/loginbg.svg';
import LoadingAnimation from '../components/LoadingAnimation';
import WelcomeScreen from '../components/WelcomeScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser, setSignupPending } from '../store/slices/authSlice';
import { createStyles } from '../styles/LoginSignupScreen.styles';
import { useTheme } from '../theme/useTheme';
import VerificationScreen from './VerificationScreen';

WebBrowser.maybeCompleteAuthSession();

type TabType = 'login' | 'signup';

export default function LoginSignupScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme, insets.bottom), [theme, insets.bottom]);
  const dispatch = useAppDispatch();
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);
  const params = useLocalSearchParams<{ tab?: string }>();
  
  const [activeTab, setActiveTab] = useState<TabType>('login');
  
  // Set active tab based on route params
  useEffect(() => {
    console.log('Route params changed:', params.tab);
    if (params.tab === 'login' || params.tab === 'signup') {
      console.log('Setting active tab to:', params.tab);
      setActiveTab(params.tab as TabType);
    }
  }, [params.tab]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationContext, setVerificationContext] = useState<'signup' | 'login' | 'google_signup'>('signup');
  const [showLoading, setShowLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeContext, setWelcomeContext] = useState<'signup' | 'login'>('signup');
  const [pendingSignupData, setPendingSignupData] = useState<{
    emailOrPhone: string;
    password: string;
    email?: string;
    phone?: string;
    name?: string;
  } | null>(null);

  // Google OAuth setup
  // Note: For production, configure your Google Cloud Console OAuth credentials
  // and replace the placeholder below with your actual client ID
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Use clientId for web/development
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // In a real app, you would use the access token to fetch user info
      // For now, we'll simulate getting user data
      handleGoogleAuthSuccess(authentication?.accessToken || '');
    }
  }, [response]);

  const handleBack = () => {
    router.push('/landing');
  };

  const calculatePasswordStrength = (pwd: string): number => {
    if (!pwd) return 0;
    
    let strength = 0;
    // Length check
    if (pwd.length >= 8) strength += 25;
    if (pwd.length >= 12) strength += 10;
    // Has lowercase
    if (/[a-z]/.test(pwd)) strength += 15;
    // Has uppercase
    if (/[A-Z]/.test(pwd)) strength += 15;
    // Has numbers
    if (/[0-9]/.test(pwd)) strength += 15;
    // Has special characters
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20;
    
    return Math.min(strength, 100);
  };

  // Check if account exists using Redux state
  const checkAccountExists = (emailOrPhone: string): boolean => {
    const user = registeredUsers.find((u) => u.emailOrPhone === emailOrPhone);
    return !!user;
  };

  // Validate credentials using Redux state
  const validateCredentials = (emailOrPhone: string, password: string): boolean => {
    const user = registeredUsers.find((u) => u.emailOrPhone === emailOrPhone);
    if (!user) return false;
    return user.password === password;
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate required fields
    if (!email.trim()) {
      setEmailError('Email or phone number is required');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    if (!validateEmailOrPhone(email.trim())) {
      setEmailError('Please enter a valid email or phone number');
      return;
    }

    // Check if account exists using Redux state
    const accountExists = checkAccountExists(email.trim());
    if (!accountExists) {
      setPasswordError('Account doesn\'t exist, signup');
      return;
    }

    // Validate credentials using Redux state
    const isValidCredentials = validateCredentials(email.trim(), password.trim());
    if (!isValidCredentials) {
      setPasswordError('Invalid credentials');
      return;
    }

    // All validations passed - login the user
    dispatch(loginUser(email.trim()));
    
    // Show loading animation then welcome screen
    setVerificationEmail(email.trim());
    setWelcomeContext('login');
    setShowLoading(true);
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    const strength = calculatePasswordStrength(text);
    setPasswordStrength(strength);
    
    if (activeTab === 'signup') {
      const error = validatePassword(text);
      setPasswordError(error);
      if (confirmPassword && text !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else if (confirmPassword && text === confirmPassword) {
        setConfirmPasswordError('');
      }
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateEmailOrPhone = (input: string) => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Simple phone validation (digits, may include +, spaces, dashes)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    return emailRegex.test(input) || (phoneRegex.test(input) && input.replace(/\D/g, '').length >= 10);
  };

  const sendOTP = async (emailOrPhone: string) => {
    // Mock OTP sending - replace with actual API call
    console.log('Sending OTP to:', emailOrPhone);
    // Simulate API call
    // const response = await fetch('/api/send-otp', {
    //   method: 'POST',
    //   body: JSON.stringify({ emailOrPhone }),
    // });
    // return response.ok;
    return true;
  };

  const handleSignup = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate required fields
    if (!email.trim()) {
      setEmailError('Email or phone number is required');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }

    // Validate email/phone format
    if (!validateEmailOrPhone(email.trim())) {
      setEmailError('Please enter a valid email or phone number');
      return;
    }

    // Check if user already exists
    const emailOrPhone = email.trim();
    if (checkAccountExists(emailOrPhone)) {
      setEmailError('Account already exists. Please login instead.');
      return;
    }

    // Validate password
    const pwdError = validatePassword(password);
    if (pwdError) {
      setPasswordError(pwdError);
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }
    
    // All validations passed - store pending signup data and show OTP verification
    const isEmail = emailOrPhone.includes('@');
    
    const signupData = {
      emailOrPhone,
      password: password.trim(),
      email: isEmail ? emailOrPhone : undefined,
      phone: !isEmail ? emailOrPhone : undefined,
      name: isEmail ? emailOrPhone.split('@')[0] : undefined,
    };
    
    // Store pending signup data
    setPendingSignupData(signupData);
    dispatch(setSignupPending(signupData));
    
    // Show OTP verification screen
    setVerificationEmail(emailOrPhone);
    setVerificationContext('signup');
    setShowVerification(true);
  };

  const handleGoogleLogin = async () => {
    if (activeTab === 'login') {
      // For login, prompt Google OAuth and login directly
      try {
        await promptAsync();
      } catch (error) {
        Alert.alert('Error', 'Failed to start Google sign-in');
      }
    } else {
      // For signup, prompt Google OAuth then show OTP
      try {
        await promptAsync();
      } catch (error) {
        Alert.alert('Error', 'Failed to start Google sign-in');
      }
    }
  };

  const handleGoogleAuthSuccess = async (accessToken: string) => {
    // In a real app, fetch user info from Google using the access token
    // For demo, we'll simulate with a mock email
    const googleEmail = `user_${Date.now()}@gmail.com`;
    const userName = 'Google User';
    
    if (activeTab === 'login') {
      // Check if user exists
      if (checkAccountExists(googleEmail)) {
        // User exists, log them in
        dispatch(loginUser(googleEmail));
        setVerificationEmail(googleEmail);
        setWelcomeContext('login');
        setShowLoading(true);
      } else {
        // User doesn't exist, ask them to sign up
        Alert.alert(
          'Account Not Found',
          'No account found with this Google account. Please sign up first.',
          [
            { text: 'OK', onPress: () => setActiveTab('signup') }
          ]
        );
      }
    } else {
      // For signup with Google, show OTP verification
      const signupData = {
        emailOrPhone: googleEmail,
        password: 'google_oauth', // Special password for OAuth users
        email: googleEmail,
        name: userName,
      };
      
      setPendingSignupData(signupData);
      dispatch(setSignupPending(signupData));
      
      setVerificationEmail(googleEmail);
      setVerificationContext('google_signup');
      setShowVerification(true);
    }
  };

  // Handle successful OTP verification from signup
  const handleSignupVerificationSuccess = () => {
    console.log('handleSignupVerificationSuccess called');
    
    // Don't close verification modal - let VerificationScreen handle success modal
    // Just register the user and clear form fields
    
    if (pendingSignupData) {
      // Register the user now that OTP is verified
      dispatch(registerUser(pendingSignupData));
      setPendingSignupData(null);
    }
    
    // Clear form fields
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setConfirmPasswordError('');
    setEmailError('');
    setPasswordStrength(0);
    
    // Success modal will be shown by VerificationScreen
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
      {/* Combined header and tabs section with background */}
      <View style={styles.headerTabsWrapper}>
        <View style={[styles.headerTabsBackground, { backgroundColor: getBackgroundColor(theme.buttonPrimary) }]} />
        {/* Logo at top */}
        <View style={styles.logoWrapper}>
          {(theme as any).mode === 'dark' ? (
            <LogoWhite width={143} height={48.5} />
          ) : (
            <Logo width={143} height={48.5} />
          )}
        </View>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <View style={[styles.backButtonCircle, { backgroundColor: theme.background }]}>
            <Ionicons name="chevron-back" size={20} color={theme.textPrimary} />
          </View>
        </TouchableOpacity>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setActiveTab('login');
              setPasswordError('');
              setConfirmPasswordError('');
              setEmailError('');
              setPasswordStrength(0);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.tabTextActive,
              ]}
            >
              Login
            </Text>
            {activeTab === 'login' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => {
              setActiveTab('signup');
              setPasswordError('');
              setConfirmPasswordError('');
              setEmailError('');
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'signup' && styles.tabTextActive,
              ]}
            >
              Sign-up
            </Text>
            {activeTab === 'signup' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Background starts BELOW tabs */}
      <View style={styles.bgWrapper}>
        <LoginBg style={styles.bgSvg} />

        {/* Content over background */}
        <View style={styles.content}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Login with section */}
            <View style={styles.loginWithSection}>
              <Text style={[styles.loginWithText, { color: theme.textPrimary }]}>Login with</Text>
              <TouchableOpacity
                style={[styles.googleButton, { backgroundColor: theme.card, borderColor: theme.divider }]}
                onPress={handleGoogleLogin}
              >
                <GoogleIcon width={24} height={24} style={styles.googleIcon} />
                <Text style={[styles.googleButtonLabel, { color: theme.textPrimary }]}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            {/* Form fields */}
            <View style={styles.formContainer}>
            {/* Email field */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>E-mail or phone number</Text>
              <TextInput
                style={styles.input}
                placeholder="Type here..."
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Password field */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
                {activeTab === 'signup' ? 'Create Password' : 'Password'}
              </Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Type here..."
                  placeholderTextColor={theme.textMuted}
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <View style={styles.errorContainer}>
                  {passwordError.includes('signup') ? (
                    <Text style={styles.errorText}>
                      Account doesn&apos;t exist,{' '}
                      <Text
                        style={styles.errorLink}
                        onPress={() => setActiveTab('signup')}
                      >
                        signup
                      </Text>
                    </Text>
                  ) : (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  )}
                </View>
              ) : null}
            </View>

            {/* Confirm Password (only for signup) */}
            {activeTab === 'signup' && (
              <View style={styles.inputWrapper}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Confirm Password</Text>
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
            )}

            {/* Forgot password (only for login) */}
            {activeTab === 'login' && (
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  // Navigate directly to reset password page
                  router.push('/reset-password');
                }}
              >
                <Text style={[styles.forgotPasswordText, { color: theme.buttonPrimary }]}>Forgot password ?</Text>
              </TouchableOpacity>
            )}

            {/* Password requirements (only for signup) */}
            {activeTab === 'signup' && (
              <View style={styles.passwordRequirements}>
                <Text style={styles.passwordRequirementsText}>
                  * At least 8 characters
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
                  <Text style={styles.passwordStrengthText}>safety alert</Text>
                </View>
              </View>
            )}

            {/* Terms text (only for login) */}
            {activeTab === 'login' && (
              <Text style={styles.termsText}>
                By signing up, you agree to the{' '}
                <Text style={styles.termsTextOrange}>Terms Of Use</Text>,{' '}
                <Text style={styles.termsTextOrange}>Privacy Policy</Text> And{' '}
                <Text style={styles.termsTextOrange}>Cookie Policy</Text>.
              </Text>
            )}

            {/* Submit button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={activeTab === 'login' ? handleLogin : handleSignup}
            >
              <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>
                {activeTab === 'login' ? 'Login' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </View>

      {/* Loading Modal */}
      {showLoading && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
              <LoadingAnimation
                rounds={3}
                onComplete={() => {
                  setShowLoading(false);
                  // Wait 1 second before showing welcome screen
                  setTimeout(() => {
                    setShowWelcome(true);
                  }, 1000);
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Welcome Modal */}
      {showWelcome && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
              <WelcomeScreen
                emailOrPhone={verificationEmail}
                context={welcomeContext}
                onClose={() => {
                  setShowWelcome(false);
                  // Clear form fields for both login and signup
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setConfirmPasswordError('');
                  setEmailError('');
                  setPasswordStrength(0);
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Verification Modal */}
      {showVerification && (
        <VerificationScreen
          emailOrPhone={verificationEmail}
          context={verificationContext === 'google_signup' ? 'signup' : verificationContext}
          onClose={() => {
            setShowVerification(false);
            setPendingSignupData(null);
          }}
          onVerificationSuccess={() => {
            // Handle successful OTP verification
            console.log('onVerificationSuccess called, context:', verificationContext);
            if (verificationContext === 'signup' || verificationContext === 'google_signup') {
              handleSignupVerificationSuccess();
            }
          }}
          onResetPasswordFromSignup={() => {
            // Clear password fields when returning from signup verification
            setPassword('');
            setConfirmPassword('');
            setPasswordError('');
            setConfirmPasswordError('');
            setPasswordStrength(0);
          }}
          onNavigateToResetPassword={() => {
            // Navigate to reset password screen after modal closes
            router.push('/reset-password');
          }}
        />
      )}
    </View>
  );
}
