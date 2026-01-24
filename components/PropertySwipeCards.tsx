import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Heart, MapPin, Bed, Bath, Maximize } from 'lucide-react-native';
import { Property } from '@/types';
import Colors from '@/constants/colors';
import { TrustBadge } from './TrustBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface PropertySwipeCardsProps {
  properties: Property[];
  onSwipeLeft: (property: Property) => void;
  onSwipeRight: (property: Property) => void;
  onCardPress: (property: Property) => void;
}

export function PropertySwipeCards({
  properties,
  onSwipeLeft,
  onSwipeRight,
  onCardPress,
}: PropertySwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const position = new Animated.ValueXY();
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe('right');
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe('left');
      } else {
        resetPosition();
      }
    },
  });
  
  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };
  
  const onSwipeComplete = (direction: 'left' | 'right') => {
    const property = properties[currentIndex];
    if (direction === 'right') {
      onSwipeRight(property);
    } else {
      onSwipeLeft(property);
    }
    
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };
  
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
    });
    
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };
  
  const renderCard = (property: Property, index: number) => {
    if (index < currentIndex) {
      return null;
    }
    
    if (index === currentIndex) {
      return (
        <Animated.View
          key={property.id}
          style={[styles.card, getCardStyle()]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onCardPress(property)}
            style={styles.cardTouchable}
          >
            <Image source={{ uri: property.images[0] }} style={styles.image} />
            
            <View style={styles.overlay}>
              <View style={styles.content}>
                <View style={styles.header}>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                      {property.currency} {property.price.toLocaleString()}
                    </Text>
                    <Text style={styles.priceLabel}>
                      {property.category === 'rental' ? '/month' : ''}
                    </Text>
                  </View>
                  
                  {property.trustScore && (
                    <TrustBadge trustScore={property.trustScore} size="small" />
                  )}
                </View>
                
                <Text style={styles.title} numberOfLines={2}>
                  {property.title}
                </Text>
                
                <View style={styles.location}>
                  <MapPin size={16} color="#FFFFFF" />
                  <Text style={styles.locationText}>{property.location.city}</Text>
                </View>
                
                <View style={styles.features}>
                  {property.bedrooms && (
                    <View style={styles.feature}>
                      <Bed size={18} color="#FFFFFF" />
                      <Text style={styles.featureText}>{property.bedrooms}</Text>
                    </View>
                  )}
                  {property.bathrooms && (
                    <View style={styles.feature}>
                      <Bath size={18} color="#FFFFFF" />
                      <Text style={styles.featureText}>{property.bathrooms}</Text>
                    </View>
                  )}
                  {property.area && (
                    <View style={styles.feature}>
                      <Maximize size={18} color="#FFFFFF" />
                      <Text style={styles.featureText}>
                        {property.area} {property.areaUnit}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }
    
    return (
      <View key={property.id} style={[styles.card, { zIndex: -index }]}>
        <Image source={{ uri: property.images[0] }} style={styles.image} />
      </View>
    );
  };
  
  if (currentIndex >= properties.length) {
    return (
      <View style={styles.noMoreCards}>
        <Heart size={64} color={Colors.light.tabIconDefault} />
        <Text style={styles.noMoreText}>No more properties</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {properties.map((property, index) => renderCard(property, index)).reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
    height: 500,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardTouchable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.light.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  priceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  features: {
    flexDirection: 'row',
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  noMoreCards: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.tabIconDefault,
    marginTop: 16,
  },
});
