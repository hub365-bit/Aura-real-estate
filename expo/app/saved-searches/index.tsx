import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Trash2, Search, MapPin, Home, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SavedSearch } from '@/types';

const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: '1',
    userId: 'u1',
    type: 'property',
    name: 'Nairobi Apartments',
    filters: { city: 'Nairobi', propertyType: 'apartment', minPrice: 30000, maxPrice: 80000 },
    alertsEnabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'u1',
    type: 'hotel',
    name: 'Mombasa Beach Hotels',
    filters: { city: 'Mombasa', category: 'hospitality' },
    alertsEnabled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'u1',
    type: 'experience',
    name: 'Safari Tours',
    filters: { searchQuery: 'safari' },
    alertsEnabled: true,
    createdAt: new Date().toISOString(),
  },
];

export default function SavedSearchesScreen() {
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);

  const toggleAlert = (id: string) => {
    setSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alertsEnabled: !s.alertsEnabled } : s))
    );
  };

  const deleteSearch = (id: string) => {
    setSearches((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Searches</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searches.length === 0 ? (
          <View style={styles.emptyState}>
            <Search size={64} color={Colors.light.gray} />
            <Text style={styles.emptyTitle}>No saved searches</Text>
            <Text style={styles.emptyText}>Save your favorite filters to get alerts when new listings match</Text>
          </View>
        ) : (
          searches.map((search) => (
            <View key={search.id} style={styles.searchCard}>
              <View style={styles.searchHeader}>
                <View style={styles.searchIconContainer}>
                  <Search size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.searchInfo}>
                  <Text style={styles.searchName}>{search.name}</Text>
                  <Text style={styles.searchType}>{search.type.toUpperCase()}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteSearch(search.id)} style={styles.deleteButton}>
                  <Trash2 size={18} color={Colors.light.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.filtersRow}>
                {search.filters.city && (
                  <View style={styles.filterChip}>
                    <MapPin size={12} color={Colors.light.primary} />
                    <Text style={styles.filterChipText}>{search.filters.city}</Text>
                  </View>
                )}
                {search.filters.propertyType && (
                  <View style={styles.filterChip}>
                    <Home size={12} color={Colors.light.primary} />
                    <Text style={styles.filterChipText}>{search.filters.propertyType}</Text>
                  </View>
                )}
                {search.filters.minPrice && (
                  <View style={styles.filterChip}>
                    <DollarSign size={12} color={Colors.light.primary} />
                    <Text style={styles.filterChipText}>
                      {search.filters.minPrice.toLocaleString()} - {search.filters.maxPrice?.toLocaleString()}
                    </Text>
                  </View>
                )}
                {search.filters.searchQuery && (
                  <View style={styles.filterChip}>
                    <Search size={12} color={Colors.light.primary} />
                    <Text style={styles.filterChipText}>{search.filters.searchQuery}</Text>
                  </View>
                )}
              </View>

              <View style={styles.alertRow}>
                <View style={styles.alertLabel}>
                  <Bell size={16} color={Colors.light.secondary} />
                  <Text style={styles.alertText}>Alert notifications</Text>
                </View>
                <Switch
                  value={search.alertsEnabled}
                  onValueChange={() => toggleAlert(search.id)}
                  trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          ))
        )}
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
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  searchCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  searchType: {
    fontSize: 12,
    color: Colors.light.gray,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingTop: 12,
  },
  alertLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
