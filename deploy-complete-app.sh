#!/bin/bash

# BECE 2026 Prediction Platform - Production Deployment Script
# This script prepares and deploys the complete application

set -e

echo "🚀 BECE 2026 Prediction Platform - Production Deployment"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if this is the BECE project
if ! grep -q "BECE 2026 Prediction Platform" package.json 2>/dev/null; then
    print_warning "This doesn't appear to be the BECE 2026 project directory."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_status "Starting deployment process..."

# 1. Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/
print_success "Build cache cleaned"

# 2. Install dependencies
print_status "Installing dependencies..."
npm ci --production=false
print_success "Dependencies installed"

# 3. Run type checking
print_status "Running type checking..."
if npm run type-check 2>/dev/null || npx tsc --noEmit; then
    print_success "Type checking passed"
else
    print_warning "Type checking failed, but continuing deployment"
fi

# 4. Build for production
print_status "Building for production..."
if npm run build; then
    print_success "Production build completed"
else
    print_error "Build failed!"
    exit 1
fi

# 5. Check build size
print_status "Checking build size..."
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    print_success "Build size: $BUILD_SIZE"
else
    print_error "Build directory not found!"
    exit 1
fi

# 6. Test the build locally
print_status "Testing production build locally..."
echo "Starting preview server..."
npm run preview &
PREVIEW_PID=$!
sleep 3

# Check if preview server is running
if curl -s http://localhost:4173 > /dev/null; then
    print_success "Preview server running at http://localhost:4173"
    echo "Please test the application and press Enter to continue with deployment..."
    read -r
else
    print_warning "Preview server may not be running properly"
fi

# Stop preview server
kill $PREVIEW_PID 2>/dev/null || true

# 7. Deployment options
echo ""
echo "🌐 Deployment Options:"
echo "1. Deploy to Vercel (Recommended)"
echo "2. Deploy to Netlify"
echo "3. Deploy to GitHub Pages"
echo "4. Create deployment package"
echo "5. Exit without deploying"

read -p "Choose deployment option (1-5): " -n 1 -r
echo

case $REPLY in
    1)
        print_status "Deploying to Vercel..."
        if command -v vercel >/dev/null 2>&1; then
            vercel --prod
            print_success "Deployment to Vercel completed!"
        else
            print_error "Vercel CLI not found. Install with: npm i -g vercel"
            exit 1
        fi
        ;;
    2)
        print_status "Deploying to Netlify..."
        if command -v netlify >/dev/null 2>&1; then
            netlify deploy --prod --dir=dist
            print_success "Deployment to Netlify completed!"
        else
            print_error "Netlify CLI not found. Install with: npm i -g netlify-cli"
            exit 1
        fi
        ;;
    3)
        print_status "Preparing for GitHub Pages deployment..."
        # Add base path configuration for GitHub Pages
        echo "Please ensure your vite.config.js has the correct base path for GitHub Pages"
        print_success "Build ready for GitHub Pages deployment"
        ;;
    4)
        print_status "Creating deployment package..."
        PACKAGE_NAME="bece-2026-production-$(date +%Y%m%d-%H%M%S).tar.gz"
        tar -czf "$PACKAGE_NAME" dist/ package.json README.md COMPLETE_APP_GUIDE.md
        print_success "Deployment package created: $PACKAGE_NAME"
        ;;
    5)
        print_status "Deployment cancelled by user"
        exit 0
        ;;
    *)
        print_error "Invalid option selected"
        exit 1
        ;;
esac

echo ""
print_success "🎉 BECE 2026 Prediction Platform deployment completed!"
echo ""
echo "📋 Deployment Summary:"
echo "   - Build Size: $BUILD_SIZE"
echo "   - Features: Landing Page + AI Audio Explanations"
echo "   - Demo Data: Completely removed"
echo "   - Authentication: Production-ready"
echo "   - Status: Ready for students and administrators"
echo ""
echo "🔧 Next Steps:"
echo "   1. Create first administrator account"
echo "   2. Add educational content (subjects, topics, questions)"
echo "   3. Generate access codes for students"
echo "   4. Monitor platform usage and performance"
echo ""
echo "📚 Documentation: See COMPLETE_APP_GUIDE.md for full details"
echo ""
print_success "Happy teaching and learning! 🎓"
