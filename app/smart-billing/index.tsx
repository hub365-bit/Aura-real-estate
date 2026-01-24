import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Download,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { RentInvoice } from '@/types';

const mockInvoices: RentInvoice[] = [
  {
    id: 'inv_001',
    tenantId: 't1',
    tenantName: 'James Ochieng',
    landlordId: 'l1',
    propertyId: 'p1',
    amount: 45000,
    currency: 'KES',
    dueDate: '2026-02-01',
    paidAmount: 45000,
    paidAt: '2026-01-28',
    lateFee: 0,
    status: 'paid',
    createdAt: '2026-01-15',
  },
  {
    id: 'inv_002',
    tenantId: 't1',
    tenantName: 'James Ochieng',
    landlordId: 'l1',
    propertyId: 'p1',
    amount: 45000,
    currency: 'KES',
    dueDate: '2026-03-01',
    paidAmount: 25000,
    lateFee: 0,
    status: 'partial',
    createdAt: '2026-02-15',
  },
  {
    id: 'inv_003',
    tenantId: 't1',
    tenantName: 'James Ochieng',
    landlordId: 'l1',
    propertyId: 'p1',
    amount: 45000,
    currency: 'KES',
    dueDate: '2026-04-01',
    paidAmount: 0,
    lateFee: 2250,
    status: 'overdue',
    createdAt: '2026-03-15',
  },
];

export default function SmartBillingScreen() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid' | 'overdue'>('all');
  
  const filteredInvoices = filter === 'all'
    ? mockInvoices
    : mockInvoices.filter(inv => inv.status === filter);
  
  const totalDue = mockInvoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.amount - inv.paidAmount + inv.lateFee), 0);
  
  const getStatusConfig = (status: RentInvoice['status']) => {
    switch (status) {
      case 'paid':
        return { label: 'Paid', color: '#10B981', Icon: CheckCircle };
      case 'partial':
        return { label: 'Partial', color: '#F59E0B', Icon: AlertCircle };
      case 'unpaid':
        return { label: 'Unpaid', color: '#6B7280', Icon: AlertCircle };
      case 'overdue':
        return { label: 'Overdue', color: '#EF4444', Icon: AlertCircle };
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Smart Billing',
          headerLargeTitle: true,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Amount Due</Text>
          <Text style={styles.summaryAmount}>
            KES {totalDue.toLocaleString()}
          </Text>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {mockInvoices.filter(i => i.status === 'paid').length}
              </Text>
              <Text style={styles.summaryStatLabel}>Paid</Text>
            </View>
            
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {mockInvoices.filter(i => i.status === 'partial').length}
              </Text>
              <Text style={styles.summaryStatLabel}>Partial</Text>
            </View>
            
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatValue}>
                {mockInvoices.filter(i => i.status === 'overdue').length}
              </Text>
              <Text style={styles.summaryStatLabel}>Overdue</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          {['all', 'paid', 'partial', 'unpaid', 'overdue'].map(f => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                filter === f && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(f as any)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.invoicesSection}>
          <Text style={styles.sectionTitle}>Rent Invoices</Text>
          
          {filteredInvoices.map(invoice => {
            const { label, color, Icon } = getStatusConfig(invoice.status);
            const remaining = invoice.amount - invoice.paidAmount;
            
            return (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View style={styles.invoiceInfo}>
                    <FileText size={24} color={Colors.light.tint} />
                    <View style={styles.invoiceDetails}>
                      <Text style={styles.invoiceId}>{invoice.id}</Text>
                      <Text style={styles.invoiceProperty}>Property #{invoice.propertyId}</Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: color + '15' }]}>
                    <Icon size={14} color={color} />
                    <Text style={[styles.statusText, { color }]}>{label}</Text>
                  </View>
                </View>
                
                <View style={styles.invoiceAmounts}>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Rent Amount:</Text>
                    <Text style={styles.amountValue}>
                      {invoice.currency} {invoice.amount.toLocaleString()}
                    </Text>
                  </View>
                  
                  {invoice.paidAmount > 0 && (
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Paid:</Text>
                      <Text style={[styles.amountValue, { color: '#10B981' }]}>
                        {invoice.currency} {invoice.paidAmount.toLocaleString()}
                      </Text>
                    </View>
                  )}
                  
                  {invoice.lateFee > 0 && (
                    <View style={styles.amountRow}>
                      <Text style={styles.amountLabel}>Late Fee:</Text>
                      <Text style={[styles.amountValue, { color: '#EF4444' }]}>
                        {invoice.currency} {invoice.lateFee.toLocaleString()}
                      </Text>
                    </View>
                  )}
                  
                  {remaining > 0 && (
                    <View style={[styles.amountRow, styles.amountRowTotal]}>
                      <Text style={styles.amountLabelTotal}>Balance Due:</Text>
                      <Text style={styles.amountValueTotal}>
                        {invoice.currency} {(remaining + invoice.lateFee).toLocaleString()}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.invoiceFooter}>
                  <View style={styles.dueDateContainer}>
                    <Calendar size={16} color={Colors.light.icon} />
                    <Text style={styles.dueDateText}>
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.invoiceActions}>
                    <TouchableOpacity style={styles.iconButton}>
                      <Download size={20} color={Colors.light.tint} />
                    </TouchableOpacity>
                    
                    {invoice.status !== 'paid' && (
                      <TouchableOpacity
                        style={styles.payButton}
                        activeOpacity={0.7}
                      >
                        <DollarSign size={18} color="#FFFFFF" />
                        <Text style={styles.payButtonText}>Pay Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    padding: 24,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  invoicesSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  invoiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  invoiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  invoiceDetails: {
    gap: 2,
  },
  invoiceId: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  invoiceProperty: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  invoiceAmounts: {
    gap: 8,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountRowTotal: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  amountLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  amountLabelTotal: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  amountValueTotal: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.tint,
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDateText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  invoiceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
