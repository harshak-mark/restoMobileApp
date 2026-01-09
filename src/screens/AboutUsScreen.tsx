import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SixSideBoxSvg from '../../assets/images/6sidebox.svg';
import Cust1Svg from '../../assets/images/customers/cust1.svg';
import Cust2Svg from '../../assets/images/customers/cust2.svg';
import Cust3Svg from '../../assets/images/customers/cust3.svg';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../theme/useTheme';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    quote: 'Fast delivery and amazing quality! The food was still hot when it arrived.',
    image: Cust1Svg,
  },
  {
    id: 2,
    name: 'John D.',
    quote: 'Great variety of restaurants and the app is so easy to use. Highly recommended!',
    image: Cust2Svg,
  },
  {
    id: 3,
    name: 'Emma R.',
    quote: 'Affordable prices and quick service. My go-to food delivery app!',
    image: Cust3Svg,
  },
];

export default function AboutUsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary, paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          onPress={() => router.replace('/home')}
          style={styles.backButton}
        >
          <View style={[styles.backButtonCircle, { backgroundColor: theme.background }]}>
            <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
          </View>
          <Text style={[styles.backButtonText, { color: theme.buttonText }]}>About us</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/images/aboutus.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* About Us Section */}
        <View style={styles.contentContainer}>
          <Text style={[styles.aboutHeading, { color: theme.buttonPrimary }]}>About Us</Text>
          
          <View style={styles.aboutTextContainer}>
            <Text style={[styles.aboutText, { color: theme.textPrimary }]}>
              Bringing people together through delicious food, warm hospitality, and a passion for great service.
            </Text>
            <Text style={[styles.aboutText, { color: theme.textPrimary }]}>
              We believe that dining is more than just eating it's an experience that touches every sense. From the aroma that greets you at the door to the last spoonful of dessert, every moment at our restaurant is designed to make you feel special.
            </Text>
          </View>

          {/* Metrics Section */}
          <View style={styles.metricsContainer}>
            {/* Happy Customer */}
            <View style={[styles.metricRow, { backgroundColor: (theme as any).card || theme.background, shadowColor: theme.shadow || '#000' }]}>
              <View style={styles.metricContent}>
                <Text style={[styles.metricNumber, { color: '#E65100' }]}>10K+</Text>
                <Text style={[styles.metricLabel, { color: theme.textPrimary }]}>Happy Customer</Text>
              </View>
              <Image
                source={require('../../assets/images/icon/customerRating.jpg')}
                style={styles.metricIcon}
                resizeMode="contain"
              />
            </View>

            {/* Guest Satisfactions */}
            <View style={[styles.metricRow, { backgroundColor: (theme as any).card || theme.background, shadowColor: theme.shadow || '#000' }]}>
              <View style={styles.metricContent}>
                <Text style={[styles.metricNumber, { color: '#00C853' }]}>98+</Text>
                <Text style={[styles.metricLabel, { color: theme.textPrimary }]}>Guest Satisfactions</Text>
              </View>
              <Image
                source={require('../../assets/images/icon/satisfaction.jpg')}
                style={styles.metricIcon}
                resizeMode="contain"
              />
            </View>

            {/* Guest Experience */}
            <View style={[styles.metricRow, { backgroundColor: (theme as any).card || theme.background, shadowColor: theme.shadow || '#000' }]}>
              <View style={styles.metricContent}>
                <Text style={[styles.metricNumber, { color: '#FDD835' }]}>5-⭐</Text>
                <Text style={[styles.metricLabel, { color: theme.textPrimary }]}>Guest Experience</Text>
              </View>
              <Image
                source={require('../../assets/images/icon/experience.jpg')}
                style={styles.metricIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Testimonials Section */}
          <View style={styles.testimonialsContainer}>
            <Text style={[styles.testimonialsHeading, { color: theme.textPrimary }]}>
              What Our Customers Say
            </Text>

            {testimonials.map((testimonial) => {
              const CustomerImage = testimonial.image;
              return (
                <View
                  key={testimonial.id}
                  style={[styles.testimonialCard, { backgroundColor: (theme as any).card || theme.background, shadowColor: theme.shadow || '#000' }]}
                >
                  <View style={styles.testimonialHeader}>
                    <CustomerImage width={50} height={50} />
                    <View style={styles.testimonialInfo}>
                      <Text style={[styles.customerName, { color: theme.textPrimary }]}>
                        {testimonial.name}
                      </Text>
                      <View style={styles.starsContainer}>
                        {[...Array(5)].map((_, index) => (
                          <Ionicons
                            key={index}
                            name="star"
                            size={16}
                            color="#FDD835"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.testimonialQuote, { color: theme.textSecondary }]}>
                    "{testimonial.quote}"
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Hexagon Button */}
      <View style={[styles.hexagonContainer, { bottom: insets.bottom + 25 }]}>
        <TouchableOpacity style={styles.hexagonButton}>
          <SixSideBoxSvg width={54} height={61} />
        </TouchableOpacity>
      </View>

      <BottomNav active="view" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  aboutHeading: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  aboutTextContainer: {
    marginBottom: 32,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  metricsContainer: {
    marginBottom: 32,
    gap: 16,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricContent: {
    flex: 1,
  },
  metricIcon: {
    width: 90,
    height: 90,
  },
  metricNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  testimonialsContainer: {
    marginTop: 8,
  },
  testimonialsHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  testimonialCard: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialInfo: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 4,
    fontFamily: 'Inter_700Bold',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialQuote: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    paddingLeft: 60,
    fontFamily: 'Inter_400Regular',
  },
  hexagonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  hexagonButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

