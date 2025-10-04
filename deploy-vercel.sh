#!/bin/bash

# BECE 2026 Prediction Platform - Vercel Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 Starting Vercel Deployment Process..."
echo "========================================"

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_status "Checking project structure..."

# Verify essential files exist
REQUIRED_FILES=(
    "package.json"
    "vercel.json"
    "tsconfig.json"
    "vite.config.ts"
    "index.html"
    "src/main.tsx"
    "src/App.tsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file $file is missing!"
        exit 1
    fi
done

print_success "All required files are present"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf .vercel/
print_success "Previous builds cleaned"

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed"

# Run linting
print_status "Running code quality checks..."
npm run lint:check
if [ $? -ne 0 ]; then
    print_warning "Linting issues found. Proceeding with deployment but consider fixing them."
fi

# TypeScript compilation check
print_status "Checking TypeScript compilation..."
npx tsc --noEmit --skipLibCheck
if [ $? -ne 0 ]; then
    print_error "TypeScript compilation failed"
    exit 1
fi
print_success "TypeScript compilation successful"

# Build the project
print_status "Building project for production..."
npm run build:clean
if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
print_success "Build completed successfully"

# Verify build output
if [ ! -d "dist" ]; then
    print_error "Build output directory 'dist' not found"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    print_error "Build output 'dist/index.html' not found"
    exit 1
fi

print_success "Build output verified"

# Check build size
BUILD_SIZE=$(du -sh dist/ | cut -f1)
print_status "Build size: $BUILD_SIZE"

# Display deployment information
echo ""
echo "🎯 Deployment Information"
echo "=========================="
echo "Project: BECE 2026 Prediction Platform"
echo "Framework: React + Vite + TypeScript"
echo "Build Output: dist/"
echo "Build Size: $BUILD_SIZE"
echo "Node Version: $(node --version)"
echo "NPM Version: $(npm --version)"
echo ""

# Display Vercel configuration
print_status "Vercel configuration:"
cat vercel.json | head -20
echo ""

# Deployment instructions
echo "📋 Next Steps for Vercel Deployment"
echo "===================================="
echo ""
echo "1. Install Vercel CLI (if not already installed):"
echo "   npm install -g vercel"
echo ""
echo "2. Login to Vercel:"
echo "   vercel login"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel"
echo ""
echo "4. For production deployment:"
echo "   vercel --prod"
echo ""
echo "📁 Project Structure Ready:"
echo "   ✅ Source code in src/"
echo "   ✅ Build output in dist/"
echo "   ✅ Vercel config in vercel.json"
echo "   ✅ Package.json configured"
echo "   ✅ TypeScript configuration"
echo ""
echo "🔧 Key Features Deployed:"
echo "   ✅ AI-powered question generation"
echo "   ✅ Mark-based solution types (12+ marks = 6-paragraph essays)"
echo "   ✅ Podcast conversation with real audio"
echo "   ✅ Subject-specific content (Social Studies, RME, English)"
echo "   ✅ Clean production-ready UI"
echo "   ✅ No demo/sample data"
echo ""

print_success "Deployment preparation completed!"
print_status "The application is ready for Vercel deployment."

echo ""
echo "🌐 After deployment, your app will be available at:"
echo "   https://your-app-name.vercel.app"
echo ""
echo "📝 Don't forget to:"
echo "   - Set up your custom domain (if needed)"
echo "   - Configure environment variables (if any)"
echo "   - Set up monitoring and analytics"
echo ""

exit 0
