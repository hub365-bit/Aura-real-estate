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
import { router, Stack } from 'expo-router';
import { Calendar, MapPin, Users, Tag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Event } from '@/types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'PropTech Africa Summit 2026',
    description: 'Annual real estate technology conference',
    category: 'conference',
    location: {
      name: 'Kenyatta International Convention Centre',
      address: 'Harambee Avenue',
      city: 'Nairobi',
      lat: -1.2921,
      lng: 36.8219,
    },
    startDate: '2026-03-15T09:00:00',
    endDate: '2026-03-17T18:00:00',
    price: 5000,
    currency: 'KES',
    capacity: 500,
    booked: 342,
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
    organizerId: 'org1',
    organizerName: 'Kenya PropTech Association',
    status: 'upcoming',
    createdAt: '2026-01-20T10:00:00',
  },
  {
    id: '2',
    title: 'Property Investment Masterclass',
    description: 'Learn investment strategies from experts',
    category: 'training',
    location: {
      name: 'Radisson Blu Hotel',
      address: 'Upper Hill',
      city: 'Nairobi',
      lat: -1.2835,
      lng: 36.8172,
    },
    startDate: '2026-02-10T14:00:00',
    endDate: '2026-02-10T18:00:00',
    price: 2500,
    currency: 'KES',
    capacity: 100,
    booked: 78,
    images: ['https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800'],
    organizerId: 'org2',
    organizerName: 'Investment Academy Kenya',
    status: 'upcoming',
    createdAt: '2026-01-15T08:00:00',
  },
];

export default function EventsScreen() {
  const [category, setCategory] = useState<string>('all');
  
  const filteredEvents = category === 'all'
    ? mockEvents
    : mockEvents.filter(e => e.category === category);
  
  const renderEvent = ({ item }: { item: Event }) => {
    const availableSpots = item.capacity - item.booked;
    const percentBooked = (item.booked / item.capacity) * 100;
    
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => router.push(`/events/${item.id}` as any)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.images[0] }} style={styles.eventImage} />
        
        <View style={styles.eventContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
          
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={styles.eventDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Calendar size={16} color={Colors.light.icon} />
              <Text style={styles.detailText}>
                {new Date(item.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={16} color={Colors.light.icon} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.location.name}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Users size={16} color={Colors.light.icon} />
              <Text style={styles.detailText}>
                {availableSpots} spots left
              </Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Tag size={18} color={Colors.light.tint} />
              <Text style={styles.price}>
                {item.currency} {item.price.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.bookingProgress}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${percentBooked}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Events & Tickets',
          headerLargeTitle: true,
        }}
      />
      
      <View style={styles.filterContainer}>
        {['all', 'conference', 'training', 'religious', 'social'].map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              category === cat && styles.filterButtonActive,
            ]}
            onPress={() => setCategory(cat)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                category === cat && styles.filterTextActive,
              ]}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.light.background,
  },
  eventContent: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.tint + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.light.tint,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.text,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.tint,
  },
  bookingProgress: {
    width: 80,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.tint,
  },
});
