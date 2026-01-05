import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import { CategoryCardSVG, FoodItemCard } from '../components/FoodCards';
import ProfileDrawer from '../components/ProfileDrawer';
import {
  FoodItem,
  allItems,
  breakfastItems,
  categoryIconsAll,
  categoryIconsBreakfast,
  categoryIconsDinner,
  categoryIconsLunch,
  dinnerItems,
  lunchItems,
} from '../data/foodItems';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../store/slices/cartSlice';
import { styles } from '../styles/MenuScreen.styles';
import { useTheme } from '../theme/useTheme';

// Import category tab icons
import AllItemsIcon from '../../assets/images/icon/allitems.svg';
import BreakfastIcon from '../../assets/images/icon/breakfast.svg';
import DinnerIcon from '../../assets/images/icon/dinner.svg';
import LunchIcon from '../../assets/images/icon/lunch.svg';

// Import category icons
const HotDealsIcon = require('../../assets/images/food/icons/hotdeals.png');
const TopRatedIcon = require('../../assets/images/food/icons/topratedfood.png');
const RewardsIcon = require('../../assets/images/food/icons/rewards.png');
const DessertsIcon = require('../../assets/images/food/icons/desserts.png');

// All carousel images
const allCarouselImages = [
  require('../../assets/images/carousel/3Burgers.png'),
  require('../../assets/images/carousel/BestSummer.png'),
  require('../../assets/images/carousel/Biriyani.png'),
  require('../../assets/images/carousel/Breakfast.png'),
  require('../../assets/images/carousel/BurgerDelicious.png'),
  require('../../assets/images/carousel/CatchYourPizza.png'),
  require('../../assets/images/carousel/ChristmasOffer.png'),
  require('../../assets/images/carousel/DeliciousFood.png'),
  require('../../assets/images/carousel/Dosa.png'),
  require('../../assets/images/carousel/DosaChutney.png'),
  require('../../assets/images/carousel/DosaPlate.png'),
  require('../../assets/images/carousel/FreshFriut.png'),
  require('../../assets/images/carousel/FreshJuice.png'),
  require('../../assets/images/carousel/IndianFood.png'),
  require('../../assets/images/carousel/PizzaOffer.png'),
  require('../../assets/images/carousel/PizzaSlice.png'),
  require('../../assets/images/carousel/Sandwich.png'),
  require('../../assets/images/carousel/Steak.png'),
  require('../../assets/images/carousel/TodayBurgerOffer.png'),
  require('../../assets/images/carousel/TodaySpecial.png'),
  require('../../assets/images/carousel/TodaySpecialBiriyani.png'),
];

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9-_]/g, '');

