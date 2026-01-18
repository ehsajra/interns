# How to Run the Application

## Prerequisites Check

Before running, ensure you have:

1. ✅ Node.js 18+ installed (`node --version`)
2. ✅ npm installed (`npm --version`)
3. ✅ PostgreSQL running (Docker or local)

## Quick Run (If Already Set Up)

If you've already completed setup:

```bash
# Start both servers
npm run dev
```

Then open http://localhost:3000

## First Time Setup

### 1. Install Dependencies

```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start Database

**Using Docker:**
```bash
cd infra
docker-compose up -d
cd ..
```

**Using Local PostgreSQL:**
- Ensure PostgreSQL service is running
- Database `interns_hub` should exist

### 3. Create Environment Files

**Create `backend/.env`:**
```env
DATABASE_URL="postgresql://interns_user:interns_password@localhost:5432/interns_hub?schema=public"
JWT_SECRET="change-this-to-a-secure-random-string-minimum-32-characters"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
USE_LOCAL_STORAGE=true
UPLOAD_DIR=./uploads
```

**Create `frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Database

```bash
cd backend
npm run generate
npm run migrate
npm run seed
cd ..
```

### 5. Start Application

```bash
npm run dev
```

## Running Individual Servers

**Backend only:**
```bash
npm run dev:backend
# Or: cd backend && npm run dev
```

**Frontend only:**
```bash
npm run dev:frontend
# Or: cd frontend && npm run dev
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/api/health

## Login Credentials

After seeding:
- Admin: `admin@internshub.com` / `admin123`
- Guide: `guide@internshub.com` / `guide123`
- Intern: `intern@internshub.com` / `intern123`

## Common Issues

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database connection failed
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env`
- For Docker: `docker ps` to check container

### Port in use
- Change `PORT` in `backend/.env` for backend
- Or kill process using port 3000/3001




