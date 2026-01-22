import React, { useRef, useState } from 'react';
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
import { MapPin, Bed, Bath, Maximize } from 'lucide-react-native';
import TrustBadge from './TrustBadge';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.7;

interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: {
    address: string;
    city: string;
  };
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  trustScore?: number;
  trustLevel?: 'verified' | 'building' | 'restricted';
}

interface SwipeCardsProps {
  properties: Property[];
  onSwipeLeft?: (property: Property) => void;
  onSwipeRight?: (property: Property) => void;
  onCardPress?: (property: Property) => void;
}

export default function SwipeCards({
  properties,
  onSwipeLeft,
  onSwipeRight,
  onCardPress,
}: SwipeCardsProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, CARD_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-CARD_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          forceSwipe('right');
        } else if (gesture.dx < -120) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? CARD_WIDTH * 2 : -CARD_WIDTH * 2;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: 'left' | 'right') => {
    const property = properties[currentIndex];
    if (direction === 'right' && onSwipeRight) {
      onSwipeRight(property);
    } else if (direction === 'left' && onSwipeLeft) {
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

  const renderCard = (property: Property, index: number) => {
    if (index < currentIndex) return null;

    if (index === currentIndex) {
      return (
        <Animated.View
          key={property.id}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => onCardPress && onCardPress(property)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: property.images[0] }} style={styles.image} />

            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Text style={styles.labelText}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Text style={styles.labelText}>NOPE</Text>
            </Animated.View>

            <View style={styles.details}>
              {property.trustLevel && property.trustScore && (
                <View style={styles.trustBadgeContainer}>
                  <TrustBadge
                    level={property.trustLevel}
                    score={property.trustScore}
                    size="small"
                  />
                </View>
              )}

              <Text style={styles.price}>
                {property.currency} {property.price.toLocaleString()}
              </Text>
              <Text style={styles.title} numberOfLines={2}>
                {property.title}
              </Text>

              <View style={styles.locationRow}>
                <MapPin size={14} color="#666" />
                <Text style={styles.location} numberOfLines={1}>
                  {property.location.address}
                </Text>
              </View>

              <View style={styles.features}>
                {property.bedrooms && (
                  <View style={styles.feature}>
                    <Bed size={16} color="#666" />
                    <Text style={styles.featureText}>{property.bedrooms}</Text>
                  </View>
                )}
                {property.bathrooms && (
                  <View style={styles.feature}>
                    <Bath size={16} color="#666" />
                    <Text style={styles.featureText}>{property.bathrooms}</Text>
                  </View>
                )}
                {property.sqft && (
                  <View style={styles.feature}>
                    <Maximize size={16} color="#666" />
                    <Text style={styles.featureText}>{property.sqft} sqft</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <View
        key={property.id}
        style={[
          styles.card,
          {
            zIndex: -index,
            transform: [{ scale: 1 - (index - currentIndex) * 0.05 }],
          },
        ]}
      >
        <Image source={{ uri: property.images[0] }} style={styles.image} />
      </View>
    );
  };

  if (currentIndex >= properties.length) {
    return (
      <View style={styles.noMore}>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '65%',
    backgroundColor: '#e5e5e5',
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    transform: [{ rotate: '20deg' }],
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    transform: [{ rotate: '-20deg' }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
  },
  details: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  trustBadgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    color: '#666',
    flex: 1,
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
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  noMore: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
});
