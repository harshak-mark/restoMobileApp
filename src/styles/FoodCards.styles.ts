import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ============================================
  // Food Item Card Styles (Type 1) - Compact for 2-column grid
  // ============================================
  foodItemCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  foodItemImageContainer: {
    width: '100%',
    height: 130,
    overflow: 'hidden',
  },
  foodItemImage: {
    width: '100%',
    height: '100%',
  },
  foodItemContent: {
    padding: 10,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  foodItemTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    flex: 1,
    marginRight: 4,
  },
  dietaryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dietaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 3,
  },
  dietaryText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
  },
  foodItemDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginBottom: 6,
    lineHeight: 14,
  },
  foodItemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  foodItemPrice: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginLeft: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestsellerTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
  },
  bestsellerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    color: '#FFFFFF',
  },
  infoIcon: {
    padding: 1,
  },
  foodItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 14,
    height: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    marginHorizontal: 4,
    minWidth: 12,
    textAlign: 'center',
  },
  addToCartButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },

  // ============================================
  // Category Card Styles (Type 2)
  // ============================================
  categoryCard: {
    width: 150,
    height: 180,
    borderRadius: 0,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#E7E7E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryImageContainer: {
    width: '100%',
    height: 120,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  categoryTitleWithSubtitle: {
    paddingVertical: 0,
    paddingBottom: 2,
  },

  // ============================================
  // Category Card with Subtitle Styles (Type 3)
  // ============================================
  categoryCardWithSubtitle: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryTextContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  categorySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 4,
  },

  // ============================================
  // Simple Food Card Styles (Type 4)
  // ============================================
  simpleFoodCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  simpleFoodImageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  simpleFoodImage: {
    width: '100%',
    height: '100%',
  },
  simpleFoodContent: {
    padding: 16,
  },
  simpleFoodTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    marginBottom: 12,
  },
  simpleFoodActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simpleFoodPrice: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  simpleAddToCartButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleAddToCartText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});

