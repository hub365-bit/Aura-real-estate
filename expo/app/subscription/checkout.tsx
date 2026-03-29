import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  CheckCircle,
  Shield,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

type PaymentMethod = 'mpesa' | 'card';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tier, price } = useLocalSearchParams<{ tier: string; price: string }>();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');

  const handlePayment = () => {
    if (paymentMethod === 'mpesa') {
      if (!mpesaPhone) {
        Alert.alert('Missing Information', 'Please enter your M-Pesa phone number');
        return;
      }
      Alert.alert(
        'M-Pesa Payment',
        'An M-Pesa prompt has been sent to your phone. Please enter your PIN to complete the payment.',
        [
          {
            text: 'OK',
            onPress: () => handleSuccess(),
          },
        ]
      );
    } else {
      if (!cardNumber || !expiryDate || !cvv || !cardName) {
        Alert.alert('Missing Information', 'Please fill in all card details');
        return;
      }
      Alert.alert('Processing Payment', 'Your payment is being processed...', [
        {
          text: 'OK',
          onPress: () => handleSuccess(),
        },
      ]);
    }
  };

  const handleSuccess = () => {
    Alert.alert(
      'Payment Successful! 🎉',
      'Your subscription has been activated. You can now access all premium features.',
      [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  const getTierLabel = (tierValue: string) => {
    switch (tierValue) {
      case 'weekly':
        return 'Weekly Plan';
      case 'monthly':
        return 'Monthly Plan';
      case 'yearly':
        return 'Yearly Plan';
      default:
        return 'Subscription Plan';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan:</Text>
            <Text style={styles.summaryValue}>{getTierLabel(tier || '')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>KSh {parseInt(price || '0').toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                paymentMethod === 'mpesa' && styles.paymentMethodCardActive,
              ]}
              onPress={() => setPaymentMethod('mpesa')}
            >
              <Smartphone
                size={28}
                color={
                  paymentMethod === 'mpesa' ? Colors.light.primary : Colors.light.textSecondary
                }
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'mpesa' && styles.paymentMethodTextActive,
                ]}
              >
                M-Pesa
              </Text>
              {paymentMethod === 'mpesa' && (
                <View style={styles.selectedBadge}>
                  <CheckCircle size={20} color={Colors.light.primary} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentMethodCard,
                paymentMethod === 'card' && styles.paymentMethodCardActive,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <CreditCard
                size={28}
                color={paymentMethod === 'card' ? Colors.light.primary : Colors.light.textSecondary}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  paymentMethod === 'card' && styles.paymentMethodTextActive,
                ]}
              >
                Card
              </Text>
              {paymentMethod === 'card' && (
                <View style={styles.selectedBadge}>
                  <CheckCircle size={20} color={Colors.light.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {paymentMethod === 'mpesa' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>M-Pesa Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Smartphone size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="+254 XXX XXX XXX"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={mpesaPhone}
                  onChangeText={setMpesaPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                You will receive an M-Pesa prompt on your phone to authorize the payment.
              </Text>
            </View>
          </View>
        )}

        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputWrapper}>
                <CreditCard size={18} color={Colors.light.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={cardName}
                  onChangeText={setCardName}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    maxLength={5}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={Colors.light.textSecondary}
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.securityNote}>
          <Shield size={20} color={Colors.light.success} />
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>
            Pay KSh {parseInt(price || '0').toLocaleString()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodCard: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  paymentMethodCardActive: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '08',
  },
  paymentMethodText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    marginTop: 12,
  },
  paymentMethodTextActive: {
    color: Colors.light.primary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.light.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  infoBox: {
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.success + '10',
    borderRadius: 12,
    padding: 16,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  payButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.surface,
  },
});
