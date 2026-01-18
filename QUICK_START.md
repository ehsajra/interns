# Quick Start Guide - Supabase Integration

Get the Interns Project Hub up and running with Supabase in minutes!

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Supabase Account** - [Sign up free](https://supabase.com)
3. **Git** (optional) - For cloning the repository

## Step 1: Install Node.js

Download and install Node.js 18+ from https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

## Step 2: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `interns-project-hub` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Wait for project creation (~2 minutes)

## Step 3: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://qfmsrhwrctjzhtsnuval.supabase.co`
   - **anon/public key**: (for frontend)
   - **service_role key**: (for backend - keep secret!)

3. Go to **Settings** → **Database**
4. Under **Connection string**, select **URI**
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password

Example connection string:
```
postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

## Step 4: Clone/Download Project

If you have the project files, navigate to the project directory:
```bash
cd interns
```

## Step 5: Install Dependencies

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

## Step 6: Configure Environment Variables

### Backend Configuration

Create `backend/.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here

# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Storage (using Supabase Storage)
USE_SUPABASE_STORAGE=true
```

**Important**: Replace all placeholder values with your actual Supabase credentials!

### Frontend Configuration

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 7: Set Up Supabase Storage Buckets

1. In Supabase dashboard, go to **Storage**
2. Create two buckets:

   **Bucket 1: `resumes`**
   - Click **"New bucket"**
   - Name: `resumes`
   - Public: **No** (private)
   - File size limit: 5MB
   - Allowed MIME types: `application/pdf`

   **Bucket 2: `certificates`**
   - Click **"New bucket"**
   - Name: `certificates`
   - Public: **Yes** (public)
   - File size limit: 2MB
   - Allowed MIME types: `application/pdf,image/png,image/jpeg`

3. Set bucket policies (optional - defaults work for now):
   - **resumes**: Authenticated users can upload, owners can read
   - **certificates**: Public read, authenticated write

## Step 8: Run Database Migration

### Option A: Using Prisma (Recommended)

```bash
cd backend

# Generate Prisma client
npm run generate

# Run migrations (creates all tables)
npm run migrate

# Seed with sample data
npm run seed

cd ..
```

### Option B: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New query"**
3. Copy the SQL from `backend/prisma/migrations/0001_initial_schema/migration.sql`
4. Paste into the SQL editor
5. Click **"Run"** to execute

## Step 9: Verify Database Setup

In Supabase SQL Editor, run:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show: User, InternProfile, GuideProfile, AdminProfile, 
-- Resume, Project, ProjectPhase, ProjectRole, Application, 
-- Assignment, OptOut, Certificate, AuditLog
```

## Step 10: Start the Application

### Option 1: Run Both Servers Together

```bash
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## Step 11: Access the Application

- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Step 12: Test the Application

### 1. Register a New User

1. Go to http://localhost:3000/register
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Password (min 8 characters)
3. Click **"Register"**
4. Check your email for verification link (if email confirmation is enabled)

### 2. Login

1. Go to http://localhost:3000/login
2. Enter your email and password
3. You should be redirected to the dashboard

### 3. Upload a Resume (Intern)

1. Login as an intern
2. Navigate to profile or resume upload
3. Upload a PDF file
4. Verify it appears in Supabase Storage → `resumes` bucket

### 4. Use Sample Credentials (After Seeding)

If you ran `npm run seed`, you can login with:

- **Admin**: admin@internshub.com / admin123
- **Guide**: guide@internshub.com / guide123
- **Intern**: intern@internshub.com / intern123

## Troubleshooting

### Database Connection Error

**Error**: `Can't reach database server at localhost:5432`

**Solution**:
- Check `DATABASE_URL` in `backend/.env` has correct Supabase connection string
- Verify password is correct (no brackets in connection string)
- Ensure Supabase project is active

### Authentication Errors

**Error**: `Invalid token` or `User not found`

**Solution**:
- Verify `SUPABASE_URL` and keys are correct in both backend and frontend
- Check that user exists in both Supabase Auth and your database
- Clear browser cache and try again

### File Upload Fails

**Error**: `Failed to upload file` or `Bucket not found`

**Solution**:
- Verify storage buckets `resumes` and `certificates` exist in Supabase
- Check bucket policies allow uploads
- Ensure file is PDF and under 5MB
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

### Port Already in Use

**Error**: `Port 3000/3001 already in use`

**Solution**:
- Change `PORT` in `backend/.env` for backend
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3001 | xargs kill
  ```

### Prisma Errors

**Error**: `Prisma schema validation` or migration errors

**Solution**:
```bash
cd backend
npm run generate  # Regenerate Prisma client
npm run migrate    # Run migrations again
```

### Module Not Found

**Error**: `Cannot find module '@supabase/supabase-js'`

**Solution**:
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## Quick Verification Checklist

- [ ] Node.js installed and working
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Storage buckets created (`resumes` and `certificates`)
- [ ] Database migrated (tables exist)
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login
- [ ] Can upload a resume (if intern)

## Next Steps

Once everything is working:

1. ✅ Explore the dashboard for your role (Intern/Guide/Admin)
2. ✅ Create a project (as Guide)
3. ✅ Apply to projects (as Intern)
4. ✅ Review applications (as Guide)
5. ✅ Continue with Phase 2 development

## Getting Help

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Project Issues**: Check `INSTALLATION.md` for detailed troubleshooting

## Environment Variables Reference

### Backend (`backend/.env`)
```env
# Required
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
USE_SUPABASE_STORAGE=true
```

### Frontend (`frontend/.env.local`)
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Security Notes

⚠️ **Important**:
- Never commit `.env` files to git
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (backend only)
- `SUPABASE_ANON_KEY` is safe for frontend (has RLS protection)
- Use environment variables, never hardcode credentials

## What's Using Supabase?

- ✅ **Database**: PostgreSQL database (via Prisma)
- ✅ **Authentication**: User signup, login, password reset
- ✅ **Storage**: Resume and certificate file storage
- ✅ **Email**: Email verification and password reset emails

All managed through your Supabase project dashboard!
