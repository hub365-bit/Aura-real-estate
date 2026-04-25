import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { Property } from '@/types';

const COMPARE_LIMIT = 3;

export default function CompareScreen() {
  const router = useRouter();
  const { allProperties, favorites } = useApp();
  const [selectedIds, setSelectedIds] = useState<string[]>(favorites.slice(0, 2));

  const selectedProperties = allProperties.filter((p) => selectedIds.includes(p.id));

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_LIMIT) return prev;
      return [...prev, id];
    });
  };

  const features = [
    { label: 'Price', key: 'price', format: (p: Property) => `${p.currency} ${p.price.toLocaleString()}` },
    { label: 'Type', key: 'type', format: (p: Property) => p.propertyType },
    { label: 'Bedrooms', key: 'bedrooms', format: (p: Property) => p.bedrooms?.toString() ?? '-' },
    { label: 'Bathrooms', key: 'bathrooms', format: (p: Property) => p.bathrooms?.toString() ?? '-' },
    { label: 'Area', key: 'area', format: (p: Property) => (p.area ? `${p.area} ${p.areaUnit}` : '-') },
    { label: 'Location', key: 'location', format: (p: Property) => p.location.city },
    { label: 'Rating', key: 'rating', format: (p: Property) => `${p.rating} (${p.reviewsCount})` },
    { label: 'Trust Score', key: 'trust', format: (p: Property) => (p.trustScore ? `${p.trustScore.score}/100` : '-') },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Listings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
        <View style={styles.selectorRow}>
          {allProperties.slice(0, 8).map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.selectorChip, isSelected && styles.selectorChipActive]}
                onPress={() => toggleSelection(p.id)}
              >
                <Image source={{ uri: p.images[0] }} style={styles.selectorImage} />
                <Text style={[styles.selectorText, isSelected && styles.selectorTextActive]} numberOfLines={1}>
                  {p.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {selectedProperties.length < 2 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Select at least 2 listings</Text>
          <Text style={styles.emptyText}>Tap chips above to compare properties side by side</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.comparisonTable}>
            <View style={styles.tableRow}>
              <View style={styles.labelCell} />
              {selectedProperties.map((p) => (
                <View key={p.id} style={styles.propertyCell}>
                  <Image source={{ uri: p.images[0] }} style={styles.propertyImage} />
                  <Text style={styles.propertyTitle} numberOfLines={2}>{p.title}</Text>
                </View>
              ))}
            </View>

            {features.map((feature) => (
              <View key={feature.key} style={[styles.tableRow, styles.dataRow]}>
                <View style={styles.labelCell}>
                  <Text style={styles.labelText}>{feature.label}</Text>
                </View>
                {selectedProperties.map((p) => (
                  <View key={p.id} style={styles.propertyCell}>
                    <Text style={styles.valueText}>{feature.format(p)}</Text>
                  </View>
                ))}
              </View>
            ))}

            <View style={[styles.tableRow, styles.dataRow]}>
              <View style={styles.labelCell}>
                <Text style={styles.labelText}>Features</Text>
              </View>
              {selectedProperties.map((p) => (
                <View key={p.id} style={styles.propertyCell}>
                  {p.features.slice(0, 4).map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <Check size={12} color={Colors.light.success} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
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
  selectorScroll: {
    maxHeight: 100,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  selectorRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  selectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  selectorChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  selectorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
    maxWidth: 120,
  },
  selectorTextActive: {
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  comparisonTable: {
    padding: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingVertical: 12,
  },
  dataRow: {
    alignItems: 'center',
  },
  labelCell: {
    width: 100,
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  propertyCell: {
    flex: 1,
    paddingHorizontal: 8,
    minWidth: 120,
  },
  propertyImage: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  valueText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
