import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Gift,
  Users,
  Copy,
  Share2,
  Mail,
  MessageCircle,
  CheckCircle,
  Award,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Referral {
  id: string;
  name: string;
  status: 'pending' | 'completed';
  rewardEarned: number;
  date: string;
}

export default function ReferralsProgram() {
  const [referralCode] = useState('AURA-JO234');
  const [referrals] = useState<Referral[]>([
    {
      id: '1',
      name: 'Peter Mwangi',
      status: 'completed',
      rewardEarned: 500,
      date: '2025-10-15',
    },
    {
      id: '2',
      name: 'Grace Wanjiru',
      status: 'completed',
      rewardEarned: 500,
      date: '2025-10-20',
    },
    {
      id: '3',
      name: 'David Kiprotich',
      status: 'pending',
      rewardEarned: 0,
      date: '2025-10-28',
    },
  ]);

  const stats = {
    totalReferrals: referrals.length,
    completedReferrals: referrals.filter((r) => r.status === 'completed').length,
    totalRewardsEarned: referrals
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.rewardEarned, 0),
    availableRewards: 1000,
  };

  const referralLink = `https://aura.app/ref/${referralCode}`;

  const handleCopyCode = () => {
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join Aura, the best real estate platform! Use my code ${referralCode} and we both earn rewards! Download: ${referralLink}`,
        title: 'Join Aura',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleShareViaEmail = () => {
    Alert.alert(
      'Share via Email',
      'Email sharing feature will open your mail app',
      [{ text: 'OK' }]
    );
  };

  const handleShareViaWhatsApp = () => {
    Alert.alert(
      'Share via WhatsApp',
      'WhatsApp sharing feature will open WhatsApp',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Referral Program</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Gift size={48} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Earn Rewards Together</Text>
          <Text style={styles.heroDescription}>
            Invite friends and family to Aura. When they join and make their first
            booking, you both earn KSh 500 in rewards!
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={24} color={colors.primary} />
            <Text style={styles.statValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </View>

          <View style={styles.statCard}>
            <CheckCircle size={24} color={colors.success} />
            <Text style={styles.statValue}>{stats.completedReferrals}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={[styles.statCard, styles.statCardFull]}>
            <Award size={28} color={colors.secondary} />
            <Text style={styles.statValue}>
              KSh {stats.totalRewardsEarned.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Rewards Earned</Text>
          </View>

          <View style={[styles.statCard, styles.statCardFull, styles.rewardCard]}>
            <Text style={styles.rewardAmount}>
              KSh {stats.availableRewards.toLocaleString()}
            </Text>
            <Text style={styles.rewardLabel}>Available to Redeem</Text>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemButtonText}>Redeem Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeCard}>
            <Text style={styles.code}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Copy size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.linkLabel}>Referral Link:</Text>
          <View style={styles.linkCard}>
            <Text style={styles.link} numberOfLines={1}>
              {referralLink}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
              <Copy size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>Share Your Code</Text>
          <View style={styles.shareButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Share2 size={24} color={colors.primary} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareViaEmail}
            >
              <Mail size={24} color={colors.info} />
              <Text style={styles.shareButtonText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareViaWhatsApp}
            >
              <MessageCircle size={24} color={colors.success} />
              <Text style={styles.shareButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                Share your unique referral code with friends
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                They sign up using your code and complete verification
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                When they make their first booking, you both earn KSh 500!
              </Text>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Use your rewards for premium subscriptions or boost listings
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.referralsList}>
          <Text style={styles.sectionTitle}>Your Referrals</Text>
          {referrals.map((referral) => (
            <View key={referral.id} style={styles.referralCard}>
              <View style={styles.referralInfo}>
                <Text style={styles.referralName}>{referral.name}</Text>
                <Text style={styles.referralDate}>
                  Referred on {new Date(referral.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.referralRight}>
                <View
                  style={[
                    styles.statusBadge,
                    referral.status === 'completed'
                      ? styles.statusCompleted
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      referral.status === 'completed'
                        ? styles.statusTextCompleted
                        : styles.statusTextPending,
                    ]}
                  >
                    {referral.status.toUpperCase()}
                  </Text>
                </View>
                {referral.status === 'completed' && (
                  <Text style={styles.rewardText}>
                    +KSh {referral.rewardEarned}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  statCardFull: {
    width: '100%',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rewardCard: {
    backgroundColor: colors.primary + '10',
  },
  rewardAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  rewardLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  codeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 20,
  },
  code: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: 2,
  },
  copyButton: {
    padding: 10,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  link: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginRight: 12,
  },
  shareSection: {
    marginBottom: 32,
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
  },
  howItWorks: {
    marginBottom: 32,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  referralsList: {
    marginBottom: 32,
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referralInfo: {
    flex: 1,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  referralDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  referralRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: colors.success + '20',
  },
  statusPending: {
    backgroundColor: colors.warning + '20',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  statusTextCompleted: {
    color: colors.success,
  },
  statusTextPending: {
    color: colors.warning,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.success,
  },
});
