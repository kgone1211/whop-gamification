#!/bin/bash

# Whop Gamification - Production Setup Script
# This script helps you set up the production environment

set -e

echo "🎮 Whop Gamification - Production Setup"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "📝 Creating .env file from template..."
  cp .env.example .env
  echo "✅ .env created! Please edit it with your credentials."
  echo ""
  echo "Required:"
  echo "  - WHOP_CLIENT_ID"
  echo "  - WHOP_CLIENT_SECRET"
  echo "  - WHOP_WEBHOOK_SECRET"
  echo "  - DATABASE_URL"
  echo "  - REDIS_URL"
  echo ""
  read -p "Press Enter to continue after updating .env..."
else
  echo "✅ .env file exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check database connection
echo ""
echo "🗄️  Checking database connection..."
if npx prisma db pull --force 2>/dev/null; then
  echo "✅ Database connected"
else
  echo "⚠️  Database not accessible. Running db push..."
  npx prisma db push --skip-generate
fi

# Seed database
echo ""
read -p "Do you want to seed the database with sample badges? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🌱 Seeding database..."
  npm run db:seed
fi

# Build for production
echo ""
echo "🏗️  Building for production..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Review your .env file"
echo "2. Configure Whop OAuth at https://whop.com/apps"
echo "3. Start the server:"
echo "   npm start"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"
