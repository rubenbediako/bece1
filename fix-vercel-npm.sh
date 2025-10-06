#!/bin/bash

# BECE 2026 - Quick Fix for Vercel npm CI Error
echo "🔧 Fixing Vercel deployment npm CI error..."

# Create a simple vercel.json that works
cat > vercel.json << 'EOF'
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install --no-package-lock --legacy-peer-deps",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
EOF

echo "✅ Updated vercel.json with npm CI fix"

# Create .npmrc for better dependency resolution
cat > .npmrc << 'EOF'
legacy-peer-deps=true
fund=false
audit=false
package-lock=false
EOF

echo "✅ Created .npmrc with legacy peer deps"

# Test build locally
echo "🔨 Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    echo ""
    echo "🚀 Ready to deploy to Vercel!"
    echo "Your fixes:"
    echo "1. ✅ Updated vercel.json with --legacy-peer-deps"
    echo "2. ✅ Added .npmrc configuration"
    echo "3. ✅ Tested local build"
    echo ""
    echo "Now deploy with:"
    echo "vercel --prod"
else
    echo "❌ Local build failed. Check errors above."
    exit 1
fi
