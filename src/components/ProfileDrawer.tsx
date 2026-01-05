import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { useTheme } from '../theme/useTheme';

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);
  
  // Get user data from available sources
  const activeUser = user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);
  const userName = activeUser?.name || activeUser?.email?.split('@')[0] || 'Xxxxxxx';
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarUrl = activeUser?.avatarUrl;

  const handleSignOut = () => {
    dispatch(logoutUser());
    onClose();
    router.replace('/login');
  };

  const handleMenuPress = (screen: string) => {
    onClose();

    switch (screen) {
      case 'personal-info':
        router.push({ pathname: '/settings/personalinfo', params: { from: 'settings' } });
        break;
      case 'delivery-address':
        router.push({ pathname: '/settings/delivery-address', params: { from: 'settings' } });
        break;
      case 'settings':
        router.push({ pathname: '/settings/account', params: { from: 'settings' } });
        break;
      case 'payment':
        router.push({ pathname: '/settings/payment', params: { from: 'settings' } });
        break;
      case 'notifications':
        router.push({ pathname: '/notifications', params: { from: 'settings' } });
        break;
      case 'faqs':
        router.push('/settings');
        break;
      case 'support':
        router.push('/settings');
        break;
      case 'cart':
        router.push({ pathname: '/cart', params: { from: 'settings' } });
        break;
      case 'orders':
        router.push({ pathname: '/orders', params: { from: 'settings' } });
        break;
      default:
        router.push(`/${screen}` as Href);
    }
  };

  const MenuItem = ({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconCircle}>{icon}</View>
        <Text style={[styles.menuItemLabel, { color: theme.textPrimary }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.buttonPrimary }]}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={[styles.profileImageContainer, { borderColor: theme.buttonText }]}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImagePlaceholder, { backgroundColor: theme.backgroundSecondary }]}>
                <Text style={[styles.profileInitialLarge, { color: theme.textPrimary }]}>
                  {userInitial}
                </Text>
              </View>
            )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.buttonText }]}>
                {userName.charAt(0).toUpperCase() + userName.slice(1)}
              </Text>
              <Text style={[styles.userBio, { color: theme.buttonText }]}>
                I love fast food
              </Text>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.textPrimary }]} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <ScrollView 
          style={[styles.content, { backgroundColor: theme.buttonPrimary }]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Block 1 */}
          <View style={[styles.menuSection, { backgroundColor: theme.card }]}>
            <MenuItem
              icon={<Ionicons name="person" size={20} color={theme.buttonPrimary} />}
              label="Profile Overview"
              onPress={() => handleMenuPress('personal-info')}
            />
            <MenuItem
              icon={<Ionicons name="document-text" size={20} color={theme.buttonPrimary} />}
              label="My Orders"
              onPress={() => handleMenuPress('orders')}
            />
          </View>

          {/* Block 2 */}
          <View style={[styles.menuSection, { backgroundColor: theme.card }]}>
            <MenuItem
              icon={<Ionicons name="cart" size={20} color={theme.buttonPrimary} />}
              label="Cart"
              onPress={() => handleMenuPress('cart')}
            />
            <MenuItem
              icon={<Ionicons name="location" size={20} color={theme.buttonPrimary} />}
              label="Delivery Address"
              onPress={() => handleMenuPress('delivery-address')}
            />
            <MenuItem
              icon={<Ionicons name="notifications" size={20} color={theme.buttonPrimary} />}
              label="Notifications"
              onPress={() => handleMenuPress('notifications')}
            />
            <MenuItem
              icon={<Ionicons name="card" size={20} color={theme.buttonPrimary} />}
              label="Save Payment Method"
              onPress={() => handleMenuPress('payment')}
            />
          </View>

          {/* Block 3 */}
          <View style={[styles.menuSection, { backgroundColor: theme.card }]}>
            <MenuItem
              icon={<Ionicons name="help-circle" size={20} color={theme.buttonPrimary} />}
              label="FAQs"
              onPress={() => handleMenuPress('faqs')}
            />
            <MenuItem
              icon={<Ionicons name="mail" size={20} color={theme.buttonPrimary} />}
              label="Support & feedback"
              onPress={() => handleMenuPress('support')}
            />
            <MenuItem
              icon={<Ionicons name="settings" size={20} color={theme.buttonPrimary} />}
              label="Settings"
              onPress={() => handleMenuPress('settings')}
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <View style={styles.iconCircle}>
              <Ionicons name="log-out" size={20} color={theme.buttonPrimary} />
            </View>
            <Text style={[styles.signOutText, { color: theme.buttonText }]}>Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
      resizeMode: 'cover',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
      backgroundColor: theme.backgroundSecondary,
  },
  profileInitialLarge: {
    fontSize: 32,
    fontWeight: 'bold',
      color: theme.textPrimary,
  },
  profileInfo: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userBio: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  menuSection: {
    borderRadius: 16,
    marginBottom: 10,
      paddingVertical: 2,
    paddingHorizontal: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
      backgroundColor: theme.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
      paddingVertical: 6,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 21,
      backgroundColor: theme.mode === 'dark' ? theme.backgroundSecondary : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
  menuItemLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 8,
  },
  signOutText: {
    fontSize: 16,
      paddingLeft: 8,
    fontWeight: '600',
    marginRight: 8,
  },
});
