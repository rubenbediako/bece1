#!/bin/bash

# BECE 2026 Platform - Quick Deployment Script
# This script prepares the project for Vercel deployment

echo "🚀 BECE 2026 Platform - Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version should be 18 or higher for Vercel deployment."
    echo "   Current version: $(node -v)"
    echo "   Please upgrade Node.js: https://nodejs.org/"
fi

echo "🔍 Pre-deployment checks..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run TypeScript check
echo "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation: PASSED"
else
    echo "❌ TypeScript compilation: FAILED"
    echo "   Please fix TypeScript errors before deployment."
    exit 1
fi

# Run ESLint check
echo "🔍 Running ESLint check..."
if npm run lint:check; then
    echo "✅ ESLint check: PASSED"
else
    echo "⚠️  ESLint warnings found. Running auto-fix..."
    npm run lint:fix
fi

# Build for production
echo "🏗️  Building for production..."
if npm run build; then
    echo "✅ Production build: SUCCESS"
else
    echo "❌ Production build: FAILED"
    echo "   Please fix build errors before deployment."
    exit 1
fi

# Verify build output
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build output verified: dist/index.html exists"
else
    echo "❌ Build output missing: dist/index.html not found"
    exit 1
fi

# Check Vercel configuration
if [ -f "vercel.json" ]; then
    echo "✅ Vercel configuration: vercel.json found"
else
    echo "❌ Vercel configuration: vercel.json missing"
    exit 1
fi

echo ""
echo "🎉 PRE-DEPLOYMENT CHECKS COMPLETE!"
echo "=================================="
echo ""
echo "✅ All systems ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Create GitHub repository (if not already done)"
echo "2. Push code to GitHub:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'BECE 2026 Platform - Production Ready'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/YOURUSERNAME/bece-2026-platform.git"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Visit https://vercel.com"
echo "   - Sign in with GitHub"
echo "   - Import your repository"
echo "   - Click Deploy"
echo ""
echo "4. Test deployment:"
echo "   - Admin login: dasexams@gmail.com / 123456"
echo "   - Student registration with access code"
echo "   - WhatsApp integration: 054045614"
echo ""
echo "📱 Platform ready for production use!"
echo "🎓 BECE 2026 students can now access the prediction platform!"
