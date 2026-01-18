# Database Migration to Supabase

## Quick Start

This guide will help you migrate the database schema to Supabase.

## Step 1: Get Supabase Database Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Under **Connection string**, select **URI**
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres
```

## Step 2: Update Backend Environment

Add to `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"
```

## Step 3: Run Migration

### Option A: Using Prisma Migrate (Recommended)

```bash
cd backend
npm run generate
npm run migrate
```

This will:
1. Generate Prisma client
2. Create all tables in your Supabase database
3. Set up all relationships and indexes

### Option B: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New query**
3. Copy the entire SQL from `backend/prisma/migrations/0001_initial_schema/migration.sql`
4. Paste into the SQL editor
5. Click **Run** to execute

## Step 4: Verify Migration

### Check Tables

In Supabase SQL Editor, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all these tables:
- User
- InternProfile
- GuideProfile
- AdminProfile
- Resume
- Project
- ProjectPhase
- ProjectRole
- Application
- Assignment
- OptOut
- Certificate
- AuditLog

### Check Enums

```sql
SELECT typname 
FROM pg_type 
WHERE typtype = 'e' 
ORDER BY typname;
```

You should see:
- UserRole
- ApplicationStatus
- ProjectStatus
- PhaseStatus
- AssignmentStatus

## Step 5: Test Connection

```bash
cd backend
npm run dev
```

The server should start without database connection errors.

## Troubleshooting

### "Can't reach database server"

- Verify `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure password is correct (no brackets in connection string)

### "relation does not exist"

- Run the migration again
- Check that you're using the correct schema (should be `public`)

### "permission denied"

- Ensure you're using the correct database user
- Check Supabase project settings

### Migration Fails

If Prisma migrate fails:

1. Try using the SQL editor method (Option B)
2. Check Supabase logs for errors
3. Verify all environment variables are set

## Next Steps

After successful migration:

1. ✅ Database is ready
2. ⏭️ Set up Supabase Auth (see `MIGRATION_TO_SUPABASE.md`)
3. ⏭️ Configure Storage buckets (see `SUPABASE_SETUP.md`)
4. ⏭️ Update application code to use Supabase

## Schema Overview

The migration creates:

- **13 tables** with all relationships
- **5 enums** for type safety
- **Indexes** for performance
- **Foreign keys** for data integrity

All tables use UUIDs as primary keys and include `createdAt`/`updatedAt` timestamps.



