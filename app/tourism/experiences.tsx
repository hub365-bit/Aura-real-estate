import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, MapPin, Star, Clock, Users, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Experience, TourType } from '@/types';
import { useCurrencyConverter } from '@/contexts/TouristContext';

const MOCK_EXPERIENCES: Experience[] = [
  {
    id: '1',
    guideId: 'guide1',
    guideName: 'James Kimani',
    guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    title: 'Full Day Nairobi National Park Safari',
    description: 'Experience wildlife just minutes from the city center. See lions, rhinos, giraffes, and more!',
    type: 'safari',
    duration: 8,
    durationUnit: 'hours',
    location: {
      name: 'Nairobi National Park',
      city: 'Nairobi',
      country: 'Kenya',
      lat: -1.373,
      lng: 36.858,
    },
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600',
      'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=600',
    ],
    price: 150,
    currency: 'USD',
    maxGroupSize: 6,
    bookingOptions: ['private', 'group'],
    included: ['Park fees', 'Transport', 'Professional guide', 'Bottled water'],
    excluded: ['Lunch', 'Personal expenses', 'Tips'],
    cancellationPolicy: 'Free cancellation up to 24 hours before',
    rating: 4.9,
    reviewsCount: 234,
    languages: ['English', 'Swahili'],
    difficulty: 'easy',
  },
  {
    id: '2',
    guideId: 'guide2',
    guideName: 'Sarah Mwangi',
    guideAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    title: 'Nairobi Street Food & Market Tour',
    description: 'Taste authentic Kenyan cuisine and explore vibrant local markets',
    type: 'food',
    duration: 4,
    durationUnit: 'hours',
    location: {
      name: 'Nairobi CBD',
      city: 'Nairobi',
      country: 'Kenya',
      lat: -1.286,
      lng: 36.817,
    },
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    ],
    price: 65,
    currency: 'USD',
    maxGroupSize: 8,
    bookingOptions: ['group'],
    included: ['Food tastings', 'Local guide', 'Market entrance'],
    excluded: ['Transport', 'Additional purchases'],
    cancellationPolicy: 'Free cancellation up to 12 hours before',
    rating: 4.8,
    reviewsCount: 156,
    languages: ['English', 'Swahili'],
    difficulty: 'easy',
  },
];

export default function ExperiencesScreen() {
  const router = useRouter();
  const { formatPrice, convertToPreferred } = useCurrencyConverter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Experiences</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search experiences..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_EXPERIENCES.map((exp) => (
          <TouchableOpacity
            key={exp.id}
            style={styles.experienceCard}
            onPress={() => router.push(`/tourism/experience/${exp.id}` as any)}
          >
            <Image source={{ uri: exp.images[0] }} style={styles.experienceImage} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{exp.type.toUpperCase()}</Text>
            </View>
            <View style={styles.experienceContent}>
              <Text style={styles.experienceTitle}>{exp.title}</Text>
              <Text style={styles.experienceDescription} numberOfLines={2}>
                {exp.description}
              </Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={14} color={Colors.light.gray} />
                  <Text style={styles.metaText}>
                    {exp.duration} {exp.durationUnit}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Users size={14} color={Colors.light.gray} />
                  <Text style={styles.metaText}>Max {exp.maxGroupSize}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
                  <Text style={styles.metaText}>{exp.rating}</Text>
                  <Text style={styles.reviewsText}>({exp.reviewsCount})</Text>
                </View>
              </View>

              <View style={styles.footer}>
                <View style={styles.guideRow}>
                  <Image source={{ uri: exp.guideAvatar }} style={styles.guideAvatar} />
                  <Text style={styles.guideName}>{exp.guideName}</Text>
                  <Award size={14} color={Colors.light.primary} />
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {formatPrice(convertToPreferred(exp.price, exp.currency as any), 'USD')}
                  </Text>
                  <Text style={styles.priceUnit}>/person</Text>
                </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  experienceCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  experienceImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.border,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  experienceContent: {
    padding: 16,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: Colors.light.gray,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guideAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  guideName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: Colors.light.gray,
  },
});
