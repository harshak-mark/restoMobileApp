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
    marginLeft: 8,
    marginRight: 4,
  },
  addressText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
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
    paddingBottom: 40,
  },
  heroCard: {
    width: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  },
  heroBackgroundText: {
    position: 'absolute',
    top: 24,
    left: 16,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 74,
    letterSpacing: 2,
    color: 'rgba(255, 255, 255, 0.25)',
    textTransform: 'capitalize',
  },
  heroImage: {
    width: SCREEN_WIDTH - 80,
    height: 320,
  },
  carouselContainer: {
    marginTop: 24,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: 180,
    borderRadius: 18,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  indicatorActive: {
    backgroundColor: '#FB8C00',
  },
});
