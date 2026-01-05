import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  locationSection: {
    marginTop:60,
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
    marginTop:40,
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
    paddingTop: 10,
    //paddingHorizontal: 20,
    paddingBottom: 40,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 20,
    //marginBottom: 6,
  },
  favoriteFoodText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 10,
  },
  carouselContainer: {
    //marginBottom: 10,
    position: 'relative',
    paddingHorizontal: 4,
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
  popularSection: {
    marginTop: 30,
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  popularTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
  },
  seeAllButton: {
    backgroundColor: '#FFE5CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeAllText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#FB8C00',
  },
  popularItemsContainer: {
    paddingRight: 20,
    paddingHorizontal: 10,
  },
  popularItemWrapper: {
    marginRight: 16,
    
    width: 180,
  },
  picksYoursSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  picksYoursTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    marginBottom: 16,
  },
  picksYoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  picksYoursCardWrapper: {
    width: (SCREEN_WIDTH - 56) / 2, // 2 columns: (screen width - 40px padding - 16px gap) / 2
    marginBottom: 16,
  },
  picksYoursCardLeft: {
    marginRight: 16, // Gap between cards
  },
  picksSeeMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 4,
  },
  picksSeeMoreText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },

  // 50% OFF Banner Styles
  offerBannerContainer: {
    marginTop: 30,
    //marginHorizontal: 20, // Extend to full width (negate content padding)
    width: SCREEN_WIDTH,
    height: 140,
  },
  offerBannerImage: {
    width: '100%',
    height: '100%',
  },

  // Reserve A Table Section Styles
  reserveSection: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  reserveSectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  reserveCard: {
    backgroundColor: '#FB8C00',
    borderRadius: 20,
    padding: 24,
  },
  reserveCardTitle: {
    fontFamily: 'FredokaOne_400Regular',
    fontSize: SCREEN_WIDTH < 380 ? 22 : 28, // Responsive font size
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: SCREEN_WIDTH < 380 ? 1 : 2,
    marginBottom: 8,
  },
  reserveCardSubtitle: {
    fontFamily: 'Epilogue_400Regular',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  reserveInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  reserveInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    marginLeft: 8,
  },
  reserveButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 16,
  },
  checkAvailabilityButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FB8C00',
  },
  checkAvailabilityText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FB8C00',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  submitButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FB8C00',
    textAlign: 'center',
  },
  placeholderText: {
    color: '#999',
  },

  // Date/Time Picker Modal Styles
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: SCREEN_WIDTH - 40,
    overflow: 'hidden',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FB8C00',
  },
  pickerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  pickerDoneButton: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Special Offer Section Styles
  specialOfferContainer: {
    marginTop: 10,
    marginBottom: 60,
    height: 180,
    borderRadius: 16,
    //overflow: 'hidden',
    
  },
  specialOfferImage: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
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
    color: '#666',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#FB8C00',
  },
  menuIcon: {
    width: 24,
    height: 24,
  },

  // Availability Modal
  availabilityOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  availabilityCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  availabilityTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  availabilityClose: {
    padding: 6,
  },
  availabilityTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  availabilityTab: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  availabilityTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  seatRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  seatCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  seatDecorRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  seatIdText: {
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 8,
  },
  seatMetaText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  seatCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#E6FFFA',
    borderRadius: 12,
    padding: 4,
  },
  reserveCta: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  reserveCtaText: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Address Dropdown Modal Styles
  addressDropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  addressDropdownContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
    paddingBottom: 20,
  },
  addressDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  addressDropdownTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  addressDropdownList: {
    maxHeight: SCREEN_HEIGHT * 0.5,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  addressDropdownItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  addressItemContent: {
    flex: 1,
  },
  addressItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressItemLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  addressCheckIcon: {
    marginLeft: 'auto',
  },
  addressItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginLeft: 28,
    marginBottom: 4,
  },
  addressItemLandmark: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginLeft: 28,
  },
  addressAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addressAddButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
});

