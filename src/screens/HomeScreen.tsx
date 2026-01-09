import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  
  // Table reservation state
  const [tableView, setTableView] = useState<'all' | 'reservation'>('all');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isTableBooked, setIsTableBooked] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'booking'>('view');
  const [bookingDetails, setBookingDetails] = useState<{
    tableId: string;
    date: Date;
    time: Date;
    guests: string;
    name: string;
    phone: string;
  } | null>(null);
  
  // Temporary table data - some reserved, some available
  const [tableData, setTableData] = useState([
    { id: 'T-1', status: 'available' },
    { id: 'T-2', status: 'reserved' },
    { id: 'T-3', status: 'available' },
    { id: 'T-4', status: 'reserved' },
    { id: 'T-5', status: 'reserved' },
    { id: 'T-6', status: 'reserved' },
    { id: 'T-7', status: 'available' },
    { id: 'T-8', status: 'reserved' },
    { id: 'T-9', status: 'available' },
    { id: 'T-10', status: 'available' },
    { id: 'T-11', status: 'available' },
    { id: 'T-12', status: 'reserved' },
    { id: 'T-13', status: 'available' },
    { id: 'T-14', status: 'reserved' },
    { id: 'T-15', status: 'available' },
  ]);

  // Address dropdown state
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  
  // Get addresses from Redux
  const addresses = useAppSelector((state) => state.address.items);
  const selectedAddressId = useAppSelector((state) => state.address.selectedAddressId);
  const defaultAddressId = useAppSelector((state) => state.address.defaultAddressId);
  
  // Find selected address
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId) || null;
  const isSelectedAddressDefault = selectedAddress?.id === defaultAddressId;
  
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

  // Debug: Log booking details changes
  useEffect(() => {
    console.log('Booking Details Updated:', bookingDetails);
    console.log('Is Table Booked:', isTableBooked);
    console.log('Table View:', tableView);
  }, [bookingDetails, isTableBooked, tableView]);

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  const formatTime = useCallback((time: Date) => {
    return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const handleDateChange = useCallback((event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleTimeChange = useCallback((event: any, time?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (time) {
      setSelectedTime(time);
    }
  }, []);

  const categories = useMemo(() => [
    { id: 1, name: 'Hot Deals', icon: HotDealsIcon },
    { id: 2, name: 'Top Rating', icon: TopRatedIcon },
    { id: 3, name: 'Rewards', icon: RewardsIcon },
    { id: 4, name: 'Desserts', icon: DessertsIcon },
  ], []);

  const handleQuantityChange = useCallback((itemId: string, quantity: number) => {
    setPicksYoursQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  }, []);

  const handleAddToCart = useCallback((itemId: string) => {
    const item = picksYoursData.find((foodItem) => foodItem.id === itemId);
    if (!item) {
      return;
    }

    const imageSource =
      typeof item.image === 'function' ? undefined : (item.image as any | undefined);

    const quantity = picksYoursQuantities[itemId] || 1;
    dispatch(addItem({ item: { ...item, image: imageSource }, quantity }));
  }, [picksYoursQuantities, dispatch]);

  const visiblePicks = useMemo(() => picksYoursData.slice(0, visiblePicksCount), [visiblePicksCount]);
  const hasMorePicks = useMemo(() => visiblePicksCount < picksYoursData.length, [visiblePicksCount]);
  const picksCtaLabel = useMemo(() => hasMorePicks ? 'See More' : 'See Less', [hasMorePicks]);

  const handleTogglePicks = useCallback(() => {
    if (hasMorePicks) {
      setVisiblePicksCount((prev) => Math.min(prev + 4, picksYoursData.length));
    } else {
      setVisiblePicksCount((prev) => Math.max(4, prev - 4));
    }
  }, [hasMorePicks]);

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
          <View style={styles.addressTextContainer}>
            <Text style={[styles.addressText, { color: theme.buttonText }]}>
              {selectedAddress ? formatAddress(selectedAddress) : 'XXXXX ,XXXX XXXXXX'}
            </Text>
          </View>
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
                <View style={[styles.indicator, { backgroundColor: theme.divider }, currentSlide === index && { backgroundColor: theme.buttonPrimary }]} />
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
            <TouchableOpacity style={[styles.seeAllButton, { backgroundColor: theme.backgroundSecondary }]} onPress={() => router.push('/menu')}>
              <Text style={[styles.seeAllText, { color: theme.buttonPrimary }]}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Items Cards */}
          <FlatList
            data={popularItemsData}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularItemsContainer}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.popularItemWrapper}>
                <CategoryCardWithSubtitle
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  onPress={() => console.log('Item pressed:', item.title)}
                />
              </View>
            )}
            removeClippedSubviews={true}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
          />
        </View>

        {/* Picks Yours Section */}
        <View style={styles.picksYoursSection}>
          <Text style={[styles.picksYoursTitle, { color: theme.textPrimary }]}>
            Picks Yours
          </Text>

          {/* Picks Yours Grid */}
          <FlatList
            data={visiblePicks}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View 
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
            )}
            removeClippedSubviews={true}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
          />

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
            <View style={[styles.reserveInputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.reserveInput, { color: theme.inputText }]}
                placeholder="No of Guest"
                placeholderTextColor={theme.inputPlaceholder}
                value={reservationForm.noOfGuests}
                onChangeText={(text) => {
                  // Only allow numbers
                  const numericValue = text.replace(/[^0-9]/g, '');
                  setReservationForm({ ...reservationForm, noOfGuests: numericValue });
                }}
                keyboardType="number-pad"
              />
            </View>

            {/* Full Name Input */}
            <View style={[styles.reserveInputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.reserveInput, { color: theme.inputText }]}
                placeholder="Full Name"
                placeholderTextColor={theme.inputPlaceholder}
                value={reservationForm.fullName}
                onChangeText={(text) => {
                  // Only allow letters and spaces
                  const lettersOnly = text.replace(/[^a-zA-Z\s]/g, '');
                  setReservationForm({ ...reservationForm, fullName: lettersOnly });
                }}
              />
            </View>

            {/* Date and Time Row */}
            <View style={styles.dateTimeRow}>
              <TouchableOpacity 
                style={[styles.reserveInputContainer, styles.dateInput, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.reserveInput, { color: selectedDate ? theme.inputText : theme.inputPlaceholder }]}>
                  {selectedDate ? formatDate(selectedDate) : 'Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.reserveInputContainer, styles.timeInput, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={[styles.reserveInput, { color: selectedTime ? theme.inputText : theme.inputPlaceholder }]}>
                  {selectedTime ? formatTime(selectedTime) : 'Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Phone No Input */}
            <View style={[styles.reserveInputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.cardBorder }]}>
              <TextInput
                style={[styles.reserveInput, { color: theme.inputText }]}
                placeholder="Phone No"
                placeholderTextColor={theme.inputPlaceholder}
                value={reservationForm.phoneNo}
                onChangeText={(text) => {
                  // Only allow numbers, max 10 digits
                  const numericValue = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setReservationForm({ ...reservationForm, phoneNo: numericValue });
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.reserveButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.checkAvailabilityButton,
                  { 
                    backgroundColor: theme.background, 
                    borderColor: theme.buttonPrimary,
                    opacity: (selectedDate && selectedTime && 
                              reservationForm.noOfGuests.trim() !== '') ? 1 : 0.5,
                  },
                ]}
                onPress={() => {
                  if (selectedDate && selectedTime && reservationForm.noOfGuests.trim() !== '') {
                    setModalMode('view');
                    setTableView('all');
                    setShowAvailabilityModal(true);
                  }
                }}
                disabled={!selectedDate || !selectedTime || reservationForm.noOfGuests.trim() === ''}
              >
                <Text style={[styles.checkAvailabilityText, { color: theme.buttonPrimary }]}>Check availability</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton, 
                  { 
                    backgroundColor: theme.buttonPrimary, 
                    borderColor: '#FFFFFF',
                    opacity: (selectedDate && selectedTime && 
                              reservationForm.noOfGuests.trim() !== '' &&
                              reservationForm.fullName.trim() !== '' &&
                              reservationForm.phoneNo.length === 10) ? 1 : 0.5,
                  }
                ]}
                onPress={() => {
                  if (selectedDate && selectedTime && 
                      reservationForm.noOfGuests.trim() !== '' &&
                      reservationForm.fullName.trim() !== '' &&
                      reservationForm.phoneNo.length === 10) {
                    setModalMode('booking');
                    // If booking already exists, show reservation tab, otherwise show all tables
                    if (bookingDetails || isTableBooked) {
                      setTableView('reservation');
                    } else {
                      setTableView('all');
                    }
                    setSelectedTable(null);
                    setShowAvailabilityModal(true);
                  }
                }}
                disabled={!selectedDate || !selectedTime || 
                         reservationForm.noOfGuests.trim() === '' ||
                         reservationForm.fullName.trim() === '' ||
                         reservationForm.phoneNo.length !== 10}
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
        onRequestClose={() => {
          setShowAvailabilityModal(false);
          setSelectedTable(null);
          // Only clear form fields if no booking has been made
          // IMPORTANT: Do NOT clear bookingDetails - preserve booking state
          if (!isTableBooked && !bookingDetails) {
            setSelectedDate(null);
            setSelectedTime(null);
            setReservationForm({ noOfGuests: '', fullName: '', phoneNo: '' });
            setTableView('all');
          }
          // If booking exists, keep reservation tab active when reopening
          if (bookingDetails || isTableBooked) {
            setTableView('reservation');
          }
          setModalMode('view');
        }}
      >
        <View style={styles.availabilityOverlay}>
          <View style={[styles.availabilityCard, { backgroundColor: theme.background }]}>
            <View style={styles.availabilityHeader}>
              <Text style={[styles.availabilityTitle, { color: theme.textPrimary }]}>
                Select Table
              </Text>
              <TouchableOpacity onPress={() => {
                setShowAvailabilityModal(false);
                setSelectedTable(null);
                // Only clear form fields if no booking has been made
                // IMPORTANT: Do NOT clear bookingDetails - preserve booking state
                if (!isTableBooked && !bookingDetails) {
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setReservationForm({ noOfGuests: '', fullName: '', phoneNo: '' });
                  setTableView('all');
                }
                // If booking exists, keep reservation tab active when reopening
                if (bookingDetails || isTableBooked) {
                  setTableView('reservation');
                }
                setModalMode('view');
              }} style={styles.availabilityClose}>
                <Ionicons name="close" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Toggle Buttons - Only show in booking mode */}
            {modalMode === 'booking' && (
              <View style={styles.toggleButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    {
                      backgroundColor: tableView === 'all' ? theme.buttonPrimary : theme.backgroundSecondary,
                    },
                  ]}
                  onPress={() => setTableView('all')}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      { color: tableView === 'all' ? theme.buttonText : theme.textPrimary },
                    ]}
                  >
                    All Table
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    {
                      backgroundColor: tableView === 'reservation' ? theme.buttonPrimary : theme.backgroundSecondary,
                      opacity: (!isTableBooked && !bookingDetails) ? 0.5 : 1,
                    },
                  ]}
                onPress={() => {
                  // Always allow clicking reservation tab in booking mode
                  if (modalMode === 'booking' || isTableBooked || bookingDetails) {
                    setTableView('reservation');
                  }
                }}
                disabled={modalMode !== 'booking' && !isTableBooked && !bookingDetails}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      { color: tableView === 'reservation' ? theme.buttonText : theme.textPrimary },
                    ]}
                  >
                    Reservation
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Show different content based on tab view */}
            {tableView === 'all' ? (
              <>
                {/* Legend */}
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, { backgroundColor: '#007A59' }]} />
                    <Text style={[styles.legendText, { color: theme.textPrimary }]}>Available</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, { backgroundColor: '#D10505' }]} />
                    <Text style={[styles.legendText, { color: theme.textPrimary }]}>Reserved</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendSquare, { backgroundColor: '#FFB500' }]} />
                    <Text style={[styles.legendText, { color: theme.textPrimary }]}>Available soon</Text>
                  </View>
                </View>

                {/* Table Grid */}
                <View style={styles.tableGrid}>
                  {tableData.map((table, index) => {
                    const isSelected = selectedTable === table.id;
                    const isAvailable = table.status === 'available';
                    const isReserved = table.status === 'reserved';
                    
                    // Determine background color
                    let backgroundColor = '#007A59'; // default green for available
                    if (isReserved) {
                      backgroundColor = '#D10505'; // red for reserved
                    } else if (isSelected && modalMode === 'booking') {
                      backgroundColor = '#FB8C00'; // orange for selected (only in booking mode)
                    }

                    // Remove right margin for last item in each row (every 5th item)
                    const isLastInRow = (index + 1) % 5 === 0;

                    return (
                      <TouchableOpacity
                        key={table.id}
                        style={[
                          styles.tableItem,
                          {
                            backgroundColor,
                            marginRight: isLastInRow ? 0 : 8,
                          },
                        ]}
                        onPress={() => {
                          // Only allow selection in booking mode
                          if (modalMode === 'booking' && isAvailable && !isReserved) {
                            setSelectedTable(table.id);
                          }
                        }}
                        disabled={isReserved || modalMode === 'view'}
                        activeOpacity={(isReserved || modalMode === 'view') ? 1 : 0.7}
                      >
                        <Text style={styles.tableItemText}>{table.id}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Book Your Table / Show Details Button - Only show in booking mode */}
                {modalMode === 'booking' && (
                  <TouchableOpacity
                    style={[
                      styles.bookTableButton,
                      {
                        backgroundColor: (selectedTable || isTableBooked) ? theme.buttonPrimary : theme.backgroundSecondary,
                        opacity: (selectedTable || isTableBooked) ? 1 : 0.5,
                      },
                    ]}
                    onPress={() => {
                      if (isTableBooked && bookingDetails) {
                        // Switch to reservation tab to show details
                        setTableView('reservation');
                      } else if (selectedTable && selectedDate && selectedTime) {
                        // Book the table
                        const updatedTableData = tableData.map((table) =>
                          table.id === selectedTable ? { ...table, status: 'reserved' as const } : table
                        );
                        setTableData(updatedTableData);
                        
                        // Store booking details - ensure all data is captured
                        const bookingData = {
                          tableId: selectedTable,
                          date: selectedDate,
                          time: selectedTime,
                          guests: reservationForm.noOfGuests || '0',
                          name: reservationForm.fullName || 'Guest',
                          phone: reservationForm.phoneNo || '',
                        };
                        
                        console.log('Booking table with details:', bookingData);
                        setBookingDetails(bookingData);
                        setIsTableBooked(true);
                        setSelectedTable(null);
                        // Automatically switch to reservation tab after booking
                        setTableView('reservation');
                      }
                    }}
                    disabled={!selectedTable && !isTableBooked}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.bookTableButtonText,
                        { color: (selectedTable || isTableBooked) ? theme.buttonText : theme.textMuted },
                      ]}
                    >
                      {isTableBooked ? 'SHOW DETAILS' : 'BOOK YOUR TABLE'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              /* Reservation Tab - Show Confirmation Details */
              (bookingDetails && bookingDetails.tableId && bookingDetails.date && bookingDetails.time) ? (
                <ScrollView
                  style={styles.reservationDetailsContainer}
                  contentContainerStyle={styles.reservationDetailsContent}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Success Icon */}
                  <View style={styles.confirmationIconContainer}>
                    <View style={styles.confirmationIconCircle}>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={[styles.confirmationTitle, { color: theme.textPrimary }]}>
                    Table Booked <Text style={[styles.confirmationTitleHighlight, { color: theme.buttonPrimary }]}>Successfully</Text>
                  </Text>

                  {/* Divider */}
                  <View style={[styles.confirmationDivider, { backgroundColor: theme.divider }]} />

                  {/* User Info */}
                  <Text style={[styles.confirmationUserName, { color: theme.textPrimary }]}>
                    {bookingDetails.name || 'Guest'}
                    <Text style={[styles.confirmationUserPhone, { color: theme.textSecondary }]}>
                    {bookingDetails.phone ? `       +1 ${bookingDetails.phone.slice(0, 4)} ${bookingDetails.phone.slice(4, 7)} ${bookingDetails.phone.slice(7)}` : '+1 000 000 0000'}
                  </Text>
                  </Text>
                 

                  {/* Divider */}
                  <View style={[styles.confirmationDivider, { backgroundColor: theme.divider }]} />

                  {/* Booking Details */}
                  <View style={styles.confirmationDetailsRow}>
                    <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                    <Text style={[styles.confirmationDetailsText, { color: theme.textPrimary }]}>
                      {formatDate(bookingDetails.date)} | {formatTime(bookingDetails.time)}
                    </Text>
                  </View>
                  <View style={styles.confirmationDetailsRow}>
                    <Ionicons name="people-outline" size={20} color={theme.textSecondary} />
                    <Text style={[styles.confirmationDetailsText, { color: theme.textPrimary }]}>
                      {bookingDetails.guests || '0'} Guests
                    </Text>
                  </View>
                  <View style={styles.confirmationDetailsRow}>
                    <Ionicons name="restaurant-outline" size={20} color={theme.textSecondary} />
                    <Text style={[styles.confirmationDetailsText, { color: theme.textPrimary }]}>
                      No : {bookingDetails.tableId.replace('T-', '') || 'N/A'} / Indoor
                    </Text>
                  </View>

                  {/* Divider */}
                  <View style={[styles.confirmationDivider, { backgroundColor: theme.divider }]} />

                  {/* Action Buttons */}
                  <View style={styles.confirmationButtonsRow}>
                    <TouchableOpacity
                      style={[styles.confirmationDoneButton, { backgroundColor: theme.buttonPrimary }]}
                      onPress={() => {
                        setShowAvailabilityModal(false);
                        setSelectedTable(null);
                        setIsTableBooked(false);
                        setBookingDetails(null);
                        // Reset form
                        setReservationForm({ noOfGuests: '', fullName: '', phoneNo: '' });
                        setSelectedDate(null);
                        setSelectedTime(null);
                        setTableView('all');
                        router.push('/home');
                      }}
                    >
                      <Text style={[styles.confirmationDoneButtonText, { color: theme.buttonText }]}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmationDownloadButton, { backgroundColor: theme.background, borderColor: theme.textPrimary }]}
                      onPress={() => {
                        // Download pass functionality
                        console.log('Download pass');
                      }}
                    >
                      <Ionicons name="download-outline" size={20} color={theme.textPrimary} />
                      <Text style={[styles.confirmationDownloadButtonText, { color: theme.textPrimary }]}>Download Pass</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Promotional Message */}
                  <Text style={[styles.confirmationPromoText, { color: theme.textSecondary }]}>
                    Your table is reserved! Since you reserved your table with Dine in Florida, your will automatically receive 2% off your bill when you pay
                  </Text>
                </ScrollView>
              ) : (
                <View style={styles.noBookingContainer}>
                  <Text style={[styles.noBookingText, { color: theme.textSecondary }]}>
                    No booking found. Please book a table first.
                  </Text>
                </View>
              )
            )}
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

