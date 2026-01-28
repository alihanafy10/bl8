#!/bin/bash

# Emergency Incident Reporter - Installation Script
# This script automates the setup process

echo "🚑 Emergency Incident Reporter - Installation"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js is installed: $NODE_VERSION${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm is installed: $NPM_VERSION${NC}"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..
echo ""

# Create models directory
echo "📁 Creating models directory..."
mkdir -p client/public/models
echo -e "${GREEN}✓ Models directory created${NC}"
echo ""

# Download face detection models
echo "📥 Downloading face detection models..."
echo "This may take a moment..."

cd client/public/models

# Download manifest file
if command -v curl &> /dev/null; then
    curl -sS -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
    curl -sS -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
elif command -v wget &> /dev/null; then
    wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
    wget -q https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
else
    echo -e "${YELLOW}⚠ Neither curl nor wget found${NC}"
    echo "Please manually download models from:"
    echo "https://github.com/justadudewhohacks/face-api.js/tree/master/weights"
    cd ../../..
fi

# Check if models were downloaded
if [ -f "tiny_face_detector_model-weights_manifest.json" ] && [ -f "tiny_face_detector_model-shard1" ]; then
    echo -e "${GREEN}✓ Face detection models downloaded${NC}"
else
    echo -e "${YELLOW}⚠ Models may not have downloaded correctly${NC}"
    echo "Please check client/public/models/ directory"
fi

cd ../../..
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating environment configuration..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}📝 Please edit .env file with your API configuration${NC}"
else
    echo -e "${YELLOW}⚠ .env file already exists, skipping${NC}"
fi
echo ""

# Create necessary directories
echo "📁 Creating required directories..."
mkdir -p uploads
echo -e "${GREEN}✓ Upload directory created${NC}"
echo ""

echo "=============================================="
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo "=============================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration (optional)"
echo "2. Run 'npm run dev' to start the application"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md and SETUP_GUIDE.md"
echo ""
