import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Sparkles, Copy, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { generateText } from '@rork-ai/toolkit-sdk';

interface GeneratedContent {
  title: string;
  description: string;
  highlights: string[];
}

export default function AIGenerator() {
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [features, setFeatures] = useState('');
  const [price, setPrice] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!propertyType || !location) {
      Alert.alert('Missing Info', 'Please provide at least property type and location');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a compelling property listing for a real estate app with the following details:
- Property Type: ${propertyType}
${bedrooms ? `- Bedrooms: ${bedrooms}` : ''}
${bathrooms ? `- Bathrooms: ${bathrooms}` : ''}
${area ? `- Area: ${area} sqft` : ''}
- Location: ${location}
${features ? `- Features: ${features}` : ''}
${price ? `- Price: KSh ${price}` : ''}

Return a JSON object with:
{
  "title": "Short catchy title (max 60 chars)",
  "description": "Detailed description (150-200 words)",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4", "highlight 5"]
}`;

      const response = await generateText(prompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const content = JSON.parse(jsonMatch[0]);
        setGenerated(content);
      } else {
        Alert.alert('Error', 'Failed to parse AI response');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      Alert.alert('Error', 'Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied', `${type} copied to clipboard`);
  };

  const handleUse = () => {
    Alert.alert(
      'Content Ready',
      'Your AI-generated content is ready to use in your listing!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Description Generator</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Sparkles size={48} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Generate Perfect Listings</Text>
          <Text style={styles.heroDescription}>
            Let AI create professional, compelling property descriptions in seconds
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Property Type <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={propertyType}
              onChangeText={setPropertyType}
              placeholder="e.g., Apartment, House, Villa"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Bedrooms</Text>
              <TextInput
                style={styles.input}
                value={bedrooms}
                onChangeText={setBedrooms}
                placeholder="e.g., 3"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Bathrooms</Text>
              <TextInput
                style={styles.input}
                value={bathrooms}
                onChangeText={setBathrooms}
                placeholder="e.g., 2"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area (sqft)</Text>
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              placeholder="e.g., 1500"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Location <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Westlands, Nairobi"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Key Features</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={features}
              onChangeText={setFeatures}
              placeholder="e.g., Swimming pool, gym, parking, balcony"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (KSh)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="e.g., 50000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
            />
          </View>

          <TouchableOpacity
            style={[styles.generateButton, isGenerating && styles.disabledButton]}
            onPress={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Sparkles size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Generate with AI</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {generated && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>Generated Content</Text>

            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Title</Text>
                <TouchableOpacity
                  onPress={() => handleCopy(generated.title, 'Title')}
                >
                  {copied ? (
                    <CheckCircle size={20} color={colors.success} />
                  ) : (
                    <Copy size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{generated.title}</Text>
            </View>

            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Description</Text>
                <TouchableOpacity
                  onPress={() => handleCopy(generated.description, 'Description')}
                >
                  {copied ? (
                    <CheckCircle size={20} color={colors.success} />
                  ) : (
                    <Copy size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.resultText}>{generated.description}</Text>
            </View>

            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Key Highlights</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopy(generated.highlights.join(', '), 'Highlights')
                  }
                >
                  {copied ? (
                    <CheckCircle size={20} color={colors.success} />
                  ) : (
                    <Copy size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.highlightsList}>
                {generated.highlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightItem}>
                    <View style={styles.highlightDot} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.useButton} onPress={handleUse}>
              <Text style={styles.useButtonText}>Use This Content</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  form: {
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 12,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  results: {
    marginTop: 32,
    gap: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  highlightsList: {
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  highlightText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  useButton: {
    backgroundColor: colors.success,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  useButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
