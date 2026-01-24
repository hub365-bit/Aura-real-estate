import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react-native';
import { PriceIntelligence } from '@/types';

interface PriceIntelligenceCardProps {
  priceIntelligence: PriceIntelligence;
  currentPrice: number;
  currency?: string;
}

export function PriceIntelligenceCard({ 
  priceIntelligence, 
  currentPrice, 
  currency = 'KES' 
}: PriceIntelligenceCardProps) {
  const getPriceLabelConfig = () => {
    switch (priceIntelligence.priceLabel) {
      case 'great-deal':
        return { label: 'Great Deal', color: '#10B981', Icon: CheckCircle };
      case 'fair-price':
        return { label: 'Fair Price', color: '#3B82F6', Icon: CheckCircle };
      case 'overpriced':
        return { label: 'Above Market', color: '#F59E0B', Icon: AlertCircle };
    }
  };
  
  const { label, color, Icon } = getPriceLabelConfig();
  const priceDiff = currentPrice - priceIntelligence.marketAverage;
  const priceDiffPercent = (priceDiff / priceIntelligence.marketAverage) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: color + '15' }]}>
          <Icon size={16} color={color} />
          <Text style={[styles.badgeText, { color }]}>{label}</Text>
        </View>
      </View>
      
      <View style={styles.priceComparison}>
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Your Price</Text>
          <Text style={styles.priceValue}>
            {currency} {currentPrice.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Market Average</Text>
          <Text style={styles.priceValue}>
            {currency} {priceIntelligence.marketAverage.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.priceItem}>
          <Text style={styles.priceLabel}>Suggested</Text>
          <Text style={[styles.priceValue, { color: '#10B981' }]}>
            {currency} {priceIntelligence.suggestedPrice.toLocaleString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.insights}>
        <View style={styles.insightRow}>
          {priceDiff > 0 ? (
            <TrendingUp size={16} color="#EF4444" />
          ) : (
            <TrendingDown size={16} color="#10B981" />
          )}
          <Text style={styles.insightText}>
            {Math.abs(priceDiffPercent).toFixed(1)}% {priceDiff > 0 ? 'above' : 'below'} market
          </Text>
        </View>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Demand:</Text>
          <View style={[
            styles.demandBadge,
            { backgroundColor: priceIntelligence.demandLevel === 'high' ? '#10B981' : 
                               priceIntelligence.demandLevel === 'medium' ? '#F59E0B' : '#EF4444' }
          ]}>
            <Text style={styles.demandText}>
              {priceIntelligence.demandLevel.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Best time to post:</Text>
          <Text style={styles.insightValue}>{priceIntelligence.bestPostingTime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  priceComparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: '#1F2937',
  },
  insights: {
    gap: 10,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightText: {
    fontSize: 13,
    color: '#6B7280',
  },
  insightLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  insightValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#1F2937',
  },
  demandBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  demandText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
