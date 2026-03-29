import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

const COLORS = {
  primary: Colors.light.primary,
  dark: Colors.light.text,
  white: '#FFFFFF',
  background: Colors.light.background,
  textSecondary: Colors.light.textSecondary,
  border: Colors.light.border,
  success: Colors.light.success,
};

interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: 'c1',
    contactId: 'agent1',
    contactName: 'John Kamau - Skyline Properties',
    contactAvatar: 'https://i.pravatar.cc/100?img=11',
    lastMessage: 'The property is still available. When would you like to view it?',
    lastMessageTime: new Date('2025-10-30T14:30:00'),
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'c2',
    contactId: 'agent2',
    contactName: 'Sarah Wanjiku - Urban Homes',
    contactAvatar: 'https://i.pravatar.cc/100?img=45',
    lastMessage: 'Thank you for your interest. I will send you the contract today.',
    lastMessageTime: new Date('2025-10-30T10:15:00'),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'c3',
    contactId: 'service1',
    contactName: 'Mike Omondi - Elite Plumbing',
    contactAvatar: 'https://i.pravatar.cc/100?img=33',
    lastMessage: 'I can come tomorrow at 10 AM to fix the issue.',
    lastMessageTime: new Date('2025-10-29T16:45:00'),
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'c4',
    contactId: 'agent3',
    contactName: 'Grace Akinyi - Prime Estates',
    contactAvatar: 'https://i.pravatar.cc/100?img=20',
    lastMessage: 'Your rent payment has been received. Receipt sent to your email.',
    lastMessageTime: new Date('2025-10-28T09:20:00'),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'c5',
    contactId: 'service2',
    contactName: 'David Mwangi - Quick Repairs',
    contactAvatar: 'https://i.pravatar.cc/100?img=55',
    lastMessage: 'The repair work is completed. Please check and confirm.',
    lastMessageTime: new Date('2025-10-27T14:00:00'),
    unreadCount: 0,
    isOnline: false,
  },
];

export default function MessagesScreen() {
  const [conversations] = useState<Conversation[]>(
    mockConversations
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) =>
    conv.contactName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    return 'Just now';
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => console.log('Open chat with', item.contactId)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.contactAvatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.contactName} numberOfLines={1}>
            {item.contactName}
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.lastMessageTime)}</Text>
        </View>

        <View style={styles.messagePreviewContainer}>
          <Text
            style={[
              styles.messagePreview,
              item.unreadCount > 0 && styles.messagePreviewUnread,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color={COLORS.border} />
          <Text style={styles.emptyTitle}>No Messages</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? 'No conversations match your search'
              : 'Start a conversation with an agent or service provider'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.dark,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.border,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  messagePreviewUnread: {
    fontWeight: '600',
    color: COLORS.dark,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
