import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TrendingUp, Eye, Heart, MessageCircle, Users, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, change, changePositive, color }: StatCardProps) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <Icon size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    {change && (
      <View style={styles.changeContainer}>
        <TrendingUp
          size={12}
          color={changePositive ? Colors.light.success : Colors.light.error}
          style={!changePositive && { transform: [{ rotate: '180deg' }] }}
        />
        <Text
          style={[
            styles.changeText,
            { color: changePositive ? Colors.light.success : Colors.light.error },
          ]}
        >
          {change}
        </Text>
      </View>
    )}
  </View>
);

export default function AnalyticsDashboard() {
  const insets = useSafeAreaInsets();

  const chartData = [
    { month: 'Jan', views: 1200, leads: 45 },
    { month: 'Feb', views: 1900, leads: 62 },
    { month: 'Mar', views: 2400, leads: 78 },
    { month: 'Apr', views: 2200, leads: 70 },
    { month: 'May', views: 2800, leads: 92 },
    { month: 'Jun', views: 3200, leads: 105 },
  ];

  const maxViews = Math.max(...chartData.map((d) => d.views));

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Analytics Dashboard',
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={Eye}
              label="Total Views"
              value="15,847"
              change="+12.5%"
              changePositive={true}
              color={Colors.light.primary}
            />
            <StatCard
              icon={Heart}
              label="Favorites"
              value="1,234"
              change="+8.2%"
              changePositive={true}
              color={Colors.light.error}
            />
            <StatCard
              icon={MessageCircle}
              label="Inquiries"
              value="452"
              change="+15.7%"
              changePositive={true}
              color={Colors.light.secondary}
            />
            <StatCard
              icon={Users}
              label="Leads"
              value="89"
              change="-3.4%"
              changePositive={false}
              color={Colors.light.info}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Performance</Text>
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Views & Leads</Text>
            <View style={styles.chart}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(item.views / maxViews) * 100}%`,
                          backgroundColor: Colors.light.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.month}</Text>
                  <Text style={styles.barValue}>{item.views}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Summary</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueRow}>
              <View style={styles.revenueItem}>
                <DollarSign size={20} color={Colors.light.success} />
                <View style={styles.revenueInfo}>
                  <Text style={styles.revenueLabel}>Total Revenue</Text>
                  <Text style={[styles.revenueValue, { color: Colors.light.success }]}>
                    KSh 2,450,000
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.revenueBreakdown}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Active Tenants</Text>
                <Text style={styles.breakdownValue}>12</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Pending Payments</Text>
                <Text style={[styles.breakdownValue, { color: Colors.light.secondary }]}>
                  KSh 180,000
                </Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Overdue</Text>
                <Text style={[styles.breakdownValue, { color: Colors.light.error }]}>
                  KSh 45,000
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Listings</Text>
          {[
            { name: 'Modern 2BR Apartment', views: 3420, leads: 45, revenue: 'KSh 85,000' },
            { name: 'Luxury Villa Westlands', views: 2890, leads: 38, revenue: 'KSh 150,000' },
            { name: 'Cozy Studio Kilimani', views: 2150, leads: 32, revenue: 'KSh 45,000' },
          ].map((listing, index) => (
            <View key={index} style={styles.listingCard}>
              <View style={styles.listingHeader}>
                <Text style={styles.listingName}>{listing.name}</Text>
                <Text style={styles.listingRevenue}>{listing.revenue}</Text>
              </View>
              <View style={styles.listingStats}>
                <View style={styles.listingStat}>
                  <Eye size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.listingStatText}>{listing.views} views</Text>
                </View>
                <View style={styles.listingStat}>
                  <Users size={14} color={Colors.light.textSecondary} />
                  <Text style={styles.listingStatText}>{listing.leads} leads</Text>
                </View>
              </View>
            </View>
          ))}
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  chartCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  revenueCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  revenueRow: {
    marginBottom: 16,
  },
  revenueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  revenueBreakdown: {
    gap: 12,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  breakdownValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  listingCard: {
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
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listingName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.text,
    flex: 1,
  },
  listingRevenue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  listingStats: {
    flexDirection: 'row',
    gap: 16,
  },
  listingStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listingStatText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
