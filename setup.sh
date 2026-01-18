#!/bin/bash

# Bash Setup Script for Interns Project Hub

echo "=== Interns Project Hub Setup ==="

# Check Node.js
echo ""
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js found: $NODE_VERSION"
else
    echo "✗ Node.js not found!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
echo ""
echo "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm found: $NPM_VERSION"
else
    echo "✗ npm not found!"
    exit 1
fi

# Install root dependencies
echo ""
echo "Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "✗ Failed to install root dependencies"
    exit 1
fi
echo "✓ Root dependencies installed"

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "✗ Failed to install backend dependencies"
    cd ..
    exit 1
fi
echo "✓ Backend dependencies installed"
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "✗ Failed to install frontend dependencies"
    cd ..
    exit 1
fi
echo "✓ Frontend dependencies installed"
cd ..

# Check for .env files
echo ""
echo "Checking configuration files..."

if [ ! -f "backend/.env" ]; then
    echo "⚠ backend/.env not found. Creating from template..."
    cat > backend/.env << EOF
DATABASE_URL="postgresql://interns_user:interns_password@localhost:5432/interns_hub?schema=public"
JWT_SECRET="change-this-to-a-secure-random-string-in-production-min-32-characters-long"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@internshub.com
USE_LOCAL_STORAGE=true
UPLOAD_DIR=./uploads
EOF
    echo "✓ Created backend/.env (please update with your settings)"
else
    echo "✓ backend/.env exists"
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠ frontend/.env.local not found. Creating..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✓ Created frontend/.env.local"
else
    echo "✓ frontend/.env.local exists"
fi

# Check Docker
echo ""
echo "Checking Docker (for database)..."
if command -v docker &> /dev/null; then
    echo "✓ Docker found"
    echo ""
    echo "To start the database, run:"
    echo "  cd infra"
    echo "  docker-compose up -d"
else
    echo "⚠ Docker not found. You'll need PostgreSQL running locally."
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Start database (Docker or local PostgreSQL)"
echo "2. Run: cd backend && npm run generate && npm run migrate && npm run seed"
echo "3. Start servers: npm run dev"




