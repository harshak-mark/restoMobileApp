import React from 'react';
import { ImageSourcePropType } from 'react-native';

// PNG/JPG images
const BiryaniImage = require('../../assets/images/food/biriyani.png');
const Chicken65BiryaniImage = require('../../assets/images/food/biriyani/chicken65biriyani.png');
const ChickenXBiryaniImage = require('../../assets/images/food/biriyani/chickenx1biriyani.png');
const FishBiryaniImage = require('../../assets/images/food/biriyani/fishbiriyani.png');
const MuttonBiryaniImage = require('../../assets/images/food/biriyani/muttonbiriyani.png');
const MuttonBucketBiryaniImage = require('../../assets/images/food/biriyani/muttonbucketbiriyani.png');
const MuttonMiniBiryaniImage = require('../../assets/images/food/biriyani/muttonminibiriyani.png');
const NalliBiryaniImage = require('../../assets/images/food/biriyani/nali biriyani.png');
const PaneerBiryaniImage = require('../../assets/images/food/biriyani/paneerbiriyani.png');
const PrawnBiryaniImage = require('../../assets/images/food/biriyani/prawnbiriyani.png');
const VegBiryaniImage = require('../../assets/images/food/biriyani/vegbiriyani.png');
const VegNoodlesImage = require('../../assets/images/food/vegnoodles.png');
const KadhaiChaapImage = require('../../assets/images/food/kadhaichap.png');
const MasalaDosaImage = require('../../assets/images/food/masaladosa.jpg');
const NoodlesImage = require('../../assets/images/food/noodles.jpg');
const BurgerImage = require('../../assets/images/food/doubleburger.jpg');
const ChickenBurgerImage = require('../../assets/images/food/burgers/chickenburger.png');
const ChickenCheeseBurgerImage = require('../../assets/images/food/burgers/chicken&chesseburger.png');
const CheeseVegBurgerImage = require('../../assets/images/food/burgers/cheesevegburger.png');
const PannerBurgerImage = require('../../assets/images/food/burgers/PannerBurger.png');
const SpicyChickenBurgerImage = require('../../assets/images/food/burgers/spicychickenburger.png');
const SpicyChickenWrapImage = require('../../assets/images/food/burgers/spicychickenwrap.png');
const SpicyPaneerBurgerImage = require('../../assets/images/food/burgers/spicypaneerburger.png');
const VegMaharajBurgerImage = require('../../assets/images/food/burgers/vegmaharajburger.png');
const PizzaImage = require('../../assets/images/food/pizza.jpg');
const MargheritaPizzaImage = require('../../assets/images/food/pizza/margheritapizza.png');
const ChickenClassicPizzaImage = require('../../assets/images/food/pizza/chickenclassicpizza.png');
const ChickenPizzaImage = require('../../assets/images/food/pizza/chickenpizza.png');
const ChickenSupremePizzaImage = require('../../assets/images/food/pizza/chickensupremepizza.png');
const ChickenTikkaPizzaImage = require('../../assets/images/food/pizza/chickentikkapizza.png');
const PaneerPizzaImage = require('../../assets/images/food/pizza/paneerpizza.png');
const RedWavePizzaImage = require('../../assets/images/food/pizza/redwavepizza.png');
const TandooriPaneerPizzaImage = require('../../assets/images/food/pizza/tandooripaneerpizza.png');
const DynamitePizzaImage = require('../../assets/images/food/pizza/6dynamitepizza.png');
const CurdRiceImage = require('../../assets/images/food/southindian/curdrice.png');
const FreshJuiceImage = require('../../assets/images/carousel/FreshJuice.png');
const FreshFruitImage = require('../../assets/images/carousel/FreshFriut.png');
const BurgerDeliciousImage = require('../../assets/images/food/burgers/chickenbigburger.png');
const ButterDosaImage = require('../../assets/images/food/dosa/butterdosa.png');
const GheeRoastDosaImage = require('../../assets/images/food/dosa/gheeroastdosa.png');
const OnionUthappamImage = require('../../assets/images/food/dosa/onionuthappam.png');
const PepperRoastDosaImage = require('../../assets/images/food/dosa/pepperroastdosa.png');
const PodiMasalaDosaImage = require('../../assets/images/food/dosa/podimasaladosa.png');
const CoconutFreshLimeImage = require('../../assets/images/food/juice/coconutfreshlime.png');
const FigJuiceImage = require('../../assets/images/food/juice/figjuice.png');
const GrapeJuiceImage = require('../../assets/images/food/juice/grapejuice.png');
const PomegranateJuiceImage = require('../../assets/images/food/juice/pomegranatejuice.png');
const SweetLimeJuiceImage = require('../../assets/images/food/juice/sweetlimejuice.png');
const WatermelonJuiceImage = require('../../assets/images/food/juice/watermelonjuice.png');

// SVG components
import EggBiryaniImage from '../../assets/images/food/biriyani/eggbiriyani.svg';
import CoffeeImage from '../../assets/images/food/coffee.svg';
import HunanChickenDryImage from '../../assets/images/food/hunanchickendry.svg';
import IdlySambarImage from '../../assets/images/food/idlysambar.svg';
import MasalaOmletteImage from '../../assets/images/food/masalaomlette.svg';
import ParottaImage from '../../assets/images/food/parotta.svg';
import VegHakkaNoodlesImage from '../../assets/images/food/veghakkanoodles.svg';

// Icon SVGs for category icon cards
import BiryaniIcon from '../../assets/images/food/icons/biriyani.svg';
import BurgerIcon from '../../assets/images/food/icons/burger.svg';
import CakesIcon from '../../assets/images/food/icons/cakes.svg';
import DosaIcon from '../../assets/images/food/icons/dosa.svg';
import IceCreamsIcon from '../../assets/images/food/icons/icecreams.svg';
import NoodlesIcon from '../../assets/images/food/icons/noodles.svg';
import NorthIndianIcon from '../../assets/images/food/icons/northindian.svg';
import PastaIcon from '../../assets/images/food/icons/pasta.svg';
import PizzaIcon from '../../assets/images/food/icons/pizza.svg';
import SaladIcon from '../../assets/images/food/icons/salad.svg';
import ShawarmaIcon from '../../assets/images/food/icons/shawarma.svg';
import SouthIndianIcon from '../../assets/images/food/icons/southindian.svg';

export type MealSection = 'breakfast' | 'lunch' | 'dinner';

export type FoodItem = {
  id: string;
  name: string;
  dishName: string;
  category: string;
  description: string;
  price?: number;
  rating?: number;
  image: ImageSourcePropType | React.ComponentType<any>;
  sections: MealSection[];
  // compatibility with existing screens
  type?: 'veg' | 'non-veg';
  status?: 'bestseller' | 'new' | null;
  categories?: string[];
};

export type CategoryIconItem = {
  id: string;
  name: string;
  image: React.ComponentType<any>;
  sections: MealSection[];
};

export interface PopularItem {
  id: number;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
}

