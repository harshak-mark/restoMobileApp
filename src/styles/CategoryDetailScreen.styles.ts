import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    //marginTop: 20,
  },
  carouselContainer: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  contentContainer: {
    //paddingTop: 24,
    //paddingHorizontal: 20,
    paddingBottom: 10,
    
  },
  headerHero: {
    //paddingHorizontal: 20,
    //paddingTop: 10,
    paddingBottom: 10,
    //marginBottom: 20,
    //marginTop: 40,
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '800',
    fontSize: 80,
    paddingBottom: 20,
    paddingTop: 20,
    lineHeight: 80,
    color: 'rgba(255,255,255,0.35)',
    opacity: 0.3,
  },
  headerImage: {
    width: 308,
    height: 252,
    alignSelf: 'center',
  },
  categoryTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroCard: {
    backgroundColor: '#FB8C00',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroImage: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.4,
    resizeMode: 'contain',
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  heroSubtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#FFF7EB',
    marginTop: 6,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    marginTop: 16,
    marginBottom: 16,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 4,
  },
  BottomMargin: {
    paddingBottom: 40,
  },
  cardWrapper: {
    width: '100%',
  },
  seeMoreButton: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 80,
  },
  seeMoreText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
