@echo off
echo.
echo ========================================
echo  Starting Emergency Incident Reporter
echo ========================================
echo.

if not exist "node_modules" (
    echo Dependencies not installed!
    echo Running installation...
    call install.bat
)

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

echo Starting development server...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev
