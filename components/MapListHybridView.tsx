import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { MapPin, Grid, List } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import { Property } from '@/types';
import Colors from '@/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapListHybridViewProps {
  properties: Property[];
  onPropertyPress: (property: Property) => void;
}

export function MapListHybridView({ properties, onPropertyPress }: MapListHybridViewProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');
  
  const renderPropertyCard = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => onPropertyPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.cardLocation}>
          <MapPin size={14} color={Colors.light.icon} />
          <Text style={styles.cardLocationText}>{item.location.city}</Text>
        </View>
        <Text style={styles.cardPrice}>
          {item.currency} {item.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  const mapRegion = properties.length > 0
    ? {
        latitude: properties[0].location.lat,
        longitude: properties[0].location.lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : {
        latitude: -1.286389,
        longitude: 36.817223,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
  
  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, viewMode === 'map' && styles.controlButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <MapPin size={20} color={viewMode === 'map' ? '#FFFFFF' : Colors.light.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, viewMode === 'split' && styles.controlButtonActive]}
          onPress={() => setViewMode('split')}
        >
          <Grid size={20} color={viewMode === 'split' ? '#FFFFFF' : Colors.light.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, viewMode === 'list' && styles.controlButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <List size={20} color={viewMode === 'list' ? '#FFFFFF' : Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      {viewMode === 'map' && (
        <MapView style={styles.map} initialRegion={mapRegion}>
          {properties.map(property => (
            <Marker
              key={property.id}
              coordinate={{
                latitude: property.location.lat,
                longitude: property.location.lng,
              }}
              onPress={() => onPropertyPress(property)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <Text style={styles.markerText}>
                    {property.currency} {(property.price / 1000).toFixed(0)}K
                  </Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      )}
      
      {viewMode === 'list' && (
        <FlatList
          data={properties}
          renderItem={renderPropertyCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {viewMode === 'split' && (
        <>
          <MapView style={styles.mapSplit} initialRegion={mapRegion}>
            {properties.map(property => (
              <Marker
                key={property.id}
                coordinate={{
                  latitude: property.location.lat,
                  longitude: property.location.lng,
                }}
                onPress={() => onPropertyPress(property)}
              >
                <View style={styles.markerContainer}>
                  <View style={styles.marker}>
                    <Text style={styles.markerText}>
                      {property.currency} {(property.price / 1000).toFixed(0)}K
                    </Text>
                  </View>
                </View>
              </Marker>
            ))}
          </MapView>
          
          <View style={styles.listSplit}>
            <FlatList
              data={properties}
              renderItem={renderPropertyCard}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  map: {
    flex: 1,
  },
  mapSplit: {
    height: SCREEN_HEIGHT * 0.5,
  },
  listSplit: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'transparent',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  horizontalListContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    width: 280,
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.light.background,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocationText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.tint,
  },
});
