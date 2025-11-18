import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRorkAgent, createRorkTool } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';

export default function Chatbot() {
  const [input, setInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { messages, sendMessage } = useRorkAgent({
    tools: {
      searchProperties: createRorkTool({
        description: 'Search for properties based on user criteria',
        zodSchema: z.object({
          location: z.string().describe('Location to search in'),
          propertyType: z.string().optional().describe('Type of property'),
          minPrice: z.number().optional().describe('Minimum price'),
          maxPrice: z.number().optional().describe('Maximum price'),
          bedrooms: z.number().optional().describe('Number of bedrooms'),
        }),
        execute(params) {
          const results = [
            {
              id: 'p1',
              title: `Modern ${params.propertyType || 'Apartment'} in ${params.location}`,
              price: params.minPrice ? params.minPrice + 5000 : 45000,
              bedrooms: params.bedrooms || 2,
            },
            {
              id: 'p2',
              title: `Luxury ${params.propertyType || 'House'} in ${params.location}`,
              price: params.maxPrice ? params.maxPrice - 10000 : 75000,
              bedrooms: params.bedrooms ? params.bedrooms + 1 : 3,
            },
          ];
          return JSON.stringify(results);
        },
      }),
      bookViewing: createRorkTool({
        description: 'Book a property viewing appointment',
        zodSchema: z.object({
          propertyId: z.string().describe('ID of the property to view'),
          date: z.string().describe('Preferred date for viewing'),
          time: z.string().describe('Preferred time for viewing'),
        }),
        execute(params) {
          const result = {
            success: true,
            message: `Viewing booked for ${params.date} at ${params.time}`,
            bookingRef: `BK${Date.now()}`,
          };
          return JSON.stringify(result);
        },
      }),
      checkAvailability: createRorkTool({
        description: 'Check if a property is still available',
        zodSchema: z.object({
          propertyId: z.string().describe('ID of the property to check'),
        }),
        execute(params) {
          const result = {
            available: true,
            message: `Property ${params.propertyId} is currently available`,
          };
          return JSON.stringify(result);
        },
      }),
    },
  });

  useEffect(() => {
    if (messages.length === 0) {
      sendMessage({
        text: "Hello! I'm your Aura assistant. I can help you find properties, book viewings, and answer questions about listings. What would you like to know?",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage({ text: input.trim() });
      setInput('');
    }
  };

  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id || index}
        style={[styles.messageContainer, isUser && styles.userMessageContainer]}
      >
        <View style={[styles.avatarContainer, isUser && styles.userAvatar]}>
          {isUser ? (
            <User size={20} color="#fff" />
          ) : (
            <Bot size={20} color="#fff" />
          )}
        </View>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          {message.parts?.map((part: any, i: number) => {
            if (part.type === 'text') {
              return (
                <Text
                  key={i}
                  style={[
                    styles.messageText,
                    isUser && styles.userMessageText,
                  ]}
                >
                  {part.text}
                </Text>
              );
            }
            if (part.type === 'tool') {
              if (part.state === 'input-available' || part.state === 'input-streaming') {
                return (
                  <View key={i} style={styles.toolIndicator}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.toolText}>
                      Using {part.toolName}...
                    </Text>
                  </View>
                );
              }
              if (part.state === 'output-available') {
                return (
                  <View key={i} style={styles.toolResult}>
                    <Text style={styles.toolResultText}>
                      ✓ {part.toolName} completed
                    </Text>
                  </View>
                );
              }
            }
            return null;
          })}
        </View>
      </View>
    );
  };

  const quickActions = [
    { text: 'Find properties in Westlands', icon: '🏠' },
    { text: 'Book a viewing', icon: '📅' },
    { text: 'Check property availability', icon: '✓' },
    { text: 'Tell me about pricing', icon: '💰' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.botAvatar}>
            <Bot size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Aura Assistant</Text>
            <Text style={styles.headerSubtitle}>AI-powered support</Text>
          </View>
        </View>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => renderMessage(message, index))}
          
          {messages.length <= 1 && (
            <View style={styles.quickActionsContainer}>
              <Text style={styles.quickActionsTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickActionButton}
                    onPress={() => sendMessage({ text: action.text })}
                  >
                    <Text style={styles.quickActionIcon}>{action.icon}</Text>
                    <Text style={styles.quickActionText}>{action.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  userMessageContainer: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    backgroundColor: colors.info,
  },
  messageBubble: {
    flex: 1,
    maxWidth: '75%',
    padding: 14,
    borderRadius: 16,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  userMessageText: {
    color: '#fff',
  },
  toolIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  toolText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  toolResult: {
    paddingVertical: 4,
  },
  toolResultText: {
    fontSize: 13,
    color: colors.success,
  },
  quickActionsContainer: {
    marginTop: 20,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderRadius: 24,
    fontSize: 15,
    color: colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
