@echo off
REM Quick Setup Script for Midnight HTLC Project
REM Run this from C:\midnight-envelopes-final

echo ============================================
echo Midnight HTLC - Quick Setup Script
echo ============================================
echo.

echo [1/4] Installing backend dependencies...
echo.
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    echo Please ensure pnpm is installed: npm install -g pnpm
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/4] Compiling HTLC contract...
echo.
call pnpm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to compile contract
    echo Check src\contract.compact for errors
    pause
    exit /b 1
)
echo ✓ Contract compiled successfully
echo.

echo [3/4] Installing frontend dependencies...
echo.
cd frontend
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo [4/4] Copying compiled contract to frontend...
echo.
call pnpm run copy-contract
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy contract
    echo Make sure the contract compiled successfully
    cd ..
    pause
    exit /b 1
)
echo ✓ Contract copied to frontend
cd ..
echo.

echo ============================================
echo ✓ Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Setup WSL2 and Docker (see DOCKER_SETUP.md)
echo 2. Start Midnight network in WSL2
echo 3. Fund your wallet
echo 4. Run: start-frontend.bat
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
