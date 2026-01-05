import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  locationSection: {
    marginTop: 60,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
    marginRight: 4,
  },
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 28,
  },
  headerRight: {
    marginTop: 40,
    position: 'absolute',
    right: 20,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    marginRight: 16,
    padding: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  profileInitial: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },
  favoriteFoodText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  carouselContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  indicatorActive: {
    backgroundColor: '#FB8C00',
  },
  categoryTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  categoryTabIconContainer: {
    marginBottom: 4,
  },
  categoryTabActive: {
    backgroundColor: '#FB8C00',
  },
  categoryTabInactive: {
    backgroundColor: 'transparent',
  },
  categoryTabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    textAlign: 'center',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  categoryTabTextInactive: {
    color: '#4B5563',
  },
  foodItemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  foodItemsGridSingle: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  foodItemWrapper: {
    width: (SCREEN_WIDTH - 56) / 2, // 2 columns: (screen width - 40px padding - 16px gap) / 2
    marginBottom: 16,
  },
  foodItemWrapperSingle: {
    width: '100%', // Full width for single column
    marginBottom: 6,
  },
  foodItemLeft: {
    marginRight: 16, // Gap between cards
  },
  foodIconCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  foodIconCardWrapper: {
    width: 150,
    marginBottom: 16,
  },
  foodIconCardLeft: {
    marginRight: (SCREEN_WIDTH - 40 - 300) / 2, // Gap between cards (screen width - padding - 2 card widths) / 2
  },
  seeMoreButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 30,
  },
  seeMoreText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  // Bottom Navigation Footer Styles
  bottomNavWrapper: {
    position: 'relative',
    height: 70,
  },
  footerSvgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#FB8C00',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  hexagonContainer: {
    position: 'absolute',
    top: -12, // Position in the notch (adjust based on SVG notch position)
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemCenter: {
    flex: 1.2,
  },
  navLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
});