// Helper function to get random items from array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function MenuScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const registeredUsers = useAppSelector((state) => state.auth.registeredUsers);
  
  // Get current user data
  const currentUser = user || (registeredUsers.length > 0 ? registeredUsers[registeredUsers.length - 1] : null);
  const userInitial = currentUser?.name?.charAt(0).toUpperCase() || 
                     currentUser?.email?.charAt(0).toUpperCase() || 
                     currentUser?.phone?.charAt(0) || 
                     'U';

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [visibleCardsCount, setVisibleCardsCount] = useState(6);
  const [visibleFoodItemsCount, setVisibleFoodItemsCount] = useState(4);

  // Get 3 random carousel images
  const [carouselImages] = useState(() => getRandomItems(allCarouselImages, 3));

  const sectionFoodMap: Record<typeof selectedCategory, FoodItem[]> = {
    all: allItems,
    breakfast: breakfastItems,
    lunch: lunchItems,
    dinner: dinnerItems,
  };

  const sectionIconMap = {
    all: categoryIconsAll,
    breakfast: categoryIconsBreakfast,
    lunch: categoryIconsLunch,
    dinner: categoryIconsDinner,
  };

  // Auto-slide carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleAddToCart = (itemId: string) => {
    const item = allItems.find((foodItem) => foodItem.id === itemId);
    if (!item) {
      return;
    }

    const quantity = quantities[itemId] || 1;
    const imageSource = typeof item.image === 'function' ? undefined : (item.image as any | undefined);
    dispatch(addItem({ item: { ...item, image: imageSource }, quantity }));
  };

  const handleCategoryPress = (name: string) => {
    const slug = slugify(name);
    router.push(`/menu/${slug}`);
  };

  const categories = [
    { id: 1, name: 'Hot Deals', icon: HotDealsIcon },
    { id: 2, name: 'Top Rating', icon: TopRatedIcon },
    { id: 3, name: 'Rewards', icon: RewardsIcon },
    { id: 4, name: 'Desserts', icon: DessertsIcon },
  ];

  const categoryTabs = [
    { id: 'all', label: 'All items', icon: AllItemsIcon },
    { id: 'breakfast', label: 'Breakfast', icon: BreakfastIcon },
    { id: 'lunch', label: 'Lunch', icon: LunchIcon },
    { id: 'dinner', label: 'Dinner', icon: DinnerIcon },
  ];

  const filteredFoodItems = sectionFoodMap[selectedCategory] || allItems;

  // Get visible food items based on visibleFoodItemsCount
  const visibleFoodItems = filteredFoodItems.slice(0, visibleFoodItemsCount);
  const totalFoodItems = filteredFoodItems.length;
  const hasMoreFood = visibleFoodItemsCount < totalFoodItems;
  const canShowLessFood = visibleFoodItemsCount > 4;
  const foodCtaLabel = hasMoreFood ? 'See More' : 'See Less';

  // Filter icon cards based on selected category
  const filteredIconCards = sectionIconMap[selectedCategory] || categoryIconsAll;

  // Get visible icon cards based on visibleCardsCount
  const visibleIconCards = filteredIconCards.slice(0, visibleCardsCount);
  const totalIconCards = filteredIconCards.length;
  const showMoreButton = visibleCardsCount < totalIconCards;
  const showLessButton = visibleCardsCount > 6 && visibleCardsCount >= totalIconCards;

  // Handle see more/less button
  const handleSeeMoreLess = () => {
    if (showMoreButton) {
      // Show next 6 cards
      setVisibleCardsCount(prev => Math.min(prev + 6, totalIconCards));
    } else if (showLessButton) {
      // Hide last 6 cards
      setVisibleCardsCount(6);
    }
  };

  // Reset visible cards count when category changes
  useEffect(() => {
    setVisibleCardsCount(6);
    setVisibleFoodItemsCount(4);
  }, [selectedCategory]);

  // Handle see more/less food items button
  const handleToggleFoodItems = () => {
    if (hasMoreFood) {
      setVisibleFoodItemsCount((prev) => Math.min(prev + 4, totalFoodItems));
    } else {
      setVisibleFoodItemsCount((prev) => Math.max(4, prev - 4));
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.buttonPrimary }]}>
        {/* Location Section */}
        <View style={styles.locationSection}>
          <View style={styles.locationRow}>
            <Ionicons name="home" size={20} color={theme.buttonText} />
            <Text style={[styles.locationText, { color: theme.buttonText }]}>Home</Text>
            <Ionicons name="chevron-down" size={16} color={theme.buttonText} />
          </View>
          <Text style={[styles.addressText, { color: theme.buttonText }]}>XXXXX ,XXXX XXXXXX</Text>
        </View>

        {/* Notifications and Profile */}
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

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          {categoryTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            const IconComponent = tab.icon;
            const iconColor = isActive ? '#FFFFFF' : '#4B5563';
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.categoryTab,
                  isActive && styles.categoryTabActive,
                  !isActive && styles.categoryTabInactive,
                ]}
                onPress={() => setSelectedCategory(tab.id as typeof selectedCategory)}
                activeOpacity={0.8}
              >
                <View style={styles.categoryTabIconContainer}>
                  <IconComponent
                    width={20}
                    height={20}
                    fill={iconColor}
                    color={iconColor}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryTabText,
                    isActive && styles.categoryTabTextActive,
                    !isActive && styles.categoryTabTextInactive,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Food Items Grid */}
        <View style={selectedCategory === 'all' ? styles.foodItemsGrid : styles.foodItemsGridSingle}>
          {visibleFoodItems.map((item, index) => {
            return (
              <View
                key={item.id}
                style={[
                  selectedCategory === 'all' ? styles.foodItemWrapper : styles.foodItemWrapperSingle,
                  selectedCategory === 'all' && index % 2 === 0 && styles.foodItemLeft,
                ]}
              >
                <FoodItemCard
                  image={item.image}
                  title={item.name}
                  description={item.description}
                  price={item.price ?? ''}
                  {...(selectedCategory !== 'all' && { rating: item.rating })} // Only show rating in other tabs, not "All Items"
                  isVegetarian={item.type === 'veg'}
                  isBestseller={item.status === 'bestseller'}
                  isNew={item.status === 'new'}
                  quantity={quantities[item.id] || 1}
                  onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  onAddToCart={() => handleAddToCart(item.id)}
                />
              </View>
            );
          })}
        </View>

        {/* See More / See Less Food Items Button */}
        {totalFoodItems > 4 && (
          <TouchableOpacity
            style={[styles.seeMoreButton, { backgroundColor: theme.buttonPrimary }]}
            activeOpacity={0.8}
            onPress={handleToggleFoodItems}
          >
            <Text style={[styles.seeMoreText, { color: theme.buttonText }]}>{foodCtaLabel}</Text>
          </TouchableOpacity>
        )}

        {/* Food Icon Cards */}
        {filteredIconCards.length > 0 && (
          <View style={styles.foodIconCardsGrid}>
            {visibleIconCards.map((icon, index) => (
              <View
                key={icon.name}
                style={[
                  styles.foodIconCardWrapper,
                  index % 2 === 0 && styles.foodIconCardLeft,
                ]}
              >
                <CategoryCardSVG
                  image={icon.image}
                  title={icon.name}
                  onPress={() => handleCategoryPress(icon.name)}
                />
              </View>
            ))}
          </View>
        )}

        {/* See More / Show Less Button */}
        {(showMoreButton || showLessButton) && (
          <TouchableOpacity
            style={[styles.seeMoreButton, { backgroundColor: theme.buttonPrimary }]}
            activeOpacity={0.8}
            onPress={handleSeeMoreLess}
          >
            <Text style={[styles.seeMoreText, { color: theme.buttonText }]}>
              {showMoreButton ? 'See More' : 'See Less'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomNav active="menu" />

      {/* Profile Drawer */}
      <ProfileDrawer
        visible={showProfileDrawer}
        onClose={() => setShowProfileDrawer(false)}
      />
    </View>
  );
}
