@echo off
REM Rebuild Contract Script
REM Run this after modifying src\contract.compact

echo ============================================
echo Rebuilding HTLC Contract
echo ============================================
echo.

echo [1/3] Cleaning previous build...
call pnpm run clean
echo.

echo [2/3] Compiling contract...
call pnpm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Compilation failed
    echo Check src\contract.compact for syntax errors
    pause
    exit /b 1
)
echo ✓ Contract compiled
echo.

echo [3/3] Copying to frontend...
cd frontend
call pnpm run copy-contract
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to copy contract
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Contract copied
echo.

echo ============================================
echo ✓ Rebuild Complete!
echo ============================================
echo.
echo Contract files updated:
echo   contracts\managed\htlc\contract.js
echo   contracts\managed\htlc\zkir\
echo   contracts\managed\htlc\keys\
echo   frontend\src\contracts\htlc\contract.js
echo.
echo If frontend is running, restart it to load changes.
echo.
pause
