import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Play,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: Colors.light.primary,
  dark: Colors.light.text,
  white: '#FFFFFF',
  textSecondary: Colors.light.textSecondary,
};

interface Reel {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  videoThumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

const mockReels: Reel[] = [
  {
    id: 'r1',
    businessId: 'b1',
    businessName: 'Skyline Properties',
    businessLogo: 'https://i.pravatar.cc/100?img=1',
    videoThumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
    caption: '🏡 Tour of our stunning new 3BR apartment in Kilimani! Swipe to see more features. #NairobiHomes #RealEstate',
    likes: 1234,
    comments: 89,
    shares: 45,
    isLiked: false,
  },
  {
    id: 'r2',
    businessId: 'b2',
    businessName: 'Elite Plumbing Services',
    businessLogo: 'https://i.pravatar.cc/100?img=2',
    videoThumbnail: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600',
    caption: '💧 Quick tip: How to fix a leaky faucet in 2 minutes! Save money on repairs. #PlumbingTips #DIY',
    likes: 856,
    comments: 54,
    shares: 32,
    isLiked: true,
  },
  {
    id: 'r3',
    businessId: 'b3',
    businessName: 'Coastal Hotels & Resorts',
    businessLogo: 'https://i.pravatar.cc/100?img=3',
    videoThumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    caption: '🏖️ Experience paradise at our beachfront resort! Book now and get 20% off. #CoastalGetaway #Travel',
    likes: 2145,
    comments: 156,
    shares: 98,
    isLiked: false,
  },
  {
    id: 'r4',
    businessId: 'b4',
    businessName: 'Green Gardens Landscaping',
    businessLogo: 'https://i.pravatar.cc/100?img=4',
    videoThumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    caption: '🌿 Transform your outdoor space! See this amazing garden makeover. Contact us for a free quote. #Landscaping #GardenDesign',
    likes: 678,
    comments: 41,
    shares: 23,
    isLiked: false,
  },
];

export default function ReelsScreen() {
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const flatListRef = useRef<FlatList>(null);

  const toggleLike = (reelId: string) => {
    setReels((prevReels) =>
      prevReels.map((reel) =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const renderReel = ({ item }: { item: Reel }) => (
    <View style={styles.reelContainer}>
      <Image source={{ uri: item.videoThumbnail }} style={styles.reelVideo} />
      
      <View style={styles.playOverlay}>
        <Play size={64} color={COLORS.white} fill={COLORS.white} />
      </View>

      <View style={styles.reelOverlay}>
        <View style={styles.reelInfo}>
          <TouchableOpacity
            style={styles.businessInfo}
            onPress={() => router.push(`/business/${item.businessId}`)}
          >
            <Image
              source={{ uri: item.businessLogo }}
              style={styles.businessLogo}
            />
            <Text style={styles.businessName}>{item.businessName}</Text>
          </TouchableOpacity>

          <Text style={styles.reelCaption} numberOfLines={3}>
            {item.caption}
          </Text>
        </View>

        <View style={styles.reelActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Heart
              size={32}
              color={COLORS.white}
              fill={item.isLiked ? COLORS.white : 'none'}
            />
            <Text style={styles.actionText}>
              {item.likes > 999 ? `${(item.likes / 1000).toFixed(1)}k` : item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={32} color={COLORS.white} />
            <Text style={styles.actionText}>
              {item.comments > 999
                ? `${(item.comments / 1000).toFixed(1)}k`
                : item.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={32} color={COLORS.white} />
            <Text style={styles.actionText}>
              {item.shares > 999 ? `${(item.shares / 1000).toFixed(1)}k` : item.shares}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={32} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={COLORS.white} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelContainer: {
    width,
    height,
    position: 'relative',
  },
  reelVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  reelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 100,
  },
  reelInfo: {
    flex: 1,
    marginRight: 16,
  },
  businessInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginRight: 8,
  },
  businessName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  reelCaption: {
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 20,
  },
  reelActions: {
    gap: 24,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
});
