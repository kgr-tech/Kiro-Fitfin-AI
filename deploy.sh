#!/bin/bash

# Kiro Fitfin AI - Deployment Script
# This script helps you deploy to Vercel

echo "🚀 Kiro Fitfin AI - Deployment Helper"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "📥 Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI ready"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "Follow the prompts to:"
echo "  1. Log in to Vercel"
echo "  2. Select your project settings"
echo "  3. Deploy!"
echo ""

vercel

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Set up Supabase at https://supabase.com"
echo "  2. Add environment variables in Vercel dashboard"
echo "  3. Redeploy to apply environment variables"
echo ""
echo "📚 See QUICKSTART.md for detailed instructions"
