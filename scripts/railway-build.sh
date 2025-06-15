#!/bin/bash

# Railway Build Script for AI-HRMS
# Handles Rollup native dependencies issue

set -e

echo "🚂 Railway Build Script"
echo "======================"

# Function to print colored output
print_status() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1"
}

# Detect if we're building frontend or backend
if [ -f "package.json" ] && grep -q "vite" package.json; then
    print_status "Building Frontend on Railway..."
    
    # Clean previous builds
    print_status "Cleaning previous builds..."
    rm -rf node_modules/.vite
    rm -rf dist
    rm -rf node_modules/@rollup
    
    # Install dependencies with optional packages
    print_status "Installing dependencies with optional packages..."
    npm ci --include=optional --no-audit --no-fund
    
    # Verify Rollup native dependency
    if [ ! -d "node_modules/@rollup/rollup-linux-x64-gnu" ]; then
        print_status "Installing missing Rollup native dependency..."
        npm install @rollup/rollup-linux-x64-gnu --save-dev --no-audit --no-fund
    fi
    
    # Build the application
    print_status "Building Vite application..."
    npm run build:railway
    
    print_success "Frontend build completed!"
    
elif [ -f "package.json" ] && grep -q "typescript" package.json; then
    print_status "Building Backend on Railway..."
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm ci --no-audit --no-fund
    
    # Build TypeScript
    print_status "Building TypeScript..."
    npm run build
    
    print_success "Backend build completed!"
    
else
    print_error "Unknown project type. Cannot determine build strategy."
    exit 1
fi 