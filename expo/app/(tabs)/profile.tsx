import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Heart,
  Calendar,
  Star,
  Settings,
  CreditCard,
  Award,
  LogOut,
  Bell,
  Globe,
  FileText,
  MessageCircle,
  Gift,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser, favorites } = useApp();

  const menuItems = [
    { icon: Heart, label: 'Favorites', value: favorites.length, color: Colors.light.error },
    { icon: Calendar, label: 'Bookings', value: 0, color: Colors.light.primary },
    { icon: Star, label: 'Reviews', value: 0, color: Colors.light.secondary },
    { icon: Award, label: 'Reward Points', value: currentUser.rewardPoints, color: Colors.light.success },
  ];

  const settingsItems = [
    { icon: User, label: 'Edit Profile', route: null },
    { icon: MessageCircle, label: 'Messages', route: '/messages/index' },
    { icon: Bell, label: 'Notifications', route: '/settings/notifications' },
    { icon: Globe, label: 'Language', route: '/settings/language' },
    { icon: Gift, label: 'Rewards & Leaderboard', route: '/rewards/index' },
    { icon: FileText, label: 'Support Tickets', route: '/tickets/index' },
    { icon: CreditCard, label: 'Subscription', route: '/payments/index' },
    { icon: Settings, label: 'Settings', route: null },
    { icon: LogOut, label: 'Logout', color: Colors.light.error, route: null },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: currentUser.avatar || 'https://i.pravatar.cc/150?img=35',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          <View style={styles.roleContainer}>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    currentUser.role === 'user'
                      ? Colors.light.primary + '20'
                      : Colors.light.secondary + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  {
                    color:
                      currentUser.role === 'user' ? Colors.light.primary : Colors.light.secondary,
                  },
                ]}
              >
                {currentUser.role.toUpperCase()}
              </Text>
            </View>
            {currentUser.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statsContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.statCard} activeOpacity={0.7}>
              <View style={[styles.statIcon, { backgroundColor: item.color + '20' }]}>
                <item.icon size={20} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.route) {
                  router.push(item.route as any);
                } else if (item.label === 'Logout') {
                  console.log('Logout pressed');
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <item.icon
                  size={20}
                  color={item.color || Colors.light.textSecondary}
                />
                <Text
                  style={[
                    styles.menuItemText,
                    item.color && { color: item.color },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>Subscription Status</Text>
            <Text style={styles.subscriptionTier}>
              {currentUser.subscriptionTier === 'free' ? 'Free Plan' : 'Premium'}
            </Text>
          </View>
          <Text style={styles.subscriptionDescription}>
            {currentUser.subscriptionTier === 'free'
              ? 'Upgrade to premium to unlock exclusive features and boost your listings'
              : 'You are on a premium plan with access to all features'}
          </Text>
          {currentUser.subscriptionTier === 'free' && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/payments/index' as any)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.light.border,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  verifiedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.success + '20',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.light.success,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  subscriptionCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  subscriptionTier: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.light.surface,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: Colors.light.surface,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
  },
  upgradeButton: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
});
