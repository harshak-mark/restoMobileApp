import React, { useEffect, useMemo, useState } from 'react';
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import { styles as homeStyles } from '../styles/HomeScreen.styles';

type CategoryCarouselProps = {
  images: ImageSourcePropType[];
  autoSlideInterval?: number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  style?: any;
};

const DEFAULT_INTERVAL = 3000;

export function CategoryCarousel({
  images,
  autoSlideInterval = DEFAULT_INTERVAL,
  initialIndex = 0,
  onIndexChange,
  style,
}: CategoryCarouselProps) {
  const slides = useMemo(() => images || [], [images]);
  const [currentSlide, setCurrentSlide] = useState(
    Math.min(initialIndex, Math.max(slides.length - 1, 0)),
  );

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        onIndexChange?.(next);
        return next;
      });
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoSlideInterval, onIndexChange]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <View style={[homeStyles.carouselContainer, style]}>
      <Image source={slides[currentSlide]} style={homeStyles.carouselImage} resizeMode="cover" />
      <View style={homeStyles.carouselIndicators}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setCurrentSlide(index);
              onIndexChange?.(index);
            }}
          >
            <View style={[homeStyles.indicator, currentSlide === index && homeStyles.indicatorActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
