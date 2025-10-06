#!/bin/bash

# BECE 2026 Prediction Platform - Vercel Deployment Script
# This script prepares and deploys the application to Vercel

echo "🚀 Starting BECE 2026 Platform Deployment..."
echo "=============================================="

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
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d 'v' -f 2)
required_version="18.0.0"

print_status "Checking Node.js version: $node_version"
if ! npx semver "$node_version" -r ">=$required_version" > /dev/null 2>&1; then
    print_error "Node.js version $required_version or higher is required. Current: $node_version"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci --silent

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

print_success "Dependencies installed successfully"

# Run linting
print_status "Running ESLint checks..."
npm run lint:check

if [ $? -ne 0 ]; then
    print_warning "Linting issues found. Consider fixing them before deployment."
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Build the project
print_status "Building the project for production..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi

print_success "Build completed successfully"

# Check if dist directory exists and has content
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    print_error "Build output directory 'dist' is empty or doesn't exist"
    exit 1
fi

print_status "Build output verified in 'dist' directory"

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    print_status "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
print_warning "You will need to:"
print_warning "1. Login to Vercel if not already logged in"
print_warning "2. Link this project to your Vercel account"
print_warning "3. Set up environment variables in Vercel dashboard"

# Run Vercel deployment
vercel --prod

if [ $? -eq 0 ]; then
    print_success "✅ Deployment completed successfully!"
    echo ""
    echo "🌐 Your BECE 2026 Prediction Platform is now live!"
    echo ""
    echo "📋 Post-deployment checklist:"
    echo "   ✅ App is accessible via the provided URL"
    echo "   🔧 Configure Firebase security rules for production"
    echo "   🔐 Set up proper environment variables in Vercel dashboard"
    echo "   📊 Monitor Firebase usage and quotas"
    echo "   🚀 Test all features including authentication and data storage"
    echo ""
    echo "🔗 Useful links:"
    echo "   • Vercel Dashboard: https://vercel.com/dashboard"
    echo "   • Firebase Console: https://console.firebase.google.com/"
    echo "   • Project Repository: https://github.com/your-username/prediction-app"
    echo ""
else
    print_error "Deployment failed"
    exit 1
fi
