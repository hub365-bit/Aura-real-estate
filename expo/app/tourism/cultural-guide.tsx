import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Shield, 
  Phone, 
  Wifi, 
  DollarSign,
  Heart,
  Languages,
  Sun,
  AlertCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';

const CULTURAL_DATA = {
  location: 'Nairobi',
  country: 'Kenya',
  customsAndEtiquette: [
    'Greet people with "Jambo" or "Habari" in Swahili',
    'Handshakes are common, often with both hands showing respect',
    'Remove shoes before entering homes',
    'Use your right hand for eating and greeting',
    'Ask permission before taking photos of people',
  ],
  dressCode: 'Smart casual is generally acceptable. In coastal areas and Muslim regions, dress more conservatively. Avoid wearing camouflage clothing.',
  safetyTips: [
    'Keep valuables hidden and be aware of surroundings',
    'Use official taxis or ride-hailing apps',
    'Avoid walking alone at night',
    'Keep copies of important documents',
    'Be cautious with street vendors',
  ],
  emergencyContacts: [
    { name: 'Police', number: '999' },
    { name: 'Ambulance', number: '999' },
    { name: 'Tourist Police', number: '+254 20 604767' },
  ],
  simCardProviders: [
    { name: 'Safaricom', coverage: 'Best nationwide coverage', plans: 'From KES 50/day' },
    { name: 'Airtel', coverage: 'Good urban coverage', plans: 'From KES 100/week' },
    { name: 'Telkom', coverage: 'Urban areas', plans: 'From KES 150/week' },
  ],
  internetAvailability: 'Wi-Fi available in most hotels and restaurants. Mobile data is reliable and affordable.',
  tippingCulture: 'Tipping is appreciated but not mandatory. 10% in restaurants if service charge not included. KES 100-200 for guides.',
  localPhrases: [
    { phrase: 'Hello', translation: 'Jambo / Habari', pronunciation: 'JAM-bo / ha-BAH-ree' },
    { phrase: 'Thank you', translation: 'Asante', pronunciation: 'ah-SAHN-teh' },
    { phrase: 'How much?', translation: 'Ni bei gani?', pronunciation: 'nee bay GAH-nee' },
    { phrase: 'Yes', translation: 'Ndiyo', pronunciation: 'n-DEE-yo' },
    { phrase: 'No', translation: 'Hapana', pronunciation: 'hah-PAH-nah' },
  ],
  bestTimeToVisit: 'June to October (dry season) and January to February for wildlife viewing',
  healthRequirements: [
    'Yellow fever vaccine certificate required',
    'Malaria prophylaxis recommended',
    'Drink bottled or boiled water',
    'Travel insurance strongly recommended',
  ],
};

export default function CulturalGuideScreen() {
  const router = useRouter();

  const Section = ({ 
    icon: Icon, 
    title, 
    children 
  }: { 
    icon: any; 
    title: string; 
    children: React.ReactNode 
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={Colors.light.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cultural Guide</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{CULTURAL_DATA.location}, {CULTURAL_DATA.country}</Text>
          <Text style={styles.heroSubtitle}>Know Before You Go</Text>
        </View>

        <Section icon={Heart} title="Customs & Etiquette">
          {CULTURAL_DATA.customsAndEtiquette.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </Section>

        <Section icon={AlertCircle} title="Dress Code">
          <Text style={styles.bodyText}>{CULTURAL_DATA.dressCode}</Text>
        </Section>

        <Section icon={Shield} title="Safety Tips">
          {CULTURAL_DATA.safetyTips.map((tip, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{tip}</Text>
            </View>
          ))}
        </Section>

        <Section icon={Phone} title="Emergency Contacts">
          {CULTURAL_DATA.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <TouchableOpacity style={styles.phoneButton}>
                <Phone size={16} color="#fff" />
                <Text style={styles.phoneNumber}>{contact.number}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Section>

        <Section icon={Wifi} title="SIM Cards & Internet">
          <Text style={styles.bodyText}>{CULTURAL_DATA.internetAvailability}</Text>
          <View style={styles.providersContainer}>
            {CULTURAL_DATA.simCardProviders.map((provider, index) => (
              <View key={index} style={styles.providerCard}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerDetail}>{provider.coverage}</Text>
                <Text style={styles.providerPrice}>{provider.plans}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section icon={DollarSign} title="Tipping Culture">
          <Text style={styles.bodyText}>{CULTURAL_DATA.tippingCulture}</Text>
        </Section>

        <Section icon={Languages} title="Local Phrases">
          {CULTURAL_DATA.localPhrases.map((phrase, index) => (
            <View key={index} style={styles.phraseCard}>
              <View style={styles.phraseHeader}>
                <Text style={styles.phraseEnglish}>{phrase.phrase}</Text>
                <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
              </View>
              <Text style={styles.phrasePronunciation}>{phrase.pronunciation}</Text>
            </View>
          ))}
        </Section>

        <Section icon={Sun} title="Best Time to Visit">
          <Text style={styles.bodyText}>{CULTURAL_DATA.bestTimeToVisit}</Text>
        </Section>

        <Section icon={AlertCircle} title="Health Requirements">
          {CULTURAL_DATA.healthRequirements.map((req, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{req}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
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
    paddingVertical: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  hero: {
    backgroundColor: Colors.light.primary,
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
  },
  sectionContent: {
    gap: 12,
  },
  bodyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.primary,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  phoneNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  providersContainer: {
    gap: 12,
    marginTop: 12,
  },
  providerCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  providerDetail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  providerPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  phraseCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  phraseEnglish: {
    fontSize: 15,
    color: Colors.light.gray,
  },
  phraseTranslation: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  phrasePronunciation: {
    fontSize: 13,
    color: Colors.light.primary,
    fontStyle: 'italic',
  },
});
