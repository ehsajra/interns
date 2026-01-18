# PowerShell Setup Script for Interns Project Hub

Write-Host "=== Interns Project Hub Setup ===" -ForegroundColor Cyan

# Check Node.js
Write-Host "`nChecking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check npm
Write-Host "`nChecking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "`nInstalling root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed" -ForegroundColor Green

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Set-Location ..

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Set-Location ..

# Check for .env files
Write-Host "`nChecking configuration files..." -ForegroundColor Yellow

if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠ backend/.env not found. Creating from template..." -ForegroundColor Yellow
    $backendEnv = @"
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
"@
    Set-Content -Path "backend\.env" -Value $backendEnv
    Write-Host "✓ Created backend/.env (please update with your settings)" -ForegroundColor Green
} else {
    Write-Host "✓ backend/.env exists" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "⚠ frontend/.env.local not found. Creating..." -ForegroundColor Yellow
    $frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@
    Set-Content -Path "frontend\.env.local" -Value $frontendEnv
    Write-Host "✓ Created frontend/.env.local" -ForegroundColor Green
} else {
    Write-Host "✓ frontend/.env.local exists" -ForegroundColor Green
}

# Check Docker
Write-Host "`nChecking Docker (for database)..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "✓ Docker found" -ForegroundColor Green
    Write-Host "`nTo start the database, run:" -ForegroundColor Cyan
    Write-Host "  cd infra" -ForegroundColor White
    Write-Host "  docker-compose up -d" -ForegroundColor White
} catch {
    Write-Host "⚠ Docker not found. You'll need PostgreSQL running locally." -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Start database (Docker or local PostgreSQL)" -ForegroundColor White
Write-Host "2. Run: cd backend && npm run generate && npm run migrate && npm run seed" -ForegroundColor White
Write-Host "3. Start servers: npm run dev" -ForegroundColor White


