/**
 * Example usage of Food Cards
 * 
 * This file demonstrates how to use the 4 types of food cards.
 * Copy the examples to your screens/components where needed.
 */

import { ScrollView, View } from 'react-native';
import {
    CategoryCard,
    CategoryCardWithSubtitle,
    FoodItemCard,
    SimpleFoodCard,
} from './FoodCards';

// Example 1: Food Item Card (Full Featured)
export function FoodItemCardExample() {
  return (
    <FoodItemCard
      image={require('../../assets/images/example-biryani.jpg')} // or use string URL
      title="Biryani"
      description="Biryani, Arabian, South Indian"
      price={180}
      rating={4.7}
      isVegetarian={true}
      isBestseller={true}
      quantity={1}
      onQuantityChange={(qty) => console.log('Quantity:', qty)}
      onAddToCart={() => console.log('Added to cart')}
    />
  );
}

// Example 2: Category Card (Simple)
export function CategoryCardExample() {
  return (
    <CategoryCard
      image={require('../../assets/images/example-biryani.jpg')} // or use string URL
      title="Biryani"
      onPress={() => console.log('Category pressed')}
    />
  );
}

// Example 3: Category Card with Subtitle
export function CategoryCardWithSubtitleExample() {
  return (
    <CategoryCardWithSubtitle
      image={require('../../assets/images/example-noodles.jpg')} // or use string URL
      title="Noodles"
      subtitle="Asan wok"
      onPress={() => console.log('Category pressed')}
    />
  );
}

// Example 4: Simple Food Card
export function SimpleFoodCardExample() {
  return (
    <SimpleFoodCard
      image={require('../../assets/images/example-burger.jpg')} // or use string URL
      title="Burger"
      price={210}
      onAddToCart={() => console.log('Added to cart')}
    />
  );
}

// Example: Using multiple cards in a list
export function FoodCardsListExample() {
  const foodItems = [
    {
      id: 1,
      image: 'https://example.com/biryani.jpg',
      title: 'Biryani',
      description: 'Biryani, Arabian, South Indian',
      price: 180,
      rating: 4.7,
      isVegetarian: true,
      isBestseller: true,
    },
    {
      id: 2,
      image: 'https://example.com/noodles.jpg',
      title: 'Veg Noodles',
      description: 'Veg Chinese Hakka Noodles',
      price: 210,
      rating: 4.5,
      isVegetarian: true,
      isBestseller: true,
    },
  ];

  const categories = [
    { id: 1, image: 'https://example.com/biryani.jpg', title: 'Biryani' },
    { id: 2, image: 'https://example.com/burger.jpg', title: 'Burgers' },
  ];

  return (
    <ScrollView>
      {/* Food Items */}
      {foodItems.map((item) => (
        <FoodItemCard
          key={item.id}
          image={item.image}
          title={item.title}
          description={item.description}
          price={item.price}
          rating={item.rating}
          isVegetarian={item.isVegetarian}
          isBestseller={item.isBestseller}
          onAddToCart={() => console.log('Added:', item.title)}
        />
      ))}

      {/* Categories */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {categories.map((category) => (
          <View key={category.id} style={{ width: '48%' }}>
            <CategoryCard
              image={category.image}
              title={category.title}
              onPress={() => console.log('Selected:', category.title)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}





