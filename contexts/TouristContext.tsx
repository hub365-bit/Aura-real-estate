import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { TouristProfile, TouristInterest, GroupType, Currency } from '@/types';

const TOURIST_PROFILE_KEY = '@aura_tourist_profile';

const DEFAULT_TOURIST_PROFILE: TouristProfile = {
  userId: '',
  touristMode: false,
  nationality: '',
  preferredLanguage: 'en',
  interests: [],
  groupType: 'solo',
  preferredCurrency: 'USD',
  travelHistory: [],
};

export const [TouristProvider, useTourist] = createContextHook(() => {
  const [profile, setProfile] = useState<TouristProfile>(DEFAULT_TOURIST_PROFILE);

  const profileQuery = useQuery({
    queryKey: ['tourist-profile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(TOURIST_PROFILE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_TOURIST_PROFILE;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (newProfile: TouristProfile) => {
      await AsyncStorage.setItem(TOURIST_PROFILE_KEY, JSON.stringify(newProfile));
      return newProfile;
    },
    onSuccess: (data) => {
      setProfile(data);
    },
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  const enableTouristMode = (data: Partial<TouristProfile>) => {
    const updated = { ...profile, ...data, touristMode: true };
    saveMutation.mutate(updated);
  };

  const disableTouristMode = () => {
    const updated = { ...profile, touristMode: false };
    saveMutation.mutate(updated);
  };

  const updateProfile = (data: Partial<TouristProfile>) => {
    const updated = { ...profile, ...data };
    saveMutation.mutate(updated);
  };

  const addInterest = (interest: TouristInterest) => {
    if (!profile.interests.includes(interest)) {
      const updated = { ...profile, interests: [...profile.interests, interest] };
      saveMutation.mutate(updated);
    }
  };

  const removeInterest = (interest: TouristInterest) => {
    const updated = {
      ...profile,
      interests: profile.interests.filter((i) => i !== interest),
    };
    saveMutation.mutate(updated);
  };

  const setTravelDates = (start: string, end: string) => {
    const updated = { ...profile, travelDates: { start, end } };
    saveMutation.mutate(updated);
  };

  const setCurrency = (currency: Currency) => {
    const updated = { ...profile, preferredCurrency: currency };
    saveMutation.mutate(updated);
  };

  const setGroupType = (groupType: GroupType) => {
    const updated = { ...profile, groupType };
    saveMutation.mutate(updated);
  };

  return {
    profile,
    isLoading: profileQuery.isLoading,
    isSaving: saveMutation.isPending,
    enableTouristMode,
    disableTouristMode,
    updateProfile,
    addInterest,
    removeInterest,
    setTravelDates,
    setCurrency,
    setGroupType,
  };
});

export function useCurrencyConverter() {
  const { profile } = useTourist();
  
  const exchangeRates: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    KES: 129.5,
    TZS: 2350,
    UGX: 3700,
  };

  const convert = (amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount;
    const usdAmount = amount / exchangeRates[from];
    return usdAmount * exchangeRates[to];
  };

  const formatPrice = (amount: number, currency: Currency): string => {
    const symbols: Record<Currency, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      KES: 'KES ',
      TZS: 'TZS ',
      UGX: 'UGX ',
    };
    return `${symbols[currency]}${amount.toLocaleString()}`;
  };

  const convertToPreferred = (amount: number, from: Currency) => {
    return convert(amount, from, profile.preferredCurrency);
  };

  return {
    convert,
    formatPrice,
    convertToPreferred,
    exchangeRates,
    preferredCurrency: profile.preferredCurrency,
  };
}
