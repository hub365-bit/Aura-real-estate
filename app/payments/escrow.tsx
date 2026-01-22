import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';
import { colors } from '@/constants/colors';

export default function EscrowPaymentsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'payer' | 'payee'>('payer');

  const escrowQuery = trpc.escrow.list.useQuery({
    userId: 'user_123',
    role: selectedTab,
  });

  const releaseEscrowMutation = trpc.escrow.release.useMutation({
    onSuccess: () => {
      Alert.alert('Success', 'Escrow payment released successfully');
      escrowQuery.refetch();
    },
  });

  const disputeEscrowMutation = trpc.escrow.dispute.useMutation({
    onSuccess: () => {
      Alert.alert('Dispute Raised', 'Admin will review your dispute');
      escrowQuery.refetch();
    },
  });

  const handleDispute = (escrowId: string) => {
    Alert.alert(
      'Dispute Escrow',
      'Are you sure you want to raise a dispute for this payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            disputeEscrowMutation.mutate({
              escrowId,
              userId: 'user_123',
              reason: 'Service not delivered as expected',
            });
          },
        },
      ]
    );
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'held':
        return { icon: Clock, color: '#f59e0b', label: 'Held' };
      case 'released':
        return { icon: CheckCircle, color: '#10b981', label: 'Released' };
      case 'disputed':
        return { icon: AlertCircle, color: '#ef4444', label: 'Disputed' };
      case 'refunded':
        return { icon: XCircle, color: '#6b7280', label: 'Refunded' };
      default:
        return { icon: Clock, color: '#6b7280', label: status };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: 'Escrow Payments',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'payer' && styles.activeTab]}
          onPress={() => setSelectedTab('payer')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'payer' && styles.activeTabText,
            ]}
          >
            My Payments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'payee' && styles.activeTab]}
          onPress={() => setSelectedTab('payee')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'payee' && styles.activeTabText,
            ]}
          >
            My Earnings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {escrowQuery.isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : escrowQuery.data && escrowQuery.data.length > 0 ? (
          escrowQuery.data.map((escrow) => {
            const statusConfig = getStatusConfig(escrow.status);
            const StatusIcon = statusConfig.icon;

            return (
              <View key={escrow.id} style={styles.escrowCard}>
                <View style={styles.escrowHeader}>
                  <View style={styles.statusBadge}>
                    <StatusIcon size={16} color={statusConfig.color} />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                  <Text style={styles.amount}>
                    {escrow.currency} {escrow.amount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.escrowDetails}>
                  <Text style={styles.detailLabel}>Booking ID:</Text>
                  <Text style={styles.detailValue}>{escrow.bookingId}</Text>
                </View>

                <View style={styles.escrowDetails}>
                  <Text style={styles.detailLabel}>Held Since:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(escrow.heldAt).toLocaleDateString()}
                  </Text>
                </View>

                {escrow.releaseScheduledAt && (
                  <View style={styles.escrowDetails}>
                    <Text style={styles.detailLabel}>Release Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(escrow.releaseScheduledAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}

                {escrow.status === 'held' && selectedTab === 'payer' && (
                  <TouchableOpacity
                    style={styles.disputeButton}
                    onPress={() => handleDispute(escrow.id)}
                  >
                    <Text style={styles.disputeButtonText}>Raise Dispute</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No escrow payments found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  escrowCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  escrowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  escrowDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  disputeButton: {
    marginTop: 12,
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  disputeButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
