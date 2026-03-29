import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Navigation,
  Share2,
  Download,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';
import Svg, { Rect } from 'react-native-svg';
import Colors from '@/constants/colors';
import { mockBookings } from '@/mocks/posts';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Booking Not Found' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found</Text>
        </View>
      </View>
    );
  }

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Booking Ref: ${booking.bookingRef}\nDate: ${new Date(booking.date).toLocaleDateString()}\nAmount: ${booking.currency} ${booking.totalAmount}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    Alert.alert('Download', 'QR code will be saved to your device');
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cancelled', 'Your booking has been cancelled');
            router.back();
          },
        },
      ]
    );
  };

  const QRCodePlaceholder = () => (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      <Rect width="200" height="200" fill={Colors.light.surface} />
      <Rect x="10" y="10" width="50" height="50" fill={Colors.light.text} />
      <Rect x="70" y="10" width="10" height="10" fill={Colors.light.text} />
      <Rect x="90" y="10" width="20" height="10" fill={Colors.light.text} />
      <Rect x="140" y="10" width="50" height="50" fill={Colors.light.text} />
      <Rect x="10" y="70" width="10" height="10" fill={Colors.light.text} />
      <Rect x="30" y="70" width="30" height="20" fill={Colors.light.text} />
      <Rect x="70" y="70" width="60" height="60" fill={Colors.light.text} />
      <Rect x="140" y="70" width="20" height="30" fill={Colors.light.text} />
      <Rect x="10" y="140" width="50" height="50" fill={Colors.light.text} />
      <Rect x="70" y="140" width="30" height="10" fill={Colors.light.text} />
      <Rect x="140" y="140" width="50" height="50" fill={Colors.light.text} />
    </Svg>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Booking Details',
          headerStyle: {
            backgroundColor: Colors.light.surface,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
          },
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIconContainer,
              { backgroundColor: getStatusColor(booking.status) + '20' },
            ]}
          >
            {booking.status === 'confirmed' ? (
              <CheckCircle size={32} color={getStatusColor(booking.status)} />
            ) : (
              <XCircle size={32} color={getStatusColor(booking.status)} />
            )}
          </View>
          <Text style={styles.statusTitle}>
            {booking.status === 'confirmed' ? 'Booking Confirmed' : `Status: ${booking.status}`}
          </Text>
          <Text style={styles.bookingRef}>Reference: {booking.bookingRef}</Text>
        </View>

        {booking.status === 'confirmed' && (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Show this QR code at entrance</Text>
            <View style={styles.qrCodeContainer}>
              <QRCodePlaceholder />
            </View>
            <Text style={styles.qrSubtitle}>Booking ID: {booking.id}</Text>
            <View style={styles.qrActions}>
              <TouchableOpacity style={styles.qrActionButton} onPress={handleDownload}>
                <Download size={18} color={Colors.light.primary} />
                <Text style={styles.qrActionText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qrActionButton} onPress={handleShare}>
                <Share2 size={18} color={Colors.light.primary} />
                <Text style={styles.qrActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Booking Information</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {booking.timeSlot && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Clock size={20} color={Colors.light.primary} />
              </View>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{booking.timeSlot}</Text>
              </View>
            </View>
          )}

          {booking.checkIn && booking.checkOut && (
            <>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Clock size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Check-in</Text>
                  <Text style={styles.detailValue}>{booking.checkIn}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailIconContainer}>
                  <Clock size={20} color={Colors.light.primary} />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Check-out</Text>
                  <Text style={styles.detailValue}>{booking.checkOut}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Contact & Location</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Phone size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>+254 712 345 678</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Mail size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>support@aura.com</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.navigationButton} activeOpacity={0.7}>
            <Navigation size={20} color={Colors.light.surface} />
            <Text style={styles.navigationButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total Amount</Text>
            <Text style={styles.paymentAmount}>
              {booking.currency} {booking.totalAmount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Status</Text>
            <Text
              style={[
                styles.paymentStatus,
                { color: booking.status === 'confirmed' ? Colors.light.success : Colors.light.secondary },
              ]}
            >
              {booking.status === 'confirmed' ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>

        {booking.status === 'confirmed' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelBooking}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  statusCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  bookingRef: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  qrCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 20,
  },
  qrCodeContainer: {
    padding: 20,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: 16,
  },
  qrSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 16,
  },
  qrActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
  },
  qrActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  detailsCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  navigationButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  paymentCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  paymentStatus: {
    fontSize: 15,
    fontWeight: '700' as const,
  },
  cancelButton: {
    backgroundColor: Colors.light.error + '15',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.error,
  },
});
