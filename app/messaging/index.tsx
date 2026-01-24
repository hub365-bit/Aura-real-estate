import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Search, MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface MockConversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  bookingRef?: string;
}

const mockConversations: MockConversation[] = [
  {
    id: '1',
    participantName: 'Sarah Mwangi',
    participantAvatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Yes, the apartment is still available',
    lastMessageTime: '10m ago',
    unreadCount: 2,
    bookingRef: 'BK-1234',
  },
  {
    id: '2',
    participantName: 'John Kamau',
    participantAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Can I schedule a viewing tomorrow?',
    lastMessageTime: '1h ago',
    unreadCount: 0,
  },
];

export default function MessagingScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const filteredConversations = mockConversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderConversation = ({ item }: { item: MockConversation }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/messaging/${item.id}` as any)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.participantAvatar }}
        style={styles.avatar}
      />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>{item.participantName}</Text>
          <Text style={styles.timestamp}>{item.lastMessageTime}</Text>
        </View>
        
        {item.bookingRef && (
          <Text style={styles.bookingRef}>Booking: {item.bookingRef}</Text>
        )}
        
        <Text
          style={[
            styles.lastMessage,
            item.unreadCount > 0 && styles.lastMessageUnread,
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.light.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.light.tabIconDefault}
        />
      </View>
      
      {filteredConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color={Colors.light.tabIconDefault} />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptyText}>
            Start a conversation by inquiring about a property or service
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  listContent: {
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.background,
  },
  conversationContent: {
    flex: 1,
    marginLeft: 12,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  bookingRef: {
    fontSize: 12,
    color: Colors.light.tint,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  lastMessageUnread: {
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  unreadBadge: {
    backgroundColor: Colors.light.tint,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
});
