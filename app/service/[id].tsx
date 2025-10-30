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
  Phone,
  Mail,
  Navigation,
  Clock,
  Award,
  Users,
  Calendar,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.35;

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export default function ServiceProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { allServiceProviders, toggleFollow, isFollowing } = useApp();

  const provider = allServiceProviders.find((p) => p.id === id);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  if (!provider) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service provider not found</Text>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${provider.owner.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${provider.owner.email}`);
  };

  const handleGetDirections = () => {
    const { lat, lng } = provider.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    console.log('Share provider:', provider.id);
  };

  const handleBookService = (serviceId: string) => {
    router.push(`/booking/service/${provider.id}/${serviceId}` as any);
  };

  const getTodayHours = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = provider.workingHours[today as keyof typeof provider.workingHours];
    if (todayHours.closed) {
      return 'Closed today';
    }
    return `Open: ${todayHours.open} - ${todayHours.close}`;
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
            {provider.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.providerImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={styles.imageIndicatorContainer}>
            {provider.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  currentImageIndex === index && styles.imageIndicatorActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.light.text} />
          </TouchableOpacity>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleFollow(provider.id)}
            >
              <Heart
                size={22}
                color={isFollowing(provider.id) ? Colors.light.error : Colors.light.text}
                fill={isFollowing(provider.id) ? Colors.light.error : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={22} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSection}>
          {provider.boosted && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>⭐ Featured Business</Text>
            </View>
          )}

          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.businessName}>{provider.businessName}</Text>
              <Text style={styles.category}>{provider.category}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={20} color={Colors.light.secondary} fill={Colors.light.secondary} />
              <Text style={styles.ratingText}>
                {provider.rating} ({provider.reviewsCount})
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.locationRow} onPress={handleGetDirections}>
            <MapPin size={16} color={Colors.light.textSecondary} />
            <Text style={styles.locationText}>{provider.location.address}</Text>
            <Navigation size={14} color={Colors.light.primary} />
          </TouchableOpacity>

          <View style={styles.hoursRow}>
            <Clock size={16} color={Colors.light.textSecondary} />
            <Text style={styles.hoursText}>{getTodayHours()}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={18} color={Colors.light.primary} />
              <Text style={styles.statText}>{provider.followersCount} followers</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={18} color={Colors.light.primary} />
              <Text style={styles.statText}>{provider.reviewsCount} reviews</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{provider.description}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            {provider.services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  <View style={styles.serviceMetaRow}>
                    <Text style={styles.servicePrice}>
                      {service.currency} {service.price.toLocaleString()}
                    </Text>
                    {service.duration && (
                      <View style={styles.serviceDuration}>
                        <Clock size={12} color={Colors.light.textSecondary} />
                        <Text style={styles.serviceDurationText}>
                          {service.duration} {service.durationUnit}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.bookServiceButton}
                  onPress={() => handleBookService(service.id)}
                >
                  <Calendar size={16} color={Colors.light.surface} />
                  <Text style={styles.bookServiceText}>Book</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            <View style={styles.hoursTable}>
              {DAYS_OF_WEEK.map((day) => {
                const hours = provider.workingHours[day];
                return (
                  <View key={day} style={styles.hoursRow2}>
                    <Text style={styles.dayText}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <Text style={styles.hoursText2}>
                      {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Owner</Text>
            <View style={styles.ownerCard}>
              <Image source={{ uri: provider.owner.avatar }} style={styles.ownerAvatar} />
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{provider.owner.name}</Text>
                {provider.owner.verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                )}
              </View>
              <View style={styles.ownerActions}>
                <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                  <Phone size={18} color={Colors.light.surface} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
                  <Mail size={18} color={Colors.light.surface} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
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
  providerImage: {
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  category: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  serviceDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  serviceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceDurationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  bookServiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
  },
  bookServiceText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  hoursTable: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  hoursRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  hoursText2: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  ownerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  ownerActions: {
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
});
