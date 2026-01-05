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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  availabilityCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  availabilityTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter_600SemiBold',
  },
  availabilityClose: {
    padding: 4,
  },
  toggleButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 12,
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendSquare: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    width: '100%',
    gap: 10,
  },
  tableItem: {
    width: (SCREEN_WIDTH - 48 - 32) / 5, // Container padding (24*2=48) + margins (8*4=32), divided by 5 columns
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 8,
    marginBottom: 10,
  },
  tableItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
  },
  bookTableButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookTableButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_600SemiBold',
  },
  
  // Booking Confirmation Modal
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(101, 67, 33, 0.9)', // Dark brown background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  confirmationIconContainer: {
    marginBottom: 16,
  },
  confirmationIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: '#FFB300', // Golden color
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  confirmationTitleHighlight: {
    color: '#FB8C00',
  },
  confirmationDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F49B33',
    marginVertical: 14,
  },
  confirmationUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
    fontFamily: 'Inter_600SemiBold',
    gap: 10,
  },
  confirmationUserPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'Inter_400Regular',
  },
  confirmationDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    width: '100%',
  },
  confirmationDetailsText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter_400Regular',
  },
  reservationDetailsContainer: {
    width: '100%',
    maxHeight: 500,
    overflow: 'hidden',
  },
  reservationDetailsContent: {
    paddingBottom: 20,
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  noBookingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noBookingText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  confirmationButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  confirmationDoneButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  confirmationDoneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  confirmationDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000',
    minWidth: 140,
  },
  confirmationDownloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Inter_600SemiBold',
  },
  confirmationPromoText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
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

