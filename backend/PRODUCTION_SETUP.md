# 🚀 Aura Backend - Production Setup Guide

This guide will help you take your Aura backend from mock data to production-ready with real services.

## 📋 Table of Contents

1. [Database Setup](#database-setup)
2. [Payment Gateway Integration](#payment-gateway-integration)
3. [Email & SMS Services](#email--sms-services)
4. [Push Notifications](#push-notifications)
5. [File Storage](#file-storage)
6. [Security & Authentication](#security--authentication)
7. [Deployment](#deployment)

---

## 1. Database Setup

### Option A: PostgreSQL with Drizzle ORM (Recommended)

```bash
# Install dependencies
bun add drizzle-orm postgres
bun add -d drizzle-kit

# Create drizzle config
```

Create `drizzle.config.ts`:

```typescript
import type { Config } from "drizzle-kit";

export default {
  schema: "./backend/db/drizzle-schema.ts",
  out: "./backend/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Create `backend/db/drizzle-schema.ts`:

```typescript
import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, decimal } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  phone: text("phone").unique().notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatar: text("avatar"),
  verified: boolean("verified").default(false),
  documentsVerified: boolean("documents_verified").default(false),
  deviceId: text("device_id"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  rewardPoints: integer("reward_points").default(0),
  organizationId: text("organization_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("KSh"),
  category: text("category").notNull(),
  location: jsonb("location").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  videos: jsonb("videos").$type<string[]>().default([]),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  sqft: integer("sqft"),
  available: boolean("available").default(true),
  featured: boolean("featured").default(false),
  boosted: boolean("boosted").default(false),
  boostExpiresAt: timestamp("boost_expires_at"),
  views: integer("views").default(0),
  saves: integer("saves").default(0),
  leads: integer("leads").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Add more tables as needed...
```

```bash
# Generate migrations
bunx drizzle-kit generate:pg

# Run migrations
bunx drizzle-kit push:pg
```

Update `backend/services/database.ts` to use Drizzle:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle-schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

export async function createDatabase(): Promise<Database> {
  return {
    users: {
      async findById(id) {
        return db.query.users.findFirst({ where: eq(schema.users.id, id) });
      },
      // ... implement all methods
    },
    // ... implement all collections
  };
}
```

### Option B: Supabase (Easiest)

```bash
bun add @supabase/supabase-js
```

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
```

---

## 2. Payment Gateway Integration

### M-Pesa (Daraja API)

```bash
bun add mpesa-node
```

Update `backend/services/payments.ts`:

```typescript
import { Mpesa } from "mpesa-node";

const mpesa = new Mpesa({
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  environment: "production",
  shortCode: process.env.MPESA_SHORTCODE!,
  passKey: process.env.MPESA_PASSKEY!,
  callbackURL: process.env.MPESA_CALLBACK_URL!,
});

export async function createMpesaPayment(params: {
  phoneNumber: string;
  amount: number;
  description: string;
}) {
  const result = await mpesa.lipaNaMpesaOnline({
    phoneNumber: params.phoneNumber,
    amount: params.amount,
    accountReference: "AURA",
    transactionDesc: params.description,
  });

  return {
    transactionId: result.CheckoutRequestID,
    status: "pending" as const,
  };
}
```

### Stripe

```bash
bun add stripe
```

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function createStripePayment(params: {
  amount: number;
  currency: string;
  description: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amount * 100,
    currency: params.currency.toLowerCase(),
    description: params.description,
    automatic_payment_methods: { enabled: true },
  });

  return {
    transactionId: paymentIntent.id,
    status: "pending" as const,
    url: paymentIntent.client_secret,
  };
}
```

### PayPal

```bash
bun add @paypal/checkout-server-sdk
```

---

## 3. Email & SMS Services

### Email with Resend (Recommended)

```bash
bun add resend
```

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(email: EmailNotification) {
  await resend.emails.send({
    from: "Aura <noreply@aura.com>",
    to: email.to,
    subject: email.subject,
    html: email.html || email.body,
  });
}
```

### SMS with Africa's Talking

```bash
bun add africastalking
```

```typescript
import AfricasTalking from "africastalking";

const africasTalking = AfricasTalking({
  apiKey: process.env.SMS_API_KEY!,
  username: process.env.SMS_USERNAME!,
});

const sms = africasTalking.SMS;

export async function sendSMS(phoneNumber: string, message: string) {
  await sms.send({
    to: [phoneNumber],
    message,
    from: process.env.SMS_SENDER_ID,
  });
}
```

---

## 4. Push Notifications

### Firebase Cloud Messaging

```bash
bun add firebase-admin
```

```typescript
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)
  ),
});

export async function sendPushNotification(notification: PushNotification) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: notification.data,
    token: notification.userId, // Store FCM tokens in user table
  };

  await admin.messaging().send(message);
}
```

---

## 5. File Storage

### AWS S3

```bash
bun add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadFile(file: Buffer, filename: string, mimeType: string) {
  const key = `uploads/${Date.now()}_${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: file,
      ContentType: mimeType,
    })
  );

  return {
    url: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
    key,
    size: file.length,
  };
}
```

---

## 6. Security & Authentication

### JWT with jsonwebtoken

```bash
bun add jsonwebtoken
bun add -d @types/jsonwebtoken
```

```typescript
import jwt from "jsonwebtoken";

export async function generateJWT(payload: JWTPayload): Promise<string> {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
}
```

### Password Hashing with bcrypt

```bash
bun add bcrypt
bun add -d @types/bcrypt
```

```typescript
import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 2FA with speakeasy

```bash
bun add speakeasy qrcode
```

```typescript
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function generate2FASecret() {
  const secret = speakeasy.generateSecret({ name: "Aura" });
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);
  return { secret: secret.base32, qrCode };
}

export async function verify2FAToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token,
  });
}
```

---

## 7. Deployment

### Deploy to Render

1. Create `render.yaml`:

```yaml
services:
  - type: web
    name: aura-backend
    runtime: node
    buildCommand: bun install && bun run build
    startCommand: bun run start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

2. Push to GitHub
3. Connect to Render
4. Add environment variables
5. Deploy!

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add environment variables
railway variables set DATABASE_URL=...

# Deploy
railway up
```

### Deploy to Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch
fly launch

# Set secrets
fly secrets set DATABASE_URL=... JWT_SECRET=...

# Deploy
fly deploy
```

---

## 🎯 Checklist

- [ ] Database connected (PostgreSQL/Supabase)
- [ ] M-Pesa integration configured
- [ ] Stripe integration configured
- [ ] Email service configured (Resend/SendGrid)
- [ ] SMS service configured (Africa's Talking/Twilio)
- [ ] Push notifications configured (FCM)
- [ ] File storage configured (S3/Cloudflare R2)
- [ ] JWT authentication implemented
- [ ] Password hashing implemented
- [ ] 2FA implemented
- [ ] Environment variables set
- [ ] SSL certificate configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking (Sentry)
- [ ] Deployed to production

---

## 📚 Additional Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [M-Pesa Daraja API](https://developer.safaricom.co.ke/)
- [Stripe Docs](https://stripe.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/)

---

**Your backend is now production-ready!** 🎊
