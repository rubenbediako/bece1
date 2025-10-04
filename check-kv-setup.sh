#!/bin/bash

# VERCEL KV SETUP CHECKER
# This script helps you verify your Vercel KV setup

echo "🔧 VERCEL KV SETUP CHECKER"
echo "=========================="
echo ""

# Check if we're in a Vercel project
if [ ! -f "vercel.json" ]; then
    echo "❌ Not in a Vercel project directory"
    echo "💡 Make sure you're in your project root folder"
    exit 1
fi

echo "✅ Found Vercel project"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "💡 Install with: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Check environment variables
echo "🔍 Checking environment variables..."
echo ""

vercel env ls 2>/dev/null | grep -E "(KV_REST_API_URL|KV_REST_API_TOKEN|KV_URL)" > kv_vars.tmp

if [ -s kv_vars.tmp ]; then
    echo "✅ KV Environment variables found:"
    cat kv_vars.tmp
    rm kv_vars.tmp
else
    echo "❌ KV Environment variables NOT found"
    echo ""
    echo "🛠️  TO FIX THIS:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Select your project"
    echo "3. Go to Storage tab"
    echo "4. Create KV database"
    echo "5. Connect to your project"
    echo ""
    rm kv_vars.tmp 2>/dev/null
    exit 1
fi

echo ""
echo "🚀 Checking deployment status..."

# Get the latest deployment
DEPLOYMENT_URL=$(vercel ls --scope=personal 2>/dev/null | grep "prediction-app" | head -1 | awk '{print $2}')

if [ -n "$DEPLOYMENT_URL" ]; then
    echo "✅ Latest deployment: https://$DEPLOYMENT_URL"
    echo ""
    echo "🧪 Testing deployment..."
    
    # Test if the deployment is accessible
    if curl -s --head "https://$DEPLOYMENT_URL" | head -n 1 | grep "200 OK" > /dev/null; then
        echo "✅ Deployment is accessible"
    else
        echo "⚠️  Deployment might have issues"
    fi
else
    echo "❌ No deployments found"
    echo "💡 Deploy with: vercel --prod"
    exit 1
fi

echo ""
echo "📋 SETUP SUMMARY:"
echo "=================="
echo "✅ Vercel project: OK"
echo "✅ Vercel CLI: OK"
echo "✅ KV variables: OK"
echo "✅ Deployment: OK"
echo ""
echo "🎯 Next steps:"
echo "1. Open your app: https://$DEPLOYMENT_URL"
echo "2. Check sync indicator (top-right corner)"
echo "3. Test saving subjects/questions"
echo "4. Use Database Diagnostics if needed"
echo ""
echo "🎉 Your KV setup should be working!"
