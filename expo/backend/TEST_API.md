# 🧪 API Testing Guide

This guide shows you how to test all backend endpoints before connecting to your React Native frontend.

## 🚀 Quick Start

```bash
# Start the development server
bun run start

# Backend will be available at:
# http://localhost:3000/api/trpc
```

## 📝 Testing Methods

### Method 1: Using tRPC Client (Recommended)

Create `backend/test.ts`:

```typescript
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./trpc/app-router";
import superjson from "superjson";

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      transformer: superjson,
    }),
  ],
});

async function testAPI() {
  try {
    // Test 1: Signup
    console.log("🧪 Testing signup...");
    const signupResult = await client.auth.signup.mutate({
      email: "test@example.com",
      phone: "+254712345678",
      password: "password123",
      name: "Test User",
      role: "user",
    });
    console.log("✅ Signup successful:", signupResult);

    // Test 2: Login
    console.log("\n🧪 Testing login...");
    const loginResult = await client.auth.login.mutate({
      email: "test@example.com",
      password: "password123",
    });
    console.log("✅ Login successful:", loginResult);

    // Test 3: List Properties
    console.log("\n🧪 Testing property list...");
    const properties = await client.properties.list.query({
      type: "rental",
    });
    console.log(`✅ Found ${properties.length} properties`);

    // Test 4: Create Booking
    console.log("\n🧪 Testing booking creation...");
    const booking = await client.bookings.create.mutate({
      propertyId: properties[0]?.id || "mock-property-id",
      checkIn: new Date("2025-11-01"),
      checkOut: new Date("2025-11-05"),
      guests: 2,
      specialRequests: "Late check-in please",
    });
    console.log("✅ Booking created:", booking);

    // Test 5: Create Ticket
    console.log("\n🧪 Testing ticket creation...");
    const ticket = await client.tickets.create.mutate({
      propertyId: properties[0]?.id || "mock-property-id",
      type: "repair",
      title: "Broken AC",
      description: "Air conditioner not cooling",
      priority: "high",
    });
    console.log("✅ Ticket created:", ticket);

    // Test 6: Get Analytics
    console.log("\n🧪 Testing analytics dashboard...");
    const analytics = await client.analytics.dashboard.query({
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
    });
    console.log("✅ Analytics retrieved:", analytics);

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testAPI();
```

Run tests:
```bash
bun run backend/test.ts
```

### Method 2: Using cURL

```bash
# Test 1: Health check
curl http://localhost:3000/

# Test 2: Signup
curl -X POST http://localhost:3000/api/trpc/auth.signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+254712345678",
    "password": "password123",
    "name": "Test User",
    "role": "user"
  }'

# Test 3: Login
curl -X POST http://localhost:3000/api/trpc/auth.login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test 4: List Properties
curl "http://localhost:3000/api/trpc/properties.list?input=%7B%22type%22%3A%22rental%22%7D"

# Test 5: Get Rewards
curl http://localhost:3000/api/trpc/rewards.get

# Test 6: List Notifications
curl http://localhost:3000/api/trpc/notifications.list
```

### Method 3: Using Postman/Insomnia

Import this collection:

```json
{
  "name": "Aura API",
  "requests": [
    {
      "name": "Signup",
      "method": "POST",
      "url": "http://localhost:3000/api/trpc/auth.signup",
      "body": {
        "email": "test@example.com",
        "phone": "+254712345678",
        "password": "password123",
        "name": "Test User",
        "role": "user"
      }
    },
    {
      "name": "Login",
      "method": "POST",
      "url": "http://localhost:3000/api/trpc/auth.login",
      "body": {
        "email": "test@example.com",
        "password": "password123"
      }
    },
    {
      "name": "List Properties",
      "method": "GET",
      "url": "http://localhost:3000/api/trpc/properties.list?input={\"type\":\"rental\"}"
    }
  ]
}
```

## 📊 Test Scenarios

### Scenario 1: User Journey

```typescript
// 1. User signs up
const user = await client.auth.signup.mutate({ ... });

// 2. User verifies OTP
await client.auth.verifyOtp.mutate({
  contact: user.phone,
  otp: "123456",
});

// 3. User browses properties
const properties = await client.properties.list.query({
  type: "rental",
  area: "Nairobi",
});

// 4. User creates a booking
const booking = await client.bookings.create.mutate({
  propertyId: properties[0].id,
  checkIn: new Date(),
  checkOut: new Date(),
  guests: 2,
});

// 5. User earns reward points
await client.rewards.addPoints.mutate({
  userId: user.id,
  points: 10,
  reason: "booking",
});
```

### Scenario 2: Agent Journey

```typescript
// 1. Agent signs up
const agent = await client.auth.signup.mutate({
  role: "agent",
  ...
});

// 2. Agent enables 2FA
const twoFA = await client.auth.enable2fa.mutate({});

// 3. Agent creates property
const property = await client.properties.create.mutate({
  type: "rental",
  title: "Modern 2BR Apartment",
  price: 50000,
  ...
});

// 4. Agent views analytics
const analytics = await client.analytics.dashboard.query({
  startDate: new Date(),
  endDate: new Date(),
});

// 5. Agent boosts property
await client.properties.boost.mutate({
  propertyId: property.id,
  duration: "monthly",
});
```

### Scenario 3: Ticket Workflow

```typescript
// 1. Tenant creates repair ticket
const ticket = await client.tickets.create.mutate({
  type: "repair",
  title: "Broken sink",
  description: "Kitchen sink is leaking",
});

// 2. Agent claims ticket
await client.tickets.update.mutate({
  ticketId: ticket.id,
  status: "claimed",
});

// 3. Agent marks in progress
await client.tickets.update.mutate({
  ticketId: ticket.id,
  status: "in_progress",
});

// 4. Agent resolves ticket
await client.tickets.update.mutate({
  ticketId: ticket.id,
  status: "resolved",
});

// 5. Ticket auto-closes
// (happens automatically after timeout or confirmation)
```

## 🔍 Testing Checklist

### Authentication
- [x] Signup with email & phone
- [x] Login with credentials
- [x] OTP verification
- [x] 2FA setup and verification
- [ ] Password reset (implement)
- [ ] JWT token refresh (implement)

### Properties
- [x] List properties with filters
- [x] Get single property details
- [x] Create new property
- [x] Update property
- [x] Boost property listing
- [x] Track views/saves/leads

### Bookings
- [x] Create booking with QR code
- [x] List user bookings
- [x] Get booking details
- [ ] Update booking status
- [ ] Cancel booking

### Tickets
- [x] Create ticket
- [x] List tickets with filters
- [x] Update ticket status
- [x] Auto-relist on vacate closure
- [x] Notifications on updates

### Social Features
- [x] Create business page
- [x] List businesses
- [x] Get business details
- [x] Create post/reel
- [x] List posts
- [x] Create review
- [x] List reviews

### Payments
- [x] Create payment intent
- [x] List payment history
- [ ] Verify payment callback
- [ ] Process refunds

### Rewards & Analytics
- [x] Get user rewards
- [x] Add reward points
- [x] Get leaderboard
- [x] Get analytics dashboard

### Notifications & Messages
- [x] List notifications
- [x] Mark notification as read
- [x] Create message
- [x] List conversations

## 🐛 Common Issues & Fixes

### Issue 1: CORS Error
**Problem:** Browser blocks requests
**Fix:** Update `backend/hono.ts`:
```typescript
app.use("*", cors({
  origin: ["http://localhost:8081", "http://localhost:19006"],
  credentials: true,
}));
```

### Issue 2: Authentication Failed
**Problem:** Token not being sent
**Fix:** Add authorization header:
```typescript
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
      headers() {
        return {
          authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
});
```

### Issue 3: Database Connection
**Problem:** Mock data not loading
**Fix:** Check `backend/db/mock-db.ts` initialization

### Issue 4: Validation Errors
**Problem:** Zod schema validation fails
**Fix:** Check input data format matches schema

## 📈 Performance Testing

```typescript
// Load test with multiple concurrent requests
async function loadTest() {
  const requests = Array.from({ length: 100 }, (_, i) =>
    client.properties.list.query({ type: "rental" })
  );

  console.time("Load Test");
  const results = await Promise.all(requests);
  console.timeEnd("Load Test");

  console.log(`✅ Completed ${results.length} requests`);
}

loadTest();
```

## 🎯 Next Steps

Once all tests pass:
1. ✅ Backend API is working correctly
2. ✅ Ready to connect React Native frontend
3. ✅ Replace mock data with real database
4. ✅ Add payment gateway integrations
5. ✅ Deploy to production

---

**Happy Testing!** 🚀
