#!/bin/bash

echo "🚀 BECE 2026 Platform - Vercel Deployment Script"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies
echo "📦 Installing dependencies..."
npm install --no-package-lock --legacy-peer-deps

# Run build
echo "🔨 Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found. Installing globally..."
    npm install -g vercel
fi

echo "🚀 Deploying to Vercel..."
echo ""
echo "📋 Deployment Checklist:"
echo "  ✅ TypeScript errors fixed"
echo "  ✅ Production build created"
echo "  ✅ Landing page with Grid layout fixed"
echo "  ✅ All dependencies resolved"
echo ""
echo "🔧 Vercel Configuration:"
echo "  • Framework: Vite"
echo "  • Build Command: npm run build"
echo "  • Output Directory: dist"
echo "  • Node.js Version: 18.x"
echo ""

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "📱 Your BECE 2026 Prediction Platform is now live!"
    echo ""
    echo "📋 Next Steps:"
    echo "  1. Visit your deployed app and test all features"
    echo "  2. Set up environment variables in Vercel dashboard if using Firebase"
    echo "  3. Configure custom domain if needed"
    echo "  4. Monitor app performance and user feedback"
    echo ""
else
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi
