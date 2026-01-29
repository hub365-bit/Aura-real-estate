import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, Globe, Calendar, Heart, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTourist } from '@/contexts/TouristContext';
import { TouristInterest, GroupType, Currency } from '@/types';

const INTERESTS: { value: TouristInterest; label: string; icon: string }[] = [
  { value: 'safari', label: 'Safari', icon: '🦁' },
  { value: 'beach', label: 'Beach', icon: '🏖️' },
  { value: 'culture', label: 'Culture', icon: '🏛️' },
  { value: 'food', label: 'Food', icon: '🍽️' },
  { value: 'nightlife', label: 'Nightlife', icon: '🎉' },
  { value: 'adventure', label: 'Adventure', icon: '⛰️' },
  { value: 'wellness', label: 'Wellness', icon: '🧘' },
  { value: 'photography', label: 'Photography', icon: '📸' },
];

const GROUP_TYPES: { value: GroupType; label: string }[] = [
  { value: 'solo', label: 'Solo Traveler' },
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'group', label: 'Group' },
];

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'KES', label: 'Kenyan Shilling', symbol: 'KES' },
  { value: 'TZS', label: 'Tanzanian Shilling', symbol: 'TZS' },
  { value: 'UGX', label: 'Ugandan Shilling', symbol: 'UGX' },
];

export default function TouristOnboarding() {
  const router = useRouter();
  const { enableTouristMode, profile } = useTourist();
  const [step, setStep] = useState(1);
  const [nationality, setNationality] = useState('');
  const [language, setLanguage] = useState('en');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interests, setInterests] = useState<TouristInterest[]>([]);
  const [groupType, setGroupType] = useState<GroupType>('solo');
  const [currency, setCurrency] = useState<Currency>('USD');

  const toggleInterest = (interest: TouristInterest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleComplete = () => {
    enableTouristMode({
      userId: profile.userId,
      nationality,
      preferredLanguage: language,
      travelDates: startDate && endDate ? { start: startDate, end: endDate } : undefined,
      interests,
      groupType,
      preferredCurrency: currency,
      travelHistory: [],
    });
    router.push('/tourism');
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Welcome, Explorer! 🌍</Text>
      <Text style={styles.stepDescription}>
        Let's personalize your travel experience in Africa
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Where are you from?</Text>
        <View style={styles.inputWrapper}>
          <Globe size={20} color={Colors.light.gray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Your country"
            value={nationality}
            onChangeText={setNationality}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Language</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="English, Swahili, French..."
            value={language}
            onChangeText={setLanguage}
            placeholderTextColor={Colors.light.gray}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Travel Dates (Optional)</Text>
        <View style={styles.dateRow}>
          <View style={[styles.inputWrapper, styles.dateInput]}>
            <Calendar size={20} color={Colors.light.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Start date"
              value={startDate}
              onChangeText={setStartDate}
              placeholderTextColor={Colors.light.gray}
            />
          </View>
          <View style={[styles.inputWrapper, styles.dateInput]}>
            <Calendar size={20} color={Colors.light.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="End date"
              value={endDate}
              onChangeText={setEndDate}
              placeholderTextColor={Colors.light.gray}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !nationality && styles.nextButtonDisabled]}
        onPress={() => setStep(2)}
        disabled={!nationality}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What interests you?</Text>
      <Text style={styles.stepDescription}>Select all that apply</Text>

      <View style={styles.interestsGrid}>
        {INTERESTS.map((item) => {
          const isSelected = interests.includes(item.value);
          return (
            <TouchableOpacity
              key={item.value}
              style={[styles.interestCard, isSelected && styles.interestCardSelected]}
              onPress={() => toggleInterest(item.value)}
            >
              <Text style={styles.interestIcon}>{item.icon}</Text>
              <Text style={[styles.interestLabel, isSelected && styles.interestLabelSelected]}>
                {item.label}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Check size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, interests.length === 0 && styles.nextButtonDisabled]}
        onPress={() => setStep(3)}
        disabled={interests.length === 0}
      >
        <Text style={styles.nextButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Travel Style</Text>
      <Text style={styles.stepDescription}>How are you traveling?</Text>

      <View style={styles.groupTypeContainer}>
        {GROUP_TYPES.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.groupTypeCard,
              groupType === item.value && styles.groupTypeCardSelected,
            ]}
            onPress={() => setGroupType(item.value)}
          >
            <Users size={24} color={groupType === item.value ? '#fff' : Colors.light.primary} />
            <Text
              style={[
                styles.groupTypeLabel,
                groupType === item.value && styles.groupTypeLabelSelected,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Currency</Text>
        <View style={styles.currencyGrid}>
          {CURRENCIES.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.currencyCard,
                currency === item.value && styles.currencyCardSelected,
              ]}
              onPress={() => setCurrency(item.value)}
            >
              <Text
                style={[
                  styles.currencySymbol,
                  currency === item.value && styles.currencySymbolSelected,
                ]}
              >
                {item.symbol}
              </Text>
              <Text
                style={[
                  styles.currencyLabel,
                  currency === item.value && styles.currencyLabelSelected,
                ]}
              >
                {item.value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleComplete}>
        <Text style={styles.nextButtonText}>Start Exploring</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#0891B2', '#22D3EE']} style={styles.gradient}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          {step > 1 && (
            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                style={[styles.stepDot, s <= step && styles.stepDotActive]}
              />
            ))}
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  interestCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  interestCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  interestIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  interestLabelSelected: {
    color: Colors.light.primary,
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTypeContainer: {
    gap: 12,
    marginBottom: 32,
  },
  groupTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  groupTypeCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  groupTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  groupTypeLabelSelected: {
    color: Colors.light.primary,
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  currencyCard: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  currencyCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  currencySymbolSelected: {
    color: Colors.light.primary,
  },
  currencyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  currencyLabelSelected: {
    color: Colors.light.primary,
  },
  nextButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
