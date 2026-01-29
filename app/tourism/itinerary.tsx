import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  MapPin, 
  Clock, 
  Download,
  Share2,
  Hotel,
  Compass,
  Car,
  Utensils
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Itinerary, ItineraryItem } from '@/types';

const MOCK_ITINERARY: Itinerary = {
  id: '1',
  userId: 'user1',
  title: 'Kenya Adventure',
  destination: 'Nairobi, Kenya',
  startDate: '2024-02-15',
  endDate: '2024-02-20',
  currency: 'USD',
  totalBudget: 1500,
  shared: false,
  items: [
    {
      id: '1',
      type: 'hotel',
      title: 'Hotel Check-in',
      description: 'Sarova Stanley Hotel',
      date: '2024-02-15',
      startTime: '14:00',
      endTime: '15:00',
      location: {
        name: 'Sarova Stanley Hotel',
        address: 'Kimathi Street, Nairobi',
        lat: -1.286,
        lng: 36.817,
      },
      cost: 200,
      currency: 'USD',
    },
    {
      id: '2',
      type: 'experience',
      title: 'Nairobi National Park Safari',
      date: '2024-02-16',
      startTime: '06:00',
      endTime: '14:00',
      location: {
        name: 'Nairobi National Park',
        address: 'Nairobi, Kenya',
        lat: -1.373,
        lng: 36.858,
      },
      cost: 150,
      currency: 'USD',
    },
    {
      id: '3',
      type: 'restaurant',
      title: 'Dinner at Carnivore',
      date: '2024-02-16',
      startTime: '19:00',
      endTime: '21:00',
      location: {
        name: 'Carnivore Restaurant',
        address: 'Langata Road, Nairobi',
        lat: -1.315,
        lng: 36.816,
      },
      cost: 50,
      currency: 'USD',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const ITEM_TYPE_ICONS = {
  hotel: Hotel,
  experience: Compass,
  transport: Car,
  restaurant: Utensils,
  custom: MapPin,
};

export default function ItineraryScreen() {
  const router = useRouter();
  const [itinerary] = useState<Itinerary>(MOCK_ITINERARY);

  const groupItemsByDate = () => {
    const grouped: { [key: string]: ItineraryItem[] } = {};
    itinerary.items.forEach((item) => {
      if (!grouped[item.date]) {
        grouped[item.date] = [];
      }
      grouped[item.date].push(item);
    });
    return grouped;
  };

  const groupedItems = groupItemsByDate();
  const dates = Object.keys(groupedItems).sort();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Itinerary</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Share2 size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tripHeader}>
        <Text style={styles.tripTitle}>{itinerary.title}</Text>
        <Text style={styles.tripDates}>
          {new Date(itinerary.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {new Date(itinerary.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
        {itinerary.totalBudget && (
          <Text style={styles.budget}>
            Budget: ${itinerary.totalBudget.toLocaleString()}
          </Text>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {dates.map((date, dayIndex) => (
          <View key={date} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>Day {dayIndex + 1}</Text>
              </View>
              <Text style={styles.dayDate}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {groupedItems[date].map((item, index) => {
              const IconComponent = ITEM_TYPE_ICONS[item.type];
              const isLast = index === groupedItems[date].length - 1;

              return (
                <View key={item.id} style={styles.itemContainer}>
                  <View style={styles.timeline}>
                    <View style={styles.timelineDot} />
                    {!isLast && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <View style={styles.itemIconContainer}>
                        <IconComponent size={20} color={Colors.light.primary} />
                      </View>
                      <View style={styles.itemHeaderContent}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <View style={styles.itemMeta}>
                          <Clock size={12} color={Colors.light.gray} />
                          <Text style={styles.itemTime}>
                            {item.startTime} - {item.endTime}
                          </Text>
                        </View>
                      </View>
                      {item.cost && (
                        <Text style={styles.itemCost}>${item.cost}</Text>
                      )}
                    </View>

                    {item.description && (
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    )}

                    <View style={styles.itemLocation}>
                      <MapPin size={14} color={Colors.light.gray} />
                      <Text style={styles.itemLocationText}>{item.location.name}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color={Colors.light.primary} />
          <Text style={styles.addButtonText}>Add Activity</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color={Colors.light.primary} />
            <Text style={styles.actionButtonText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={20} color={Colors.light.primary} />
            <Text style={styles.actionButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
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
  headerButton: {
    padding: 4,
  },
  tripHeader: {
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  tripDates: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  budget: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  daySection: {
    marginBottom: 32,
  },
  dayHeader: {
    marginBottom: 16,
  },
  dayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  dayDate: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.primary,
    borderWidth: 3,
    borderColor: Colors.light.surface,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.light.border,
    marginTop: 4,
  },
  itemCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemHeaderContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemTime: {
    fontSize: 13,
    color: Colors.light.gray,
  },
  itemCost: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  itemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemLocationText: {
    fontSize: 13,
    color: Colors.light.gray,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    marginBottom: 24,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
