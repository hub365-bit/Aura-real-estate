import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { colors } from '@/constants/colors';

export default function EventsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('all');

  const eventsQuery = trpc.events.list.useQuery({
    status: 'published',
  });

  const renderEvent = ({ item }: { item: any }) => {
    const availableTickets = item.capacity - item.ticketsSold;
    const percentSold = (item.ticketsSold / item.capacity) * 100;

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => console.log('Event clicked:', item.id)}
      >
        <Image source={{ uri: item.images[0] }} style={styles.eventImage} />
        
        <View style={styles.eventContent}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {item.type.replace('_', ' ').toUpperCase()}
            </Text>
          </View>

          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color="#666" />
              <Text style={styles.detailText}>
                {new Date(item.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={16} color="#666" />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location.address}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Users size={16} color="#666" />
              <Text style={styles.detailText}>
                {availableTickets} / {item.capacity} available
              </Text>
            </View>
          </View>

          <View style={styles.ticketProgress}>
            <View
              style={[styles.ticketProgressBar, { width: `${percentSold}%` }]}
            />
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>Ticket Price</Text>
              <Text style={styles.price}>
                {item.currency} {item.ticketPrice.toLocaleString()}
              </Text>
            </View>

            <TouchableOpacity style={styles.buyButton}>
              <Ticket size={18} color="#fff" />
              <Text style={styles.buyButtonText}>Buy Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ headerTitle: 'Events & Tickets' }} />

      <FlatList
        data={eventsQuery.data || []}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={eventsQuery.isRefetching}
        onRefresh={() => eventsQuery.refetch()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ticket size={48} color="#ccc" />
            <Text style={styles.emptyText}>No events available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e5e5',
  },
  eventContent: {
    padding: 16,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  ticketProgress: {
    height: 4,
    backgroundColor: '#e5e5e5',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  ticketProgressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});
