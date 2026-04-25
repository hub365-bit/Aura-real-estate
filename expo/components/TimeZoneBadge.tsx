import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Globe } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface TimeZoneBadgeProps {
  targetTimezone?: string;
  label?: string;
}

export default function TimeZoneBadge({ targetTimezone = 'Africa/Nairobi', label }: TimeZoneBadgeProps) {
  const timeInfo = useMemo(() => {
    try {
      const now = new Date();
      const targetTime = new Date(now.toLocaleString('en-US', { timeZone: targetTimezone }));
      const localOffset = now.getTimezoneOffset();
      const targetOffset = (now.getTime() - targetTime.getTime()) / 60000 + localOffset;
      const hoursDiff = Math.round(targetOffset / 60);
      const timeString = targetTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: targetTimezone,
      });
      return { timeString, hoursDiff };
    } catch {
      return { timeString: '--:--', hoursDiff: 0 };
    }
  }, [targetTimezone]);

  return (
    <View style={styles.container}>
      <Globe size={14} color={Colors.light.primary} />
      <Text style={styles.text}>
        {label ? `${label} ` : ''}
        {timeInfo.timeString}
        {timeInfo.hoursDiff !== 0 && (
          <Text style={styles.diffText}>
            {' '}
            ({timeInfo.hoursDiff > 0 ? '+' : ''}
            {timeInfo.hoursDiff}h)
          </Text>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  diffText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
});
