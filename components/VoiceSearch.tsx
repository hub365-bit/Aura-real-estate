import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Mic, X, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface VoiceSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function VoiceSearch({
  onSearch,
  placeholder = 'Search properties...',
}: VoiceSearchProps) {
  const [query, setQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleVoiceSearch = () => {
    console.log('🎤 Voice search triggered');
    setIsListening(true);

    setTimeout(() => {
      const mockTranscription = '3 bedroom apartment in Kilimani';
      setQuery(mockTranscription);
      setIsListening(false);
      onSearch && onSearch(mockTranscription);
    }, 2000);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch && onSearch(query);
    }
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);

    if (text.length > 2) {
      const mockSuggestions = [
        `${text} in Kilimani`,
        `${text} near me`,
        `${text} with parking`,
        `${text} under 50000`,
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color="#666" />
        
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleQueryChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onSubmitEditing={handleSearch}
          editable={!isListening}
        />

        {query.length > 0 && !isListening && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <X size={20} color="#666" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.listeningButton,
          ]}
          onPress={handleVoiceSearch}
          disabled={isListening}
        >
          {isListening ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Mic size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {isListening && (
        <View style={styles.listeningIndicator}>
          <View style={styles.waveDot} />
          <View style={[styles.waveDot, styles.waveDot2]} />
          <View style={[styles.waveDot, styles.waveDot3]} />
          <Text style={styles.listeningText}>Listening...</Text>
        </View>
      )}

      {suggestions.length > 0 && !isListening && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => {
                  setQuery(item);
                  setSuggestions([]);
                  onSearch && onSearch(item);
                }}
              >
                <Search size={16} color="#999" />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  voiceButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningButton: {
    backgroundColor: '#ef4444',
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  waveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  waveDot2: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  waveDot3: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listeningText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#000',
  },
});
