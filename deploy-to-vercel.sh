#!/bin/bash

# BECE 2026 Platform - Vercel Deployment Script
echo "🚀 BECE 2026 Platform - Preparing for Vercel Deployment"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if project name is correct
PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
if [ "$PROJECT_NAME" != "bece-2026-prediction-platform" ]; then
    echo "❌ Error: Wrong project. Expected 'bece-2026-prediction-platform'."
    exit 1
fi

echo "✅ Project verified: $PROJECT_NAME"

# Clean and test build
echo ""
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

echo ""
echo "📦 Installing dependencies..."
npm ci

echo ""
echo "🔍 Running TypeScript check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix before deployment."
    exit 1
fi

echo ""
echo "🔍 Running ESLint check..."
npm run lint:check
if [ $? -ne 0 ]; then
    echo "⚠️  ESLint warnings found, but continuing..."
fi

echo ""
echo "🏗️  Building for production..."
npm run build:clean
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deployment."
    exit 1
fi

echo ""
echo "✅ Build successful!"

# Show build size
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo "📊 Build size: $BUILD_SIZE"
fi

echo ""
echo "🎯 Deployment Ready!"
echo "===================="
echo ""
echo "Your BECE 2026 Platform is ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. 📤 Push to GitHub: git add . && git commit -m 'Ready for deployment' && git push"
echo "2. 🌐 Deploy on Vercel: Import your GitHub repository"
echo "3. ⚙️  Vercel will auto-detect Vite and use optimal settings"
echo "4. 🎉 Your app will be live at: https://your-project.vercel.app"
echo ""
echo "📋 Key info for Vercel:"
echo "   • Framework: Vite"
echo "   • Build Command: npm run build"
echo "   • Output Directory: dist"
echo "   • Install Command: npm ci"
echo ""
echo "🔗 Useful links:"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • Deployment Guide: ./VERCEL_DEPLOYMENT_GUIDE.md"
echo ""
echo "✨ Happy deploying!"