// Centralized food items (no duplicates)
export const foodItems: FoodItem[] = [
  {
    id: 'idli-sambar',
    name: 'Idli Sambar',
    dishName: 'Idli Sambar',
    category: 'South Indian',
    description: 'Steamed rice cakes with lentil curry',
    price: 80,
    rating: 3.6,
    image: IdlySambarImage,
    sections: ['breakfast'],
    type: 'veg',
    status: 'new',
    categories: ['South Indian', 'Breakfast'],
  },
  {
    id: 'masala-omelette',
    name: 'Masala Omelette',
    dishName: 'Masala Omelette',
    category: 'Breakfast',
    description: 'Spiced egg omelette with onions',
    price: 180,
    rating: 4.7,
    image: MasalaOmletteImage,
    sections: ['breakfast', 'lunch'],
    type: 'non-veg',
    status: null,
    categories: ['Breakfast', 'Lunch'],
  },
  {
    id: 'filter-coffee',
    name: 'Filter Coffee',
    dishName: 'Filter Coffee',
    category: 'Beverage',
    description: 'Traditional South Indian coffee',
    price: 40,
    rating: 4.0,
    image: CoffeeImage,
    sections: ['breakfast'],
    type: 'veg',
    status: 'bestseller',
    categories: ['Breakfast', 'Beverage'],
  },
  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    dishName: 'Masala Dosa',
    category: 'South Indian',
    description: 'Crispy rice crepe with spiced potato filling',
    price: 90,
    rating: 4.5,
    image: MasalaDosaImage,
    sections: ['breakfast', 'dinner'],
    type: 'veg',
    status: 'bestseller',
    categories: ['Dosa', 'South Indian', 'Breakfast', 'Dinner'],
  },
  {
    id: 'biryani',
    name: 'Biriyani',
    dishName: 'Chicken Biryani',
    category: 'Biryani',
    description: 'Aromatic biryani with spices and tender meat',
    price: 350,
    rating: 4.0,
    image: BiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'new',
    categories: ['Biryani', 'Arabian', 'South Indian', 'Lunch', 'Dinner'],
  },
  {
    id: 'kadhai-chaap',
    name: 'Kadhai Chaap',
    dishName: 'Kadhai Chaap',
    category: 'North Indian',
    description: 'Soya chaap cooked with onions and spices',
    price: 230,
    rating: 4.7,
    image: KadhaiChaapImage,
    sections: ['lunch'],
    type: 'veg',
    status: null,
    categories: ['North Indian', 'Punjabi', 'Lunch'],
  },
  {
    id: 'classic-curd-rice',
    name: 'Classic Curd Rice',
    dishName: 'Curd Rice',
    category: 'South Indian',
    description: 'Classic creamy curd rice',
    price: 90,
    rating: 4.0,
    image: CurdRiceImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: 'bestseller',
    categories: ['South Indian', 'Lunch', 'Dinner'],
  },
  {
    id: 'hunan-chicken-dry',
    name: 'Hunan Chicken Dry',
    dishName: 'Hunan Chicken Dry',
    category: 'Chinese',
    description: 'Chicken, onions, and capsicum tossed in spices',
    price: 150,
    rating: 4.7,
    image: HunanChickenDryImage,
    sections: ['dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Chinese', 'Dinner'],
  },
  {
    id: 'veg-hakka-noodles',
    name: 'Veg Chinese Hakka Noodles',
    dishName: 'Veg Hakka Noodles',
    category: 'Chinese',
    description: 'The OG Indo-Chinese classic',
    price: 210,
    rating: 4.7,
    image: VegHakkaNoodlesImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Veg', 'Chinese', 'Hakka', 'Lunch', 'Dinner'],
  },
  {
    id: 'parotta',
    name: 'Parotta',
    dishName: 'Parotta',
    category: 'South Indian',
    description: 'Soft and flaky layered flatbread',
    price: 90,
    rating: 4.0,
    image: ParottaImage,
    sections: ['dinner'],
    type: 'veg',
    status: 'bestseller',
    categories: ['South Indian', 'Dinner'],
  },
  {
    id: 'mixed-fruit-juice',
    name: 'Mixed Fruit Juice',
    dishName: 'Mixed Fruit Juice',
    category: 'Beverage',
    description: 'Seasonal fruits blended fresh to order',
    price: 110,
    rating: 4.1,
    image: FreshFruitImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: 'new',
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'fresh-orange-juice',
    name: 'Fresh Orange Juice',
    dishName: 'Orange Juice',
    category: 'Beverage',
    description: 'Cold-pressed oranges with no added sugar',
    price: 120,
    rating: 4.4,
    image: FreshJuiceImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: null,
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'classic-burger',
    name: 'Classic Veg Burger',
    dishName: 'Veg Burger',
    category: 'Fast Food',
    description: 'Grilled veg patty with lettuce and cheese',
    price: 150,
    rating: 4.2,
    image: BurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Burgers', 'Snacks', 'Lunch', 'Dinner'],
  },
  {
    id: 'double-patty-burger',
    name: 'Double Patty Burger',
    dishName: 'Double Patty Burger',
    category: 'Fast Food',
    description: 'Juicy double patty with house sauce',
    price: 220,
    rating: 4.5,
    image: BurgerDeliciousImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Burgers', 'Snacks', 'Lunch', 'Dinner'],
  },
  {
    id: 'veg-noodles',
    name: 'Veg Noodles',
    dishName: 'Veg Noodles',
    category: 'Chinese',
    description: 'Stir-fried noodles with veggies',
    price: 160,
    rating: 4.2,
    image: VegNoodlesImage,
    sections: ['lunch'],
    type: 'veg',
    status: null,
    categories: ['Chinese', 'Lunch'],
  },
  {
    id: 'noodles',
    name: 'Noodles',
    dishName: 'Noodles',
    category: 'Chinese',
    description: 'Classic wok-tossed noodles',
    price: 150,
    rating: 4.0,
    image: NoodlesImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Chinese', 'Lunch', 'Dinner'],
  },
  {
    id: 'pizza',
    name: 'Pizza',
    dishName: 'Pizza',
    category: 'Fast Food',
    description: 'Cheesy pizza with classic toppings',
    price: 260,
    rating: 4.3,
    image: PizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner'],
  },
  // Biriyani variants
  {
    id: 'chicken65-biryani',
    name: 'Chicken 65 Biryani',
    dishName: 'Chicken 65 Biryani',
    category: 'Biryani',
    description: 'Spicy fried chicken tossed over fragrant biryani rice',
    price: 260,
    rating: 4.4,
    image: Chicken65BiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'chickenx1-biryani',
    name: 'Chicken X1 Biryani',
    dishName: 'Chicken X1 Biryani',
    category: 'Biryani',
    description: 'Signature single-serve chicken biryani',
    price: 240,
    rating: 4.2,
    image: ChickenXBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'egg-biryani',
    name: 'Egg Biryani',
    dishName: 'Egg Biryani',
    category: 'Biryani',
    description: 'Seeraga samba rice with spiced boiled eggs',
    price: 190,
    rating: 4.0,
    image: EggBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'fish-biryani',
    name: 'Fish Biryani',
    dishName: 'Fish Biryani',
    category: 'Biryani',
    description: 'Coastal style fish biryani with fresh catch',
    price: 320,
    rating: 4.1,
    image: FishBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner', 'Seafood'],
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    dishName: 'Mutton Biryani',
    category: 'Biryani',
    description: 'Tender mutton slow-cooked with fragrant rice',
    price: 380,
    rating: 4.6,
    image: MuttonBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'mutton-bucket-biryani',
    name: 'Mutton Bucket Biryani',
    dishName: 'Mutton Bucket Biryani',
    category: 'Biryani',
    description: 'Family bucket loaded with spiced mutton and rice',
    price: 520,
    rating: 4.3,
    image: MuttonBucketBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'mutton-mini-biryani',
    name: 'Mutton Mini Biryani',
    dishName: 'Mutton Mini Biryani',
    category: 'Biryani',
    description: 'Compact portion of flavorful mutton biryani',
    price: 260,
    rating: 4.1,
    image: MuttonMiniBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'nalli-biryani',
    name: 'Nalli Biryani',
    dishName: 'Nalli Biryani',
    category: 'Biryani',
    description: 'Rich marrow bone biryani with deep flavors',
    price: 420,
    rating: 4.5,
    image: NalliBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Biryani', 'Lunch', 'Dinner'],
  },
  {
    id: 'paneer-biryani',
    name: 'Paneer Biryani',
    dishName: 'Paneer Biryani',
    category: 'Biryani',
    description: 'Cottage cheese cubes in aromatic basmati rice',
    price: 240,
    rating: 4.0,
    image: PaneerBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'prawn-biryani',
    name: 'Prawn Biryani',
    dishName: 'Prawn Biryani',
    category: 'Biryani',
    description: 'Juicy prawns layered with flavorful rice',
    price: 360,
    rating: 4.4,
    image: PrawnBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner', 'Seafood'],
  },
  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    dishName: 'Veg Biryani',
    category: 'Biryani',
    description: 'Mixed vegetables cooked with fragrant rice',
    price: 190,
    rating: 4.1,
    image: VegBiryaniImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Biryani', 'Lunch', 'Dinner', 'Veg'],
  },
  // Burgers
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    dishName: 'Chicken Burger',
    category: 'Fast Food',
    description: 'Juicy chicken patty with crisp lettuce',
    price: 199,
    rating: 4.2,
    image: ChickenBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Burgers', 'Lunch', 'Dinner'],
  },
  {
    id: 'chicken-cheese-burger',
    name: 'Chicken & Cheese Burger',
    dishName: 'Chicken & Cheese Burger',
    category: 'Fast Food',
    description: 'Chicken patty with double cheese layers',
    price: 220,
    rating: 4.4,
    image: ChickenCheeseBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Burgers', 'Lunch', 'Dinner'],
  },
  {
    id: 'cheese-veg-burger',
    name: 'Cheese Veg Burger',
    dishName: 'Cheese Veg Burger',
    category: 'Fast Food',
    description: 'Veg patty with melted cheese slice',
    price: 180,
    rating: 3.5,
    image: CheeseVegBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Burgers', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'paneer-burger',
    name: 'Paneer Burger',
    dishName: 'Paneer Burger',
    category: 'Fast Food',
    description: 'Spiced paneer patty with crunchy veggies',
    price: 210,
    rating: 3.8,
    image: PannerBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Burgers', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'spicy-chicken-burger',
    name: 'Spicy Chicken Burger',
    dishName: 'Spicy Chicken Burger',
    category: 'Fast Food',
    description: 'Fiery chicken patty topped with jalapeños',
    price: 230,
    rating: 3.8,
    image: SpicyChickenBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Burgers', 'Lunch', 'Dinner'],
  },
  {
    id: 'spicy-chicken-wrap',
    name: 'Spicy Chicken Wrap',
    dishName: 'Spicy Chicken Wrap',
    category: 'Fast Food',
    description: 'Grilled chicken wrapped with lettuce and sauce',
    price: 210,
    rating: 4.0,
    image: SpicyChickenWrapImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Wraps', 'Burgers', 'Lunch', 'Dinner'],
  },
  {
    id: 'spicy-paneer-burger',
    name: 'Spicy Paneer Burger',
    dishName: 'Spicy Paneer Burger',
    category: 'Fast Food',
    description: 'Crispy paneer patty with spicy mayo',
    price: 220,
    rating: 3.9,
    image: SpicyPaneerBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Burgers', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'veg-maharaj-burger',
    name: 'Veg Maharaja Burger',
    dishName: 'Veg Maharaja Burger',
    category: 'Fast Food',
    description: 'Stacked veg patties with creamy sauce',
    price: 240,
    rating: 4.1,
    image: VegMaharajBurgerImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Burgers', 'Lunch', 'Dinner', 'Veg'],
  },
  // Pizza
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    dishName: 'Margherita Pizza',
    category: 'Pizza',
    description: 'Classic cheese pizza with basil',
    price: 199,
    rating: 4.0,
    image: MargheritaPizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'chicken-classic-pizza',
    name: 'Chicken Classic Pizza',
    dishName: 'Chicken Classic Pizza',
    category: 'Pizza',
    description: 'Tender chicken chunks on cheesy base',
    price: 290,
    rating: 4.5,
    image: ChickenClassicPizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner'],
  },
  {
    id: 'chicken-pizza',
    name: 'Chicken Pizza',
    dishName: 'Chicken Pizza',
    category: 'Pizza',
    description: 'Loaded with chicken and classic toppings',
    price: 220,
    rating: 4.1,
    image: ChickenPizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner'],
  },
  {
    id: 'chicken-supreme-pizza',
    name: 'Chicken Supreme Pizza',
    dishName: 'Chicken Supreme Pizza',
    category: 'Pizza',
    description: 'Supreme toppings with extra cheese',
    price: 240,
    rating: 4.4,
    image: ChickenSupremePizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: 'bestseller',
    categories: ['Pizza', 'Lunch', 'Dinner'],
  },
  {
    id: 'chicken-tikka-pizza',
    name: 'Chicken Tikka Pizza',
    dishName: 'Chicken Tikka Pizza',
    category: 'Pizza',
    description: 'Spiced tikka chicken on tangy sauce',
    price: 299,
    rating: 3.5,
    image: ChickenTikkaPizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'non-veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner'],
  },
  {
    id: 'paneer-pizza',
    name: 'Paneer Pizza',
    dishName: 'Paneer Pizza',
    category: 'Pizza',
    description: 'Cottage cheese with creamy sauce',
    price: 190,
    rating: 3.8,
    image: PaneerPizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'red-wave-pizza',
    name: 'Red Wave Pizza',
    dishName: 'Red Wave Pizza',
    category: 'Pizza',
    description: 'Red sauce, jalapeños, olives, and cheese',
    price: 320,
    rating: 3.5,
    image: RedWavePizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'tandoori-paneer-pizza',
    name: 'Tandoori Paneer Pizza',
    dishName: 'Tandoori Paneer Pizza',
    category: 'Pizza',
    description: 'Tandoori paneer with onions and peppers',
    price: 220,
    rating: 3.5,
    image: TandooriPaneerPizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner', 'Veg'],
  },
  {
    id: 'dynamite-pizza',
    name: '6” Dynamite Pizza',
    dishName: '6” Dynamite Pizza',
    category: 'Pizza',
    description: 'Spicy toppings with molten cheese pull',
    price: 239,
    rating: 4.0,
    image: DynamitePizzaImage,
    sections: ['lunch', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Pizza', 'Lunch', 'Dinner', 'Veg'],
  },
  // Dosa / South Indian
  {
    id: 'butter-dosa',
    name: 'Butter Dosa',
    dishName: 'Butter Dosa',
    category: 'South Indian',
    description: 'Crispy dosa finished with melting butter',
    price: 75,
    rating: 4.5,
    image: ButterDosaImage,
    sections: ['breakfast', 'dinner'],
    type: 'veg',
    status: 'bestseller',
    categories: ['Dosa', 'South Indian', 'Breakfast', 'Dinner'],
  },
  {
    id: 'ghee-roast-dosa',
    name: 'Ghee Roast Dosa',
    dishName: 'Ghee Roast Dosa',
    category: 'South Indian',
    description: 'Golden crisp dosa roasted in ghee',
    price: 90,
    rating: 4.5,
    image: GheeRoastDosaImage,
    sections: ['breakfast', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Dosa', 'South Indian', 'Breakfast', 'Dinner'],
  },
  {
    id: 'onion-uthappam',
    name: 'Onion Uthappam',
    dishName: 'Onion Uthappam',
    category: 'South Indian',
    description: 'Soft uthappam topped with onions and veggies',
    price: 90,
    rating: 4.4,
    image: OnionUthappamImage,
    sections: ['breakfast', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Dosa', 'South Indian', 'Breakfast', 'Dinner'],
  },
  {
    id: 'pepper-roast-dosa',
    name: 'Pepper Roast Dosa',
    dishName: 'Pepper Roast Dosa',
    category: 'South Indian',
    description: 'Spicy peppery roast dosa for heat lovers',
    price: 80,
    rating: 4.5,
    image: PepperRoastDosaImage,
    sections: ['breakfast', 'dinner'],
    type: 'veg',
    status: 'bestseller',
    categories: ['Dosa', 'South Indian', 'Breakfast', 'Dinner'],
  },
  {
    id: 'podi-masala-dosa',
    name: 'Podi Masala Dosa',
    dishName: 'Podi Masala Dosa',
    category: 'South Indian',
    description: 'Crisp dosa with spiced podi and potato masala',
    price: 85,
    rating: 4.2,
    image: PodiMasalaDosaImage,
    sections: ['breakfast', 'dinner'],
    type: 'veg',
    status: null,
    categories: ['Dosa', 'South Indian', 'Breakfast', 'Dinner'],
  },
  // Juices
  {
    id: 'coconut-fresh-lime',
    name: 'Coconut Fresh Lime',
    dishName: 'Coconut Fresh Lime',
    category: 'Beverage',
    description: 'Tender coconut blended with a dash of lime',
    price: 110,
    rating: 4.1,
    image: CoconutFreshLimeImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: null,
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'fig-juice',
    name: 'Fig Juice',
    dishName: 'Fig Juice',
    category: 'Beverage',
    description: 'Naturally sweet fig juice rich in nutrients',
    price: 100,
    rating: 3.9,
    image: FigJuiceImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: null,
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'grape-juice',
    name: 'Grape Juice',
    dishName: 'Grape Juice',
    category: 'Beverage',
    description: 'Refreshing grape juice with natural sweetness',
    price: 100,
    rating: 3.8,
    image: GrapeJuiceImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: null,
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'pomegranate-juice',
    name: 'Pomegranate Juice',
    dishName: 'Pomegranate Juice',
    category: 'Beverage',
    description: 'Rich antioxidant pomegranate drink',
    price: 110,
    rating: 4.6,
    image: PomegranateJuiceImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: 'bestseller',
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'sweet-lime-juice',
    name: 'Sweet Lime Juice',
    dishName: 'Sweet Lime Juice',
    category: 'Beverage',
    description: 'Freshly squeezed sweet lime for a citrus kick',
    price: 70,
    rating: 3.9,
    image: SweetLimeJuiceImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: null,
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
  {
    id: 'watermelon-juice',
    name: 'Watermelon Juice',
    dishName: 'Watermelon Juice',
    category: 'Beverage',
    description: 'Chilled watermelon juice for instant refresh',
    price: 90,
    rating: 4.1,
    image: WatermelonJuiceImage,
    sections: ['breakfast', 'lunch'],
    type: 'veg',
    status: null,
    categories: ['Juices', 'Beverage', 'Breakfast', 'Lunch'],
  },
];

// Derived helpers (no duplication)
const filterBySection = (section: MealSection) =>
  foodItems.filter((item) => item.sections.includes(section));

export const allItems = foodItems;
export const breakfastItems = filterBySection('breakfast');
export const lunchItems = filterBySection('lunch');
export const dinnerItems = filterBySection('dinner');

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '');

export const categoryItemsData: Record<string, FoodItem[]> = foodItems.reduce(
  (acc, item) => {
    const keys = new Set<string>([
      item.category,
      item.name,
      item.dishName,
      ...(item.categories || []),
    ]);

    keys.forEach((key) => {
      const normalized = normalizeKey(key);
      if (!normalized) {
        return;
      }
      if (!acc[normalized]) {
        acc[normalized] = [];
      }
      acc[normalized].push(item);
    });

    return acc;
  },
  {} as Record<string, FoodItem[]>,
);

// Backward compatible exports for existing screens
export const picksYoursData = foodItems;

// Category icon cards (single source)
export const categoryIconItems: CategoryIconItem[] = [
  { id: 'icon-biryani', name: 'Biryani', image: BiryaniIcon, sections: ['lunch', 'dinner'] },
  { id: 'icon-burgers', name: 'Burgers', image: BurgerIcon, sections: ['lunch', 'dinner'] },
  { id: 'icon-salads', name: 'Salads', image: SaladIcon, sections: ['lunch'] },
  { id: 'icon-pizzas', name: 'Pizzas', image: PizzaIcon, sections: ['lunch', 'dinner'] },
  { id: 'icon-pasta', name: 'Pasta', image: PastaIcon, sections: ['lunch', 'dinner'] },
  { id: 'icon-dosa', name: 'Dosa', image: DosaIcon, sections: ['breakfast', 'dinner'] },
  { id: 'icon-shawarma', name: 'Shawarma', image: ShawarmaIcon, sections: ['lunch', 'dinner'] },
  { id: 'icon-noodles', name: 'Noodles', image: NoodlesIcon, sections: ['lunch', 'dinner'] },
  { id: 'icon-south-indian', name: 'South Indian', image: SouthIndianIcon, sections: ['breakfast', 'dinner'] },
  { id: 'icon-north-indian', name: 'North Indian', image: NorthIndianIcon, sections: ['dinner'] },
  { id: 'icon-ice-creams', name: 'Ice Creams', image: IceCreamsIcon, sections: ['breakfast', 'lunch', 'dinner'] },
  { id: 'icon-cakes', name: 'Cakes', image: CakesIcon, sections: ['breakfast', 'lunch', 'dinner'] },
];

const filterIconsBySection = (section: MealSection) =>
  categoryIconItems.filter((icon) => icon.sections.includes(section));

export const categoryIconsAll = categoryIconItems;
export const categoryIconsBreakfast = filterIconsBySection('breakfast');
export const categoryIconsLunch = filterIconsBySection('lunch');
export const categoryIconsDinner = filterIconsBySection('dinner');

// Popular items section data
export const popularItemsData: PopularItem[] = [
  {
    id: 1,
    title: 'Noodles',
    subtitle: 'Asan wok',
    image: NoodlesImage,
  },
  {
    id: 2,
    title: 'Burger',
    subtitle: 'Flame-grilled',
    image: BurgerImage,
  },
  {
    id: 3,
    title: 'Pizza',
    subtitle: 'American pizza',
    image: PizzaImage,
  },
];
