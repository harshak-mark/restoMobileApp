import React from 'react';
import { ImageSourcePropType } from 'react-native';

// Import PNG/JPG images
const BiryaniImage = require('../../assets/images/food/biriyani.png');
const VegNoodlesImage = require('../../assets/images/food/vegnoodles.png');
const KadhaiChaapImage = require('../../assets/images/food/kadhaichap.png');
const MasalaDosaImage = require('../../assets/images/food/masaladosa.jpg');
const NoodlesImage = require('../../assets/images/food/noodles.jpg');
const BurgerImage = require('../../assets/images/food/doubleburger.jpg');
const PizzaImage = require('../../assets/images/food/pizza.jpg');
const CurdRiceImage = require('../../assets/images/food/southindian/curdrice.png');

// Import SVG files as React components
import CoffeeImage from '../../assets/images/food/coffee.svg';
import HunanChickenDryImage from '../../assets/images/food/hunanchickendry.svg';
import IdlySambarImage from '../../assets/images/food/idlysambar.svg';
import MasalaOmletteImage from '../../assets/images/food/masalaomlette.svg';
import ParottaImage from '../../assets/images/food/parotta.svg';
import VegHakkaNoodlesImage from '../../assets/images/food/veghakkanoodles.svg';

/**
 * Type for food images - can be ImageSourcePropType (PNG/JPG) or React Component (SVG)
 */
export type FoodImage = ImageSourcePropType | React.ComponentType<any>;

/**
 * Normalizes a food item name to match image file naming convention
 * Converts to lowercase and removes spaces
 * Example: "Idli Sambar" -> "idlisambar"
 */
function normalizeFoodName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}

/**
 * Mapping of normalized food names to their image imports
 * This ensures type safety while allowing "dynamic" resolution
 */
const foodImageMap: Record<string, FoodImage> = {
  // Breakfast items
  'idlisambar': IdlySambarImage,
  'masalaomelette': MasalaOmletteImage,
  'filtercoffee': CoffeeImage,
  'coffee': CoffeeImage,
  
  // Lunch items
  'biryani': BiryaniImage,
  'kadhaichaap': KadhaiChaapImage,
  'kadhaichap': KadhaiChaapImage,
  'classiccurdrice': CurdRiceImage,
  'curdrice': CurdRiceImage,
  
  // Dinner items
  'hunanchickendry': HunanChickenDryImage,
  'vegchinesehakkanoodles': VegHakkaNoodlesImage,
  'veghakkanoodles': VegHakkaNoodlesImage,
  'parotta': ParottaImage,
  
  // Additional items that might be in the data
  'masaladosa': MasalaDosaImage,
  'vegnoodles': VegNoodlesImage,
  'noodles': NoodlesImage,
  'burger': BurgerImage,
  'pizza': PizzaImage,
};

/**
 * Fallback image to use when no mapping is found
 */
const fallbackImage = BiryaniImage;

/**
 * Maps a food item name to its corresponding image
 * 
 * @param foodName - The name of the food item (e.g., "Idli Sambar")
 * @returns The image (ImageSourcePropType for PNG/JPG or React Component for SVG)
 * 
 * @example
 * const image = getFoodImage('Idli Sambar'); // Returns IdlySambarImage (SVG component)
 * const image = getFoodImage('Biryani'); // Returns BiryaniImage (PNG)
 */
export function getFoodImage(foodName: string): FoodImage {
  const normalizedName = normalizeFoodName(foodName);
  
  // Try exact match first
  if (foodImageMap[normalizedName]) {
    return foodImageMap[normalizedName];
  }
  
  // Try partial matches for compound names
  // For example, "Classic Curd Rice" might be stored as "curdrice"
  const partialMatches = Object.keys(foodImageMap).filter(key => 
    normalizedName.includes(key) || key.includes(normalizedName)
  );
  
  if (partialMatches.length > 0) {
    // Return the longest matching key (most specific match)
    const bestMatch = partialMatches.reduce((a, b) => a.length > b.length ? a : b);
    return foodImageMap[bestMatch];
  }
  
  // Return fallback if no match found
  console.warn(`No image mapping found for food item: "${foodName}" (normalized: "${normalizedName}"). Using fallback.`);
  return fallbackImage;
}
