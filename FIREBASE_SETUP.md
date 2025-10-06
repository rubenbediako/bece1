# Firebase Database Setup Guide - BECE 2026 Platform

## 🔥 Firebase Configuration Complete!

Your Firebase project `bece-ea729` is now configured and ready to use.

## ✅ What's Already Done

1. **Firebase Project**: `bece-ea729` 
2. **Environment Variables**: Configured in `.env.local`
3. **Firebase Services**: Authentication, Firestore, Storage, Analytics
4. **App Integration**: Firebase providers and services are ready

## 🚀 Next Steps to Complete Setup

### Step 1: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/project/bece-ea729)
2. Click on "Firestore Database" in the left sidebar
3. Click "Create database"
4. Choose "Start in test mode" (for now)
5. Select location: `us-central1` or closest to Ghana
6. Click "Done"

### Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click on "Email/Password"
5. Enable "Email/Password" provider
6. Click "Save"

### Step 3: Set Up Firestore Security Rules

1. Go to "Firestore Database" > "Rules"
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

### Step 4: Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. The app should now:
   - Connect to Firebase automatically
   - Show the modern landing page
   - Allow you to create the first admin account

### Step 5: Create Your First Admin User

1. Click "Admin Login" on the landing page
2. Click "Create Initial Admin"
3. Fill in your admin details:
   - **Email**: your-admin@email.com
   - **Password**: (choose a secure password)
   - **Full Name**: Your Name

4. The system will automatically:
   - Create your admin account
   - Seed initial subjects (Math, English, Science, Social Studies)
   - Set up the database structure

## 🛟 Troubleshooting

### Common Issues:

1. **"Firebase project not found"**
   - Check that `.env.local` exists with correct values
   - Verify project ID: `bece-ea729`

2. **"Permission denied"**
   - Make sure Firestore rules allow authenticated access
   - Check that Authentication is enabled

3. **"Network error"**
   - Check internet connection
   - Verify Firebase URLs are accessible

### Check Your Setup:

Run this command to verify configuration:
```bash
cat .env.local
```

Should show:
```
VITE_FIREBASE_PROJECT_ID=bece-ea729
VITE_FIREBASE_API_KEY=AIzaSyD-jhQDPYs7Suj7pv1tZjnpVbQX6RLhI7o
# ... other variables
```

## 🔒 Production Security (Later)

When ready for production, update Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin-only collections
    match /subjects/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /topics/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /questions/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /predictions/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 What You Get with Firebase

### Real-time Features:
- ✅ User authentication
- ✅ Real-time data sync
- ✅ Offline support
- ✅ Data persistence
- ✅ User management
- ✅ Analytics tracking

### Database Collections:
- **users**: Student and admin accounts
- **subjects**: Math, English, Science, Social Studies
- **topics**: Subject subdivisions
- **questions**: BECE practice questions
- **predictions**: AI-generated predictions
- **analytics**: Usage tracking

## 🚀 Ready to Launch!

Your BECE 2026 Prediction Platform now has:
- ✅ Modern Quantic-style UI
- ✅ Firebase backend
- ✅ Real-time data
- ✅ User authentication
- ✅ Progressive Web App
- ✅ Mobile-friendly design

Start the app and create your first admin account to begin! 🎉
