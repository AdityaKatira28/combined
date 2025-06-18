# Build script for AI Compliance Monitoring System (PowerShell)
# This script helps build and test the application locally on Windows

param(
    [switch]$SkipDocker
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Building AI Compliance Monitoring System..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if Docker is available
function Test-Docker {
    try {
        docker --version | Out-Null
        Write-Status "Docker is available"
        return $true
    }
    catch {
        Write-Warning "Docker is not available. Skipping Docker builds."
        return $false
    }
}

# Build backend
function Build-Backend {
    Write-Status "Building backend..."
    Set-Location "ai-compliance-demo"
    
    # Check if requirements.txt exists
    if (-not (Test-Path "requirements.txt")) {
        Write-Error "requirements.txt not found in ai-compliance-demo/"
        exit 1
    }
    
    # Test Python dependencies
    Write-Status "Testing Python dependencies..."
    try {
        python -m pip install -r requirements.txt --dry-run
        Write-Status "Python dependencies test passed"
    }
    catch {
        Write-Error "Failed to install Python dependencies"
        exit 1
    }
    
    # Build Docker image if Docker is available
    if (-not $SkipDocker -and (Test-Docker)) {
        Write-Status "Building backend Docker image..."
        try {
            docker build -t ai-compliance-backend .
            Write-Status "Backend Docker image built successfully"
        }
        catch {
            Write-Error "Failed to build backend Docker image"
            exit 1
        }
    }
    
    Set-Location ".."
}

# Build frontend
function Build-Frontend {
    Write-Status "Building frontend..."
    Set-Location "UI-main"
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found in UI-main/"
        exit 1
    }
    
    # Install Node.js dependencies
    Write-Status "Installing Node.js dependencies..."
    try {
        npm install --legacy-peer-deps
        Write-Status "Node.js dependencies installed successfully"
    }
    catch {
        Write-Error "Failed to install Node.js dependencies"
        exit 1
    }
    
    # Build the application
    Write-Status "Building frontend application..."
    try {
        npm run build
        Write-Status "Frontend application built successfully"
    }
    catch {
        Write-Error "Failed to build frontend application"
        exit 1
    }
    
    # Build Docker image if Docker is available
    if (-not $SkipDocker -and (Test-Docker)) {
        Write-Status "Building frontend Docker image..."
        try {
            docker build -t ai-compliance-frontend .
            Write-Status "Frontend Docker image built successfully"
        }
        catch {
            Write-Error "Failed to build frontend Docker image"
            exit 1
        }
    }
    
    Set-Location ".."
}

# Test the application
function Test-Application {
    Write-Status "Testing application..."
    
    # Test backend
    Set-Location "ai-compliance-demo"
    Write-Status "Testing backend..."
    try {
        python -c "import app.main; print('Backend imports successfully')"
        Write-Status "Backend test passed"
    }
    catch {
        Write-Error "Backend test failed"
        exit 1
    }
    Set-Location ".."
    
    # Test frontend build output
    Set-Location "UI-main"
    if (Test-Path "dist") {
        Write-Status "Frontend build output exists"
        if (Test-Path "dist/index.html") {
            Write-Status "Frontend index.html found"
        }
        else {
            Write-Error "Frontend index.html not found"
            exit 1
        }
    }
    else {
        Write-Error "Frontend dist directory not found"
        exit 1
    }
    Set-Location ".."
}

# Main execution
function Main {
    Write-Status "Starting build process..."
    
    # Check if we're in the right directory
    if (-not (Test-Path "ai-compliance-demo") -or -not (Test-Path "UI-main")) {
        Write-Error "Please run this script from the project root directory"
        exit 1
    }
    
    Build-Backend
    Build-Frontend
    Test-Application
    
    Write-Status "✅ Build completed successfully!"
    Write-Status "You can now deploy to Coolify using the instructions in DEPLOYMENT.md"
}

# Run main function
Main 