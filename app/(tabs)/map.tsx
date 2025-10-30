import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, Navigation, X, Home, Briefcase } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import * as MapComponents from '@/components/MapComponents';

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { allProperties, allServiceProviders } = useApp();
  const mapRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'property' | 'service';
    id: string;
  } | null>(null);
  const [showType, setShowType] = useState<'all' | 'properties' | 'services'>('all');

  const nairobiRegion = {
    latitude: -1.2864,
    longitude: 36.8172,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  };

  const filteredProperties =
    showType === 'services'
      ? []
      : allProperties.filter(
          (p) =>
            !searchQuery ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.city.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const filteredProviders =
    showType === 'properties'
      ? []
      : allServiceProviders.filter(
          (p) =>
            !searchQuery ||
            p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.city.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleMarkerPress = (type: 'property' | 'service', id: string) => {
    setSelectedMarker({ type, id });
  };

  const handleNavigateToDetail = () => {
    if (!selectedMarker) return;
    if (selectedMarker.type === 'property') {
      router.push(`/property/${selectedMarker.id}` as any);
    } else {
      router.push(`/service/${selectedMarker.id}` as any);
    }
  };

  const getSelectedItem = () => {
    if (!selectedMarker) return null;
    if (selectedMarker.type === 'property') {
      return allProperties.find((p) => p.id === selectedMarker.id);
    }
    return allServiceProviders.find((p) => p.id === selectedMarker.id);
  };

  const selectedItem = getSelectedItem();

  const handleCenterMap = () => {
    mapRef.current?.animateToRegion(nairobiRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Explore Map</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search on map..."
            placeholderTextColor={Colors.light.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, showType === 'all' && styles.filterChipActive]}
          onPress={() => setShowType('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              showType === 'all' && styles.filterChipTextActive,
            ]}
          >
            All ({allProperties.length + allServiceProviders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, showType === 'properties' && styles.filterChipActive]}
          onPress={() => setShowType('properties')}
        >
          <Home
            size={14}
            color={showType === 'properties' ? Colors.light.surface : Colors.light.text}
          />
          <Text
            style={[
              styles.filterChipText,
              showType === 'properties' && styles.filterChipTextActive,
            ]}
          >
            Properties ({allProperties.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, showType === 'services' && styles.filterChipActive]}
          onPress={() => setShowType('services')}
        >
          <Briefcase
            size={14}
            color={showType === 'services' ? Colors.light.surface : Colors.light.text}
          />
          <Text
            style={[
              styles.filterChipText,
              showType === 'services' && styles.filterChipTextActive,
            ]}
          >
            Services ({allServiceProviders.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {Platform.OS !== 'web' && MapComponents.MapView ? (
        <View style={styles.mapContainer}>
          <MapComponents.MapView
            ref={mapRef}
            provider={Platform.OS === 'android' ? MapComponents.PROVIDER_GOOGLE : undefined}
            style={styles.map}
            initialRegion={nairobiRegion}
          >
            {filteredProperties.map((property: any) => (
              <MapComponents.Marker
                key={`property-${property.id}`}
                coordinate={{
                  latitude: property.location.lat,
                  longitude: property.location.lng,
                }}
                onPress={() => handleMarkerPress('property', property.id)}
                pinColor={Colors.light.primary}
              />
            ))}

            {filteredProviders.map((provider: any) => (
              <MapComponents.Marker
                key={`service-${provider.id}`}
                coordinate={{
                  latitude: provider.location.lat,
                  longitude: provider.location.lng,
                }}
                onPress={() => handleMarkerPress('service', provider.id)}
                pinColor={Colors.light.secondary}
              />
            ))}
          </MapComponents.MapView>

          <TouchableOpacity style={styles.centerButton} onPress={handleCenterMap}>
            <Navigation size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <FlatList
            data={[...filteredProperties, ...filteredProviders]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.webList}
            renderItem={({ item }) => {
              const isProperty = 'title' in item;
              return (
                <TouchableOpacity
                  style={styles.webListItem}
                  onPress={() => handleMarkerPress(isProperty ? 'property' : 'service', item.id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.webListImage}
                    resizeMode="cover"
                  />
                  <View style={styles.webListInfo}>
                    <Text style={styles.webListTitle} numberOfLines={1}>
                      {isProperty ? (item as any).title : (item as any).businessName}
                    </Text>
                    <View style={styles.webListLocationRow}>
                      <MapPin size={14} color={Colors.light.textSecondary} />
                      <Text style={styles.webListLocation} numberOfLines={1}>
                        {item.location.city}
                      </Text>
                    </View>
                    {isProperty && (
                      <Text style={styles.webListPrice}>
                        {(item as any).currency} {(item as any).price.toLocaleString()}
                        {(item as any).category === 'rental' && '/mo'}
                      </Text>
                    )}
                    {!isProperty && (
                      <Text style={styles.webListCategory}>{(item as any).category}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {selectedItem && (
        <View style={[styles.detailCard, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.detailCardContent}
            onPress={handleNavigateToDetail}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: selectedItem.images[0] }}
              style={styles.detailImage}
              resizeMode="cover"
            />
            <View style={styles.detailInfo}>
              <Text style={styles.detailTitle} numberOfLines={1}>
                {selectedMarker?.type === 'property'
                  ? (selectedItem as any).title
                  : (selectedItem as any).businessName}
              </Text>
              <View style={styles.detailLocationRow}>
                <MapPin size={12} color={Colors.light.textSecondary} />
                <Text style={styles.detailLocation} numberOfLines={1}>
                  {selectedItem.location.city}
                </Text>
              </View>
              {selectedMarker?.type === 'property' && (
                <Text style={styles.detailPrice}>
                  {(selectedItem as any).currency} {(selectedItem as any).price.toLocaleString()}
                  {(selectedItem as any).category === 'rental' && '/mo'}
                </Text>
              )}
              {selectedMarker?.type === 'service' && (
                <Text style={styles.detailCategory}>{(selectedItem as any).category}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMarker(null)}>
              <X size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 12,
    backgroundColor: Colors.light.surface,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
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
  filterContainer: {
    maxHeight: 50,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: Colors.light.surface,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  centerButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  detailCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  detailCardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  detailImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  detailInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  detailLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  detailLocation: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  detailPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  detailCategory: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webList: {
    padding: 20,
    gap: 16,
  },
  webListItem: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  webListImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  webListInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  webListTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  webListLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  webListLocation: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  webListPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  webListCategory: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
});
