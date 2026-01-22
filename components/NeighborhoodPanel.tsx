import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { School, Hospital, Bus, Shield, Volume2 } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { colors } from '@/constants/colors';

interface NeighborhoodPanelProps {
  lat: number;
  lng: number;
}

export default function NeighborhoodPanel({ lat, lng }: NeighborhoodPanelProps) {
  const neighborhoodQuery = trpc.neighborhood.get.useQuery({ lat, lng });

  if (neighborhoodQuery.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading neighborhood data...</Text>
      </View>
    );
  }

  if (!neighborhoodQuery.data) return null;

  const data = neighborhoodQuery.data;

  const getNoiseColor = (level: string) => {
    switch (level) {
      case 'quiet':
        return '#10b981';
      case 'moderate':
        return '#f59e0b';
      case 'busy':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neighborhood Insights</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Shield size={24} color={colors.primary} />
          <Text style={styles.statValue}>{data.safetyRating}/10</Text>
          <Text style={styles.statLabel}>Safety Rating</Text>
        </View>

        <View style={styles.statCard}>
          <Volume2 size={24} color={getNoiseColor(data.noiseLevel)} />
          <Text style={[styles.statValue, { textTransform: 'capitalize' }]}>
            {data.noiseLevel}
          </Text>
          <Text style={styles.statLabel}>Noise Level</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <School size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Nearby Schools</Text>
        </View>
        {data.schools.map((school, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemName}>{school.name}</Text>
            <Text style={styles.itemDistance}>{school.distance} km</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Hospital size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Healthcare</Text>
        </View>
        {data.hospitals.map((hospital, index) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.itemName}>{hospital.name}</Text>
              <Text style={styles.itemType}>{hospital.type}</Text>
            </View>
            <Text style={styles.itemDistance}>{hospital.distance} km</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bus size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Transport</Text>
        </View>
        {data.transport.map((transport, index) => (
          <View key={index} style={styles.item}>
            <View>
              <Text style={styles.itemName}>{transport.name}</Text>
              <Text style={styles.itemType}>{transport.type}</Text>
            </View>
            <Text style={styles.itemDistance}>{transport.distance} km</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  itemType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemDistance: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
