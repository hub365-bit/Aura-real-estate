import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, DollarSign, MapPin, Image as ImageIcon, Video, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PropertyType, ListingCategory } from '@/types';

type Step = 'type' | 'details' | 'location' | 'media' | 'pricing';

export default function CreateListingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [listingType, setListingType] = useState<ListingCategory>('rental');
  const [propertyType, setPropertyType] = useState<PropertyType>('house');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');

  const handleNext = () => {
    const steps: Step[] = ['type', 'details', 'location', 'media', 'pricing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['type', 'details', 'location', 'media', 'pricing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    Alert.alert('Success', 'Your listing has been created successfully!', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What are you listing?</Text>

            <Text style={styles.label}>Listing Type</Text>
            <View style={styles.optionsRow}>
              {(['rental', 'sale', 'hospitality'] as ListingCategory[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionCard,
                    listingType === type && styles.optionCardActive,
                  ]}
                  onPress={() => setListingType(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      listingType === type && styles.optionTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Property Type</Text>
            <View style={styles.optionsGrid}>
              {(['house', 'apartment', 'office', 'land', 'commercial'] as PropertyType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeCard,
                    propertyType === type && styles.typeCardActive,
                  ]}
                  onPress={() => setPropertyType(type)}
                >
                  <Home
                    size={24}
                    color={propertyType === type ? Colors.light.primary : Colors.light.textSecondary}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      propertyType === type && styles.typeTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'details':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Property Details</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Modern 2BR Apartment in Westlands"
              placeholderTextColor={Colors.light.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your property..."
              placeholderTextColor={Colors.light.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Bedrooms</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={bedrooms}
                  onChangeText={setBedrooms}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Bathrooms</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={bathrooms}
                  onChangeText={setBathrooms}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>
        );

      case 'location':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Location</Text>

            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter property address"
              placeholderTextColor={Colors.light.textSecondary}
              value={location}
              onChangeText={setLocation}
            />

            <TouchableOpacity style={styles.mapButton} activeOpacity={0.7}>
              <MapPin size={20} color={Colors.light.primary} />
              <Text style={styles.mapButtonText}>Select on Map</Text>
            </TouchableOpacity>
          </View>
        );

      case 'media':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Photos & Videos</Text>

            <TouchableOpacity style={styles.uploadCard} activeOpacity={0.7}>
              <ImageIcon size={32} color={Colors.light.primary} />
              <Text style={styles.uploadTitle}>Add Photos</Text>
              <Text style={styles.uploadSubtitle}>Up to 12 photos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadCard} activeOpacity={0.7}>
              <Video size={32} color={Colors.light.secondary} />
              <Text style={styles.uploadTitle}>Add Videos</Text>
              <Text style={styles.uploadSubtitle}>Up to 2 videos</Text>
            </TouchableOpacity>
          </View>
        );

      case 'pricing':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Pricing</Text>

            <Text style={styles.label}>
              Price * {listingType === 'rental' && '(per month)'}
            </Text>
            <View style={styles.priceInputContainer}>
              <DollarSign size={20} color={Colors.light.textSecondary} />
              <TextInput
                style={styles.priceInput}
                placeholder="0"
                placeholderTextColor={Colors.light.textSecondary}
                value={price}
                onChangeText={setPrice}
                keyboardType="number-pad"
              />
              <Text style={styles.currency}>KSh</Text>
            </View>

            <View style={styles.boostCard}>
              <Text style={styles.boostTitle}>🚀 Boost Your Listing</Text>
              <Text style={styles.boostText}>
                Get more visibility and reach potential clients faster
              </Text>
              <TouchableOpacity style={styles.boostButton} activeOpacity={0.7}>
                <Plus size={16} color={Colors.light.surface} />
                <Text style={styles.boostButtonText}>Add Boost</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const steps: Step[] = ['type', 'details', 'location', 'media', 'pricing'];
  const progress = ((steps.indexOf(currentStep) + 1) / steps.length) * 100;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === 'pricing' ? 'Submit' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.light.surface,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  headerPlaceholder: {
    width: 50,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.border,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.light.surface,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  optionCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '15',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  optionTextActive: {
    color: Colors.light.primary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  typeCardActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '15',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  typeTextActive: {
    color: Colors.light.primary,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    paddingVertical: 14,
  },
  mapButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  uploadCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  priceInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    marginLeft: 8,
  },
  currency: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  boostCard: {
    backgroundColor: Colors.light.secondary + '15',
    borderRadius: 16,
    padding: 20,
  },
  boostTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  boostText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  boostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  boostButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
});
