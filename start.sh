#!/bin/bash

# Quick start script for Emergency Incident Reporter

echo "🚑 Starting Emergency Incident Reporter..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Dependencies not installed. Running installation..."
    ./install.sh
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✓ .env file created (using mock mode)"
    echo ""
fi

# Start the application
echo "🚀 Starting development server..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
