#!/usr/bin/env node

/**
 * Firebase Database Initialization Script
 * 
 * This script initializes your Firebase Firestore database with:
 * - Security rules setup
 * - Initial data seeding
 * - Authentication configuration
 * 
 * Run this after setting up your Firebase project and environment variables.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import FirebaseService from '../src/services/FirebaseService.js';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

async function initializeFirebaseDatabase() {
  try {
    console.log('🔥 Initializing Firebase Database...');
    
    // Check if all required environment variables are set
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN', 
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.log('Please check your .env.local file');
      process.exit(1);
    }
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    // Initialize services
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    console.log('✅ Firebase services initialized');
    
    // Seed initial data
    console.log('📊 Seeding initial data...');
    await FirebaseService.seedInitialData();
    console.log('✅ Initial data seeded successfully');
    
    console.log('\n🎉 Firebase Database Setup Complete!');
    console.log('\nNext steps:');
    console.log('1. Go to Firebase Console and set up security rules');
    console.log('2. Enable Authentication with Email/Password');
    console.log('3. Start your app with: npm run dev');
    console.log('4. Create your first admin user through the setup flow');
    
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Check your Firebase configuration in .env.local');
    console.log('2. Ensure your Firebase project exists and is active');
    console.log('3. Verify Firestore is enabled in your Firebase project');
    process.exit(1);
  }
}

// Run the initialization
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeFirebaseDatabase();
}

export default initializeFirebaseDatabase;
