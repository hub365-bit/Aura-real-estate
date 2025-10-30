import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SubscriptionTier } from '@/types';

const SUBSCRIPTION_PLANS = [
  {
    category: 'Hotels / Motels / Restaurants',
    tiers: [
      {
        tier: 'weekly' as SubscriptionTier,
        price: 1500,
        features: ['List unlimited properties', 'Featured badge', 'Priority support', 'Analytics dashboard'],
      },
      {
        tier: 'monthly' as SubscriptionTier,
        price: 5000,
        features: ['All weekly features', 'Boost 5 listings/month', 'Custom branding', 'Advanced analytics'],
        popular: true,
      },
      {
        tier: 'yearly' as SubscriptionTier,
        price: 55000,
        features: ['All monthly features', 'Unlimited boosts', 'Priority placement', '2 months free'],
      },
    ],
  },
  {
    category: 'Service Providers',
    tiers: [
      {
        tier: 'weekly' as SubscriptionTier,
        price: 300,
        features: ['List your services', 'Online bookings', 'Basic analytics', 'Email support'],
      },
      {
        tier: 'monthly' as SubscriptionTier,
        price: 1000,
        features: ['All weekly features', 'Featured listing', '24/7 support', 'Customer reviews'],
        popular: true,
      },
      {
        tier: 'yearly' as SubscriptionTier,
        price: 11000,
        features: ['All monthly features', 'Priority support', 'Marketing tools', '1 month free'],
      },
    ],
  },
  {
    category: 'Property Agents',
    tiers: [
      {
        tier: 'weekly' as SubscriptionTier,
        price: 300,
        features: ['List 10 properties', 'Lead management', 'Basic analytics', 'Email support'],
      },
      {
        tier: 'monthly' as SubscriptionTier,
        price: 1000,
        features: ['Unlimited listings', 'CRM tools', 'Featured badge', 'Priority support'],
        popular: true,
      },
      {
        tier: 'yearly' as SubscriptionTier,
        price: 11000,
        features: ['All monthly features', 'Dedicated account manager', 'Custom reports', '1 month free'],
      },
    ],
  },
];

export default function SubscriptionPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const handleSelectPlan = (tier: SubscriptionTier, price: number) => {
    router.push(`/subscription/checkout?tier=${tier}&price=${price}` as any);
  };

  const getTierLabel = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      default:
        return tier;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Plan</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryChip,
              selectedCategory === index && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(index)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === index && styles.categoryChipTextActive,
              ]}
            >
              {plan.category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {SUBSCRIPTION_PLANS[selectedCategory].tiers.map((plan) => (
          <View
            key={plan.tier}
            style={[styles.planCard, plan.popular && styles.planCardPopular]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Crown size={14} color={Colors.light.surface} />
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTier}>{getTierLabel(plan.tier)}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceSymbol}>KSh</Text>
                  <Text style={styles.price}>{plan.price.toLocaleString()}</Text>
                  <Text style={styles.pricePeriod}>/{plan.tier}</Text>
                </View>
              </View>
              {plan.popular && (
                <View style={styles.iconContainer}>
                  <Zap size={32} color={Colors.light.secondary} fill={Colors.light.secondary} />
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresSection}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.checkIcon}>
                    <Check size={16} color={Colors.light.surface} />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.selectButton,
                plan.popular && styles.selectButtonPopular,
              ]}
              onPress={() => handleSelectPlan(plan.tier, plan.price)}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  plan.popular && styles.selectButtonTextPopular,
                ]}
              >
                Select Plan
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 Need Help Choosing?</Text>
          <Text style={styles.infoText}>
            All plans include basic features. Upgrade anytime to unlock more capabilities and grow
            your business.
          </Text>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  categoryChipTextActive: {
    color: Colors.light.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  planCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planTier: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceSymbol: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.primary,
    marginRight: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  pricePeriod: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.light.secondary + '20',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 20,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  checkIcon: {
    width: 24,
    height: 24,
    backgroundColor: Colors.light.success,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
  selectButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonPopular: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  selectButtonTextPopular: {
    color: Colors.light.surface,
  },
  infoSection: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
});
