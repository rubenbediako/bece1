#!/bin/bash

# Quick Vercel deployment using npx (no global installation required)
echo "🚀 Quick Vercel Deployment for BECE 2026 Platform"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful!"

# Deploy using npx vercel
echo "🌐 Deploying to Vercel..."
echo ""
echo "📝 Note: You'll need to:"
echo "   1. Login to your Vercel account when prompted"
echo "   2. Link this project to Vercel"
echo "   3. Set up environment variables after deployment"
echo ""

npx vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "🔧 Post-deployment setup:"
echo "   1. Go to your Vercel dashboard"
echo "   2. Navigate to your project settings"
echo "   3. Add these environment variables:"
echo "      - VITE_FIREBASE_API_KEY"
echo "      - VITE_FIREBASE_AUTH_DOMAIN"
echo "      - VITE_FIREBASE_PROJECT_ID"
echo "      - VITE_FIREBASE_STORAGE_BUCKET"
echo "      - VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "      - VITE_FIREBASE_APP_ID"
echo "      - VITE_FIREBASE_MEASUREMENT_ID"
echo "      - VITE_APP_NAME=BECE 2026 Prediction Platform"
echo "      - VITE_APP_VERSION=1.0.0"
echo "      - NODE_ENV=production"
echo "   4. Redeploy to apply environment variables"
echo ""
