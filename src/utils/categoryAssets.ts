import { ImageSourcePropType } from 'react-native';

export function normalizeCategory(category?: string): string {
  return (category || '').trim().toLowerCase();
}

const categoryMainIcons: Record<string, ImageSourcePropType> = {
  dosa: require('../../assets/images/food/mainicon/dosa.png'),
  biriyani: require('../../assets/images/food/mainicon/biriyani.png'),
  biryani: require('../../assets/images/food/mainicon/biriyani.png'),
  juice: require('../../assets/images/food/mainicon/juice.png'),
  juices: require('../../assets/images/food/mainicon/juice.png'),
  burgers: require('../../assets/images/food/mainicon/burgers.png'),
  burger: require('../../assets/images/food/mainicon/burgers.png'),
  pizza: require('../../assets/images/food/mainicon/pizza.png'),
  'south indian': require('../../assets/images/food/mainicon/southindian.png'),
  southindian: require('../../assets/images/food/mainicon/southindian.png'),
};

const defaultMainIcon = categoryMainIcons.dosa || categoryMainIcons.biriyani;

const defaultCarousel: ImageSourcePropType[] = [
  require('../../assets/images/carousel/TodaySpecial.png'),
  require('../../assets/images/carousel/PizzaSlice.png'),
  require('../../assets/images/carousel/3Burgers.png'),
];

const categoryCarouselMap: Record<string, ImageSourcePropType[]> = {
  dosa: [
    require('../../assets/images/carousel/Dosa.png'),
    require('../../assets/images/carousel/DosaChutney.png'),
    require('../../assets/images/carousel/DosaPlate.png'),
  ],
  biriyani: [
    require('../../assets/images/carousel/TodaySpecialBiriyani.png'),
    require('../../assets/images/carousel/IndianFood.png'),
    require('../../assets/images/carousel/Biriyani.png'),
  ],
  biryani: [
    require('../../assets/images/carousel/TodaySpecialBiriyani.png'),
    require('../../assets/images/carousel/IndianFood.png'),
    require('../../assets/images/carousel/Biriyani.png'),
  ],
  juice: [
    require('../../assets/images/carousel/FreshJuice.png'),
    require('../../assets/images/carousel/FreshFriut.png'),
    require('../../assets/images/carousel/BestSummer.png'),
  ],
  juices: [
    require('../../assets/images/carousel/FreshJuice.png'),
    require('../../assets/images/carousel/FreshFriut.png'),
    require('../../assets/images/carousel/BestSummer.png'),
  ],
  burgers: [
    require('../../assets/images/carousel/3Burgers.png'),
    require('../../assets/images/carousel/BurgerDelicious.png'),
    require('../../assets/images/carousel/TodayBurgerOffer.png'),
  ],
  burger: [
    require('../../assets/images/carousel/3Burgers.png'),
    require('../../assets/images/carousel/BurgerDelicious.png'),
    require('../../assets/images/carousel/TodayBurgerOffer.png'),
  ],
  pizza: [
    require('../../assets/images/carousel/CatchYourPizza.png'),
    require('../../assets/images/carousel/PizzaSlice.png'),
    require('../../assets/images/carousel/PizzaOffer.png'),
  ],
};

export function getCategoryMainImage(category?: string): ImageSourcePropType {
  const key = normalizeCategory(category);
  return categoryMainIcons[key] || defaultMainIcon;
}

export function getCategoryCarouselImages(category?: string): ImageSourcePropType[] {
  const key = normalizeCategory(category);
  return categoryCarouselMap[key] || defaultCarousel;
}
