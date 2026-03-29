import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Star, CheckCircle, XCircle, DollarSign, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function TenantProfileScreen() {
  const { currentUser } = useApp();
  
  const tenantHistory = [
    {
      id: '1',
      propertyName: 'Modern Apartment in Kilimani',
      landlord: 'Sarah Mwangi',
      duration: '12 months',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      rating: 5,
      review: 'Excellent tenant, always paid on time',
      paymentReliability: 100,
    },
    {
      id: '2',
      propertyName: 'Studio in Westlands',
      landlord: 'John Kamau',
      duration: '6 months',
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      rating: 4,
      review: 'Good tenant, kept property clean',
      paymentReliability: 95,
    },
  ];
  
  const averageRating = tenantHistory.reduce((acc, h) => acc + h.rating, 0) / tenantHistory.length;
  const averagePaymentReliability = tenantHistory.reduce((acc, h) => acc + h.paymentReliability, 0) / tenantHistory.length;
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'Tenant Profile',
          headerLargeTitle: true,
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatar}
          />
          
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star size={24} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.statValue}>{averageRating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            
            <View style={styles.statItem}>
              <DollarSign size={24} color="#10B981" />
              <Text style={styles.statValue}>{averagePaymentReliability.toFixed(0)}%</Text>
              <Text style={styles.statLabel}>Payment</Text>
            </View>
            
            <View style={styles.statItem}>
              <Calendar size={24} color={Colors.light.tint} />
              <Text style={styles.statValue}>{tenantHistory.length}</Text>
              <Text style={styles.statLabel}>Rentals</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental History</Text>
          
          {tenantHistory.map(history => (
            <View key={history.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View style={styles.historyInfo}>
                  <Text style={styles.propertyName}>{history.propertyName}</Text>
                  <Text style={styles.landlordName}>Landlord: {history.landlord}</Text>
                </View>
                
                <View style={styles.ratingBadge}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{history.rating}</Text>
                </View>
              </View>
              
              <View style={styles.historyDetails}>
                <View style={styles.detailRow}>
                  <Calendar size={16} color={Colors.light.icon} />
                  <Text style={styles.detailText}>
                    {new Date(history.startDate).toLocaleDateString()} - {new Date(history.endDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <DollarSign size={16} color={Colors.light.icon} />
                  <Text style={styles.detailText}>
                    Payment Reliability: {history.paymentReliability}%
                  </Text>
                </View>
              </View>
              
              {history.review && (
                <View style={styles.reviewContainer}>
                  <Text style={styles.reviewLabel}>Landlord Review:</Text>
                  <Text style={styles.reviewText}>{history.review}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Status</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              {currentUser.verified ? (
                <CheckCircle size={20} color="#10B981" />
              ) : (
                <XCircle size={20} color="#EF4444" />
              )}
              <Text style={styles.statusText}>Identity Verified</Text>
            </View>
            
            <View style={styles.statusItem}>
              {currentUser.blacklisted ? (
                <XCircle size={20} color="#EF4444" />
              ) : (
                <CheckCircle size={20} color="#10B981" />
              )}
              <Text style={styles.statusText}>
                {currentUser.blacklisted ? 'Restricted' : 'Active Status'}
              </Text>
            </View>
          </View>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.background,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: Colors.light.tabIconDefault,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  landlordName: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#F59E0B',
  },
  historyDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.text,
  },
  reviewContainer: {
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 8,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  reviewText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    fontSize: 15,
    color: Colors.light.text,
  },
});
