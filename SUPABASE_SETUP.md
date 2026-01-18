# Supabase Setup Guide

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Note down your project URL and API keys

## Step 1: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Key** (for backend - keep this secret!)
   - **Anon Key** (for frontend)

## Step 2: Update Environment Variables

### Backend (`backend/.env`)

Add/update these variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Database (Supabase provides this)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Remove or keep these for email (optional)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@internshub.com
```

**To get DATABASE_URL:**
1. Go to **Settings** → **Database**
2. Under **Connection string**, select **URI**
3. Copy the connection string and replace `[YOUR-PASSWORD]` with your database password

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Run Database Migrations

### Option A: Using Prisma (Recommended for initial setup)

```bash
cd backend
npm run generate
npm run migrate
```

### Option B: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Run the migration SQL (we'll provide this)

## Step 4: Enable Row Level Security (RLS)

After migrations, enable RLS on tables:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InternProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GuideProfile" ENABLE ROW LEVEL SECURITY;
-- ... (add for all tables)
```

## Step 5: Set Up Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - `resumes` - for intern resumes
   - `certificates` - for generated certificates

3. Set bucket policies (public read for certificates, authenticated upload for resumes)

## Step 6: Generate TypeScript Types (Optional but Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Generate types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > backend/src/lib/database.types.ts
```

## Step 7: Test Connection

```bash
cd backend
npm run dev
```

Check that the server starts without errors.

## Migration Notes

- Supabase uses PostgreSQL, so Prisma works seamlessly
- Authentication is handled by Supabase Auth (replaces JWT)
- Storage uses Supabase Storage (replaces S3)
- Row Level Security (RLS) provides database-level access control

## Next Steps

1. Update authentication to use Supabase Auth
2. Update file uploads to use Supabase Storage
3. Configure RLS policies for data access
4. Test the application



