import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockBookings } from '@/mocks/posts';

export default function BookingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.light.success;
      case 'pending':
        return Colors.light.secondary;
      case 'cancelled':
        return Colors.light.error;
      default:
        return Colors.light.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Manage your reservations</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockBookings.map((booking) => (
          <TouchableOpacity
            key={booking.id}
            style={styles.card}
            onPress={() => router.push(`/booking/details/${booking.id}` as any)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.typeContainer}>
                <Calendar size={16} color={Colors.light.primary} />
                <Text style={styles.typeText}>
                  {booking.type === 'service' ? 'Service Booking' : 'Property Viewing'}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                  {booking.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.userName}>{booking.userName}</Text>
            <Text style={styles.bookingRef}>Ref: {booking.bookingRef}</Text>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Clock size={16} color={Colors.light.textSecondary} />
              <Text style={styles.detailText}>
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>

            {booking.timeSlot && (
              <View style={styles.detailRow}>
                <Clock size={16} color={Colors.light.textSecondary} />
                <Text style={styles.detailText}>{booking.timeSlot}</Text>
              </View>
            )}

            {booking.checkIn && booking.checkOut && (
              <View style={styles.detailRow}>
                <MapPin size={16} color={Colors.light.textSecondary} />
                <Text style={styles.detailText}>
                  Check-in: {booking.checkIn} • Check-out: {booking.checkOut}
                </Text>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.amount}>
                {booking.currency} {booking.totalAmount.toLocaleString()}
              </Text>
              {booking.status === 'confirmed' && (
                <View style={styles.confirmedContainer}>
                  <CheckCircle size={16} color={Colors.light.success} />
                  <Text style={styles.confirmedText}>Confirmed</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {mockBookings.length === 0 && (
          <View style={styles.emptyState}>
            <Calendar size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptySubtitle}>
              Book properties or services to see them here
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  bookingRef: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  confirmedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmedText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
