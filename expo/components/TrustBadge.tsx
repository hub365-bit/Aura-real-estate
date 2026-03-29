import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react-native';
import { TrustScore } from '@/types';
import { getTrustLevelColor, getTrustLevelLabel } from '@/lib/trust-score';

interface TrustBadgeProps {
  trustScore: TrustScore;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  onPress?: () => void;
}

export function TrustBadge({ trustScore, size = 'medium', showDetails = false, onPress }: TrustBadgeProps) {
  const color = getTrustLevelColor(trustScore.level);
  const label = getTrustLevelLabel(trustScore.level);
  
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  
  const Icon = trustScore.level === 'verified' ? CheckCircle : 
                trustScore.level === 'building' ? Shield : AlertCircle;
  
  const badge = (
    <View style={[styles.badge, { backgroundColor: color + '15' }]}>
      <Icon size={iconSize} color={color} />
      <Text style={[styles.badgeText, { color, fontSize }]}>{label}</Text>
      {showDetails && (
        <Text style={[styles.scoreText, { fontSize: fontSize - 2 }]}>
          {trustScore.score}/100
        </Text>
      )}
    </View>
  );
  
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {badge}
      </TouchableOpacity>
    );
  }
  
  return badge;
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontWeight: '600' as const,
  },
  scoreText: {
    opacity: 0.7,
    marginLeft: 2,
  },
});
