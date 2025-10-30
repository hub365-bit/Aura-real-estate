# 🚀 Aura App - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Configuration

#### Frontend (.env)
```bash
# Copy the example file
cp .env.example .env

# Fill in these critical values:
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# ... (see .env.example for full list)
```

#### Backend (backend/.env)
```bash
# Copy the example file
cp backend/.env.example backend/.env

# Fill in production values:
DATABASE_URL=postgresql://user:password@host:5432/aura_prod
JWT_SECRET=generate-a-secure-random-32-char-secret
STRIPE_SECRET_KEY=sk_live_your_secret_key
MPESA_CONSUMER_KEY=your_production_key
# ... (see backend/.env.example for full list)
```

---

## 🗄️ Database Setup

### Option 1: PostgreSQL (Recommended)
```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS:
brew install postgresql@15

# Create database
createdb aura_production

# Update DATABASE_URL in backend/.env
DATABASE_URL=postgresql://username:password@localhost:5432/aura_production
```

### Option 2: Supabase (Managed PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

### Database Migration
```bash
# Install migration tool (e.g., Drizzle, Prisma, or Kysely)
# Then run migrations to create tables from backend/db/schema.ts

# Example with Drizzle:
npm install drizzle-orm drizzle-kit
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## 💳 Payment Gateway Setup

### M-Pesa (Daraja API)
1. Register at [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. Create an app and get credentials
3. Add to backend/.env:
```bash
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_ENV=production
```

### Stripe
1. Get keys from [dashboard.stripe.com](https://dashboard.stripe.com)
2. Add to .env files:
```bash
# Frontend
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Backend
STRIPE_SECRET_KEY=sk_live_...
```

### PayPal
1. Create app at [developer.paypal.com](https://developer.paypal.com)
2. Add credentials to backend/.env:
```bash
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
PAYPAL_ENV=production
```

---

## 🗺️ Google Maps Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
3. Create API keys (separate for iOS/Android/Web)
4. Add to .env:
```bash
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_web_key
EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY=your_ios_key
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY=your_android_key
```

---

## 🔔 Push Notifications (Firebase)

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add iOS and Android apps
3. Download config files and add Firebase config to .env
4. Enable Cloud Messaging

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📧 Email & SMS Services

### Email (Resend)
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Add to backend/.env:
```bash
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@yourdomain.com
```

### SMS (Africa's Talking)
1. Register at [africastalking.com](https://africastalking.com)
2. Top up account
3. Add credentials:
```bash
AFRICASTALKING_API_KEY=your_key
AFRICASTALKING_USERNAME=your_username
```

---

## 📦 File Storage

### Option 1: AWS S3
```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=aura-uploads
```

### Option 2: Cloudflare R2
```bash
# Similar to S3, use Cloudflare R2 credentials
```

---

## 🚀 Backend Deployment

### Option 1: Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Render
1. Connect GitHub repo
2. Add environment variables
3. Deploy from dashboard

### Option 3: AWS/GCP
- Use Elastic Beanstalk (AWS) or Cloud Run (GCP)
- Set up load balancers and auto-scaling

---

## 📱 Mobile App Builds

### iOS
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Build APK/AAB
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

---

## 🔐 Security Checklist

- [ ] Change all default secrets and passwords
- [ ] Enable HTTPS only
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Set secure JWT expiry times
- [ ] Encrypt sensitive data at rest
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📊 Monitoring & Analytics

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: Firebase Performance
- **Logs**: Papertrail, Loggly

---

## 🧪 Testing Before Launch

```bash
# Run type checking
npx tsc --noEmit

# Run linter
npm run lint

# Test on real devices
# - iOS physical device
# - Android physical device
# - Test all payment flows
# - Test push notifications
# - Test map functionality
```

---

## 🎯 Performance Optimization

1. **Code Splitting**: Lazy load heavy components
2. **Image Optimization**: Use optimized formats (WebP)
3. **Caching**: Implement Redis for backend caching
4. **CDN**: Use CDN for static assets
5. **Database Indexing**: Add indexes to frequently queried fields

---

## 📝 Post-Launch

- [ ] Monitor error rates
- [ ] Track user feedback
- [ ] Set up automated backups
- [ ] Create incident response plan
- [ ] Schedule regular maintenance windows
- [ ] Plan feature updates

---

## 🆘 Support & Maintenance

### Regular Tasks
- Daily: Check error logs
- Weekly: Review analytics, update content
- Monthly: Security patches, dependency updates
- Quarterly: Major feature releases

### Emergency Contacts
- Database admin: [contact]
- DevOps: [contact]
- Backend lead: [contact]

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Best Practices](https://reactnative.dev/docs/getting-started)
- [tRPC Documentation](https://trpc.io)
- [Stripe Integration Guide](https://stripe.com/docs)

---

**🎉 Ready to launch! Good luck with your Aura app deployment!**
