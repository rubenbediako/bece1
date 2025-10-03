#!/bin/bash

# BECE 2026 Platform - Production Build Script
echo "🎓 Building BECE 2026 Prediction Platform for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running code quality checks..."
npm run lint

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📊 Build Statistics:"
    echo "==================="
    du -sh dist/
    echo ""
    echo "📁 Build Output:"
    ls -la dist/
    echo ""
    echo "🚀 Ready for deployment!"
    echo ""
    echo "To preview the production build:"
    echo "npm run preview"
    echo ""
    echo "To deploy to static hosting:"
    echo "Upload the 'dist/' folder to your hosting provider"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
