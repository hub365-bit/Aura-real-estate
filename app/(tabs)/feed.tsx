import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mockPosts } from '@/mocks/posts';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Feed</Text>
        <Text style={styles.headerSubtitle}>Latest from businesses you follow</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image
                source={{ uri: post.authorAvatar || 'https://i.pravatar.cc/150?img=1' }}
                style={styles.avatar}
              />
              <View style={styles.postHeaderInfo}>
                <Text style={styles.authorName}>{post.authorName}</Text>
                <Text style={styles.postTime}>{formatTimeAgo(post.createdAt)}</Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={20} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.media.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.mediaContainer}
                contentContainerStyle={styles.mediaContent}
              >
                {post.media.map((media, index) => (
                  <Image
                    key={index}
                    source={{ uri: media }}
                    style={styles.mediaImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={20} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.commentsCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={20} color={Colors.light.textSecondary} />
                <Text style={styles.actionText}>{post.sharesCount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: Colors.light.surface,
    marginBottom: 12,
    paddingTop: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  mediaContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  mediaImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
  },
  postActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '600' as const,
  },
});
