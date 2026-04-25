import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Mic, MicOff, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onClose: () => void;
}

export default function VoiceSearch({ onResult, onClose }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    setIsListening(true);
    setTranscript('Listening...');
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    setTimeout(() => {
      setTranscript('"Show me 2 bedroom apartments in Nairobi under 50k"');
    }, 1500);

    setTimeout(() => {
      setIsListening(false);
      pulseAnim.setValue(1);
      onResult('2 bedroom apartments in Nairobi under 50000');
    }, 3000);
  }, [onResult, pulseAnim]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Voice Search</Text>
        <Text style={styles.subtitle}>Tap the microphone and speak naturally</Text>

        <View style={styles.micContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.3], outputRange: [0.5, 0] }) },
            ]}
          />
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={isListening ? stopListening : startListening}
            activeOpacity={0.8}
          >
            {isListening ? <MicOff size={40} color="#fff" /> : <Mic size={40} color="#fff" />}
          </TouchableOpacity>
        </View>

        <Text style={styles.transcript}>{transcript}</Text>

        <View style={styles.examples}>
          <Text style={styles.examplesTitle}>Try saying:</Text>
          {['Safari tours near Nairobi', 'Hotels with pool in Mombasa', '3 bedroom house in Karen'].map((ex, i) => (
            <TouchableOpacity key={i} style={styles.exampleChip} onPress={() => onResult(ex)}>
              <Text style={styles.exampleText}>{ex}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  container: {
    backgroundColor: Colors.light.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    alignItems: 'center',
    minHeight: 500,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 32,
  },
  micContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.primary,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: Colors.light.error,
    shadowColor: Colors.light.error,
  },
  transcript: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    minHeight: 24,
  },
  examples: {
    width: '100%',
    gap: 10,
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.gray,
    marginBottom: 4,
    textAlign: 'center',
  },
  exampleChip: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  exampleText: {
    fontSize: 15,
    color: Colors.light.primary,
  },
});
