import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { List, MapIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';

const { height } = Dimensions.get('window');

interface Property {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface MapHybridViewProps {
  properties: Property[];
  onPropertyPress?: (property: Property) => void;
}

export default function MapHybridView({
  properties,
  onPropertyPress,
}: MapHybridViewProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const initialRegion = {
    latitude: properties[0]?.location.lat || -1.2921,
    longitude: properties[0]?.location.lng || 36.8219,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.activeButton]}
          onPress={() => setViewMode('map')}
        >
          <MapIcon
            size={18}
            color={viewMode === 'map' ? '#fff' : colors.primary}
          />
          <Text
            style={[
              styles.toggleText,
              viewMode === 'map' && styles.activeText,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.activeButton]}
          onPress={() => setViewMode('list')}
        >
          <List
            size={18}
            color={viewMode === 'list' ? '#fff' : colors.primary}
          />
          <Text
            style={[
              styles.toggleText,
              viewMode === 'list' && styles.activeText,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'map' ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
        >
          {properties.map((property) => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.location.lat,
                longitude: property.location.lng,
              }}
              onPress={() => onPropertyPress && onPropertyPress(property)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <Text style={styles.markerPrice}>
                    {property.currency} {(property.price / 1000).toFixed(0)}K
                  </Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.listView}>
          <Text style={styles.listPlaceholder}>List view here</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  activeText: {
    color: '#fff',
  },
  map: {
    width: '100%',
    height: height * 0.5,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  markerPrice: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  listView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  listPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
});
