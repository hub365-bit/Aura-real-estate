import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Map, 
  Compass, 
  Car, 
  Calendar, 
  Globe, 
  Sparkles,
  MessageSquare 
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useTourist } from '@/contexts/TouristContext';

export default function TourismHub() {
  const router = useRouter();
  const { profile } = useTourist();

  const features = [
    {
      icon: Compass,
      title: 'Tour Guides',
      description: 'Expert local guides',
      route: '/tourism/guides',
      gradient: ['#0891B2', '#22D3EE'],
    },
    {
      icon: Map,
      title: 'Experiences',
      description: 'Unique tours & activities',
      route: '/tourism/experiences',
      gradient: ['#EC4899', '#F472B6'],
    },
    {
      icon: Calendar,
      title: 'My Itinerary',
      description: 'Plan your trip',
      route: '/tourism/itinerary',
      gradient: ['#F59E0B', '#FBBF24'],
    },
    {
      icon: Car,
      title: 'Transport',
      description: 'Transfers & car hire',
      route: '/tourism/transport',
      gradient: ['#10B981', '#34D399'],
    },
    {
      icon: Globe,
      title: 'Cultural Guide',
      description: 'Local tips & customs',
      route: '/tourism/cultural-guide',
      gradient: ['#8B5CF6', '#A78BFA'],
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant',
      description: 'Travel help & tips',
      route: '/tourism/ai-assistant',
      gradient: ['#EF4444', '#F87171'],
    },
  ];

  if (!profile.touristMode) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LinearGradient colors={['#0891B2', '#22D3EE']} style={styles.onboardingGradient}>
          <View style={styles.onboardingContent}>
            <Sparkles size={64} color="#fff" />
            <Text style={styles.onboardingTitle}>Discover Africa</Text>
            <Text style={styles.onboardingDescription}>
              Enable Tourist Mode to unlock personalized travel experiences, local guides, and
              curated itineraries
            </Text>
            <TouchableOpacity
              style={styles.enableButton}
              onPress={() => router.push('/tourism/onboarding')}
            >
              <Text style={styles.enableButtonText}>Enable Tourist Mode</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome, Traveler!</Text>
          <Text style={styles.subGreeting}>
            {profile.nationality} • {profile.preferredCurrency}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings/notifications')}
        >
          <Globe size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Explore</Text>
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={() => router.push(feature.route as any)}
            >
              <LinearGradient colors={feature.gradient as [string, string]} style={styles.featureGradient}>
                <feature.icon size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  onboardingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  onboardingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 24,
    marginBottom: 16,
  },
  onboardingDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  enableButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
  },
  subGreeting: {
    fontSize: 14,
    color: Colors.light.gray,
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: '47%',
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.light.gray,
    lineHeight: 18,
  },
});
