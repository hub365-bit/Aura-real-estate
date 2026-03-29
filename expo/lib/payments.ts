import AsyncStorage from '@react-native-async-storage/async-storage';

export type PaymentMethod = 'mpesa' | 'stripe' | 'paypal' | 'card';

export interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber?: string;
  email?: string;
  description: string;
  reference: string;
  method: PaymentMethod;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  message: string;
  checkoutRequestID?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  category: 'hotel' | 'service_provider' | 'property_seller' | 'boost';
  weekly: number;
  monthly: number;
  yearly: number;
  currency: string;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'hotel_plan',
    name: 'Hotels / Motels / Restaurants / Airbnb / Landlords',
    category: 'hotel',
    weekly: 1500,
    monthly: 5000,
    yearly: 55000,
    currency: 'KSh',
    features: [
      'Unlimited property listings',
      'Room booking system',
      'Business page with posts and reels',
      'Analytics dashboard',
      'Priority customer support',
      'Featured listings',
    ],
  },
  {
    id: 'service_provider_plan',
    name: 'Service Providers',
    category: 'service_provider',
    weekly: 300,
    monthly: 1000,
    yearly: 11000,
    currency: 'KSh',
    features: [
      'Service listings',
      'Booking management',
      'Business page',
      'Customer reviews',
      'Working hours management',
      'Analytics access',
    ],
  },
  {
    id: 'property_seller_plan',
    name: 'Property Sellers (Renting/Selling)',
    category: 'property_seller',
    weekly: 300,
    monthly: 1000,
    yearly: 11000,
    currency: 'KSh',
    features: [
      'Multiple property listings',
      'Lead generation',
      'Analytics dashboard',
      'Document upload',
      'Map integration',
      'Tenant management',
    ],
  },
  {
    id: 'boost_plan',
    name: 'Boost Listings/Services/Properties',
    category: 'boost',
    weekly: 200,
    monthly: 800,
    yearly: 8000,
    currency: 'KSh',
    features: [
      'Increased visibility',
      'Top search ranking',
      'Featured badge',
      'Extended reach',
      'Performance analytics',
    ],
  },
];

export async function initiateMpesaPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  console.log('Initiating M-Pesa payment:', request);
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockCheckoutRequestID = `ws_CO_${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    
    return {
      success: true,
      checkoutRequestID: mockCheckoutRequestID,
      reference: request.reference,
      message:
        'Payment request sent. Please check your phone for the M-Pesa prompt.',
    };
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return {
      success: false,
      message: 'Failed to initiate M-Pesa payment. Please try again.',
    };
  }
}

export async function checkMpesaPaymentStatus(
  checkoutRequestID: string
): Promise<PaymentResponse> {
  console.log('Checking M-Pesa payment status:', checkoutRequestID);
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const isSuccessful = Math.random() > 0.2;
    
    if (isSuccessful) {
      const transactionId = `MPesa${Date.now()}`;
      return {
        success: true,
        transactionId,
        message: 'Payment completed successfully!',
      };
    } else {
      return {
        success: false,
        message: 'Payment was cancelled or failed. Please try again.',
      };
    }
  } catch (error) {
    console.error('M-Pesa status check error:', error);
    return {
      success: false,
      message: 'Failed to check payment status.',
    };
  }
}

export async function processStripePayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  console.log('Processing Stripe payment:', request);
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const transactionId = `stripe_${Date.now()}`;
    
    return {
      success: true,
      transactionId,
      reference: request.reference,
      message: 'Payment completed successfully via Stripe!',
    };
  } catch (error) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      message: 'Stripe payment failed. Please check your card details.',
    };
  }
}

export async function processPayPalPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  console.log('Processing PayPal payment:', request);
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const transactionId = `paypal_${Date.now()}`;
    
    return {
      success: true,
      transactionId,
      reference: request.reference,
      message: 'Payment completed successfully via PayPal!',
    };
  } catch (error) {
    console.error('PayPal payment error:', error);
    return {
      success: false,
      message: 'PayPal payment failed. Please try again.',
    };
  }
}

export async function processPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  switch (request.method) {
    case 'mpesa':
      return await initiateMpesaPayment(request);
    case 'stripe':
      return await processStripePayment(request);
    case 'paypal':
      return await processPayPalPayment(request);
    case 'card':
      return await processStripePayment(request);
    default:
      return {
        success: false,
        message: 'Invalid payment method',
      };
  }
}

export async function savePaymentHistory(
  payment: PaymentResponse & PaymentRequest
): Promise<void> {
  try {
    const history = await getPaymentHistory();
    history.push({
      ...payment,
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem('payment_history', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving payment history:', error);
  }
}

export async function getPaymentHistory(): Promise<any[]> {
  try {
    const history = await AsyncStorage.getItem('payment_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading payment history:', error);
    return [];
  }
}

export function formatCurrency(amount: number, currency: string = 'KSh'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function calculateSubscriptionDiscount(
  baseAmount: number,
  period: 'weekly' | 'monthly' | 'yearly'
): number {
  switch (period) {
    case 'yearly':
      return 0.1;
    case 'monthly':
      return 0.05;
    default:
      return 0;
  }
}

export function getSubscriptionPlanById(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find((plan) => plan.id === planId);
}

export function getSubscriptionPlansByCategory(
  category: SubscriptionPlan['category']
): SubscriptionPlan[] {
  return subscriptionPlans.filter((plan) => plan.category === category);
}
