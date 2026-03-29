import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Ticket, Wrench, Home as HomeIcon, AlertCircle, FileText } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Ticket as TicketType } from '@/types';

const mockTickets: TicketType[] = [
  {
    id: 't1',
    type: 'repair',
    title: 'Leaking Faucet in Kitchen',
    description: 'The kitchen faucet has been leaking for the past week. Water pressure is also low.',
    propertyId: 'p1',
    tenantId: 'u10',
    agentId: 'a1',
    status: 'in_progress',
    priority: 'high',
    attachments: [],
    createdAt: '2025-01-20T10:30:00Z',
    updatedAt: '2025-01-22T14:20:00Z',
  },
  {
    id: 't2',
    type: 'complaint',
    title: 'Noisy Neighbors',
    description: 'Neighbors in apartment 3B are consistently loud during late hours.',
    propertyId: 'p2',
    tenantId: 'u10',
    agentId: 'a2',
    status: 'open',
    priority: 'medium',
    attachments: [],
    createdAt: '2025-01-18T16:45:00Z',
    updatedAt: '2025-01-18T16:45:00Z',
  },
  {
    id: 't3',
    type: 'vacate',
    title: 'Moving Out End of Month',
    description: 'Giving notice for move-out on January 31st. Lease ends February 15th.',
    propertyId: 'p1',
    tenantId: 'u10',
    agentId: 'a1',
    status: 'claimed',
    priority: 'high',
    attachments: [],
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-19T11:30:00Z',
  },
];

export default function TicketsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState<'all' | TicketType['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketType['status']>('all');

  const filteredTickets = mockTickets.filter((ticket) => {
    const typeMatch = selectedFilter === 'all' || ticket.type === selectedFilter;
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const getTypeIcon = (type: TicketType['type']) => {
    switch (type) {
      case 'repair':
        return Wrench;
      case 'vacate':
        return HomeIcon;
      case 'complaint':
        return AlertCircle;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: TicketType['status']) => {
    switch (status) {
      case 'open':
        return Colors.light.primary;
      case 'claimed':
        return Colors.light.info;
      case 'in_progress':
        return Colors.light.secondary;
      case 'resolved':
        return Colors.light.success;
      case 'closed':
        return Colors.light.textSecondary;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getPriorityColor = (priority: TicketType['priority']) => {
    switch (priority) {
      case 'high':
        return Colors.light.error;
      case 'medium':
        return Colors.light.secondary;
      case 'low':
        return Colors.light.info;
      default:
        return Colors.light.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'My Tickets',
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
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {(['all', 'repair', 'vacate', 'complaint', 'other'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedFilter === type && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(type)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === type && styles.filterChipTextActive,
              ]}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusFiltersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {(['all', 'open', 'claimed', 'in_progress', 'resolved', 'closed'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusChip,
              statusFilter === status && styles.statusChipActive,
            ]}
            onPress={() => setStatusFilter(status)}
          >
            <Text
              style={[
                styles.statusChipText,
                statusFilter === status && styles.statusChipTextActive,
              ]}
            >
              {status === 'all' ? 'All Status' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ticket size={48} color={Colors.light.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Tickets Found</Text>
            <Text style={styles.emptyStateText}>
              {selectedFilter === 'all' && statusFilter === 'all'
                ? 'You haven&apos;t created any tickets yet'
                : 'No tickets match your current filters'}
            </Text>
          </View>
        ) : (
          filteredTickets.map((ticket) => {
            const TypeIcon = getTypeIcon(ticket.type);
            return (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => router.push(`/tickets/${ticket.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.ticketHeader}>
                  <View
                    style={[
                      styles.typeIconContainer,
                      { backgroundColor: getPriorityColor(ticket.priority) + '20' },
                    ]}
                  >
                    <TypeIcon size={20} color={getPriorityColor(ticket.priority)} />
                  </View>
                  <View style={styles.ticketHeaderInfo}>
                    <Text style={styles.ticketTitle} numberOfLines={1}>
                      {ticket.title}
                    </Text>
                    <Text style={styles.ticketType}>
                      {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(ticket.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(ticket.status) },
                      ]}
                    >
                      {ticket.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketDescription} numberOfLines={2}>
                  {ticket.description}
                </Text>

                <View style={styles.ticketFooter}>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(ticket.priority) + '15' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: getPriorityColor(ticket.priority) },
                      ]}
                    >
                      {ticket.priority.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.ticketDate}>{formatDate(ticket.updatedAt)}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => router.push('/tickets/create' as any)}
        activeOpacity={0.8}
      >
        <Plus size={24} color={Colors.light.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  filtersContainer: {
    maxHeight: 50,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  statusFiltersContainer: {
    maxHeight: 50,
    backgroundColor: Colors.light.background,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  filterChipTextActive: {
    color: Colors.light.surface,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statusChipActive: {
    backgroundColor: Colors.light.secondary,
    borderColor: Colors.light.secondary,
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  statusChipTextActive: {
    color: Colors.light.surface,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ticketHeaderInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  ticketType: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
  },
  ticketDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  ticketDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
