import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { colors } from '@/constants/colors';

interface AIPricingPanelProps {
  propertyId: string;
  currentPrice: number;
  location: {
    city: string;
    area: string;
  };
  propertyType: string;
  bedrooms?: number;
  sqft?: number;
}

export default function AIPricingPanel({
  propertyId,
  currentPrice,
  location,
  propertyType,
  bedrooms,
  sqft,
}: AIPricingPanelProps) {
  const pricingQuery = trpc.ai.pricing.useQuery({
    propertyId,
    location,
    propertyType,
    bedrooms,
    sqft,
  });

  const bestTimeQuery = trpc.ai.bestPostingTime.useQuery({
    userId: 'user_123',
    category: propertyType,
  });

  if (pricingQuery.isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Calculating AI pricing...</Text>
      </View>
    );
  }

  if (!pricingQuery.data) return null;

  const data = pricingQuery.data;
  const priceDiff = currentPrice - data.suggestedPrice;
  const priceDiffPercent = ((priceDiff / data.suggestedPrice) * 100).toFixed(1);

  const getCompetitivenessConfig = (competitiveness: string) => {
    switch (competitiveness) {
      case 'good_deal':
        return {
          icon: TrendingDown,
          color: '#10b981',
          label: 'Great Deal',
          message: 'This property is priced below market average',
        };
      case 'overpriced':
        return {
          icon: TrendingUp,
          color: '#ef4444',
          label: 'Above Market',
          message: 'Consider adjusting price to attract more interest',
        };
      default:
        return {
          icon: DollarSign,
          color: '#f59e0b',
          label: 'Fair Price',
          message: 'Property is priced competitively',
        };
    }
  };

  const config = getCompetitivenessConfig(data.competitiveness);
  const CompIcon = config.icon;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Market Insights</Text>
        <View style={[styles.badge, { backgroundColor: config.color + '20' }]}>
          <CompIcon size={14} color={config.color} />
          <Text style={[styles.badgeText, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>

      <View style={styles.priceComparison}>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Your Price</Text>
          <Text style={styles.price}>
            KES {currentPrice.toLocaleString()}
          </Text>
        </View>

        <View style={styles.arrow}>
          {priceDiff > 0 ? (
            <TrendingUp size={24} color="#ef4444" />
          ) : (
            <TrendingDown size={24} color="#10b981" />
          )}
          <Text
            style={[
              styles.diffText,
              { color: priceDiff > 0 ? '#ef4444' : '#10b981' },
            ]}
          >
            {priceDiff > 0 ? '+' : ''}
            {priceDiffPercent}%
          </Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>AI Suggested</Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            KES {data.suggestedPrice.toLocaleString()}
          </Text>
        </View>
      </View>

      <Text style={styles.message}>{config.message}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Market Average</Text>
          <Text style={styles.statValue}>
            KES {data.marketAverage.toLocaleString()}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Price Range</Text>
          <Text style={styles.statValue}>
            {data.priceRange.min.toLocaleString()} - {data.priceRange.max.toLocaleString()}
          </Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={styles.statValue}>{data.confidence}%</Text>
        </View>
      </View>

      {bestTimeQuery.data && (
        <View style={styles.timingSection}>
          <View style={styles.timingHeader}>
            <Clock size={18} color={Colors.primary} />
            <Text style={styles.timingTitle}>Best Time to Post</Text>
          </View>
          <Text style={styles.timingDays}>
            {bestTimeQuery.data.bestDays.join(', ')}
          </Text>
          <Text style={styles.timingHours}>
            Between {bestTimeQuery.data.bestHours[0]}:00 -{' '}
            {bestTimeQuery.data.bestHours[bestTimeQuery.data.bestHours.length - 1]}:00
          </Text>
          <Text style={styles.timingReason}>{bestTimeQuery.data.reasoning}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.adjustButton}>
        <Text style={styles.adjustButtonText}>Adjust to Suggested Price</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceCard: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  arrow: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  diffText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timingSection: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  timingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  timingDays: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  timingHours: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  timingReason: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  adjustButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
