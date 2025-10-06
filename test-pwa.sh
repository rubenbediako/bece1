#!/bin/bash

# Test PWA functionality locally
echo "🚀 Testing BECE 2026 PWA locally..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if service worker exists
if [ -f "public/sw.js" ]; then
    echo "✅ Service worker found: public/sw.js"
else
    echo "❌ Service worker not found!"
    exit 1
fi

# Check if manifest exists
if [ -f "public/manifest.json" ]; then
    echo "✅ Web app manifest found: public/manifest.json"
else
    echo "❌ Web app manifest not found!"
    exit 1
fi

# Check if icons exist
if [ -f "public/icon.svg" ]; then
    echo "✅ App icon found: public/icon.svg"
else
    echo "❌ App icon not found!"
fi

# Start preview server
echo "🌐 Starting preview server..."
echo "📱 Open http://localhost:4173 in your browser"
echo "🔧 To test PWA features:"
echo "   1. Open Chrome DevTools"
echo "   2. Go to Application tab"
echo "   3. Check Service Workers and Manifest sections"
echo "   4. Test 'Add to Home Screen' functionality"
echo ""
echo "Press Ctrl+C to stop the server"

npm run preview
