import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Check, Phone, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { TourismInsurance } from '@/types';
import { useCurrencyConverter } from '@/contexts/TouristContext';

const MOCK_INSURANCE: TourismInsurance[] = [
  {
    id: 'i1',
    name: 'Essential Travel Cover',
    provider: 'Aura Shield',
    coverage: ['Medical emergencies up to $50,000', 'Trip cancellation', 'Lost baggage', '24/7 emergency assistance'],
    price: 25,
    currency: 'USD',
    maxCoverage: 50000,
    duration: 7,
    durationUnit: 'days',
  },
  {
    id: 'i2',
    name: 'Comprehensive Safari Cover',
    provider: 'Aura Shield',
    coverage: ['Medical emergencies up to $100,000', 'Trip cancellation & interruption', 'Adventure activity coverage', 'Evacuation & repatriation', 'Personal liability'],
    price: 55,
    currency: 'USD',
    maxCoverage: 100000,
    duration: 14,
    durationUnit: 'days',
  },
  {
    id: 'i3',
    name: 'Tour Cancellation Protect',
    provider: 'Aura Partners',
    coverage: ['100% refund on cancellations', 'Rescheduling protection', 'Missed connection cover'],
    price: 15,
    currency: 'USD',
    maxCoverage: 5000,
    duration: 7,
    durationUnit: 'days',
  },
];

export default function InsuranceScreen() {
  const router = useRouter();
  const { formatPrice } = useCurrencyConverter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel Protection</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Shield size={40} color={Colors.light.primary} />
          </View>
          <Text style={styles.heroTitle}>Travel with Confidence</Text>
          <Text style={styles.heroSubtitle}>
            Optional insurance and protection add-ons for your African adventures
          </Text>
        </View>

        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Phone size={20} color={Colors.light.error} />
            <Text style={styles.emergencyTitle}>Emergency Support Hotline</Text>
          </View>
          <Text style={styles.emergencyNumber}>+254 700 123 456</Text>
          <Text style={styles.emergencyNote}>Available 24/7 for all insured travelers</Text>
        </View>

        <Text style={styles.sectionTitle}>Protection Plans</Text>

        {MOCK_INSURANCE.map((plan) => {
          const isSelected = selectedId === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, isSelected && styles.planCardSelected]}
              onPress={() => setSelectedId(isSelected ? null : plan.id)}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planProvider}>by {plan.provider}</Text>
                </View>
                <View style={styles.planPrice}>
                  <Text style={styles.priceAmount}>{formatPrice(plan.price, 'USD')}</Text>
                  <Text style={styles.priceUnit}>/{plan.duration} {plan.durationUnit}</Text>
                </View>
              </View>

              <View style={styles.coverageList}>
                {plan.coverage.map((item, i) => (
                  <View key={i} style={styles.coverageItem}>
                    <Check size={16} color={Colors.light.success} />
                    <Text style={styles.coverageText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.planFooter}>
                <Text style={styles.maxCoverage}>Max coverage: {formatPrice(plan.maxCoverage, 'USD')}</Text>
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedText}>Selected</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.checkoutButton} disabled={!selectedId}>
          <Text style={styles.checkoutButtonText}>
            {selectedId ? 'Add Protection at Checkout' : 'Select a Plan'}
          </Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
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
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: Colors.light.text, marginBottom: 8 },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emergencyCard: {
    backgroundColor: Colors.light.error + '10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.error + '30',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  emergencyTitle: { fontSize: 16, fontWeight: '700', color: Colors.light.error },
  emergencyNumber: { fontSize: 22, fontWeight: '800', color: Colors.light.text, marginBottom: 4 },
  emergencyNote: { fontSize: 13, color: Colors.light.textSecondary },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.light.text, marginBottom: 16 },
  planCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: { fontSize: 18, fontWeight: '700', color: Colors.light.text },
  planProvider: { fontSize: 13, color: Colors.light.gray, marginTop: 2 },
  planPrice: { alignItems: 'flex-end' },
  priceAmount: { fontSize: 20, fontWeight: '800', color: Colors.light.primary },
  priceUnit: { fontSize: 13, color: Colors.light.gray },
  coverageList: { gap: 10, marginBottom: 16 },
  coverageItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  coverageText: { fontSize: 14, color: Colors.light.textSecondary, flex: 1, lineHeight: 20 },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.borderLight,
    paddingTop: 12,
  },
  maxCoverage: { fontSize: 13, color: Colors.light.gray },
  selectedBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  selectedText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 8,
    marginTop: 8,
    marginBottom: 32,
    opacity: 1,
  },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
