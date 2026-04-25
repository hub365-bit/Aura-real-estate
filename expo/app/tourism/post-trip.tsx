import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Star, Gift, BookOpen, Send, ChevronRight, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
// import { useTourist } from '@/contexts/TouristContext';

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    title: 'Maasai Mara Safari',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
    date: '2026-03-10',
    type: 'experience',
    reviewed: false,
  },
  {
    id: 'b2',
    title: 'Sarova Stanley Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    date: '2026-03-08',
    type: 'hotel',
    reviewed: true,
  },
];

const REWARDS = [
  { id: 'r1', title: 'Early Bird', description: 'Book 30 days ahead', points: 200, icon: Star },
  { id: 'r2', title: 'Storyteller', description: 'Share 3 traveler moments', points: 500, icon: BookOpen },
  { id: 'r3', title: 'Loyal Explorer', description: 'Complete 5 bookings', points: 1000, icon: Award },
];

export default function PostTripScreen() {
  const router = useRouter();
  // const { profile } = useTourist();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  const setRating = (bookingId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [bookingId]: rating }));
  };

  const submitReview = (bookingId: string) => {
    setSubmitted((prev) => new Set(prev).add(bookingId));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post-Trip</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <Gift size={24} color={Colors.light.secondary} />
            <Text style={styles.loyaltyTitle}>Loyalty Rewards</Text>
          </View>
          <Text style={styles.pointsText}>You have <Text style={styles.pointsHighlight}>0</Text> points</Text>
          <Text style={styles.pointsSubtext}>Earn more by reviewing and sharing</Text>
        </View>

        <Text style={styles.sectionTitle}>Pending Reviews</Text>
        {MOCK_BOOKINGS.filter((b) => !b.reviewed && !submitted.has(b.id)).map((booking) => (
          <View key={booking.id} style={styles.reviewCard}>
            <View style={styles.bookingHeader}>
              <Image source={{ uri: booking.image }} style={styles.bookingImage} />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>{booking.title}</Text>
                <Text style={styles.bookingDate}>{new Date(booking.date).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(booking.id, star)}>
                  <Star
                    size={28}
                    color={Colors.light.warning}
                    fill={(ratings[booking.id] || 0) >= star ? Colors.light.warning : 'none'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              placeholderTextColor={Colors.light.gray}
              multiline
              numberOfLines={3}
              value={reviews[booking.id] || ''}
              onChangeText={(text) => setReviews((prev) => ({ ...prev, [booking.id]: text }))}
            />

            <TouchableOpacity
              style={[styles.submitButton, !ratings[booking.id] && styles.submitButtonDisabled]}
              onPress={() => submitReview(booking.id)}
              disabled={!ratings[booking.id]}
            >
              <Send size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Review (+100 pts)</Text>
            </TouchableOpacity>
          </View>
        ))}

        {submitted.size > 0 && (
          <View style={styles.thanksCard}>
            <Text style={styles.thanksText}>Thanks for your review!</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rewardsScroll}>
          <View style={styles.rewardsRow}>
            {REWARDS.map((reward) => {
              const Icon = reward.icon;
              return (
                <View key={reward.id} style={styles.rewardCard}>
                  <View style={styles.rewardIcon}>
                    <Icon size={28} color={Colors.light.secondary} />
                  </View>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDesc}>{reward.description}</Text>
                  <Text style={styles.rewardPoints}>+{reward.points} pts</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.journalCard}>
          <BookOpen size={28} color={Colors.light.primary} />
          <View style={styles.journalContent}>
            <Text style={styles.journalTitle}>Travel Journal</Text>
            <Text style={styles.journalDesc}>Capture your memories and create a beautiful travel story</Text>
          </View>
          <ChevronRight size={20} color={Colors.light.gray} />
        </TouchableOpacity>
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  placeholder: { width: 32 },
  content: { flex: 1, padding: 20 },
  loyaltyCard: {
    backgroundColor: Colors.light.secondary + '15',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.secondary + '30',
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  loyaltyTitle: { fontSize: 18, fontWeight: '800', color: Colors.light.secondary },
  pointsText: { fontSize: 16, color: Colors.light.text, marginBottom: 4 },
  pointsHighlight: { fontWeight: '800', color: Colors.light.secondary },
  pointsSubtext: { fontSize: 13, color: Colors.light.textSecondary },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.light.text, marginBottom: 16 },
  reviewCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  bookingInfo: {
    marginLeft: 12,
    flex: 1,
  },
  bookingTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text },
  bookingDate: { fontSize: 13, color: Colors.light.gray, marginTop: 2 },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: Colors.light.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.light.gray,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  thanksCard: {
    backgroundColor: Colors.light.success + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  thanksText: {
    color: Colors.light.success,
    fontWeight: '700',
    fontSize: 15,
  },
  rewardsScroll: {
    marginBottom: 24,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  rewardCard: {
    width: 160,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  rewardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardTitle: { fontSize: 14, fontWeight: '700', color: Colors.light.text, marginBottom: 4, textAlign: 'center' },
  rewardDesc: { fontSize: 12, color: Colors.light.textSecondary, textAlign: 'center', marginBottom: 8 },
  rewardPoints: { fontSize: 13, fontWeight: '800', color: Colors.light.secondary },
  journalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  journalContent: { flex: 1 },
  journalTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  journalDesc: { fontSize: 13, color: Colors.light.textSecondary },
});
