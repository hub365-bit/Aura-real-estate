import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Star, MapPin, Zap, Car, Coffee, Accessibility, Heart, Users, Leaf } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Room, RoomTag } from '@/types';
import { useCurrencyConverter } from '@/contexts/TouristContext';

interface Hotel {
  id: string;
  name: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  location: { city: string; address: string };
  price: number;
  currency: string;
  tags: string[];
  amenities: string[];
  rooms: Room[];
  airportPickup: boolean;
  breakfastIncluded: boolean;
  wifiQuality: 'basic' | 'good' | 'excellent';
  powerBackup: boolean;
  ecoFriendly: boolean;
  familyFriendly: boolean;
  coupleFriendly: boolean;
  accessibilityOptions: boolean;
}

const MOCK_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'Sarova Stanley',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'],
    rating: 4.8,
    reviewsCount: 342,
    location: { city: 'Nairobi', address: 'Kimathi Street' },
    price: 180,
    currency: 'USD',
    tags: ['luxury', 'historic', 'city-center'],
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'],
    rooms: [
      { id: 'r1', hotelId: 'h1', name: 'Deluxe Room', description: 'City view with balcony', price: 180, currency: 'USD', capacity: 2, bedrooms: 1, bathrooms: 1, tags: ['balcony', 'work_friendly'], amenities: ['WiFi', 'TV', 'Minibar'], available: true, images: [] },
      { id: 'r2', hotelId: 'h1', name: 'Ocean Suite', description: 'Panoramic ocean view', price: 350, currency: 'USD', capacity: 2, bedrooms: 1, bathrooms: 1, tags: ['ocean_view', 'honeymoon'], amenities: ['WiFi', 'TV', 'Jacuzzi'], available: true, images: [] },
    ],
    airportPickup: true,
    breakfastIncluded: true,
    wifiQuality: 'excellent',
    powerBackup: true,
    ecoFriendly: true,
    familyFriendly: true,
    coupleFriendly: true,
    accessibilityOptions: true,
  },
  {
    id: 'h2',
    name: 'The Reef Hotel',
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400'],
    rating: 4.5,
    reviewsCount: 189,
    location: { city: 'Mombasa', address: 'Nyali Beach' },
    price: 120,
    currency: 'USD',
    tags: ['beach', 'resort', 'family'],
    amenities: ['Beach Access', 'Pool', 'Water Sports'],
    rooms: [
      { id: 'r3', hotelId: 'h2', name: 'Garden Room', description: 'Quiet garden facing', price: 120, currency: 'USD', capacity: 2, bedrooms: 1, bathrooms: 1, tags: ['quiet'], amenities: ['WiFi', 'TV'], available: true, images: [] },
    ],
    airportPickup: false,
    breakfastIncluded: true,
    wifiQuality: 'good',
    powerBackup: true,
    ecoFriendly: false,
    familyFriendly: true,
    coupleFriendly: true,
    accessibilityOptions: false,
  },
];

const ROOM_TAG_LABELS: Record<RoomTag, string> = {
  ocean_view: 'Ocean View',
  balcony: 'Balcony',
  quiet: 'Quiet Room',
  honeymoon: 'Honeymoon Suite',
  work_friendly: 'Work Friendly',
};

export default function HotelsScreen() {
  const router = useRouter();
  const { formatPrice, convertToPreferred } = useCurrencyConverter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filters = [
    { id: 'airportPickup', label: 'Airport Pickup', icon: Car },
    { id: 'breakfastIncluded', label: 'Breakfast', icon: Coffee },
    { id: 'powerBackup', label: 'Power Backup', icon: Zap },
    { id: 'ecoFriendly', label: 'Eco Friendly', icon: Leaf },
    { id: 'familyFriendly', label: 'Family', icon: Users },
    { id: 'coupleFriendly', label: 'Couple', icon: Heart },
    { id: 'accessibilityOptions', label: 'Accessible', icon: Accessibility },
  ];

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filteredHotels = MOCK_HOTELS.filter((hotel) => {
    if (searchQuery && !hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) && !hotel.location.city.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return activeFilters.every((f) => (hotel as any)[f] === true);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hotels & Stays</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotels..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        <View style={styles.filtersRow}>
          {filters.map((f) => {
            const Icon = f.icon;
            const isActive = activeFilters.includes(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => toggleFilter(f.id)}
              >
                <Icon size={14} color={isActive ? '#fff' : Colors.light.primary} />
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredHotels.map((hotel) => (
          <TouchableOpacity key={hotel.id} style={styles.hotelCard}>
            <Image source={{ uri: hotel.images[0] }} style={styles.hotelImage} />
            <View style={styles.hotelContent}>
              <View style={styles.hotelHeader}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <View style={styles.ratingBadge}>
                  <Star size={14} color={Colors.light.warning} fill={Colors.light.warning} />
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
                </View>
              </View>
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.light.gray} />
                <Text style={styles.locationText}>{hotel.location.city}</Text>
              </View>
              <View style={styles.amenitiesRow}>
                {hotel.amenities.slice(0, 3).map((a, i) => (
                  <View key={i} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>{a}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.roomsPreview}>
                {hotel.rooms.slice(0, 2).map((room) => (
                  <View key={room.id} style={styles.roomRow}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <View style={styles.roomTags}>
                      {room.tags.map((tag) => (
                        <View key={tag} style={styles.roomTag}>
                          <Text style={styles.roomTagText}>{ROOM_TAG_LABELS[tag]}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.roomPrice}>
                      {formatPrice(convertToPreferred(room.price, room.currency as 'USD'), 'USD')}
                    </Text>
                  </View>
                ))}
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  placeholder: { width: 32 },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  searchInput: { flex: 1, fontSize: 16, color: Colors.light.text },
  filtersScroll: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    maxHeight: 64,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: { fontSize: 13, fontWeight: '600', color: Colors.light.primary },
  filterChipTextActive: { color: '#fff' },
  content: { flex: 1, padding: 20 },
  hotelCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  hotelImage: { width: '100%', height: 180 },
  hotelContent: { padding: 16 },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelName: { fontSize: 18, fontWeight: '700', color: Colors.light.text, flex: 1 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.warning + '15',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { fontSize: 14, fontWeight: '700', color: Colors.light.warning },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  locationText: { fontSize: 13, color: Colors.light.gray },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  amenityChip: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  amenityText: { fontSize: 12, color: Colors.light.textSecondary },
  roomsPreview: { gap: 10, borderTopWidth: 1, borderTopColor: Colors.light.borderLight, paddingTop: 12 },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
  },
  roomName: { fontSize: 14, fontWeight: '600', color: Colors.light.text, flex: 1 },
  roomTags: { flexDirection: 'row', gap: 6, marginHorizontal: 8 },
  roomTag: {
    backgroundColor: Colors.light.primary + '15',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  roomTagText: { fontSize: 10, color: Colors.light.primary, fontWeight: '600' },
  roomPrice: { fontSize: 14, fontWeight: '700', color: Colors.light.primary },
});
