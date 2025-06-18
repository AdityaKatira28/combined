#!/bin/bash

# Build script for AI Compliance Monitoring System
# This script helps build and test the application locally

set -e

echo "🚀 Building AI Compliance Monitoring System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is available
check_docker() {
    if command -v docker &> /dev/null; then
        print_status "Docker is available"
        return 0
    else
        print_warning "Docker is not available. Skipping Docker builds."
        return 1
    fi
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd ai-compliance-demo
    
    # Check if requirements.txt exists
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt not found in ai-compliance-demo/"
        exit 1
    fi
    
    # Test Python dependencies
    print_status "Testing Python dependencies..."
    python3 -m pip install -r requirements.txt --dry-run || {
        print_error "Failed to install Python dependencies"
        exit 1
    }
    
    # Build Docker image if Docker is available
    if check_docker; then
        print_status "Building backend Docker image..."
        docker build -t ai-compliance-backend . || {
            print_error "Failed to build backend Docker image"
            exit 1
        }
        print_status "Backend Docker image built successfully"
    fi
    
    cd ..
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd UI-main
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in UI-main/"
        exit 1
    fi
    
    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    npm install --legacy-peer-deps || {
        print_error "Failed to install Node.js dependencies"
        exit 1
    }
    
    # Build the application
    print_status "Building frontend application..."
    npm run build || {
        print_error "Failed to build frontend application"
        exit 1
    }
    
    # Build Docker image if Docker is available
    if check_docker; then
        print_status "Building frontend Docker image..."
        docker build -t ai-compliance-frontend . || {
            print_error "Failed to build frontend Docker image"
            exit 1
        }
        print_status "Frontend Docker image built successfully"
    fi
    
    cd ..
}

# Test the application
test_application() {
    print_status "Testing application..."
    
    # Test backend
    cd ai-compliance-demo
    print_status "Testing backend..."
    python3 -c "import app.main; print('Backend imports successfully')" || {
        print_error "Backend test failed"
        exit 1
    }
    cd ..
    
    # Test frontend build output
    cd UI-main
    if [ -d "dist" ]; then
        print_status "Frontend build output exists"
        if [ -f "dist/index.html" ]; then
            print_status "Frontend index.html found"
        else
            print_error "Frontend index.html not found"
            exit 1
        fi
    else
        print_error "Frontend dist directory not found"
        exit 1
    fi
    cd ..
}

# Main execution
main() {
    print_status "Starting build process..."
    
    # Check if we're in the right directory
    if [ ! -d "ai-compliance-demo" ] || [ ! -d "UI-main" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    build_backend
    build_frontend
    test_application
    
    print_status "✅ Build completed successfully!"
    print_status "You can now deploy to Coolify using the instructions in DEPLOYMENT.md"
}

# Run main function
main "$@" 