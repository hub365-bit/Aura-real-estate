import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useRorkAgent, createRorkTool } from '@rork-ai/toolkit-sdk';
import { z } from 'zod';
import { useTourist } from '@/contexts/TouristContext';

export default function AIAssistantScreen() {
  const router = useRouter();
  const { profile } = useTourist();
  const [input, setInput] = useState('');

  const { messages, error, sendMessage, isLoading } = useRorkAgent({
    tools: {
      searchExperiences: createRorkTool({
        description: 'Search for tours and experiences based on user preferences',
        zodSchema: z.object({
          type: z.enum(['safari', 'city', 'cultural', 'food', 'hiking', 'nightlife', 'multi_day']).describe('Type of experience'),
          location: z.string().describe('Location to search in'),
        }),
        execute(input) {
          return { message: `Found experiences in ${input.location} for ${input.type} tours` };
        },
      }),
      bookingAssistance: createRorkTool({
        description: 'Help with booking process',
        zodSchema: z.object({
          bookingType: z.enum(['hotel', 'tour', 'transport']).describe('Type of booking'),
          details: z.string().describe('Booking details'),
        }),
        execute(input) {
          return { message: `I can help you book a ${input.bookingType}. ${input.details}` };
        },
      }),
      currencyConversion: createRorkTool({
        description: 'Convert currency for the user',
        zodSchema: z.object({
          amount: z.number().describe('Amount to convert'),
          fromCurrency: z.string().describe('Source currency'),
          toCurrency: z.string().describe('Target currency'),
        }),
        execute(input) {
          return { message: `${input.amount} ${input.fromCurrency} is approximately ${input.amount * 1.1} ${input.toCurrency}` };
        },
      }),
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    const context = `User is from ${profile.nationality}, interested in: ${profile.interests.join(', ')}, traveling as ${profile.groupType}, prefers ${profile.preferredCurrency}`;
    sendMessage(`${context}\n\nUser question: ${input}`);
    setInput('');
  };

  const QUICK_QUESTIONS = [
    'What are the best safari tours?',
    'How do I get to Nairobi National Park?',
    'What should I wear?',
    'Is it safe to travel alone?',
    'Best time to visit Kenya?',
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Sparkles size={20} color={Colors.light.primary} />
          <Text style={styles.headerTitle}>AI Travel Assistant</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        style={styles.flex} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIcon}>
                <Sparkles size={48} color={Colors.light.primary} />
              </View>
              <Text style={styles.welcomeTitle}>Hello, Traveler! 👋</Text>
              <Text style={styles.welcomeText}>
                I'm your AI travel assistant. Ask me anything about traveling in Kenya and Africa!
              </Text>
              <View style={styles.quickQuestions}>
                <Text style={styles.quickQuestionsTitle}>Quick questions:</Text>
                {QUICK_QUESTIONS.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickQuestionChip}
                    onPress={() => setInput(question)}
                  >
                    <Text style={styles.quickQuestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {messages.map((message, index) => (
            <View key={message.id || index} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.assistantIcon}>
                    <Sparkles size={16} color="#fff" />
                  </View>
                )}
                {message.parts.map((part, partIndex) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Text
                          key={partIndex}
                          style={[
                            styles.messageText,
                            message.role === 'user' ? styles.userText : styles.assistantText,
                          ]}
                        >
                          {part.text}
                        </Text>
                      );
                    case 'tool':
                      if (part.state === 'input-streaming' || part.state === 'input-available') {
                        return (
                          <View key={partIndex} style={styles.toolIndicator}>
                            <Text style={styles.toolText}>🔍 {part.toolName}...</Text>
                          </View>
                        );
                      }
                      if (part.state === 'output-available') {
                        return (
                          <View key={partIndex} style={styles.toolResult}>
                            <Text style={styles.toolResultText}>
                              ✅ {JSON.stringify(part.output)}
                            </Text>
                          </View>
                        );
                      }
                      break;
                  }
                  return null;
                })}
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDot} />
              <View style={styles.loadingDot} />
              <View style={styles.loadingDot} />
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            value={input}
            onChangeText={setInput}
            placeholderTextColor={Colors.light.gray}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
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
    backgroundColor: Colors.light.background,
  },
  flex: {
    flex: 1,
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
  backButton: {
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  welcomeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  quickQuestions: {
    width: '100%',
    gap: 8,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.gray,
    marginBottom: 8,
  },
  quickQuestionChip: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quickQuestionText: {
    fontSize: 15,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  messageWrapper: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: Colors.light.primary,
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: Colors.light.surface,
    alignSelf: 'flex-start',
  },
  assistantIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: Colors.light.text,
  },
  toolIndicator: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  toolText: {
    fontSize: 13,
    color: Colors.light.gray,
    fontStyle: 'italic',
  },
  toolResult: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  toolResultText: {
    fontSize: 13,
    color: Colors.light.success,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.gray,
  },
  errorContainer: {
    backgroundColor: Colors.light.error,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
