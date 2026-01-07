import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTwoFactorEnabled } from '../store/slices/authSlice';
import { useTheme } from '../theme/useTheme';

const AccountSettingsScreen = () => {
  const { theme, setTheme, themeMode } = useTheme();
  const dispatch = useAppDispatch();
  const twoFactorEnabled = useAppSelector((state) => state.auth.twoFactorEnabled);

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [appAlerts, setAppAlerts] = useState(false);
  const language = useMemo(() => 'English', []);

  const handleTheme = (value: 'light' | 'dark') => {
    setTheme?.(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={26} color={theme.buttonText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Account Settings</Text>
        <View style={styles.headerIcon} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Notification Preferences</Text>
          <SettingRow
            label="Email Notifications"
            value={emailNotif}
            onValueChange={setEmailNotif}
            themeColor={theme.buttonPrimary}
            textColor={theme.textPrimary}
          />
          <SettingRow
            label="SMS Notifications"
            value={smsNotif}
            onValueChange={setSmsNotif}
            themeColor={theme.buttonPrimary}
            textColor={theme.textPrimary}
          />
          <SettingRow
            label="App Alerts"
            value={appAlerts}
            onValueChange={setAppAlerts}
            themeColor={theme.buttonPrimary}
            textColor={theme.textPrimary}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Theme & Appearance</Text>
          <Text style={[styles.subLabel, { color: theme.textPrimary }]}>Theme</Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && styles.themeOptionActive,
                themeMode === 'dark' && { borderColor: theme.buttonPrimary },
              ]}
              onPress={() => handleTheme('dark')}
            >
              <Ionicons
                name="moon"
                size={16}
                color={themeMode === 'dark' ? theme.buttonPrimary : theme.textPrimary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  { color: themeMode === 'dark' ? theme.buttonPrimary : theme.textPrimary },
                ]}
              >
                Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && styles.themeOptionActiveFilled,
                themeMode === 'light' && { backgroundColor: theme.buttonPrimary, borderColor: theme.buttonPrimary },
              ]}
              onPress={() => handleTheme('light')}
            >
              <Ionicons
                name="sunny"
                size={16}
                color={themeMode === 'light' ? theme.buttonText : theme.textPrimary}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  { color: themeMode === 'light' ? theme.buttonText : theme.textPrimary },
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subLabel, { color: theme.textPrimary, marginTop: 16 }]}>Language</Text>
          <View style={[styles.languageBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.divider, borderWidth: 1 }]}>
            <Text style={[styles.languageText, { color: theme.textPrimary }]}>{language}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Security</Text>

          <TouchableOpacity
            style={styles.securityButton}
            onPress={() => router.push('/reset-password')}
          >
            <Text style={[styles.securityButtonText, { color: theme.textPrimary }]}>Change Password</Text>
          </TouchableOpacity>

          <View style={styles.securityRow}>
            <Text style={[styles.securityLabel, { color: theme.textPrimary }]}>Enable Two-Factor Authentication</Text>
            <Switch
              value={twoFactorEnabled}
              onValueChange={() => {
                const next = !twoFactorEnabled;
                dispatch(setTwoFactorEnabled(next));
              }}
              trackColor={{ false: '#ccc', true: theme.buttonPrimary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.securityButton}>
            <Text style={[styles.securityButtonText, { color: theme.textPrimary }]}>
              Manage Active Sessions
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
};

const SettingRow = ({
  label,
  value,
  onValueChange,
  themeColor,
  textColor,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  themeColor: string;
  textColor: string;
}) => {
  return (
    <View style={styles.settingRow}>
      <Text style={[styles.settingLabel, { color: textColor }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: themeColor }}
        thumbColor="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  body: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 140,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingVertical: 4,
  },
  settingLabel: {
    fontSize: 15,
  },
  subLabel: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '600',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    gap: 6,
  },
  themeOptionActive: {
    borderColor: '#FB8C00',
  },
  themeOptionActiveFilled: {
    borderColor: '#FB8C00',
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  languageBox: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  languageText: {
    fontSize: 14,
  },
  securityButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  securityButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
  },
  securityLabel: {
    fontSize: 15,
    flex: 1,
    marginRight: 12,
  },
});

export default AccountSettingsScreen;
