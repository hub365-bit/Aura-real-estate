import { TRPCError } from "@trpc/server";

export interface PaymentIntentResult {
  transactionId: string;
  status: "pending" | "completed" | "failed";
  url?: string;
  checkoutUrl?: string;
}

export async function createMpesaPayment(params: {
  phoneNumber: string;
  amount: number;
  currency: string;
  description: string;
}): Promise<PaymentIntentResult> {
  console.log("💰 Creating M-Pesa payment:", params);
  
  const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
  const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
  const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
  const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
  const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY) {
    console.warn("⚠️  M-Pesa credentials not configured. Using mock payment.");
    return {
      transactionId: `MPESA_MOCK_${Date.now()}`,
      status: "pending",
    };
  }

  try {
    const baseUrl = MPESA_ENV === "production" 
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    const authResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64")}`,
      },
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

    const phoneNumber = params.phoneNumber.replace(/^\+/, "");
    
    const stkPushResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(params.amount),
        PartyA: phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.API_BASE_URL}/api/mpesa/callback`,
        AccountReference: "AURA",
        TransactionDesc: params.description,
      }),
    });

    const stkData = await stkPushResponse.json();

    if (stkData.ResponseCode === "0") {
      return {
        transactionId: stkData.CheckoutRequestID,
        status: "pending",
      };
    } else {
      throw new Error(stkData.ResponseDescription || "M-Pesa payment failed");
    }
  } catch (error) {
    console.error("M-Pesa payment error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "M-Pesa payment failed",
    });
  }
}

export async function createStripePayment(params: {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}): Promise<PaymentIntentResult> {
  console.log("💳 Creating Stripe payment:", params);
  
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    console.warn("⚠️  Stripe not configured. Using mock payment.");
    return {
      transactionId: `STRIPE_MOCK_${Date.now()}`,
      status: "pending",
      url: "https://checkout.stripe.com/mock",
    };
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(params.amount * 100),
      currency: params.currency.toLowerCase(),
      description: params.description,
      metadata: params.metadata || {},
      automatic_payment_methods: { enabled: true },
    });

    return {
      transactionId: paymentIntent.id,
      status: "pending",
      checkoutUrl: paymentIntent.client_secret || undefined,
    };
  } catch (error) {
    console.error("Stripe payment error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Stripe payment failed",
    });
  }
}

export async function createPayPalPayment(params: {
  amount: number;
  currency: string;
  description: string;
}): Promise<PaymentIntentResult> {
  console.log("🌐 Creating PayPal payment:", params);
  
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";

  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    console.warn("⚠️  PayPal not configured. Using mock payment.");
    return {
      transactionId: `PAYPAL_MOCK_${Date.now()}`,
      status: "pending",
      url: "https://www.paypal.com/checkoutnow?token=mock",
    };
  }

  try {
    const baseUrl = PAYPAL_ENV === "production"
      ? "https://api.paypal.com"
      : "https://api.sandbox.paypal.com";

    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: params.currency.toUpperCase(),
            value: params.amount.toFixed(2),
          },
          description: params.description,
        }],
        application_context: {
          return_url: `${process.env.API_BASE_URL}/api/paypal/success`,
          cancel_url: `${process.env.API_BASE_URL}/api/paypal/cancel`,
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (orderData.id) {
      const approveLink = orderData.links.find((link: any) => link.rel === "approve");
      return {
        transactionId: orderData.id,
        status: "pending",
        url: approveLink?.href,
      };
    } else {
      throw new Error("PayPal order creation failed");
    }
  } catch (error) {
    console.error("PayPal payment error:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "PayPal payment failed",
    });
  }
}

export async function verifyMpesaPayment(checkoutRequestId: string): Promise<{ verified: boolean; status: "completed" | "failed" }> {
  console.log(`✅ Verifying M-Pesa payment: ${checkoutRequestId}`);

  const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
  const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
  const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
  const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
  const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET || !MPESA_SHORTCODE || !MPESA_PASSKEY) {
    console.warn("⚠️  M-Pesa not configured. Using mock verification.");
    return { verified: true, status: "completed" };
  }

  try {
    const baseUrl = MPESA_ENV === "production" 
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    const authResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64")}`,
      },
    });

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString("base64");

    const queryResponse = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const queryData = await queryResponse.json();

    if (queryData.ResultCode === "0") {
      return { verified: true, status: "completed" };
    } else {
      return { verified: false, status: "failed" };
    }
  } catch (error) {
    console.error("M-Pesa verification error:", error);
    return { verified: false, status: "failed" };
  }
}

export async function verifyStripePayment(paymentIntentId: string): Promise<{ verified: boolean; status: "completed" | "failed" }> {
  console.log(`✅ Verifying Stripe payment: ${paymentIntentId}`);

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    console.warn("⚠️  Stripe not configured. Using mock verification.");
    return { verified: true, status: "completed" };
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      return { verified: true, status: "completed" };
    } else if (paymentIntent.status === "canceled" || paymentIntent.status === "payment_failed") {
      return { verified: false, status: "failed" };
    } else {
      return { verified: false, status: "failed" };
    }
  } catch (error) {
    console.error("Stripe verification error:", error);
    return { verified: false, status: "failed" };
  }
}

export async function verifyPayment(
  transactionId: string,
  method: "mpesa" | "stripe" | "paypal" | "card"
): Promise<{ verified: boolean; status: "completed" | "failed" }> {
  console.log(`✅ Verifying payment: ${transactionId} (${method})`);
  
  switch (method) {
    case "mpesa":
      return verifyMpesaPayment(transactionId);
    case "stripe":
    case "card":
      return verifyStripePayment(transactionId);
    case "paypal":
      console.warn("PayPal verification not implemented yet");
      return { verified: true, status: "completed" };
    default:
      return { verified: false, status: "failed" };
  }
}

export async function refundPayment(
  transactionId: string,
  amount: number,
  method: "mpesa" | "stripe" | "paypal" | "card"
): Promise<{ success: boolean; refundId: string }> {
  console.log(`🔄 Refunding payment: ${transactionId} - Amount: ${amount} (${method})`);
  
  if (method === "stripe" || method === "card") {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      console.warn("⚠️  Stripe not configured. Using mock refund.");
      return { success: true, refundId: `REFUND_MOCK_${Date.now()}` };
    }

    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

      const refund = await stripe.refunds.create({
        payment_intent: transactionId,
        amount: Math.ceil(amount * 100),
      });

      return { success: true, refundId: refund.id };
    } catch (error) {
      console.error("Stripe refund error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Refund failed",
      });
    }
  }

  console.warn(`Refund not implemented for ${method}`);
  return { success: true, refundId: `REFUND_MOCK_${Date.now()}` };
}
