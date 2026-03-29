import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Shield,
  Eye,
  Trash2,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

type TabType = 'overview' | 'users' | 'content' | 'verification' | 'reports';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  documents: string[];
  requestDate: string;
}

interface ReportedContent {
  id: string;
  type: 'post' | 'property' | 'service' | 'comment';
  contentId: string;
  reportedBy: string;
  reason: string;
  description: string;
  reportDate: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [pendingVerifications] = useState<PendingUser[]>([
    {
      id: '1',
      name: 'John Kamau',
      email: 'john@example.com',
      phone: '+254712345678',
      role: 'agent',
      avatar: 'https://i.pravatar.cc/150?img=12',
      documents: ['ID Card', 'KRA PIN', 'Business License'],
      requestDate: '2025-10-28',
    },
    {
      id: '2',
      name: 'Mary Njeri',
      email: 'mary@example.com',
      phone: '+254723456789',
      role: 'landlord',
      avatar: 'https://i.pravatar.cc/150?img=45',
      documents: ['ID Card', 'Title Deed'],
      requestDate: '2025-10-27',
    },
  ]);

  const [reportedContent] = useState<ReportedContent[]>([
    {
      id: '1',
      type: 'post',
      contentId: 'post_123',
      reportedBy: 'User #456',
      reason: 'spam',
      description: 'Repeated promotional content',
      reportDate: '2025-10-29',
      status: 'pending',
    },
    {
      id: '2',
      type: 'property',
      contentId: 'prop_789',
      reportedBy: 'User #789',
      reason: 'fraud',
      description: 'Fake property listing with stolen images',
      reportDate: '2025-10-28',
      status: 'pending',
    },
  ]);

  const stats = {
    totalUsers: 12453,
    activeListings: 3456,
    pendingVerifications: pendingVerifications.length,
    reportedContent: reportedContent.length,
    monthlyRevenue: 2567890,
    activeSubscriptions: 456,
  };

  const handleApproveUser = (userId: string) => {
    Alert.alert('Approve User', 'Are you sure you want to approve this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        style: 'default',
        onPress: () => {
          console.log('Approved user:', userId);
        },
      },
    ]);
  };

  const handleRejectUser = (userId: string) => {
    Alert.alert('Reject User', 'Are you sure you want to reject this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          console.log('Rejected user:', userId);
        },
      },
    ]);
  };

  const handleReviewContent = (contentId: string, action: 'approve' | 'remove') => {
    Alert.alert(
      action === 'approve' ? 'Approve Content' : 'Remove Content',
      `Are you sure you want to ${action} this content?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'approve' ? 'Approve' : 'Remove',
          style: action === 'remove' ? 'destructive' : 'default',
          onPress: () => {
            console.log(`${action} content:`, contentId);
          },
        },
      ]
    );
  };

  const renderOverview = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Platform Overview</Text>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary + '20' }]}>
          <Users size={24} color={colors.primary} />
          <Text style={styles.statValue}>{stats.totalUsers.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
          <FileText size={24} color={colors.success} />
          <Text style={styles.statValue}>{stats.activeListings.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.warning + '20' }]}>
          <AlertTriangle size={24} color={colors.warning} />
          <Text style={styles.statValue}>{stats.pendingVerifications}</Text>
          <Text style={styles.statLabel}>Pending Verifications</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.error + '20' }]}>
          <MessageSquare size={24} color={colors.error} />
          <Text style={styles.statValue}>{stats.reportedContent}</Text>
          <Text style={styles.statLabel}>Reported Content</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: '#10B981' + '20' }]}>
          <DollarSign size={24} color="#10B981" />
          <Text style={styles.statValue}>
            KSh {(stats.monthlyRevenue / 1000).toFixed(0)}K
          </Text>
          <Text style={styles.statLabel}>Monthly Revenue</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.info + '20' }]}>
          <TrendingUp size={24} color={colors.info} />
          <Text style={styles.statValue}>{stats.activeSubscriptions}</Text>
          <Text style={styles.statLabel}>Active Subscriptions</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setActiveTab('verification')}
        >
          <Shield size={20} color={colors.primary} />
          <Text style={styles.actionText}>Review Verifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setActiveTab('content')}
        >
          <Eye size={20} color={colors.warning} />
          <Text style={styles.actionText}>Moderate Content</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVerifications = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Pending Verifications</Text>
      {pendingVerifications.map((user) => (
        <View key={user.id} style={styles.verificationCard}>
          <View style={styles.userHeader}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.gray }]}>
                <Text style={styles.avatarText}>
                  {user.name.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDetail}>{user.email}</Text>
              <Text style={styles.userDetail}>{user.phone}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.documentsSection}>
            <Text style={styles.documentsTitle}>Submitted Documents:</Text>
            {user.documents.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <FileText size={16} color={colors.primary} />
                <Text style={styles.documentText}>{doc}</Text>
                <TouchableOpacity>
                  <Eye size={16} color={colors.info} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.requestDate}>
            Requested: {new Date(user.requestDate).toLocaleDateString()}
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleApproveUser(user.id)}
            >
              <CheckCircle size={18} color="#fff" />
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleRejectUser(user.id)}
            >
              <XCircle size={18} color="#fff" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderContentModeration = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Reported Content</Text>
      {reportedContent.map((report) => (
        <View key={report.id} style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{report.type.toUpperCase()}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    report.status === 'pending'
                      ? colors.warning + '20'
                      : colors.success + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      report.status === 'pending' ? colors.warning : colors.success,
                  },
                ]}
              >
                {report.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.reportReason}>Reason: {report.reason}</Text>
          <Text style={styles.reportDescription}>{report.description}</Text>
          <Text style={styles.reportMeta}>
            Reported by {report.reportedBy} on{' '}
            {new Date(report.reportDate).toLocaleDateString()}
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.viewButton]}
              onPress={() => console.log('View content:', report.contentId)}
            >
              <Eye size={18} color="#fff" />
              <Text style={styles.buttonText}>View Content</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleReviewContent(report.id, 'approve')}
            >
              <CheckCircle size={18} color="#fff" />
              <Text style={styles.buttonText}>Keep</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={() => handleReviewContent(report.id, 'remove')}
            >
              <Trash2 size={18} color="#fff" />
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'verification':
        return renderVerifications();
      case 'content':
        return renderContentModeration();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <TrendingUp
            size={20}
            color={activeTab === 'overview' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'overview' && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'verification' && styles.activeTab]}
          onPress={() => setActiveTab('verification')}
        >
          <Shield
            size={20}
            color={
              activeTab === 'verification' ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'verification' && styles.activeTabText,
            ]}
          >
            Verify ({pendingVerifications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && styles.activeTab]}
          onPress={() => setActiveTab('content')}
        >
          <Eye
            size={20}
            color={activeTab === 'content' ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'content' && styles.activeTabText,
            ]}
          >
            Content ({reportedContent.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
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
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  activeTab: {
    backgroundColor: colors.primary + '15',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
  verificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
  },
  userDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.primary + '20',
    borderRadius: 6,
    marginTop: 4,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  documentsSection: {
    gap: 8,
    marginBottom: 12,
  },
  documentsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 4,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  requestDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  viewButton: {
    backgroundColor: colors.info,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#fff',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.primary + '20',
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  reportReason: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  reportMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});
