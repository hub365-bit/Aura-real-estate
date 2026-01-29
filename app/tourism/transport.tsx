import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Car, Users, Briefcase, Star, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Transport, TransportType } from '@/types';
import { useCurrencyConverter } from '@/contexts/TouristContext';

const MOCK_TRANSPORTS: Transport[] = [
  {
    id: '1',
    providerId: 'provider1',
    providerName: 'Nairobi Transfers',
    type: 'airport_pickup',
    vehicleType: 'Sedan',
    driverName: 'John Ochieng',
    driverRating: 4.9,
    luggageCapacity: 3,
    passengerCapacity: 4,
    price: 35,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600'],
    amenities: ['AC', 'WiFi', 'Water'],
    availability: true,
  },
  {
    id: '2',
    providerId: 'provider2',
    providerName: 'Safari Wheels',
    type: 'tour_van',
    vehicleType: 'Van',
    driverName: 'Peter Mwangi',
    driverRating: 4.8,
    luggageCapacity: 8,
    passengerCapacity: 10,
    price: 120,
    currency: 'USD',
    pricePerKm: 2,
    images: ['https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=600'],
    amenities: ['AC', 'WiFi', 'Cooler', 'First Aid'],
    availability: true,
  },
];

const TRANSPORT_TYPES = [
  { value: 'airport_pickup' as TransportType, label: 'Airport Transfer', icon: '✈️' },
  { value: 'car_hire' as TransportType, label: 'Car Hire', icon: '🚗' },
  { value: 'tour_van' as TransportType, label: 'Tour Van', icon: '🚐' },
  { value: 'boda' as TransportType, label: 'Boda Boda', icon: '🏍️' },
  { value: 'tuk_tuk' as TransportType, label: 'Tuk Tuk', icon: '🛺' },
];

export default function TransportScreen() {
  const router = useRouter();
  const { formatPrice, convertToPreferred } = useCurrencyConverter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TransportType | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transport & Transfers</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesScroll}>
        <View style={styles.types}>
          {TRANSPORT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeChip,
                selectedType === type.value && styles.typeChipActive,
              ]}
              onPress={() =>
                setSelectedType(selectedType === type.value ? null : type.value)
              }
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type.value && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {MOCK_TRANSPORTS.map((transport) => (
          <TouchableOpacity
            key={transport.id}
            style={styles.transportCard}
            onPress={() => {}}
          >
            <Image source={{ uri: transport.images[0] }} style={styles.vehicleImage} />
            <View style={styles.transportContent}>
              <View style={styles.transportHeader}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleType}>{transport.vehicleType}</Text>
                  <Text style={styles.providerName}>{transport.providerName}</Text>
                </View>
                {transport.availability && (
                  <View style={styles.availableBadge}>
                    <CheckCircle size={14} color={Colors.light.success} />
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                )}
              </View>

              <View style={styles.driverRow}>
                <Text style={styles.driverLabel}>Driver:</Text>
                <Text style={styles.driverName}>{transport.driverName}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={12} color={Colors.light.warning} fill={Colors.light.warning} />
                  <Text style={styles.ratingText}>{transport.driverRating}</Text>
                </View>
              </View>

              <View style={styles.specs}>
                <View style={styles.specItem}>
                  <Users size={16} color={Colors.light.gray} />
                  <Text style={styles.specText}>{transport.passengerCapacity} passengers</Text>
                </View>
                <View style={styles.specItem}>
                  <Briefcase size={16} color={Colors.light.gray} />
                  <Text style={styles.specText}>{transport.luggageCapacity} bags</Text>
                </View>
              </View>

              <View style={styles.amenitiesRow}>
                {transport.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {formatPrice(
                      convertToPreferred(transport.price, transport.currency as any),
                      'USD'
                    )}
                  </Text>
                  {transport.pricePerKm && (
                    <Text style={styles.priceUnit}>
                      +{formatPrice(convertToPreferred(transport.pricePerKm, transport.currency as any), 'USD')}/km
                    </Text>
                  )}
                </View>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
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
  typesScroll: {
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  types: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  typeChipActive: {
    backgroundColor: Colors.light.primary,
  },
  typeIcon: {
    fontSize: 16,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  typeLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  transportCard: {
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
  vehicleImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.light.border,
  },
  transportContent: {
    padding: 16,
  },
  transportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.success,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  driverLabel: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  specs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 13,
    color: Colors.light.gray,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  amenityTag: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  amenityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  priceUnit: {
    fontSize: 12,
    color: Colors.light.gray,
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
