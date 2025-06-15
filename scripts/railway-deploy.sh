#!/bin/bash

# AI-HRMS Railway Deployment Script
set -e

echo "🚂 AI-HRMS Railway Deployment"
echo "============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if Railway CLI is installed
check_railway_cli() {
    if ! command -v railway &> /dev/null; then
        print_error "Railway CLI not found. Installing..."
        npm install -g @railway/cli
        print_success "Railway CLI installed"
    else
        print_success "Railway CLI found"
    fi
}

# Check if user is logged in
check_railway_auth() {
    if ! railway whoami &> /dev/null; then
        print_warning "Not logged in to Railway. Please login:"
        railway login
    else
        print_success "Logged in to Railway as: $(railway whoami)"
    fi
}

# Build applications
build_apps() {
    print_status "Building applications..."
    
    # Build backend
    print_status "Building backend..."
    cd backend
    npm install
    npm run build
    cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
    
    print_success "Applications built successfully"
}

# Deploy to Railway
deploy_to_railway() {
    print_status "Deploying to Railway..."
    
    # Check if project is linked
    if ! railway status &> /dev/null; then
        print_warning "Project not linked to Railway. Please run:"
        echo "  railway init"
        echo "  railway link [project-id]"
        exit 1
    fi
    
    # Deploy
    railway up
    
    print_success "Deployment completed!"
}

# Show deployment info
show_deployment_info() {
    print_status "Deployment Information:"
    echo ""
    
    # Show status
    railway status
    
    echo ""
    print_status "Useful commands:"
    echo "  railway logs              - View logs"
    echo "  railway logs --service backend   - Backend logs"
    echo "  railway logs --service frontend  - Frontend logs"
    echo "  railway variables         - View environment variables"
    echo "  railway open              - Open in browser"
    echo ""
}

# Main deployment flow
main() {
    print_status "Starting Railway deployment..."
    echo ""
    
    check_railway_cli
    echo ""
    
    check_railway_auth
    echo ""
    
    build_apps
    echo ""
    
    deploy_to_railway
    echo ""
    
    show_deployment_info
    
    print_success "🎉 Railway deployment completed!"
    print_status "Your application should be available at the URLs shown above."
}

# Run main function
main 