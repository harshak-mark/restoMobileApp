import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CategoryCardWithSubtitle, FoodItemCard } from '../components/FoodCards';
import ProfileDrawer from '../components/ProfileDrawer';
import { picksYoursData, popularItemsData } from '../data/foodItems';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedAddress, type Address } from '../store/slices/addressSlice';
import { addItem } from '../store/slices/cartSlice';
import { styles } from '../styles/HomeScreen.styles';
import { useTheme } from '../theme/useTheme';

type FloorId = 'ground' | 'first' | 'second' | 'third' | 'rooftop';

const floorTabs: { id: FloorId; label: string }[] = [
  { id: 'ground', label: 'Ground Floor' },
  { id: 'first', label: '1st Floor' },
  { id: 'second', label: '2nd Floor' },
  { id: 'third', label: '3rd Floor' },
  { id: 'rooftop', label: 'Rooftop' },
];

const seatsByFloor: Record<FloorId, { id: string; seats: number }[]> = {
  ground: [
    { id: '13', seats: 4 },
    { id: '14', seats: 4 },
  ],
  first: [
    { id: '21', seats: 4 },
    { id: '22', seats: 6 },
  ],
  second: [
    { id: '31', seats: 2 },
    { id: '32', seats: 4 },
  ],
  third: [
    { id: '41', seats: 4 },
    { id: '42', seats: 6 },
  ],
  rooftop: [
    { id: '51', seats: 4 },
    { id: '52', seats: 2 },
  ],
};

// Import category icons
const HotDealsIcon = require('../../assets/images/food/icons/hotdeals.png');
const TopRatedIcon = require('../../assets/images/food/icons/topratedfood.png');
const RewardsIcon = require('../../assets/images/food/icons/rewards.png');
const DessertsIcon = require('../../assets/images/food/icons/desserts.png');

// Import carousel images
const carouselImages = [
  require('../../assets/images/carousel/TodaySpecial.png'),
  require('../../assets/images/carousel/PizzaSlice.png'),
  require('../../assets/images/carousel/3Burgers.png'),
];

// Import offer banner images (PNG)
const OfferBannerImage = require('../../assets/images/50off.png');
const SpecialOfferImage = require('../../assets/images/Specialoffer.png');

// Import bottom nav SVGs
import BottomNav from '../components/BottomNav';

