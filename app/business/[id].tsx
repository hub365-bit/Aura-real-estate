import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Phone,
  Mail,
  Globe,
  Clock,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: Colors.light.primary,
  dark: Colors.light.text,
  white: '#FFFFFF',
  background: Colors.light.background,
  textSecondary: Colors.light.textSecondary,
  border: Colors.light.border,
  error: Colors.light.error,
};

interface Post {
  id: string;
  type: 'image' | 'video' | 'text';
  content: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  mediaUrl?: string;
}

interface BusinessData {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  followers: number;
  coverImage: string;
  logo: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  hours: string;
  isFollowing: boolean;
  verified: boolean;
}

export default function BusinessPageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'reviews'>(
    'posts'
  );

  const mockBusiness: BusinessData = {
    id: id || 'b1',
    name: 'Skyline Properties Ltd',
    category: 'Real Estate Agency',
    description:
      'Leading real estate company in Nairobi specializing in residential and commercial properties. We offer premium listings with excellent customer service.',
    rating: 4.8,
    reviews: 342,
    followers: 1245,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
    location: 'Westlands, Nairobi',
    phone: '+254 712 345 678',
    email: 'info@skylineproperties.co.ke',
    website: 'www.skylineproperties.co.ke',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM',
    isFollowing: false,
    verified: true,
  };

  const mockPosts: Post[] = [
    {
      id: 'p1',
      type: 'image',
      content: '',
      caption:
        '🏡 New Listing Alert! Stunning 3-bedroom apartment in Kilimani with modern amenities and great views. Contact us today!',
      likes: 234,
      comments: 45,
      shares: 12,
      timestamp: new Date('2025-10-28'),
      mediaUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    },
    {
      id: 'p2',
      type: 'text',
      content:
        '🎉 We are excited to announce our new office opening in Karen! Visit us for exclusive property deals this weekend. #RealEstate #Nairobi',
      caption: '',
      likes: 156,
      comments: 23,
      shares: 8,
      timestamp: new Date('2025-10-26'),
    },
    {
      id: 'p3',
      type: 'image',
      content: '',
      caption:
        '✨ Property of the Week: Luxurious 5-bedroom villa with pool in Runda Estate. Premium lifestyle awaits! DM for details.',
      likes: 432,
      comments: 78,
      shares: 34,
      timestamp: new Date('2025-10-24'),
      mediaUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
    },
  ];

  const [business] = useState(mockBusiness);
  const [posts] = useState(mockPosts);
  const [isFollowing, setIsFollowing] = useState(business.isFollowing);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Share2 size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: business.coverImage }} style={styles.coverImage} />

        <View style={styles.profileSection}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: business.logo }} style={styles.logo} />
            {business.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>

          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.category}>{business.category}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Star size={16} color={COLORS.primary} fill={COLORS.primary} />
                <Text style={styles.statText}>
                  {business.rating} ({business.reviews})
                </Text>
              </View>
              <View style={styles.stat}>
                <Users size={16} color={COLORS.textSecondary} />
                <Text style={styles.statText}>
                  {business.followers.toLocaleString()} followers
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followingButton,
                ]}
                onPress={toggleFollow}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <MessageCircle size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'posts' && styles.activeTabText,
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'about' && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'reviews' && styles.activeTabText,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'posts' && (
          <View style={styles.postsContainer}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image
                    source={{ uri: business.logo }}
                    style={styles.postAvatar}
                  />
                  <View style={styles.postInfo}>
                    <Text style={styles.postAuthor}>{business.name}</Text>
                    <Text style={styles.postTime}>
                      {formatTimeAgo(post.timestamp)}
                    </Text>
                  </View>
                </View>

                {post.mediaUrl && (
                  <Image
                    source={{ uri: post.mediaUrl }}
                    style={styles.postImage}
                  />
                )}

                <View style={styles.postContent}>
                  <Text style={styles.postCaption}>
                    {post.caption || post.content}
                  </Text>

                  <View style={styles.postActions}>
                    <TouchableOpacity style={styles.postAction}>
                      <Heart size={20} color={COLORS.textSecondary} />
                      <Text style={styles.postActionText}>{post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postAction}>
                      <MessageCircle size={20} color={COLORS.textSecondary} />
                      <Text style={styles.postActionText}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postAction}>
                      <Share2 size={20} color={COLORS.textSecondary} />
                      <Text style={styles.postActionText}>{post.shares}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.aboutContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{business.description}</Text>

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              <View style={styles.contactItem}>
                <MapPin size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>{business.location}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Phone size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>{business.phone}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Mail size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>{business.email}</Text>
              </View>
              
              {business.website && (
                <View style={styles.contactItem}>
                  <Globe size={20} color={COLORS.primary} />
                  <Text style={styles.contactText}>{business.website}</Text>
                </View>
              )}
              
              <View style={styles.contactItem}>
                <Clock size={20} color={COLORS.primary} />
                <Text style={styles.contactText}>{business.hours}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Reviews Coming Soon</Text>
            <Text style={styles.description}>
              Customer reviews and ratings will be displayed here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: width,
    height: 200,
    backgroundColor: COLORS.border,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  logoContainer: {
    position: 'relative',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  businessInfo: {
    flex: 1,
    marginLeft: 12,
  },
  businessName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  followingButtonText: {
    color: COLORS.dark,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  postsContainer: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.border,
  },
  postInfo: {
    marginLeft: 12,
    flex: 1,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  postTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.border,
  },
  postContent: {
    padding: 12,
  },
  postCaption: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postActionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  aboutContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  contactSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.dark,
    flex: 1,
  },
  reviewsContainer: {
    padding: 16,
  },
});
