@echo off
REM Start Frontend Development Server
REM Run this from C:\midnight-envelopes-final

echo ============================================
echo Starting Midnight HTLC Frontend
echo ============================================
echo.

REM Check if contract is compiled
if not exist "contracts\managed\htlc\contract.js" (
    echo ERROR: Contract not compiled!
    echo Please run setup.bat first, or:
    echo   pnpm run build
    echo.
    pause
    exit /b 1
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not installed!
    echo Please run setup.bat first, or:
    echo   cd frontend
    echo   pnpm install
    echo.
    pause
    exit /b 1
)

REM Check if contract is copied to frontend
if not exist "frontend\src\contracts\htlc\contract.js" (
    echo WARNING: Contract not copied to frontend
    echo Copying now...
    cd frontend
    call pnpm run copy-contract
    cd ..
    echo.
)

echo Starting development server...
echo.
echo Frontend will be available at:
echo   http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

cd frontend
call pnpm run dev
