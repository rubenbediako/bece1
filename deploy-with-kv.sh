#!/bin/bash

# DEPLOY WITH VERCEL KV SETUP
echo "🚀 BECE 2026 PREDICTION PLATFORM - VERCEL DEPLOYMENT"
echo "===================================================="
echo ""

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed."
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "🔧 NEXT STEPS:"
echo "=============="
echo ""
echo "1. 🗄️  ADD VERCEL KV DATABASE:"
echo "   • Go to: https://vercel.com/dashboard"
echo "   • Select your 'prediction-app' project"
echo "   • Click 'Storage' tab"
echo "   • Click 'Create Database' → 'KV'"
echo "   • Name it 'bece-2026-kv'"
echo "   • Click 'Create' and 'Connect to Project'"
echo ""
echo "2. 🔄 REDEPLOY AFTER ADDING KV:"
echo "   • Run: npx vercel --prod"
echo ""
echo "3. ✅ TEST YOUR APP:"
echo "   • Open your Vercel URL"
echo "   • Check sync indicator (top-right corner)"
echo "   • Should show green 'Synced' status"
echo "   • Test saving subjects/questions"
echo ""
echo "🆘 TROUBLESHOOTING:"
echo "==================="
echo "• If sync shows orange 'Local Only' → KV not configured"
echo "• Click sync indicator → 'Database Diagnostics' for help"
echo "• App works with localStorage fallback until KV is set up"
echo ""
echo "🎉 Your BECE 2026 platform is ready!"