export default function HomeScreen() {
  const { theme } = useTheme();
  const t = theme as any;
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);
  
  // Get current user data
  const currentUser = user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);
  const userInitial = currentUser?.name?.charAt(0).toUpperCase() || 
                     currentUser?.email?.charAt(0).toUpperCase() || 
                     currentUser?.phone?.charAt(0) || 
                     'U';
  const avatarUrl = currentUser?.avatarUrl;

  // State for "Picks Yours" items quantity
  const [picksYoursQuantities, setPicksYoursQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    picksYoursData.forEach((item) => {
      initial[item.id] = 1;
    });
    return initial;
  });
  const [visiblePicksCount, setVisiblePicksCount] = useState(4);

  // State for reservation form
  const [reservationForm, setReservationForm] = useState({
    noOfGuests: '',
    fullName: '',
    phoneNo: '',
  });

  // Date and Time picker states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Profile drawer state
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Availability modal state
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [activeFloor, setActiveFloor] = useState<FloorId>('ground');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Address dropdown state
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  
  // Get addresses from Redux
  const addresses = useAppSelector((state) => state.address.items);
  const selectedAddressId = useAppSelector((state) => state.address.selectedAddressId);
  
  // Find selected address
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId) || null;
  
  // Auto-select first address if none selected and addresses exist
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      dispatch(setSelectedAddress(addresses[0].id));
    }
  }, [addresses.length, selectedAddressId, dispatch]);
  
  // Format address for display
  const formatAddress = (address: Address) => {
    return `${address.address}, ${address.city} ${address.pinCode}`;
  };
  
  // Handle address selection
  const handleAddressSelect = (addressId: string) => {
    dispatch(setSelectedAddress(addressId));
    setShowAddressDropdown(false);
  };

  useEffect(() => {
    if (!selectedSeat) {
      const firstSeat = seatsByFloor[activeFloor][0]?.id;
      if (firstSeat) setSelectedSeat(firstSeat);
    }
  }, [activeFloor, selectedSeat]);

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
  };

  const categories = [
    { id: 1, name: 'Hot Deals', icon: HotDealsIcon },
    { id: 2, name: 'Top Rating', icon: TopRatedIcon },
    { id: 3, name: 'Rewards', icon: RewardsIcon },
    { id: 4, name: 'Desserts', icon: DessertsIcon },
  ];

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setPicksYoursQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleAddToCart = (itemId: string) => {
    const item = picksYoursData.find((foodItem) => foodItem.id === itemId);
    if (!item) {
      return;
    }

    const imageSource =
      typeof item.image === 'function' ? undefined : (item.image as any | undefined);

    const quantity = picksYoursQuantities[itemId] || 1;
    dispatch(addItem({ item: { ...item, image: imageSource }, quantity }));
  };

  const visiblePicks = picksYoursData.slice(0, visiblePicksCount);
  const hasMorePicks = visiblePicksCount < picksYoursData.length;
  const picksCtaLabel = hasMorePicks ? 'See More' : 'See Less';

  const handleTogglePicks = () => {
    if (hasMorePicks) {
      setVisiblePicksCount((prev) => Math.min(prev + 4, picksYoursData.length));
    } else {
      setVisiblePicksCount((prev) => Math.max(4, prev - 4));
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        {/* Location Section */}
        <View style={styles.locationSection}>
          <TouchableOpacity 
            style={styles.locationRow}
            onPress={() => {
              if (addresses.length > 0) {
                setShowAddressDropdown(true);
              } else {
                router.push('/settings/delivery-address/add');
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="home" size={20} color={theme.buttonText} />
            <Text style={[styles.locationText, { color: theme.buttonText }]}>
              {selectedAddress?.label || 'Home'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={theme.buttonText} />
          </TouchableOpacity>
          <Text style={[styles.addressText, { color: theme.buttonText }]}>
            {selectedAddress ? formatAddress(selectedAddress) : 'XXXXX ,XXXX XXXXXX'}
          </Text>
        </View>

        {/* Notifications and Profile */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.notificationButton,]}>
            <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowProfileDrawer(true)}>
            {avatarUrl ? (
              <View style={[styles.profileAvatar, { overflow: 'hidden', padding: 0 }]}>
                <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
            <View style={[styles.profileAvatar, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={[styles.profileInitial, { color: theme.textPrimary }]}>
                {userInitial}
              </Text>
            </View>
            )}
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

      {/* Content Area */}
      <ScrollView
        style={[styles.content, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Icons */}
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIconContainer, { backgroundColor: theme.backgroundSecondary }]}>
                <Image source={category.icon} style={styles.categoryIcon} resizeMode="contain" />
              </View>
              <Text style={[styles.categoryLabel, { color: theme.textPrimary }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section Title */}
        <Text style={[styles.sectionTitle, { color: theme.buttonPrimary }]}>
          WHAT WE SERVE
        </Text>

        {/* Your Favorite Food Text */}
        <Text style={[styles.favoriteFoodText, { color: theme.textPrimary }]}>
          Your Favorite Food
        </Text>

        {/* Carousel Banner */}
        <View style={styles.carouselContainer}>
          <Image source={carouselImages[currentSlide]} style={styles.carouselImage} resizeMode="cover" />
          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            {carouselImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentSlide(index)}
              >
                <View style={[styles.indicator, currentSlide === index && styles.indicatorActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Items Section */}
        <View style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text style={[styles.popularTitle, { color: theme.textPrimary }]}>
              Popular items
            </Text>
            <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/menu')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Items Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularItemsContainer}
          >
            {popularItemsData.map((item) => (
              <View key={item.id} style={styles.popularItemWrapper}>
                <CategoryCardWithSubtitle
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  onPress={() => console.log('Item pressed:', item.title)}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Picks Yours Section */}
        <View style={styles.picksYoursSection}>
          <Text style={[styles.picksYoursTitle, { color: theme.textPrimary }]}>
            Picks Yours
          </Text>

          {/* Picks Yours Grid */}
          <View style={styles.picksYoursGrid}>
            {visiblePicks.map((item, index) => (
              <View 
                key={item.id} 
                style={[
                  styles.picksYoursCardWrapper,
                  index % 2 === 0 && styles.picksYoursCardLeft,
                ]}
              >
                <FoodItemCard
                  image={item.image}
                  title={item.name}
                  description={item.description}
                  price={item.price ?? ''}
                  isVegetarian={item.type === 'veg'}
                  isBestseller={item.status === 'bestseller'}
                  isNew={item.status === 'new'}
                  quantity={picksYoursQuantities[item.id] || 1}
                  onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  onAddToCart={() => handleAddToCart(item.id)}
                />
              </View>
            ))}
          </View>

          {picksYoursData.length > 4 && (
            <TouchableOpacity
              style={[styles.picksSeeMoreButton, { backgroundColor: theme.buttonPrimary }]}
              activeOpacity={0.8}
              onPress={handleTogglePicks}
            >
              <Text style={[styles.picksSeeMoreText, { color: theme.buttonText }]}>{picksCtaLabel}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 50% OFF Banner Section */}
        <View style={styles.offerBannerContainer}>
          <Image source={OfferBannerImage} style={styles.offerBannerImage} resizeMode="cover" />
        </View>

        {/* Reserve A Table Section */}
        <View style={styles.reserveSection}>
          <Text style={[styles.reserveSectionTitle, { color: theme.textPrimary }]}>
            Reserve A Table
          </Text>

          {/* Reserve Form Card */}
          <View style={styles.reserveCard}>
            <Text style={styles.reserveCardTitle} numberOfLines={1}>RESERVE  A TABLE</Text>
            <Text style={styles.reserveCardSubtitle}>Discover our New Menu !</Text>

            {/* No of Guest Input */}
            <View style={styles.reserveInputContainer}>
              <TextInput
                style={styles.reserveInput}
                placeholder="No of Guest"
                placeholderTextColor={theme.textMuted}
                value={reservationForm.noOfGuests}
                onChangeText={(text) => setReservationForm({ ...reservationForm, noOfGuests: text })}
                keyboardType="number-pad"
              />
            </View>

            {/* Full Name Input */}
            <View style={styles.reserveInputContainer}>
              <TextInput
                style={styles.reserveInput}
                placeholder="Full Name"
                placeholderTextColor={theme.textMuted}
                value={reservationForm.fullName}
                onChangeText={(text) => setReservationForm({ ...reservationForm, fullName: text })}
              />
            </View>

            {/* Date and Time Row */}
            <View style={styles.dateTimeRow}>
              <TouchableOpacity 
                style={[styles.reserveInputContainer, styles.dateInput]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.reserveInput, !selectedDate && styles.placeholderText]}>
                  {selectedDate ? formatDate(selectedDate) : 'Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.reserveInputContainer, styles.timeInput]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={[styles.reserveInput, !selectedTime && styles.placeholderText]}>
                  {selectedTime ? formatTime(selectedTime) : 'Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Phone No Input */}
            <View style={styles.reserveInputContainer}>
              <TextInput
                style={styles.reserveInput}
                placeholder="Phone No"
                placeholderTextColor={theme.textMuted}
                value={reservationForm.phoneNo}
                onChangeText={(text) => setReservationForm({ ...reservationForm, phoneNo: text })}
                keyboardType="phone-pad"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.reserveButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.checkAvailabilityButton,
                  { backgroundColor: theme.background, borderColor: theme.buttonPrimary },
                ]}
                onPress={() => setShowAvailabilityModal(true)}
              >
                <Text style={[styles.checkAvailabilityText, { color: theme.buttonPrimary }]}>Check availability</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.buttonPrimary, borderColor: '#FFFFFF' }]}
              >
                <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Special Offer Section */}
        <View style={styles.specialOfferContainer}>
          <Image source={SpecialOfferImage} style={styles.specialOfferImage} resizeMode="cover" />
        </View>
      </ScrollView>

      <BottomNav active="home" />

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent
          animationType="fade"
          visible={showDatePicker}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={[styles.pickerModalContent, { backgroundColor: theme.background }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.textPrimary }]}>Select Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.pickerDoneButton, { color: theme.buttonPrimary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                themeVariant={theme.mode === 'dark' ? 'dark' : 'light'}
                accentColor={theme.buttonPrimary}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Availability Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showAvailabilityModal}
        onRequestClose={() => setShowAvailabilityModal(false)}
      >
        <View style={styles.availabilityOverlay}>
          <View style={[styles.availabilityCard, { backgroundColor: t.card || t.backgroundSecondary || t.background || '#fff' }]}>
            <View style={styles.availabilityHeader}>
              <Text style={[styles.availabilityTitle, { color: theme.textPrimary }]}>
                 {floorTabs.find((f) => f.id === activeFloor)?.label ?? 'Ground Floor'}
              </Text>
              <TouchableOpacity onPress={() => setShowAvailabilityModal(false)} style={styles.availabilityClose}>
                <Ionicons name="close" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.availabilityTabsRow}>
              {floorTabs.map((tab) => {
                const isActive = activeFloor === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={[
                      styles.availabilityTab,
                      {
                        backgroundColor: isActive ? t.buttonPrimary : t.backgroundSecondary,
                        borderColor: isActive ? t.buttonPrimary : t.divider,
                      },
                    ]}
                    onPress={() => {
                      setActiveFloor(tab.id);
                      const firstSeat = seatsByFloor[tab.id][0]?.id;
                      setSelectedSeat(firstSeat || null);
                    }}
                  >
                    <Text
                      style={[
                        styles.availabilityTabText,
                        { color: isActive ? t.buttonText : t.textPrimary },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.seatRow}>
              {seatsByFloor[activeFloor].map((seat) => {
                const isSelected = selectedSeat === seat.id;
                return (
                  <TouchableOpacity
                    key={seat.id}
                    style={[
                      styles.seatCard,
                      {
                        backgroundColor: isSelected ? '#9AE6B4' : t.backgroundSecondary,
                        borderColor: isSelected ? '#38A169' : t.divider,
                        shadowColor: t.mode === 'dark' ? '#000' : '#000',
                      },
                    ]}
                    onPress={() => setSelectedSeat(seat.id)}
                    activeOpacity={0.9}
                  >
                    <View style={styles.seatDecorRow}>
                      <View style={[styles.seatDot, { backgroundColor: isSelected ? '#38A169' : t.divider }]} />
                      <View style={[styles.seatDot, { backgroundColor: isSelected ? '#38A169' : t.divider }]} />
                    </View>
                    <Text style={[styles.seatIdText, { color: t.textPrimary }]}>{seat.id}</Text>
                    <Text style={[styles.seatMetaText, { color: t.textSecondary }]}>{seat.seats} Seats</Text>
                    <View style={styles.seatDecorRow}>
                      <View style={[styles.seatDot, { backgroundColor: isSelected ? '#38A169' : t.divider }]} />
                      <View style={[styles.seatDot, { backgroundColor: isSelected ? '#38A169' : t.divider }]} />
                    </View>
                    {isSelected && (
                      <View style={styles.seatCheck}>
                        <Ionicons name="checkmark" size={16} color="#38A169" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.reserveCta, { backgroundColor: t.textPrimary }]}
              onPress={() => setShowAvailabilityModal(false)}
              activeOpacity={0.9}
            >
              <Text style={[styles.reserveCtaText, { color: t.buttonText }]}>Reserve Table</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <Modal
          transparent
          animationType="fade"
          visible={showTimePicker}
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={[styles.pickerModalContent, { backgroundColor: theme.background }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.textPrimary }]}>Select Time</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Text style={[styles.pickerDoneButton, { color: theme.buttonPrimary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                themeVariant={theme.mode === 'dark' ? 'dark' : 'light'}
                accentColor={theme.buttonPrimary}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Profile Drawer */}
      <ProfileDrawer
        visible={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />

      {/* Address Dropdown Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showAddressDropdown}
        onRequestClose={() => setShowAddressDropdown(false)}
      >
        <TouchableOpacity
          style={styles.addressDropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowAddressDropdown(false)}
        >
          <View style={[styles.addressDropdownContent, { backgroundColor: theme.background }]}>
            <View style={styles.addressDropdownHeader}>
              <Text style={[styles.addressDropdownTitle, { color: theme.textPrimary }]}>
                Select Address
              </Text>
              <TouchableOpacity onPress={() => setShowAddressDropdown(false)}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.addressDropdownList} showsVerticalScrollIndicator={false}>
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddressId;
                return (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressDropdownItem,
                      {
                        backgroundColor: isSelected ? theme.buttonPrimary + '20' : theme.card,
                        borderColor: isSelected ? theme.buttonPrimary : theme.divider,
                      },
                    ]}
                    onPress={() => handleAddressSelect(address.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.addressItemContent}>
                      <View style={styles.addressItemHeader}>
                        <Ionicons
                          name={address.label === 'Home' ? 'home' : address.label === 'Work' ? 'briefcase' : 'location'}
                          size={20}
                          color={isSelected ? theme.buttonPrimary : theme.textPrimary}
                        />
                        <Text style={[styles.addressItemLabel, { color: isSelected ? theme.buttonPrimary : theme.textPrimary }]}>
                          {address.label}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={20} color={theme.buttonPrimary} style={styles.addressCheckIcon} />
                        )}
                      </View>
                      <Text style={[styles.addressItemText, { color: theme.textSecondary }]}>
                        {formatAddress(address)}
                      </Text>
                      {address.landmark && (
                        <Text style={[styles.addressItemLandmark, { color: theme.textMuted }]}>
                          Near {address.landmark}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.addressAddButton, { backgroundColor: theme.buttonPrimary }]}
              onPress={() => {
                setShowAddressDropdown(false);
                router.push('/settings/delivery-address/add');
              }}
            >
              <Ionicons name="add" size={20} color={theme.buttonText} />
              <Text style={[styles.addressAddButtonText, { color: theme.buttonText }]}>
                Add New Address
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

