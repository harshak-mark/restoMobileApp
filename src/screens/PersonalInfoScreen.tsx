import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppSelector } from '../store/hooks';
import { useTheme } from '../theme/useTheme';

const PersonalInfoScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useLocalSearchParams<{ from?: string }>();
  const backToSettings = params.from === 'settings';
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);

  const activeUser = user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);
  const fullName =
    activeUser?.fullName ||
    activeUser?.name ||
    activeUser?.email?.split('@')[0] ||
    activeUser?.phone ||
    'User';
  const bio = activeUser?.bio || 'I love fast food';
  const email = activeUser?.email || '';
  const phone = activeUser?.phone || '';
  const avatarUrl = activeUser?.avatarUrl;
  const initial = fullName.charAt(0).toUpperCase();

  const handleBack = () => {
    if (backToSettings) {
      router.replace('/settings');
    } else {
      router.back();
    }
  };

  const handleEdit = () => {
    router.push('/settings/personalinfo/editdetails');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButtonHeader}>
          <View style={[styles.backButtonCircle, { backgroundColor: theme.background }]}>
            <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Personal Overview</Text>
        <View style={styles.headerIconPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Summary Section */}
        <View style={styles.profileSectionWrapper}>
          {/* Orange Container for Image (40% width, from left) */}
          <View style={[styles.profileImageContainer, { backgroundColor: '#FB8C00B8' }]}>
            <View style={styles.avatarWrapper}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.backgroundSecondary }]}>
                  <Text style={[styles.avatarInitial, { color: theme.textPrimary }]}>{initial}</Text>
                </View>
              )}
            </View>
          </View>
          {/* Name and Tagline (60% width, to the right) */}
          <View style={styles.nameBlockContainer}>
            <Text style={styles.nameText}>{fullName}</Text>
            <Text style={styles.bioText}>{bio}</Text>
          </View>
        </View>

        {/* Contact Information Card */}
        <View style={[styles.infoCard, { backgroundColor: (theme as any).card || theme.background }]}>
          <InfoRow
            icon={<Ionicons name="person-outline" size={22} color={theme.buttonPrimary} />}
            label="FULL NAME"
            value={fullName}
            showVerification={false}
          />
          <InfoRow
            icon={<Ionicons name="mail-outline" size={22} color={theme.buttonPrimary} />}
            label="EMAIL"
            value={email || 'Not provided'}
            verified={activeUser?.emailVerified || false}
            showVerification={true}
          />
          <InfoRow
            icon={<Ionicons name="call-outline" size={22} color={theme.buttonPrimary} />}
            label="PHONE NUMBER"
            value={phone || 'Not provided'}
            verified={activeUser?.phoneVerified || false}
            showVerification={true}
          />
        </View>

        <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleEdit}>
          <Text style={[styles.editButtonText, { color: theme.buttonText }]}>Edit</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  verified = false,
  showVerification = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  verified?: boolean;
  showVerification?: boolean;
}) => {
  const { theme } = useTheme();
  const infoRowStyles = useMemo(() => createInfoRowStyles(theme), [theme]);
  const isNotProvided = value === 'Not provided';
  const shouldShowVerification = showVerification && !isNotProvided;

  const handleNotVerifiedPress = () => {
    router.push('/settings/personalinfo/editdetails');
  };

  return (
    <View style={infoRowStyles.infoRow}>
      <View style={infoRowStyles.iconColumn}>
        <View style={[infoRowStyles.iconCircle, { backgroundColor: '#FFFFFF' }]}>
          {icon}
        </View>
      </View>
      <View style={infoRowStyles.infoColumn}>
        <Text style={[infoRowStyles.infoLabel, { color: theme.textPrimary }]}>{label}</Text>
        <View style={infoRowStyles.valueContainer}>
          <Text style={[infoRowStyles.infoValue, { color: '#6B6E82' }]}>{value}</Text>
          {shouldShowVerification && (
            verified ? (
              <View style={infoRowStyles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={(theme as any).success || '#00C853'} />
                <Text style={[infoRowStyles.verifiedLabel, { color: (theme as any).success || '#00C853' }]}>Verified</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[infoRowStyles.notVerifiedButton, { borderColor: theme.buttonPrimary }]}
                onPress={handleNotVerifiedPress}
              >
                <Text style={[infoRowStyles.notVerifiedButtonText, { color: theme.buttonPrimary }]}>Not verified</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </View>
  );
};

const createInfoRowStyles = (theme: any) => StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconColumn: {
    marginRight: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '400',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
    color: theme.textPrimary,
  },
      infoValue: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6B6E82',
      },
      valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
      },
      verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginLeft: 8,
      },
      verifiedLabel: {
        fontSize: 12,
        fontWeight: '500',
      },
      notVerifiedButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 1,
        marginLeft: 8,
      },
      notVerifiedButtonText: {
        fontSize: 12,
        fontWeight: '500',
      },
});

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  headerIconPlaceholder: {
    width: 40,
    height: 40,
  },
  contentContainer: {
    paddingBottom: 140,
  },
  profileSectionWrapper: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    height: 161.2,
    width: '100%',
  },
  profileImageContainer: {
    width: '40%',
    height: 161.2,
    borderBottomRightRadius: 80,
    borderTopRightRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBlockContainer: {
    width: '60%',
    paddingLeft: 20,
    justifyContent: 'center',
    height: 161.2,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '700',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#2C2C3A',
    fontFamily: 'Inter_700Bold',
  },
  bioText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#A0A5BA',
    fontFamily: 'Inter_400Regular',
  },
  infoCard: {
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    marginTop: 24,
    marginHorizontal: 24,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editButtonText: {
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
});

export default PersonalInfoScreen;
