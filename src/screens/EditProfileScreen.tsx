import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  useEffect(() => {
    if (activeUser) {
      setFullName(activeUser.fullName || activeUser.name || '');
      setEmail(activeUser.email || '');
      setPhone(activeUser.phone || '');
      setBio(activeUser.bio || 'I love fast food');
      setAvatarUrl(activeUser.avatarUrl);
    }
  }, [activeUser]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    const payload = {
      fullName: fullName.trim(),
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl?.trim() || undefined,
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
          <View style={[styles.avatarContainer, { backgroundColor: theme.backgroundSecondary }]}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-outline" size={48} color={theme.textMuted} />
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
        <InputField label="Email" value={email} onChangeText={setEmail} placeholder="Type here..." />
        <InputField label="Phone number" value={phone} onChangeText={setPhone} placeholder="Type here..." />
        <InputField label="BIO" value={bio} onChangeText={setBio} placeholder="Type here..." multiline />

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.buttonPrimary }]} onPress={handleSave}>
          <Text style={[styles.saveButtonText, { color: theme.buttonText }]}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>

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
});

export default EditProfileScreen;
