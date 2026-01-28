# Quick start script for Emergency Incident Reporter (PowerShell)

Write-Host "🚑 Starting Emergency Incident Reporter..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependencies not installed. Running installation..." -ForegroundColor Yellow
    .\install.ps1
    Write-Host ""
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No .env file found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created (using mock mode)" -ForegroundColor Green
    Write-Host ""
}

# Start the application
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run dev
