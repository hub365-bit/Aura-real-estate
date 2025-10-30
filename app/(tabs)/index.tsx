import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, MapPin, Heart, Star } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { Property, FilterOptions } from '@/types';
import FiltersModal from '@/app/modals/filters';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function PropertiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getFilteredProperties, toggleFavorite, isFavorite } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'rental' | 'sale'>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({});

  const filters = useMemo<FilterOptions>(() => {
    const base: FilterOptions = {
      searchQuery,
      ...advancedFilters,
    };
    if (selectedCategory !== 'all') {
      base.category = selectedCategory;
    }
    return base;
  }, [searchQuery, selectedCategory, advancedFilters]);

  const properties = useMemo(() => getFilteredProperties(filters), [filters, getFilteredProperties]);

  const handlePropertyPress = (property: Property) => {
    router.push(`/property/${property.id}` as any);
  };

  const handleToggleFavorite = (propertyId: string) => {
    toggleFavorite(propertyId);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setAdvancedFilters(newFilters);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your perfect place</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search properties..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {['all', 'rental', 'sale'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat as 'all' | 'rental' | 'sale')}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat && styles.categoryChipTextActive,
              ]}
            >
              {cat === 'all' ? 'All' : cat === 'rental' ? 'For Rent' : 'For Sale'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {properties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.card}
              onPress={() => handlePropertyPress(property)}
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: property.images[0] }}
                  style={styles.propertyImage}
                  resizeMode="cover"
                />
                {property.boosted && (
                  <View style={styles.boostedBadge}>
                    <Text style={styles.boostedText}>Featured</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(property.id)}
                >
                  <Heart
                    size={20}
                    color={isFavorite(property.id) ? Colors.light.error : Colors.light.surface}
                    fill={isFavorite(property.id) ? Colors.light.error : 'transparent'}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {property.title}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color={Colors.light.textSecondary} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {property.location.city}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  {property.bedrooms && (
                    <Text style={styles.detailText}>{property.bedrooms} BD</Text>
                  )}
                  {property.bathrooms && (
                    <>
                      <Text style={styles.detailDivider}>•</Text>
                      <Text style={styles.detailText}>{property.bathrooms} BA</Text>
                    </>
                  )}
                  {property.area && (
                    <>
                      <Text style={styles.detailDivider}>•</Text>
                      <Text style={styles.detailText}>
                        {property.area} {property.areaUnit}
                      </Text>
                    </>
                  )}
                </View>

                <View style={styles.footer}>
                  <Text style={styles.price}>
                    {property.currency} {property.price.toLocaleString()}
                    {property.category === 'rental' && (
                      <Text style={styles.pricePeriod}>/mo</Text>
                    )}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color={Colors.light.secondary} fill={Colors.light.secondary} />
                    <Text style={styles.ratingText}>{property.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        initialFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
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
    gap: 12,
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
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: Colors.light.surface,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  boostedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  boostedText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  detailDivider: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginHorizontal: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  pricePeriod: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.light.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
});
