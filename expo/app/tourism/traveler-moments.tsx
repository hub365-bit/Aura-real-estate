import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share2, Award } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { TravelerMoment } from '@/types';

const MOCK_MOMENTS: TravelerMoment[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Emma Wilson',
    userAvatar: 'https://i.pravatar.cc/150?img=5',
    verifiedTraveler: true,
    experienceId: 'e1',
    location: 'Maasai Mara, Kenya',
    media: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600'],
    caption: 'The most incredible sunrise over the savanna! Saw all of the Big Five in one day.',
    rating: 5,
    likes: 234,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Marco Rossi',
    userAvatar: 'https://i.pravatar.cc/150?img=11',
    verifiedTraveler: true,
    hotelId: 'h1',
    location: 'Diani Beach, Kenya',
    media: ['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=600'],
    caption: 'Paradise found. Crystal clear waters and the friendliest locals.',
    rating: 5,
    likes: 189,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Aisha Patel',
    userAvatar: 'https://i.pravatar.cc/150?img=9',
    verifiedTraveler: false,
    location: 'Nairobi National Park',
    media: ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600'],
    caption: 'Giraffe feeding at the manor was a dream come true!',
    rating: 4,
    likes: 67,
    createdAt: new Date().toISOString(),
  },
];

export default function TravelerMomentsScreen() {
  const router = useRouter();
  const [likedMoments, setLikedMoments] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedMoments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Traveler Moments</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Share Your Journey</Text>
            <Text style={styles.heroSubtitle}>Inspire fellow travelers with your Africa stories</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Moments</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add Yours</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.momentsGrid}>
          {MOCK_MOMENTS.map((moment) => {
            const isLiked = likedMoments.has(moment.id);
            return (
              <View key={moment.id} style={styles.momentCard}>
                <View style={styles.momentHeader}>
                  <Image source={{ uri: moment.userAvatar }} style={styles.userAvatar} />
                  <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.userName}>{moment.userName}</Text>
                      {moment.verifiedTraveler && (
                        <View style={styles.verifiedBadge}>
                          <Award size={12} color="#fff" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.locationText}>{moment.location}</Text>
                  </View>
                </View>

                <Image source={{ uri: moment.media[0] }} style={styles.momentImage} />

                <View style={styles.momentActions}>
                  <TouchableOpacity onPress={() => toggleLike(moment.id)} style={styles.actionButton}>
                    <Heart size={22} color={isLiked ? Colors.light.error : Colors.light.text} fill={isLiked ? Colors.light.error : 'none'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MessageCircle size={22} color={Colors.light.text} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Share2 size={22} color={Colors.light.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.momentFooter}>
                  <Text style={styles.likesText}>
                    {moment.likes + (isLiked ? 1 : 0)} likes
                  </Text>
                  <Text style={styles.caption}>
                    <Text style={styles.captionName}>{moment.userName} </Text>
                    {moment.caption}
                  </Text>
                </View>
              </View>
            );
          })}
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  placeholder: { width: 32 },
  content: { flex: 1 },
  heroBanner: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.light.text },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  momentsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 20,
  },
  momentCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 13,
    color: Colors.light.gray,
    marginTop: 2,
  },
  momentImage: {
    width: '100%',
    height: 280,
  },
  momentActions: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  momentFooter: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 8,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  captionName: {
    fontWeight: '700',
    color: Colors.light.text,
  },
});
