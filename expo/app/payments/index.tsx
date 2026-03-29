import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, DollarSign, Check } from 'lucide-react-native';
import {
  PaymentMethod,
  processPayment,
  savePaymentHistory,
  formatCurrency,
  subscriptionPlans,
} from '@/lib/payments';
import Colors from '@/constants/colors';

const COLORS = {
  primary: Colors.light.primary,
  dark: Colors.light.text,
  white: '#FFFFFF',
  background: Colors.light.background,
  textSecondary: Colors.light.textSecondary,
  border: Colors.light.border,
  success: Colors.light.success,
};

export default function PaymentsScreen() {
  const [selectedPlan, setSelectedPlan] = useState(subscriptionPlans[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'weekly' | 'monthly' | 'yearly'
  >('monthly');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = selectedPlan[selectedPeriod];

  const handlePayment = async () => {
    if (selectedMethod === 'mpesa' && !phoneNumber) {
      Alert.alert('Error', 'Please enter your M-Pesa phone number');
      return;
    }

    if (selectedMethod === 'stripe' && !email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentRequest = {
        amount,
        currency: selectedPlan.currency,
        phoneNumber: selectedMethod === 'mpesa' ? phoneNumber : undefined,
        email: selectedMethod === 'stripe' ? email : undefined,
        description: `${selectedPlan.name} - ${selectedPeriod} subscription`,
        reference: `SUB_${Date.now()}`,
        method: selectedMethod,
      };

      const response = await processPayment(paymentRequest);

      if (response.success) {
        await savePaymentHistory({ ...paymentRequest, ...response });

        if (selectedMethod === 'mpesa' && response.checkoutRequestID) {
          Alert.alert(
            'Payment Initiated',
            response.message,
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert(
            'Payment Successful',
            response.message,
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
        }
      } else {
        Alert.alert('Payment Failed', response.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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
        <Text style={styles.headerTitle}>Subscribe to Premium</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Plan</Text>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan.id === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  {formatCurrency(plan.monthly, plan.currency)}/month
                </Text>
              </View>
              {selectedPlan.id === plan.id && (
                <Check size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Billing Period</Text>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'weekly' && styles.periodButtonSelected,
              ]}
              onPress={() => setSelectedPeriod('weekly')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'weekly' && styles.periodButtonTextSelected,
                ]}
              >
                Weekly
              </Text>
              <Text
                style={[
                  styles.periodPrice,
                  selectedPeriod === 'weekly' && styles.periodButtonTextSelected,
                ]}
              >
                {formatCurrency(selectedPlan.weekly)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'monthly' && styles.periodButtonSelected,
              ]}
              onPress={() => setSelectedPeriod('monthly')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'monthly' &&
                    styles.periodButtonTextSelected,
                ]}
              >
                Monthly
              </Text>
              <Text
                style={[
                  styles.periodPrice,
                  selectedPeriod === 'monthly' &&
                    styles.periodButtonTextSelected,
                ]}
              >
                {formatCurrency(selectedPlan.monthly)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === 'yearly' && styles.periodButtonSelected,
              ]}
              onPress={() => setSelectedPeriod('yearly')}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === 'yearly' && styles.periodButtonTextSelected,
                ]}
              >
                Yearly
              </Text>
              <Text
                style={[
                  styles.periodPrice,
                  selectedPeriod === 'yearly' && styles.periodButtonTextSelected,
                ]}
              >
                {formatCurrency(selectedPlan.yearly)}
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save 10%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === 'mpesa' && styles.methodCardSelected,
            ]}
            onPress={() => setSelectedMethod('mpesa')}
          >
            <View style={styles.methodIcon}>
              <DollarSign size={24} color={COLORS.success} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>M-Pesa</Text>
              <Text style={styles.methodDescription}>
                Pay with mobile money
              </Text>
            </View>
            {selectedMethod === 'mpesa' && (
              <Check size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodCard,
              selectedMethod === 'stripe' && styles.methodCardSelected,
            ]}
            onPress={() => setSelectedMethod('stripe')}
          >
            <View style={styles.methodIcon}>
              <CreditCard size={24} color={COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Credit/Debit Card</Text>
              <Text style={styles.methodDescription}>
                Pay with Stripe
              </Text>
            </View>
            {selectedMethod === 'stripe' && (
              <Check size={24} color={COLORS.primary} />
            )}
          </TouchableOpacity>
        </View>

        {selectedMethod === 'mpesa' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>M-Pesa Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+254 712 345 678"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        )}

        {selectedMethod === 'stripe' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan:</Text>
            <Text style={styles.summaryValue}>{selectedPlan.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Period:</Text>
            <Text style={styles.summaryValue}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Method:</Text>
            <Text style={styles.summaryValue}>
              {selectedMethod === 'mpesa' ? 'M-Pesa' : 'Credit Card'}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(amount, selectedPlan.currency)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.payButtonText}>
              Pay {formatCurrency(amount, selectedPlan.currency)}
            </Text>
          )}
        </TouchableOpacity>
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
    borderBottomColor: COLORS.border,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    position: 'relative',
  },
  periodButtonSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  periodButtonTextSelected: {
    color: COLORS.white,
  },
  periodPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  saveBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
  },
  summaryTotal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 32,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
