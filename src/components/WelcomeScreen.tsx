import { router } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WelcomeScreenProps {
  emailOrPhone: string;
  onClose?: () => void;
  context?: 'signup' | 'login';
}

export default function WelcomeScreen({ emailOrPhone, onClose, context = 'signup' }: WelcomeScreenProps) {
  const { theme } = useTheme();

  // Extract username from email (part before @) or show "Username" for phone numbers
  const getUsername = (input: string): string => {
    if (input.includes('@')) {
      // Extract part before @
      const username = input.split('@')[0];
      // Capitalize first letter
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    // For phone numbers, just show "Username"
    return 'Username';
  };

  const username = getUsername(emailOrPhone);
  const userInitial = username.charAt(0).toUpperCase();

  const handleButtonPress = () => {
    if (onClose) {
      onClose();
    }
    if (context === 'signup') {
      // Navigate to login page after signup
      router.replace('/login');
    } else {
      // Navigate to home page after login
      router.replace('/home');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Welcome Title */}
      <Text style={[styles.welcomeText, { color: theme.buttonPrimary }]}>
        {context === 'login' ? 'Welcome back' : 'Welcome'}
      </Text>

      {/* User Avatar */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: '#F5F5F5' }]}>
          <Text style={[styles.avatarText, { color: theme.textPrimary }]}>
            {userInitial}
          </Text>
        </View>
        <Text style={[styles.usernameText, { color: theme.textPrimary }]}>{username}</Text>
      </View>

      {/* Success Messages */}
      <Text style={[styles.successMessage, { color: theme.textSecondary }]}>
        {context === 'login'
          ? 'You have been logged in successfully.'
          : 'Your account has been created successfully.'}
      </Text>
      <Text style={[styles.motivationalMessage, { color: theme.textSecondary }]}>
        Enjoy your foods and taste the freshness with every order.
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={[styles.getStartedButton, { backgroundColor: theme.buttonPrimary }]}
        onPress={handleButtonPress}
      >
        <Text style={[styles.getStartedText, { color: theme.buttonText }]}>
          {context === 'login' ? 'Go to Home' : 'Get Started'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 32,
    marginBottom: 32,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  avatarText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 36,
  },
  usernameText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  successMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
    color: '#666666',
  },
  motivationalMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    color: '#666666',
  },
  getStartedButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

