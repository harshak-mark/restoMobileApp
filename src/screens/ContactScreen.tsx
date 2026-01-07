import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PhoneSvg from '../../assets/images/phone.svg';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

type SubjectType = 'general' | 'event' | 'dining' | 'business';

const ContactScreen = () => {
  const { theme } = useTheme();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+1 012 3456 789');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('general');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // Handle send message logic
    console.log('Sending message:', { firstName, email, phoneNumber, selectedSubject, message });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity
          onPress={() => router.replace('/settings')}
          style={styles.backButton}
        >
          <View style={[styles.backButtonCircle, { backgroundColor: '#ECF0F4' }]}>
            <Ionicons name="chevron-back" size={22} color="#181C2E" />
          </View>
          <Text style={[styles.backButtonText, { color: theme.buttonText }]}>About us</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Contact Us</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Any question or remarks?{'\n'}Just write us a message!
          </Text>
        </View>

        {/* Contact Information Card */}
        <View style={styles.contactCard}>
          <View style={styles.phoneImageContainer}>
            <PhoneSvg width="100%" height="100%" style={styles.phoneImage} />
          </View>
          
          <View style={styles.contactCardContent}>
            <Text style={[styles.contactCardTitle, { color: theme.buttonText }]}>Contact Information</Text>
            <Text style={[styles.contactCardSubtitle, { color: theme.textMuted }]}>
              Say something to start a live chat!
            </Text>

            <View style={styles.contactDetails}>
              <View style={styles.contactItem}>
                <Ionicons name="call" size={20} color={theme.buttonText} /> 
                <Text style={[styles.contactText, { color: theme.buttonText }]}>+1234567890</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail" size={20} color={theme.buttonText} />
                <Text style={[styles.contactText, { color: theme.buttonText }]}>Resto@gmail.com</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="location" size={20} color={theme.buttonText} />
                <Text style={[styles.contactText, { color: theme.buttonText }]}>
                  132,XXXXXXXXXXX, {'\n'}XXXXXXXXXXxxx02156 XXXXXXXXXX
                </Text>
              </View>
            </View>

            {/* Social Media Icons */}
            <View style={styles.socialIcons}>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: theme.background, borderColor: theme.buttonPrimary }]}>
                <Ionicons name="logo-twitter" size={20} color={theme.buttonPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: theme.background, borderColor: theme.buttonPrimary }]}>
                <Ionicons name="logo-instagram" size={20} color={theme.buttonPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialIcon, { backgroundColor: theme.background, borderColor: theme.buttonPrimary }]}>
                <Ionicons name="logo-discord" size={20} color={theme.buttonPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: 'transparent',
                  borderBottomColor: '#8D8D8D',
                  color: theme.inputText,
                },
              ]}
              placeholderTextColor={theme.inputPlaceholder}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: 'transparent',
                  borderBottomColor: '#8D8D8D',
                  color: theme.inputText,
                },
              ]}
              placeholderTextColor={theme.inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: 'transparent',
                  borderBottomColor: theme.divider,
                  color: theme.inputText,
                },
              ]}
              placeholder="+x xxxxx xxxxx"
              placeholderTextColor={theme.inputPlaceholder}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Subject Selection */}
          <View style={styles.subjectSection}>
            <Text style={[styles.subjectLabel, { color: theme.textPrimary }]}>Select Subject?</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSelectedSubject('general')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedSubject === 'general' ? theme.buttonPrimary : '#E0E0E0',
                      backgroundColor: selectedSubject === 'general' ? theme.buttonPrimary : '#E0E0E0',
                    },
                  ]}
                >
                  {selectedSubject === 'general' && (
                    <Ionicons name="checkmark" size={10} color={theme.buttonText} />
                  )}
                </View>
                <Text style={[styles.radioLabel, { color: theme.textPrimary }]}>General enquiry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSelectedSubject('event')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedSubject === 'event' ? theme.buttonPrimary : '#E0E0E0',
                      backgroundColor: selectedSubject === 'event' ? theme.buttonPrimary : '#E0E0E0',
                    },
                  ]}
                >
                  {selectedSubject === 'event' && (
                    <Ionicons name="checkmark" size={10} color={theme.buttonText} />
                  )}
                </View>
                <Text style={[styles.radioLabel, { color: theme.textPrimary }]}>Event enquiry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSelectedSubject('dining')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedSubject === 'dining' ? theme.buttonPrimary : '#E0E0E0',
                      backgroundColor: selectedSubject === 'dining' ? theme.buttonPrimary : '#E0E0E0',
                    },
                  ]}
                >
                  {selectedSubject === 'dining' && (
                    <Ionicons name="checkmark" size={10} color={theme.buttonText} />
                  )}
                </View>
                <Text style={[styles.radioLabel, { color: theme.textPrimary }]}>Dining enquiry</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setSelectedSubject('business')}
              >
                <View
                  style={[
                    styles.radioCircle,
                    {
                      borderColor: selectedSubject === 'business' ? theme.buttonPrimary : '#E0E0E0',
                      backgroundColor: selectedSubject === 'business' ? theme.buttonPrimary : '#E0E0E0',
                    },
                  ]}
                >
                  {selectedSubject === 'business' && (
                    <Ionicons name="checkmark" size={10} color={theme.buttonText} />
                  )}
                </View>
                <Text style={[styles.radioLabel, { color: theme.textPrimary }]}>Business enquiry</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Message</Text>
            <TextInput
              style={[
                styles.messageInput,
                {
                  backgroundColor: 'transparent',
                  borderBottomColor: theme.divider,
                  color: theme.inputText,
                },
              ]}
              placeholder="Write your message.."
              placeholderTextColor={theme.inputPlaceholder}
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Send Message Button */}
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.buttonPrimary }]}
            onPress={handleSendMessage}
          >
            <Text style={[styles.sendButtonText, { color: theme.buttonText }]}>Send message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
  },
  contactCard: {
    borderRadius: 16,
    padding: 0,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 400,
    backgroundColor: 'transparent',
  },
  phoneImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
  },
  phoneImage: {
    width: '100%',
    height: '100%',
  },
  contactCardContent: {
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    padding: 20,
  },
  contactCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactCardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactDetails: {
    gap: 16,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  contactItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    gap: 16,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 2,
    paddingHorizontal: 0,
    fontSize: 14,
  },
  messageInput: {
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 0,
    fontSize: 14,
    minHeight: 20,
    textAlignVertical: 'top',
  },
  subjectSection: {
    marginBottom: 16,
  },
  subjectLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    marginBottom: 12,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  sendButton: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ContactScreen;

