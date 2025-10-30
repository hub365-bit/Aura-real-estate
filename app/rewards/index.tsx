import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Award, TrendingUp, Gift, Star, Crown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

const leaderboardData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=47',
    points: 8520,
    rank: 1,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=12',
    points: 7890,
    rank: 2,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=45',
    points: 7340,
    rank: 3,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/150?img=33',
    points: 6920,
    rank: 4,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    avatar: 'https://i.pravatar.cc/150?img=26',
    points: 6540,
    rank: 5,
  },
];

const rewardActivities = [
  { action: 'Write a review', points: 50, icon: Star },
  { action: 'Follow a business', points: 10, icon: TrendingUp },
  { action: 'Complete a booking', points: 100, icon: Award },
  { action: 'Refer a friend', points: 500, icon: Gift },
];

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const { currentUser } = useApp();
  const [selectedTab, setSelectedTab] = useState<'earn' | 'leaderboard'>('earn');

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={24} color={Colors.light.secondary} />;
    if (rank === 2) return <Crown size={20} color="#C0C0C0" />;
    if (rank === 3) return <Crown size={18} color="#CD7F32" />;
    return <Text style={styles.rankNumber}>#{rank}</Text>;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Rewards',
          headerStyle: {
            backgroundColor: Colors.light.surface,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
          },
        }}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pointsCard}>
          <View style={styles.pointsHeader}>
            <Award size={32} color={Colors.light.secondary} />
            <Text style={styles.pointsTitle}>Your Points</Text>
          </View>
          <Text style={styles.pointsValue}>{currentUser.rewardPoints.toLocaleString()}</Text>
          <Text style={styles.pointsSubtitle}>Earn more points to unlock rewards</Text>
          <TouchableOpacity style={styles.redeemButton} activeOpacity={0.7}>
            <Gift size={18} color={Colors.light.surface} />
            <Text style={styles.redeemButtonText}>Redeem Points</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'earn' && styles.tabActive]}
            onPress={() => setSelectedTab('earn')}
          >
            <Text
              style={[styles.tabText, selectedTab === 'earn' && styles.tabTextActive]}
            >
              Earn Points
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'leaderboard' && styles.tabActive]}
            onPress={() => setSelectedTab('leaderboard')}
          >
            <Text
              style={[styles.tabText, selectedTab === 'leaderboard' && styles.tabTextActive]}
            >
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'earn' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ways to Earn</Text>
            {rewardActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <View key={index} style={styles.activityCard}>
                  <View style={styles.activityLeft}>
                    <View style={styles.activityIconContainer}>
                      <Icon size={20} color={Colors.light.primary} />
                    </View>
                    <Text style={styles.activityText}>{activity.action}</Text>
                  </View>
                  <View style={styles.pointsBadge}>
                    <Text style={styles.pointsBadgeText}>+{activity.points}</Text>
                  </View>
                </View>
              );
            })}

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>💡 Pro Tip</Text>
              <Text style={styles.infoText}>
                Complete all activities regularly to climb the leaderboard and earn exclusive rewards!
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Contributors</Text>
            {leaderboardData.map((user, index) => (
              <View
                key={user.id}
                style={[
                  styles.leaderboardCard,
                  user.rank <= 3 && styles.leaderboardCardHighlight,
                ]}
              >
                <View style={styles.leaderboardLeft}>
                  <View style={styles.rankContainer}>{getRankIcon(user.rank)}</View>
                  <Image source={{ uri: user.avatar }} style={styles.leaderboardAvatar} />
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                </View>
                <View style={styles.leaderboardRight}>
                  <Text style={styles.leaderboardPoints}>
                    {user.points.toLocaleString()}
                  </Text>
                  <Text style={styles.leaderboardPointsLabel}>points</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  pointsCard: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.light.surface,
    marginBottom: 8,
  },
  pointsSubtitle: {
    fontSize: 14,
    color: Colors.light.surface,
    opacity: 0.9,
    marginBottom: 20,
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  redeemButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.surface,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  pointsBadge: {
    backgroundColor: Colors.light.secondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.secondary,
  },
  infoCard: {
    backgroundColor: Colors.light.info + '15',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  leaderboardCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leaderboardCardHighlight: {
    borderWidth: 2,
    borderColor: Colors.light.secondary + '40',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankContainer: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.textSecondary,
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    flex: 1,
  },
  leaderboardRight: {
    alignItems: 'flex-end',
  },
  leaderboardPoints: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  leaderboardPointsLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
