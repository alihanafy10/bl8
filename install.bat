@echo off
echo.
echo ========================================
echo  Emergency Incident Reporter - Install
echo ========================================
echo.

echo Checking Node.js...
node -v
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking npm...
call npm -v
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Creating models directory...
if not exist "client\public\models" mkdir "client\public\models"

echo.
echo Downloading face detection models...
cd client\public\models

echo Downloading manifest file...
curl -sS -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

echo Downloading model shard...
curl -sS -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

cd ..\..\..

echo.
echo Creating .env file...
if not exist ".env" (
    copy .env.example .env
    echo .env file created
) else (
    echo .env file already exists
)

echo.
echo Creating uploads directory...
if not exist "uploads" mkdir "uploads"

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file if needed
echo 2. Run: start.bat
echo 3. Open: http://localhost:3000
echo.
pause
