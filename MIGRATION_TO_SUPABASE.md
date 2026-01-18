# Migration to Supabase - Step by Step

## Overview

This guide walks you through migrating the Interns Project Hub to use Supabase for:
- **Database** (PostgreSQL)
- **Authentication** (Supabase Auth)
- **Storage** (Supabase Storage)

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: interns-project-hub
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

## Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: (for frontend)
   - **service_role key**: (for backend - keep secret!)

3. Go to **Settings** → **Database**
4. Under **Connection string**, select **URI**
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password

## Step 3: Update Environment Variables

### Backend (`backend/.env`)

```env
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here

# Database (from Supabase)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Storage
USE_SUPABASE_STORAGE=true
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Run Database Migration

### Option A: Using Prisma (Recommended)

```bash
cd backend
npm run generate
npm run migrate
```

This will create all tables in your Supabase database.

### Option B: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Copy the SQL from `backend/prisma/migrations/0001_initial_schema/migration.sql`
3. Paste and run in SQL Editor

## Step 5: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 6: Set Up Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create buckets:

   **Bucket 1: `resumes`**
   - Public: No
   - File size limit: 5MB
   - Allowed MIME types: `application/pdf`

   **Bucket 2: `certificates`**
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: `application/pdf,image/png,image/jpeg`

3. Set up policies (optional - we'll handle in code):
   - Resumes: Authenticated users can upload
   - Certificates: Public read, admin write

## Step 7: Enable Row Level Security (RLS)

After migration, you may want to enable RLS. For now, we'll use service role key which bypasses RLS.

To enable RLS later:

```sql
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InternProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GuideProfile" ENABLE ROW LEVEL SECURITY;
-- ... (add for all tables)
```

## Step 8: Test the Connection

```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

## Step 9: Generate TypeScript Types (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > backend/src/lib/database.types.ts
```

## What's Changed

### Backend
- ✅ Added `@supabase/supabase-js` package
- ✅ Created Supabase client setup (`src/lib/supabase.ts`)
- ✅ Created Supabase Auth helpers (`src/lib/supabase-auth.ts`)
- ✅ Created Supabase Storage helpers (`src/lib/supabase-storage.ts`)
- ✅ Updated Prisma schema to work with Supabase PostgreSQL
- ✅ Created migration SQL file

### Frontend
- ✅ Added `@supabase/supabase-js` and `@supabase/ssr` packages
- ✅ Created Supabase client for browser (`src/lib/supabase/client.ts`)
- ✅ Created Supabase client for server (`src/lib/supabase/server.ts`)
- ✅ Created middleware for session management (`src/middleware.ts`)

## Next Steps

1. **Update Authentication**: Replace custom JWT with Supabase Auth
2. **Update File Uploads**: Replace S3/local storage with Supabase Storage
3. **Update User Service**: Use Supabase Auth instead of custom auth
4. **Test Everything**: Verify all functionality works

## Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` has correct password
- Verify Supabase project is active
- Check network/firewall settings

### Authentication Issues
- Verify `SUPABASE_URL` and keys are correct
- Check that email confirmation is set up in Supabase Auth settings

### Storage Upload Fails
- Verify buckets are created
- Check bucket policies
- Verify file size limits

## Support

- Supabase Docs: https://supabase.com/docs
- Prisma + Supabase: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase



