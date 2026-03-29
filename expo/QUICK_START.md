# ⚡ Aura App - Quick Start Guide

Get your Aura app running in **under 10 minutes**!

---

## 🚀 Step 1: Install Dependencies (2 minutes)

```bash
# Install all dependencies
bun install

# Or with npm
npm install
```

---

## 🔧 Step 2: Basic Configuration (3 minutes)

### Create Environment Files

```bash
# Copy example files
cp .env.example .env
cp backend/.env.example backend/.env
```

### Minimal Configuration (for local development)

The app will work with mock services by default! You only need to set this:

**.env**
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8081
```

**backend/.env**
```bash
# JWT secret (generate a random string)
JWT_SECRET=your-random-secret-key-min-32-chars-for-security
```

*That's it! All other services will use mocks for development.*

---

## 🏃 Step 3: Run the App (1 minute)

```bash
# Start the development server
npm start

# Or specifically for web
npm run start-web

# Scan QR code with Expo Go app on your phone
# Or press 'w' for web, 'i' for iOS simulator, 'a' for Android emulator
```

---

## ✅ You're Done!

The app is now running with:
- ✅ Mock authentication
- ✅ Mock database
- ✅ Mock payments
- ✅ Full UI and features

---

## 🎯 What Works Out of the Box

### Already Functional (No Setup Required)
- Authentication & Login
- Property browsing
- Service listings
- Bookings
- Tickets
- Social feed
- Business pages
- Reviews & ratings
- Rewards
- Analytics dashboards
- Notifications (in-app)

### Requires API Keys (Optional for Development)
- Google Maps (will show error but app works)
- Payment processing (mocked)
- Push notifications (mocked)
- SMS/Email (logged to console)

---

## 📱 Testing on Your Phone

1. Install [Expo Go](https://expo.dev/client) on your iOS/Android device
2. Run `npm start`
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)
4. App loads on your phone!

---

## 🧪 Test Features

### Try These Flows:

1. **Sign Up Flow**
   - Go to auth/signup
   - Enter email/phone
   - Receive OTP in console logs
   - Complete registration

2. **Browse Properties**
   - View property listings on home tab
   - Tap to see details
   - Use filters and search

3. **Create Booking**
   - Select a property/service
   - Book a room or appointment
   - View booking in bookings tab

4. **Social Features**
   - Go to Feed tab
   - View posts and reels
   - Like and comment

---

## 🔐 Test User Credentials

The mock database includes a test user:

```
Email: test@example.com
Password: (any password works in mock mode)
OTP: (any 6-digit code works)
```

---

## 🛠️ When You're Ready for Production

Follow these guides in order:

1. **PRODUCTION_DEPLOYMENT.md** - Complete deployment guide
2. **backend/INTEGRATION_CHECKLIST.md** - Backend setup steps
3. **backend/.env.example** - Full list of environment variables

---

## 🆘 Common Issues

### Issue: "Can't find variable: process"
**Solution**: This is normal on mobile. Environment variables work fine.

### Issue: Google Maps not showing
**Solution**: Add `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` to .env

### Issue: Payment fails
**Solution**: Payments are mocked in development. Add real keys for production.

### Issue: Push notifications don't work
**Solution**: Configure Firebase in .env (optional for development)

---

## 📚 Next Steps

### For Development
- ✅ You're all set! Start building features
- Add your own properties and services
- Customize the UI
- Test all user flows

### For Production
See `PRODUCTION_DEPLOYMENT.md` for:
- Real database setup
- Payment gateway integration  
- Google Maps configuration
- Push notification setup
- App store deployment

---

## 🎨 Customize the App

### Change App Name
Edit `app.json`:
```json
{
  "name": "Your App Name",
  "slug": "your-app-slug"
}
```

### Change Colors
Edit `constants/colors.ts`:
```typescript
export const colors = {
  primary: "#your-color",
  // ...
}
```

### Modify Data
Edit files in `mocks/` directory:
- `mocks/properties.ts` - Sample properties
- `mocks/services.ts` - Sample services
- `mocks/posts.ts` - Sample social posts

---

## 💡 Pro Tips

1. **Use Web for Fast Development**
   ```bash
   npm run start-web
   # Opens in browser - faster refresh
   ```

2. **Enable Hot Reload**
   - Shake device
   - Enable Fast Refresh

3. **View Logs**
   ```bash
   # In terminal where app is running
   # All console.logs appear here
   ```

4. **Debug Network**
   - Open React Native Debugger
   - See all tRPC calls

---

## 🎉 You're Ready!

Your Aura app is now running locally with all features enabled!

**Happy coding! 🚀**

---

## 📞 Need Help?

Check these resources:
- `README.md` - Project overview
- `FEATURE_COMPLETE_SUMMARY.md` - All implemented features
- `PRODUCTION_DEPLOYMENT.md` - Production setup
- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
