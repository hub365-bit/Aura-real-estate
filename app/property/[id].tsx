import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Bed,
  Bath,
  Maximize,
  Phone,
  Mail,
  Navigation,
  Calendar,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.45;

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { allProperties, toggleFavorite, isFavorite } = useApp();
  
  const property = allProperties.find((p) => p.id === id);
  
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${property.agentName}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:agent@example.com`);
  };

  const handleGetDirections = () => {
    const { lat, lng } = property.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    console.log('Share property:', property.id);
  };

  const handleBook = () => {
    router.push(`/booking/property/${property.id}` as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
                listener: (event: any) => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const index = Math.round(offsetX / width);
                  setCurrentImageIndex(index);
                },
              }
            )}
            scrollEventThrottle={16}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={styles.imageIndicatorContainer}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  currentImageIndex === index && styles.imageIndicatorActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleFavorite(property.id)}
            >
              <Heart
                size={22}
                color={isFavorite(property.id) ? Colors.light.error : Colors.light.text}
                fill={isFavorite(property.id) ? Colors.light.error : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={22} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSection}>
          {property.boosted && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>⭐ Featured Property</Text>
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {property.currency} {property.price.toLocaleString()}
              {property.category === 'rental' && (
                <Text style={styles.pricePeriod}> /month</Text>
              )}
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={18} color={Colors.light.secondary} fill={Colors.light.secondary} />
              <Text style={styles.ratingText}>
                {property.rating} ({property.reviewsCount})
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{property.title}</Text>

          <TouchableOpacity style={styles.locationRow} onPress={handleGetDirections}>
            <MapPin size={16} color={Colors.light.textSecondary} />
            <Text style={styles.locationText}>{property.location.address}</Text>
            <Navigation size={14} color={Colors.light.primary} />
          </TouchableOpacity>

          <View style={styles.statsRow}>
            {property.bedrooms && (
              <View style={styles.statItem}>
                <Bed size={20} color={Colors.light.primary} />
                <Text style={styles.statText}>{property.bedrooms} Bedrooms</Text>
              </View>
            )}
            {property.bathrooms && (
              <View style={styles.statItem}>
                <Bath size={20} color={Colors.light.primary} />
                <Text style={styles.statText}>{property.bathrooms} Bathrooms</Text>
              </View>
            )}
            {property.area && (
              <View style={styles.statItem}>
                <Maximize size={20} color={Colors.light.primary} />
                <Text style={styles.statText}>
                  {property.area} {property.areaUnit}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this property</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features & Amenities</Text>
            <View style={styles.featuresGrid}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureChip}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed by</Text>
            <View style={styles.agentCard}>
              <Image
                source={{ uri: property.agentAvatar }}
                style={styles.agentAvatar}
              />
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{property.agentName}</Text>
                <Text style={styles.agentLabel}>Property Agent</Text>
              </View>
              <View style={styles.agentActions}>
                <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                  <Phone size={18} color={Colors.light.surface} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
                  <Mail size={18} color={Colors.light.surface} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{property.views}</Text>
              <Text style={styles.statsLabel}>Views</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{property.saves}</Text>
              <Text style={styles.statsLabel}>Saved</Text>
            </View>
            <View style={styles.statsCard}>
              <Text style={styles.statsNumber}>{property.reviewsCount}</Text>
              <Text style={styles.statsLabel}>Reviews</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Calendar size={20} color={Colors.light.surface} />
          <Text style={styles.bookButtonText}>
            {property.category === 'rental' ? 'Request Viewing' : 'Make Offer'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  imageSection: {
    position: 'relative',
    height: IMAGE_HEIGHT,
  },
  propertyImage: {
    width,
    height: IMAGE_HEIGHT,
  },
  imageIndicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  imageIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageIndicatorActive: {
    width: 20,
    backgroundColor: Colors.light.surface,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  topActions: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contentSection: {
    padding: 20,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  featuredText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  pricePeriod: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.light.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.textSecondary,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureChip: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  agentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  agentLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  agentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
});
