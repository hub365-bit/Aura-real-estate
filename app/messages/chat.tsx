import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Send, Image as ImageIcon, Mic, ArrowLeft } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { colors } from '@/constants/colors';

interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  read: boolean;
  createdAt: Date;
}

export default function ChatScreen() {
  const { conversationId, receiverName } = useLocalSearchParams<{
    conversationId: string;
    receiverName: string;
  }>();
  const router = useRouter();
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const currentUserId = 'user_123';

  const messagesQuery = trpc.conversations.getMessages.useQuery({
    conversationId: conversationId || '',
  });

  const sendMessageMutation = trpc.conversations.sendMessage.useMutation({
    onSuccess: (newMessage) => {
      setMessages((prev) => [newMessage as Message, ...prev]);
      setMessage('');
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    },
  });

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data as Message[]);
    }
  }, [messagesQuery.data]);

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      conversationId: conversationId || '',
      senderId: currentUserId,
      receiverId: 'other_user',
      type: 'text',
      content: message.trim(),
    });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        {item.type === 'image' && item.mediaUrl && (
          <Image source={{ uri: item.mediaUrl }} style={styles.messageImage} />
        )}
        <Text
          style={[
            styles.messageText,
            { color: isMyMessage ? '#fff' : '#000' },
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            { color: isMyMessage ? '#e5e5e5' : '#666' },
          ]}
        >
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: receiverName || 'Chat',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          inverted
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <ImageIcon size={24} color={colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            maxLength={1000}
          />

          {message.trim() ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={sendMessageMutation.isPending}
            >
              <Send size={22} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micButton}>
              <Mic size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  micButton: {
    padding: 8,
    marginLeft: 8,
  },
});
