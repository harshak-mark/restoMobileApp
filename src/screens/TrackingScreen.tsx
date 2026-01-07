import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

const TrackingScreen = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header with rounded bottom corners */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <TouchableOpacity 
          onPress={() => router.replace('/home')}
          style={[styles.backButton, { backgroundColor: '#ECF0F4' }]}
        >
          <Ionicons name="chevron-back" size={24} color="#181C2E" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.buttonText }]}>Live tracking</Text>
      </View>

      {/* Main Card */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Live Order Tracking
          </Text>

          {/* Timeline Section */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineWrapper}>
              {/* Preparing - Completed */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIcon, { backgroundColor: theme.buttonPrimary }]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                  <View style={[styles.timelineLine, { backgroundColor: theme.divider }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, { color: theme.textPrimary }]}>Preparing</Text>
                  <Text style={[styles.timelineSub, { color: theme.textSecondary }]}>
                    Your meal is being cooked
                  </Text>
                </View>
              </View>

              {/* Out for Delivery - Active */}
              <View style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIconActive, { borderColor: theme.buttonPrimary, backgroundColor: theme.card }]}>
                    <View style={[styles.timelineDot, { backgroundColor: theme.buttonPrimary }]} />
                  </View>
                  <View style={[styles.timelineLine, { backgroundColor: theme.divider }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, { color: theme.textPrimary }]}>Out for Delivery</Text>
                  <Text style={[styles.timelineSub, { color: theme.textSecondary }]}>
                    Driver is on the way
                  </Text>
                </View>
              </View>

              {/* Delivered - Pending */}
              <View style={[styles.timelineItem, styles.timelineItemLast]}>
                <View style={styles.timelineIconContainer}>
                  <View style={[styles.timelineIconPending, { borderColor: theme.divider, backgroundColor: theme.card }]} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, { color: theme.textSecondary }]}>Delivered</Text>
                  <Text style={[styles.timelineSub, { color: theme.textSecondary }]}>
                    Enjoy your meal!
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Map Placeholder */}
          <View style={[styles.mapPlaceholder, { backgroundColor: theme.inputBackground }]}>
            <Text style={[styles.mapText, { color: theme.textSecondary }]}>
              Mini Map Placeholder
            </Text>
          </View>

          {/* Driver Information */}
          <View style={styles.driverSection}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person-circle" size={48} color={theme.textPrimary} />
            </View>
            <View style={styles.driverInfo}>
              <Text style={[styles.driverName, { color: theme.textPrimary }]}>Alex Ray</Text>
              <Text style={[styles.driverEta, { color: theme.textSecondary }]}>ETA: 12 mins</Text>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity 
                style={[styles.driverActionButton, { backgroundColor: theme.card }]}
                onPress={() => {
                  // Handle call
                  console.log('Call driver');
                }}
              >
                <Ionicons name="call" size={20} color={theme.buttonPrimary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.driverActionButton, { backgroundColor: theme.card }]}
                onPress={() => {
                  // Handle message
                  console.log('Message driver');
                }}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color={theme.buttonPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="cart" />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 160,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineWrapper: {
    position: 'relative',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
    position: 'relative',
    zIndex: 1,
  },
  timelineItemLast: {
    marginBottom: 0,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 24,
    justifyContent: 'flex-start',
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineIconPending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: 0,
    alignSelf: 'center',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  timelineSub: {
    fontSize: 12,
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  mapText: {
    fontSize: 14,
    fontWeight: '600',
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  driverEta: {
    fontSize: 14,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  driverActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default TrackingScreen;
