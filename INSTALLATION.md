# Installation Guide

## Step-by-Step Installation

### 1. Install Node.js

**Windows:**
- Download from: https://nodejs.org/
- Choose the LTS version (18.x or higher)
- Run the installer and follow the prompts
- Verify installation:
  ```powershell
  node --version
  npm --version
  ```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:**
```bash
brew install node
```

### 2. Install PostgreSQL

**Option A: Docker (Recommended)**

1. Install Docker Desktop:
   - Windows/Mac: https://www.docker.com/products/docker-desktop
   - Linux: https://docs.docker.com/engine/install/

2. Start database:
   ```bash
   cd infra
   docker-compose up -d
   cd ..
   ```

**Option B: Local PostgreSQL**

1. Download from: https://www.postgresql.org/download/
2. Install and start PostgreSQL service
3. Create database:
   ```bash
   createdb interns_hub
   # Or using psql:
   psql -U postgres
   CREATE DATABASE interns_hub;
   ```

### 3. Clone/Download Project

If you have the project files, navigate to the project directory:
```bash
cd interns
```

### 4. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 5. Configure Environment

**Backend Configuration (`backend/.env`):**

Create this file with the following content:
```env
DATABASE_URL="postgresql://interns_user:interns_password@localhost:5432/interns_hub?schema=public"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long-change-in-production"
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
```

**Note:** If using local PostgreSQL (not Docker), update `DATABASE_URL`:
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/interns_hub?schema=public"
```

**Frontend Configuration (`frontend/.env.local`):**

Create this file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Initialize Database

```bash
cd backend

# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# Seed with sample data
npm run seed

cd ..
```

### 7. Start the Application

**Option 1: Run both servers together**
```bash
npm run dev
```

**Option 2: Run separately (in different terminals)**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

### 8. Access the Application

- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### 9. Login

Use these sample credentials (created by seed script):

- **Admin**: admin@internshub.com / admin123
- **Guide**: guide@internshub.com / guide123
- **Intern**: intern@internshub.com / intern123

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Reinstall Node.js and ensure "Add to PATH" is checked
- Restart your terminal/command prompt

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- For Docker: `docker ps` to verify container is running
- Test connection: `psql -U interns_user -d interns_hub`

### Port Already in Use
- Backend (3001): Change `PORT` in `backend/.env`
- Frontend (3000): Kill process using port or change in `frontend/package.json`

### Prisma Errors
```bash
cd backend
npm run generate
npm run migrate
```

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Do this for root, backend, and frontend directories
```

### Docker Issues
- Ensure Docker Desktop is running
- Check: `docker ps`
- View logs: `docker-compose logs` (in infra directory)

## Verification Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL running (Docker or local)
- [ ] All dependencies installed
- [ ] Environment files created
- [ ] Database migrated and seeded
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can login with sample credentials

## Next Steps

Once the application is running:

1. Explore the different user roles (Admin, Guide, Intern)
2. Review the codebase structure
3. Check the API endpoints
4. Proceed to Phase 2 development




