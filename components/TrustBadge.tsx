import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react-native';

interface TrustBadgeProps {
  level: 'verified' | 'building' | 'restricted';
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function TrustBadge({ level, score, size = 'medium', showLabel = true }: TrustBadgeProps) {
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const fontSize = size === 'small' ? 10 : size === 'medium' ? 12 : 14;

  const config = {
    verified: {
      icon: ShieldCheck,
      color: '#10b981',
      bg: '#d1fae5',
      label: 'Verified',
    },
    building: {
      icon: Shield,
      color: '#f59e0b',
      bg: '#fef3c7',
      label: 'Building Trust',
    },
    restricted: {
      icon: ShieldAlert,
      color: '#ef4444',
      bg: '#fee2e2',
      label: 'Restricted',
    },
  };

  const { icon: Icon, color, bg, label } = config[level];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Icon size={iconSize} color={color} strokeWidth={2.5} />
      {showLabel && (
        <Text style={[styles.label, { color, fontSize }]}>{label}</Text>
      )}
      {showLabel && (
        <Text style={[styles.score, { fontSize: fontSize - 1 }]}>
          {score}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  label: {
    fontWeight: '600',
  },
  score: {
    opacity: 0.7,
    fontWeight: '500',
  },
});
