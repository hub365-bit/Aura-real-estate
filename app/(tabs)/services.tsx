import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, Star, Heart } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { ServiceProvider } from '@/types';

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getFilteredServiceProviders, toggleFollow, isFollowing } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const providers = useMemo(
    () => getFilteredServiceProviders(searchQuery),
    [searchQuery, getFilteredServiceProviders]
  );

  const handleProviderPress = (provider: ServiceProvider) => {
    router.push(`/service/${provider.id}` as any);
  };

  const handleToggleFollow = (providerId: string) => {
    toggleFollow(providerId);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSubtitle}>Find trusted professionals</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            style={styles.card}
            onPress={() => handleProviderPress(provider)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: provider.images[0] }}
              style={styles.providerImage}
              resizeMode="cover"
            />
            {provider.boosted && (
              <View style={styles.boostedBadge}>
                <Text style={styles.boostedText}>Featured</Text>
              </View>
            )}

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.businessName} numberOfLines={1}>
                    {provider.businessName}
                  </Text>
                  <Text style={styles.category}>{provider.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleToggleFollow(provider.id)}
                >
                  <Heart
                    size={18}
                    color={
                      isFollowing(provider.id) ? Colors.light.error : Colors.light.textSecondary
                    }
                    fill={isFollowing(provider.id) ? Colors.light.error : 'transparent'}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {provider.description}
              </Text>

              <View style={styles.locationRow}>
                <MapPin size={12} color={Colors.light.textSecondary} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {provider.location.city}
                </Text>
              </View>

              <View style={styles.footer}>
                <View style={styles.ratingContainer}>
                  <Star size={14} color={Colors.light.secondary} fill={Colors.light.secondary} />
                  <Text style={styles.ratingText}>
                    {provider.rating} ({provider.reviewsCount})
                  </Text>
                </View>
                <Text style={styles.followersText}>{provider.followersCount} followers</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  providerImage: {
    width: '100%',
    height: 180,
  },
  boostedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  boostedText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  followButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.light.background,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  followersText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
