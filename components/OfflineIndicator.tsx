import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WifiOff, Wifi } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const translateY = useSharedValue<number>(-100);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => {
        setIsOnline(true);
        translateY.value = withSequence(
          withTiming(0, { duration: 300 }),
          withTiming(-100, { duration: 300 }, () => {})
        );
      };

      const handleOffline = () => {
        setIsOnline(false);
        translateY.value = withTiming(0, { duration: 300 });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        translateY.value = 0;
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: isOnline ? '#10b981' : '#ef4444' },
        animatedStyle,
      ]}
    >
      {isOnline ? (
        <Wifi size={16} color="#fff" />
      ) : (
        <WifiOff size={16} color="#fff" />
      )}
      <Text style={styles.text}>
        {isOnline ? 'Back Online' : 'No Internet Connection'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingTop: 48,
    zIndex: 9999,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
