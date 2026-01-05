import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProfileDrawer from '../components/ProfileDrawer';
import { useAppSelector } from '../store/hooks';
import { styles } from '../styles/BiriyaniScreen.styles';
import { useTheme } from '../theme/useTheme';

const HeroImage = require('../../assets/images/food/mainicon/biriyani.png');
const carouselImages = [
  require('../../assets/images/carousel/TodaySpecialBiriyani.png'),
  require('../../assets/images/carousel/IndianFood.png'),
  require('../../assets/images/carousel/Biriyani.png'),
];

export default function BiriyaniScreen() {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);

  const currentUser =
    user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);
  const userInitial =
    currentUser?.name?.charAt(0).toUpperCase() ||
    currentUser?.email?.charAt(0).toUpperCase() ||
    currentUser?.phone?.charAt(0) ||
    'U';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <Ionicons name="home" size={20} color={theme.buttonText} />
            <Text style={[styles.locationText, { color: theme.buttonText }]}>Home</Text>
            <Ionicons name="chevron-down" size={16} color={theme.buttonText} />
          </View>
          <Text style={[styles.addressText, { color: theme.buttonText }]}>XXXXX ,XXXX XXXXXX</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowProfileDrawer(true)}>
            <View style={[styles.profileAvatar, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={[styles.profileInitial, { color: theme.textPrimary }]}>
                {userInitial}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.buttonPrimary }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.background }]}>
          <Ionicons name="search" size={20} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search"
            placeholderTextColor={theme.textMuted}
          />
        </View>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroCard}>
          <Text style={styles.heroBackgroundText}>Biryani</Text>
          <Image source={HeroImage} style={styles.heroImage} resizeMode="contain" />
        </View>

        {/* Carousel Banner */}
        <View style={styles.carouselContainer}>
          <Image source={carouselImages[currentSlide]} style={styles.carouselImage} resizeMode="cover" />
          <View style={styles.carouselIndicators}>
            {carouselImages.map((_, index) => (
              <TouchableOpacity key={index} onPress={() => setCurrentSlide(index)}>
                <View
                  style={[
                    styles.indicator,
                    currentSlide === index && [styles.indicatorActive, { backgroundColor: theme.buttonPrimary }],
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Profile Drawer */}
      <ProfileDrawer visible={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} />
    </View>
  );
}
