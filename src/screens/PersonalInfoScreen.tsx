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
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Personal Info</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: theme.buttonPrimary }]}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.backgroundSecondary }]}>
                <Text style={[styles.avatarInitial, { color: theme.textPrimary }]}>{initial}</Text>
              </View>
            )}
          </View>
          <View style={styles.nameBlock}>
            <Text style={[styles.nameText, { color: theme.textPrimary }]}>{fullName}</Text>
            <Text style={[styles.bioText, { color: theme.textMuted }]}>{bio}</Text>
          </View>
        </View>

        <InfoRow
          icon={<Ionicons name="person-outline" size={22} color={theme.buttonPrimary} />}
          label="FULL NAME"
          value={fullName}
        />
        <InfoRow
          icon={<Ionicons name="mail-outline" size={22} color="#4A4AF4" />}
          label="EMAIL"
          value={email || 'Not provided'}
        />
        <InfoRow
          icon={<Ionicons name="call-outline" size={22} color="#2B9BF4" />}
          label="PHONE NUMBER"
          value={phone || 'Not provided'}
        />

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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  const { theme } = useTheme();
  const infoRowStyles = useMemo(() => createInfoRowStyles(theme), [theme]);
  return (
    <View style={[infoRowStyles.infoRow, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
      <View style={[infoRowStyles.iconCircle, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>{icon}</View>
      <View style={infoRowStyles.infoTextBlock}>
        <Text style={[infoRowStyles.infoLabel, { color: theme.textPrimary }]}>{label}</Text>
        <Text style={[infoRowStyles.infoValue, { color: theme.textMuted }]}>{value}</Text>
      </View>
    </View>
  );
};

const createInfoRowStyles = (theme: any) => StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  infoTextBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
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
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    overflow: 'hidden',
    backgroundColor: theme.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameBlock: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '700',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
  },
  bioText: {
    fontSize: 14,
  },
  editButton: {
    marginTop: 24,
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
