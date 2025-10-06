#!/bin/bash

# BECE 2026 Prediction Platform - Quick Vercel Deployment Script
# Run this script to deploy to Vercel with proper checks

echo "🚀 BECE 2026 Platform - Vercel Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Checking project setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    print_success "Node.js version $NODE_VERSION is compatible"
else
    print_error "Node.js version $NODE_VERSION is not supported. Please upgrade to Node.js 18+"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm ci
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed"
fi

# Run linting
print_info "Running code quality checks..."
npm run lint:check
if [ $? -ne 0 ]; then
    print_warning "Linting issues found. Attempting to fix..."
    npm run lint:fix
fi

# Build the project
print_info "Building project for production..."
npm run build:production
if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi
print_success "Build completed successfully"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        print_error "Failed to install Vercel CLI"
        exit 1
    fi
    print_success "Vercel CLI installed"
fi

# Deploy to Vercel
print_info "Deploying to Vercel..."
echo ""
print_warning "Make sure you have:"
print_warning "1. Created a Vercel account at vercel.com"
print_warning "2. Added all environment variables in Vercel dashboard"
print_warning "3. Connected your Git repository (recommended)"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Ask if production or preview
    echo ""
    echo "Deployment options:"
    echo "1. Production deployment (--prod)"
    echo "2. Preview deployment (default)"
    echo ""
    read -p "Choose deployment type (1 for production, 2 for preview): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[1]$ ]]; then
        print_info "Deploying to production..."
        vercel --prod
    else
        print_info "Deploying to preview..."
        vercel
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Deployment completed successfully!"
        echo ""
        print_info "Your BECE 2026 Prediction Platform is now live!"
        print_info "Check the deployment URL in the output above."
        echo ""
        print_info "Next steps:"
        echo "  1. Test all features on the deployed URL"
        echo "  2. Add environment variables if not done already"
        echo "  3. Set up custom domain (optional)"
        echo "  4. Monitor performance in Vercel dashboard"
    else
        print_error "Deployment failed. Check the error messages above."
        exit 1
    fi
else
    print_info "Deployment cancelled."
    print_info "You can deploy manually using: vercel --prod"
fi

echo ""
print_success "Deployment script completed!"
