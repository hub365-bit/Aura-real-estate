import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Award, ExternalLink, Shield, MapPin, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Partner {
  id: string;
  name: string;
  type: 'national_park' | 'museum' | 'tourism_board' | 'operator';
  description: string;
  image: string;
  verified: boolean;
  location: string;
  events?: string[];
}

const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'Kenya Wildlife Service',
    type: 'national_park',
    description: 'Official manager of all national parks and reserves in Kenya. Book park entry and conservation fees directly.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400',
    verified: true,
    location: 'Nationwide, Kenya',
    events: ['Wildebeest Migration Season', 'Rhino Charge 2026'],
  },
  {
    id: 'p2',
    name: 'National Museums of Kenya',
    type: 'museum',
    description: 'Preserve and present Kenya\'s cultural and natural heritage. Access tickets for museums and heritage sites.',
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=400',
    verified: true,
    location: 'Nairobi, Mombasa, Kisumu',
  },
  {
    id: 'p3',
    name: 'Magical Kenya',
    type: 'tourism_board',
    description: 'Official tourism board promoting Kenya as a premium travel destination. Verified travel information and campaigns.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
    verified: true,
    location: 'Kenya',
    events: ['Magical Kenya Travel Expo', 'Tourism Week'],
  },
  {
    id: 'p4',
    name: 'Porini Safari Camps',
    type: 'operator',
    description: 'Eco-tourism operator with community-owned camps in prime wildlife conservancies.',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400',
    verified: true,
    location: 'Maasai Mara, Amboseli',
  },
];

const TYPE_COLORS: Record<string, string> = {
  national_park: '#10B981',
  museum: '#8B5CF6',
  tourism_board: '#0891B2',
  operator: '#F59E0B',
};

const TYPE_LABELS: Record<string, string> = {
  national_park: 'National Park',
  museum: 'Museum & Heritage',
  tourism_board: 'Tourism Board',
  operator: 'Tour Operator',
};

export default function PartnersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Official Partners</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Shield size={32} color={Colors.light.primary} />
          <Text style={styles.introTitle}>Verified Tourism Partners</Text>
          <Text style={styles.introText}>
            Aura partners with official tourism authorities to provide authentic, verified experiences and seamless bookings.
          </Text>
        </View>

        {MOCK_PARTNERS.map((partner) => (
          <View key={partner.id} style={styles.partnerCard}>
            <Image source={{ uri: partner.image }} style={styles.partnerImage} />
            <View style={styles.partnerContent}>
              <View style={styles.partnerHeader}>
                <View style={styles.nameRow}>
                  <Text style={styles.partnerName}>{partner.name}</Text>
                  {partner.verified && (
                    <View style={styles.verifiedBadge}>
                      <Award size={14} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[partner.type] + '15' }]}>
                  <Text style={[styles.typeText, { color: TYPE_COLORS[partner.type] }]}>
                    {TYPE_LABELS[partner.type]}
                  </Text>
                </View>
              </View>

              <Text style={styles.partnerDescription}>{partner.description}</Text>

              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.light.gray} />
                <Text style={styles.locationText}>{partner.location}</Text>
              </View>

              {partner.events && partner.events.length > 0 && (
                <View style={styles.eventsSection}>
                  <View style={styles.eventsHeader}>
                    <Calendar size={14} color={Colors.light.secondary} />
                    <Text style={styles.eventsTitle}>Upcoming Events</Text>
                  </View>
                  {partner.events.map((event, i) => (
                    <Text key={i} style={styles.eventItem}>• {event}</Text>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>View Partner Page</Text>
                <ExternalLink size={16} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  placeholder: { width: 32 },
  content: { flex: 1, padding: 20 },
  introCard: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  partnerCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  partnerImage: {
    width: '100%',
    height: 160,
  },
  partnerContent: {
    padding: 16,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
  },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  partnerDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: Colors.light.gray,
  },
  eventsSection: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  eventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  eventsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.secondary,
  },
  eventItem: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginLeft: 4,
    marginBottom: 2,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
