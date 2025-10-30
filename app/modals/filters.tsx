import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Home,
  Building,
  Store,
  MapPin,
  DollarSign,
  Bed,
  Bath,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { FilterOptions, PropertyType } from '@/types';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  initialFilters?: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

export default function FiltersModal({
  visible,
  onClose,
  initialFilters = {},
  onApplyFilters,
}: FiltersModalProps) {
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<'rental' | 'sale' | undefined>(
    initialFilters.category === 'rental' || initialFilters.category === 'sale'
      ? initialFilters.category
      : undefined
  );
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>(
    initialFilters.propertyType
  );
  const [city, setCity] = useState<string>(initialFilters.city || '');
  const [minPrice, setMinPrice] = useState<string>(
    initialFilters.minPrice?.toString() || ''
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialFilters.maxPrice?.toString() || ''
  );
  const [bedrooms, setBedrooms] = useState<number | undefined>(initialFilters.bedrooms);
  const [bathrooms, setBathrooms] = useState<number | undefined>(initialFilters.bathrooms);

  const propertyTypes: { value: PropertyType; label: string; icon: any }[] = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'office', label: 'Office', icon: Store },
    { value: 'land', label: 'Land', icon: MapPin },
    { value: 'commercial', label: 'Commercial', icon: Building },
  ];

  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4];

  const handleReset = () => {
    setCategory(undefined);
    setPropertyType(undefined);
    setCity('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms(undefined);
    setBathrooms(undefined);
  };

  const handleApply = () => {
    const filters: FilterOptions = {};

    if (category) filters.category = category;
    if (propertyType) filters.propertyType = propertyType;
    if (city) filters.city = city;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (bedrooms) filters.bedrooms = bedrooms;
    if (bathrooms) filters.bathrooms = bathrooms;

    onApplyFilters(filters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listing Type</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionChip,
                  category === 'rental' && styles.optionChipActive,
                ]}
                onPress={() => setCategory(category === 'rental' ? undefined : 'rental')}
              >
                <Text
                  style={[
                    styles.optionText,
                    category === 'rental' && styles.optionTextActive,
                  ]}
                >
                  For Rent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionChip,
                  category === 'sale' && styles.optionChipActive,
                ]}
                onPress={() => setCategory(category === 'sale' ? undefined : 'sale')}
              >
                <Text
                  style={[
                    styles.optionText,
                    category === 'sale' && styles.optionTextActive,
                  ]}
                >
                  For Sale
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Type</Text>
            <View style={styles.propertyTypesGrid}>
              {propertyTypes.map((type) => {
                const Icon = type.icon;
                const isActive = propertyType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.propertyTypeCard,
                      isActive && styles.propertyTypeCardActive,
                    ]}
                    onPress={() =>
                      setPropertyType(isActive ? undefined : type.value)
                    }
                  >
                    <Icon
                      size={24}
                      color={isActive ? Colors.light.surface : Colors.light.primary}
                    />
                    <Text
                      style={[
                        styles.propertyTypeText,
                        isActive && styles.propertyTypeTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.inputWrapper}>
              <MapPin size={18} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter city or area..."
                placeholderTextColor={Colors.light.textSecondary}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.priceRow}>
              <View style={[styles.inputWrapper, styles.priceInput]}>
                <DollarSign size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.priceSeparator}>-</Text>
              <View style={[styles.inputWrapper, styles.priceInput]}>
                <DollarSign size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bed size={20} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Bedrooms</Text>
            </View>
            <View style={styles.optionsRow}>
              {bedroomOptions.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberChip,
                    bedrooms === num && styles.numberChipActive,
                  ]}
                  onPress={() => setBedrooms(bedrooms === num ? undefined : num)}
                >
                  <Text
                    style={[
                      styles.numberText,
                      bedrooms === num && styles.numberTextActive,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.numberChip,
                  bedrooms && bedrooms > 5 && styles.numberChipActive,
                ]}
                onPress={() => setBedrooms(bedrooms && bedrooms > 5 ? undefined : 6)}
              >
                <Text
                  style={[
                    styles.numberText,
                    bedrooms && bedrooms > 5 && styles.numberTextActive,
                  ]}
                >
                  5+
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bath size={20} color={Colors.light.primary} />
              <Text style={styles.sectionTitle}>Bathrooms</Text>
            </View>
            <View style={styles.optionsRow}>
              {bathroomOptions.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberChip,
                    bathrooms === num && styles.numberChipActive,
                  ]}
                  onPress={() => setBathrooms(bathrooms === num ? undefined : num)}
                >
                  <Text
                    style={[
                      styles.numberText,
                      bathrooms === num && styles.numberTextActive,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.numberChip,
                  bathrooms && bathrooms > 4 && styles.numberChipActive,
                ]}
                onPress={() => setBathrooms(bathrooms && bathrooms > 4 ? undefined : 5)}
              >
                <Text
                  style={[
                    styles.numberText,
                    bathrooms && bathrooms > 4 && styles.numberTextActive,
                  ]}
                >
                  4+
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingBottom: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionChip: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  optionChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  optionTextActive: {
    color: Colors.light.surface,
  },
  propertyTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propertyTypeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  propertyTypeCardActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  propertyTypeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  propertyTypeTextActive: {
    color: Colors.light.surface,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.textSecondary,
  },
  numberChip: {
    width: 60,
    height: 48,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  numberTextActive: {
    color: Colors.light.surface,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  applyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
});
