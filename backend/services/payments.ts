import { TRPCError } from "@trpc/server";

export interface PaymentIntentResult {
  transactionId: string;
  status: "pending" | "completed" | "failed";
  url?: string;
}

export async function createMpesaPayment(params: {
  phoneNumber: string;
  amount: number;
  currency: string;
  description: string;
}): Promise<PaymentIntentResult> {
  console.log("💰 Creating M-Pesa payment:", params);
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real M-Pesa API integration (Daraja API)");
    console.warn("Required env vars: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE");
    throw new Error("M-Pesa integration not configured");
  }
  
  return {
    transactionId: `MPESA_${Date.now()}`,
    status: "pending",
  };
}

export async function createStripePayment(params: {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}): Promise<PaymentIntentResult> {
  console.log("💳 Creating Stripe payment:", params);
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real Stripe integration");
    console.warn("Required env vars: STRIPE_SECRET_KEY");
    throw new Error("Stripe integration not configured");
  }
  
  return {
    transactionId: `STRIPE_${Date.now()}`,
    status: "pending",
    url: "https://checkout.stripe.com/mock",
  };
}

export async function createPayPalPayment(params: {
  amount: number;
  currency: string;
  description: string;
}): Promise<PaymentIntentResult> {
  console.log("🌐 Creating PayPal payment:", params);
  
  if (process.env.NODE_ENV === "production") {
    console.warn("⚠️  Implement real PayPal integration");
    console.warn("Required env vars: PAYPAL_CLIENT_ID, PAYPAL_SECRET");
    throw new Error("PayPal integration not configured");
  }
  
  return {
    transactionId: `PAYPAL_${Date.now()}`,
    status: "pending",
    url: "https://www.paypal.com/checkoutnow?token=mock",
  };
}

export async function verifyPayment(
  transactionId: string,
  method: "mpesa" | "stripe" | "paypal" | "card"
): Promise<{ verified: boolean; status: "completed" | "failed" }> {
  console.log(`✅ Verifying payment: ${transactionId} (${method})`);
  
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement real payment verification");
  }
  
  return {
    verified: true,
    status: "completed",
  };
}

export async function refundPayment(
  transactionId: string,
  amount: number
): Promise<{ success: boolean; refundId: string }> {
  console.log(`🔄 Refunding payment: ${transactionId} - Amount: ${amount}`);
  
  if (process.env.NODE_ENV === "production") {
    throw new Error("Implement real payment refund");
  }
  
  return {
    success: true,
    refundId: `REFUND_${Date.now()}`,
  };
}
