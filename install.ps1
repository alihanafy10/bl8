# Emergency Incident Reporter - Installation Script (PowerShell)
# This script automates the setup process for Windows

Write-Host "🚑 Emergency Incident Reporter - Installation" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Host "✓ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host ""

# Create models directory
Write-Host "📁 Creating models directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "client/public/models" | Out-Null
Write-Host "✓ Models directory created" -ForegroundColor Green
Write-Host ""

# Download face detection models
Write-Host "📥 Downloading face detection models..." -ForegroundColor Yellow
Write-Host "This may take a moment..." -ForegroundColor Gray

Set-Location client/public/models

try {
    # Download manifest file
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json" -OutFile "tiny_face_detector_model-weights_manifest.json"
    
    # Download model shard
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1" -OutFile "tiny_face_detector_model-shard1"
    
    Write-Host "✓ Face detection models downloaded" -ForegroundColor Green
} catch {
    Write-Host "⚠ Failed to download models" -ForegroundColor Yellow
    Write-Host "Please manually download from:" -ForegroundColor Yellow
    Write-Host "https://github.com/justadudewhohacks/face-api.js/tree/master/weights" -ForegroundColor Yellow
}

Set-Location ../../..
Write-Host ""

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Creating environment configuration..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "📝 Please edit .env file with your API configuration" -ForegroundColor Yellow
} else {
    Write-Host "⚠ .env file already exists, skipping" -ForegroundColor Yellow
}
Write-Host ""

# Create necessary directories
Write-Host "📁 Creating required directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "uploads" | Out-Null
Write-Host "✓ Upload directory created" -ForegroundColor Green
Write-Host ""

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your configuration (optional)"
Write-Host "2. Run 'npm run dev' to start the application"
Write-Host "3. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "For more information, see README.md and SETUP_GUIDE.md"
Write-Host ""
