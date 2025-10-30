import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, BellOff } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/lib/notifications';
import Colors from '@/constants/colors';

const COLORS = {
  primary: Colors.light.primary,
  dark: Colors.light.text,
  white: '#FFFFFF',
  background: Colors.light.background,
  textSecondary: Colors.light.textSecondary,
  gray: '#9CA3AF',
  lightGray: Colors.light.border,
  error: Colors.light.error,
  border: Colors.light.border,
};

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationSettingsScreen() {
  const [pushToken, setPushToken] = useState<string | undefined>();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'booking_notifications',
      title: 'Booking Updates',
      description: 'Get notified about booking confirmations and changes',
      enabled: true,
    },
    {
      id: 'payment_reminders',
      title: 'Payment Reminders',
      description: 'Receive reminders for upcoming payments',
      enabled: true,
    },
    {
      id: 'ticket_updates',
      title: 'Ticket Updates',
      description: 'Updates on your maintenance and support tickets',
      enabled: true,
    },
    {
      id: 'reward_notifications',
      title: 'Reward Points',
      description: 'Get notified when you earn reward points',
      enabled: true,
    },
    {
      id: 'subscription_alerts',
      title: 'Subscription Alerts',
      description: 'Alerts about subscription expiry and renewals',
      enabled: true,
    },
    {
      id: 'messages',
      title: 'New Messages',
      description: 'Notifications for new messages from agents',
      enabled: true,
    },
    {
      id: 'listing_updates',
      title: 'Listing Updates',
      description: 'Updates about your property listings',
      enabled: false,
    },
    {
      id: 'promotional',
      title: 'Promotional Offers',
      description: 'Special offers and promotions',
      enabled: false,
    },
  ]);

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
      console.log('Notification token registered:', token);
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const enableAll = () => {
    setPreferences((prev) => prev.map((pref) => ({ ...pref, enabled: true })));
  };

  const disableAll = () => {
    setPreferences((prev) => prev.map((pref) => ({ ...pref, enabled: false })));
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification from Aura!',
        data: { test: true },
      },
      trigger: null,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {pushToken ? (
          <View style={styles.statusCard}>
            <Bell size={24} color={COLORS.primary} />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Push Notifications Enabled</Text>
              <Text style={styles.statusSubtitle}>
                You will receive notifications on this device
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.statusCard, styles.statusCardDisabled]}>
            <BellOff size={24} color={COLORS.error} />
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Push Notifications Disabled</Text>
              <Text style={styles.statusSubtitle}>
                {Platform.OS === 'web'
                  ? 'Push notifications are not supported on web'
                  : 'Enable notifications in your device settings'}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={enableAll}
          >
            <Text style={styles.quickActionText}>Enable All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.quickActionButtonSecondary]}
            onPress={disableAll}
          >
            <Text style={styles.quickActionTextSecondary}>Disable All</Text>
          </TouchableOpacity>
          {Platform.OS !== 'web' && (
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionButtonTest]}
              onPress={testNotification}
            >
              <Text style={styles.quickActionText}>Test</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          {preferences.map((pref) => (
            <View key={pref.id} style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Text style={styles.preferenceTitle}>{pref.title}</Text>
                <Text style={styles.preferenceDescription}>
                  {pref.description}
                </Text>
              </View>
              <Switch
                value={pref.enabled}
                onValueChange={() => togglePreference(pref.id)}
                trackColor={{ false: COLORS.gray, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            </View>
          ))}
        </View>

        {pushToken && Platform.OS !== 'web' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Device Token</Text>
            <View style={styles.tokenCard}>
              <Text style={styles.tokenLabel}>Push Token:</Text>
              <Text style={styles.tokenText} numberOfLines={2}>
                {pushToken}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statusCardDisabled: {
    borderColor: COLORS.error,
  },
  statusText: {
    flex: 1,
    marginLeft: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickActionButtonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionButtonTest: {
    flex: 0,
    paddingHorizontal: 20,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  quickActionTextSecondary: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tokenCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
  },
  tokenLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  tokenText: {
    fontSize: 11,
    color: COLORS.dark,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
