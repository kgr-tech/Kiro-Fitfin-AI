@echo off
REM Kiro Fitfin AI - Deployment Script for Windows
REM This script helps you deploy to Vercel

echo.
echo 🚀 Kiro Fitfin AI - Deployment Helper
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo 📥 Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Build the project
echo 🔨 Building project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build successful
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📥 Vercel CLI not found. Installing...
    call npm install -g vercel
)

echo ✅ Vercel CLI ready
echo.

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
echo.
echo Follow the prompts to:
echo   1. Log in to Vercel
echo   2. Select your project settings
echo   3. Deploy!
echo.

call vercel

echo.
echo 🎉 Deployment complete!
echo.
echo 📋 Next steps:
echo   1. Set up Supabase at https://supabase.com
echo   2. Add environment variables in Vercel dashboard
echo   3. Redeploy to apply environment variables
echo.
echo 📚 See QUICKSTART.md for detailed instructions
echo.
pause
