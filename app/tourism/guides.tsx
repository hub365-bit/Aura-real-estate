import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, MapPin, Star, Award, Languages } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { TourGuide, TourType } from '@/types';
import { useCurrencyConverter } from '@/contexts/TouristContext';

const MOCK_GUIDES: TourGuide[] = [
  {
    id: '1',
    userId: 'guide1',
    name: 'James Kimani',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    verifiedId: true,
    tourismLicense: 'KT-2024-001',
    languages: ['English', 'Swahili', 'German'],
    expertise: ['Safari Tours', 'Wildlife Photography', 'Cultural Tours'],
    yearsExperience: 8,
    rating: 4.9,
    reviewsCount: 127,
    trustScore: {
      score: 95,
      level: 'verified',
      verifiedId: true,
      verifiedBusiness: true,
      completedBookings: 340,
      avgResponseTime: 15,
      cancellationRate: 0.02,
      disputeCount: 0,
      lastUpdated: new Date().toISOString(),
    },
    bio: 'Passionate wildlife guide with 8 years experience. Specialized in safari adventures across Kenya.',
    location: 'Nairobi, Kenya',
    priceRange: { min: 100, max: 500, currency: 'USD' },
  },
  {
    id: '2',
    userId: 'guide2',
    name: 'Sarah Mwangi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    verifiedId: true,
    languages: ['English', 'Swahili', 'French'],
    expertise: ['Cultural Tours', 'Food Tours', 'City Tours'],
    yearsExperience: 5,
    rating: 4.8,
    reviewsCount: 89,
    trustScore: {
      score: 92,
      level: 'verified',
      verifiedId: true,
      verifiedBusiness: true,
      completedBookings: 215,
      avgResponseTime: 20,
      cancellationRate: 0.03,
      disputeCount: 0,
      lastUpdated: new Date().toISOString(),
    },
    bio: 'Local food and culture expert. Let me show you the real Nairobi!',
    location: 'Nairobi, Kenya',
    priceRange: { min: 50, max: 200, currency: 'USD' },
  },
];

const TOUR_CATEGORIES = [
  { value: 'safari' as TourType, label: 'Safari', icon: '🦁' },
  { value: 'city' as TourType, label: 'City', icon: '🏙️' },
  { value: 'cultural' as TourType, label: 'Cultural', icon: '🏛️' },
  { value: 'food' as TourType, label: 'Food', icon: '🍽️' },
  { value: 'hiking' as TourType, label: 'Hiking', icon: '⛰️' },
  { value: 'nightlife' as TourType, label: 'Nightlife', icon: '🎉' },
];

export default function TourGuidesScreen() {
  const router = useRouter();
  const { formatPrice, convertToPreferred } = useCurrencyConverter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TourType | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tour Guides</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guides..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categories}>
          {TOUR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryChip,
                selectedCategory === cat.value && styles.categoryChipActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === cat.value ? null : cat.value)
              }
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.value && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_GUIDES.map((guide) => (
          <TouchableOpacity
            key={guide.id}
            style={styles.guideCard}
            onPress={() => router.push(`/tourism/guide/${guide.id}` as any)}
          >
            <Image source={{ uri: guide.avatar }} style={styles.avatar} />
            <View style={styles.guideInfo}>
              <View style={styles.guideHeader}>
                <View style={styles.nameRow}>
                  <Text style={styles.guideName}>{guide.name}</Text>
                  {guide.verifiedId && (
                    <View style={styles.verifiedBadge}>
                      <Award size={14} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={styles.ratingRow}>
                  <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
                  <Text style={styles.ratingText}>{guide.rating}</Text>
                  <Text style={styles.reviewsText}>({guide.reviewsCount})</Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.light.gray} />
                <Text style={styles.locationText}>{guide.location}</Text>
              </View>

              <View style={styles.languagesRow}>
                <Languages size={14} color={Colors.light.gray} />
                <Text style={styles.languagesText}>{guide.languages.join(', ')}</Text>
              </View>

              <View style={styles.expertiseRow}>
                {guide.expertise.slice(0, 2).map((exp, idx) => (
                  <View key={idx} style={styles.expertiseTag}>
                    <Text style={styles.expertiseText}>{exp}</Text>
                  </View>
                ))}
                {guide.expertise.length > 2 && (
                  <Text style={styles.moreText}>+{guide.expertise.length - 2}</Text>
                )}
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>From</Text>
                <Text style={styles.priceAmount}>
                  {formatPrice(
                    convertToPreferred(guide.priceRange.min, guide.priceRange.currency as any),
                    'USD'
                  )}
                </Text>
                <Text style={styles.priceUnit}>/tour</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  categoriesScroll: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  categoryLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  guideCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  guideInfo: {
    flex: 1,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guideName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 13,
    color: Colors.light.gray,
  },
  languagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  languagesText: {
    fontSize: 13,
    color: Colors.light.gray,
  },
  expertiseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  expertiseTag: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  expertiseText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  moreText: {
    fontSize: 11,
    color: Colors.light.gray,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: Colors.light.gray,
  },
});
