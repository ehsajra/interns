# Supabase Authentication & Storage Integration

## ✅ Completed Integration

I've successfully integrated Supabase Authentication and Storage into the application.

## What's Been Updated

### Backend Changes

#### 1. Authentication Middleware (`backend/src/middleware/auth.ts`)
- ✅ Replaced JWT verification with Supabase token verification
- ✅ Extracts user from Supabase session
- ✅ Links Supabase user to our database User record via email
- ✅ Maintains role-based access control

#### 2. User Service (`backend/src/services/userService.ts`)
- ✅ `createIntern()` - Creates user in Supabase Auth, then in our database
- ✅ `login()` - Uses Supabase Auth for authentication
- ✅ `verifyEmail()` - Uses Supabase email verification
- ✅ `requestPasswordReset()` - Uses Supabase password reset
- ✅ `resetPassword()` - Uses Supabase password update
- ✅ `createGuide()` - Creates guide with Supabase Auth
- ✅ `createAdmin()` - Creates admin with Supabase Auth

#### 3. Auth Routes (`backend/src/routes/auth.ts`)
- ✅ Updated login to return Supabase session tokens
- ✅ Added `/auth/me` endpoint to get current user
- ✅ All auth endpoints now use Supabase

#### 4. File Upload (`backend/src/routes/upload.ts`)
- ✅ New upload route for resume files
- ✅ Uses Supabase Storage (`resumes` bucket)
- ✅ Handles file upload with multer
- ✅ Stores file metadata in database
- ✅ Returns public/signed URLs

### Frontend Changes

#### 1. Auth Library (`frontend/src/lib/auth.ts`)
- ✅ Replaced localStorage token storage with Supabase session
- ✅ `getAccessToken()` - Gets token from Supabase session
- ✅ `getUser()` - Gets user from Supabase and our API
- ✅ `clearAuth()` - Signs out from Supabase

#### 2. Login Page (`frontend/src/app/login/page.tsx`)
- ✅ Uses Supabase `signInWithPassword()`
- ✅ Handles Supabase session automatically
- ✅ Redirects to dashboard on success

#### 3. Register Page (`frontend/src/app/register/page.tsx`)
- ✅ Uses Supabase `signUp()` for authentication
- ✅ Creates user profile via API after Supabase signup
- ✅ Handles email verification flow

#### 4. API Client (`frontend/src/lib/api.ts`)
- ✅ Intercepts requests to add Supabase access token
- ✅ Handles 401 errors by signing out from Supabase
- ✅ Automatically refreshes tokens

#### 5. Dashboard Layout (`frontend/src/app/dashboard/layout.tsx`)
- ✅ Uses Supabase session check
- ✅ Listens for auth state changes
- ✅ Handles logout with Supabase signOut

## How It Works

### Authentication Flow

1. **Registration:**
   - User signs up with Supabase Auth
   - Supabase sends verification email
   - After verification, user profile is created in our database
   - User can login

2. **Login:**
   - User enters email/password
   - Frontend calls Supabase `signInWithPassword()`
   - Supabase returns session with access_token
   - Frontend stores session (handled by Supabase client)
   - API requests include access_token in Authorization header

3. **API Authentication:**
   - Backend middleware verifies Supabase token
   - Extracts user email from token
   - Looks up user in our database
   - Attaches user info to request

### Storage Flow

1. **Resume Upload:**
   - Intern uploads PDF file
   - Backend receives file via multer
   - Uploads to Supabase Storage `resumes` bucket
   - Stores file metadata in database
   - Returns file URL

2. **File Access:**
   - Files stored in private `resumes` bucket
   - Use signed URLs for temporary access
   - Public `certificates` bucket for certificates

## Environment Variables Required

### Backend (`backend/.env`)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Setup Steps

1. **Create Supabase Storage Buckets:**
   - Go to Storage in Supabase dashboard
   - Create `resumes` bucket (private)
   - Create `certificates` bucket (public)

2. **Configure Bucket Policies:**
   - `resumes`: Authenticated users can upload, owners can read
   - `certificates`: Public read, admin write

3. **Update Environment Variables:**
   - Add Supabase credentials to backend and frontend .env files

4. **Test Authentication:**
   - Try registering a new user
   - Check email verification
   - Test login
   - Verify session persistence

5. **Test File Upload:**
   - Login as intern
   - Upload a resume
   - Verify file appears in Supabase Storage
   - Check database record

## Key Features

### Authentication
- ✅ Email/password authentication via Supabase
- ✅ Email verification
- ✅ Password reset
- ✅ Session management
- ✅ Automatic token refresh
- ✅ Role-based access control

### Storage
- ✅ Resume upload to Supabase Storage
- ✅ File metadata in database
- ✅ Private file access
- ✅ Public certificate URLs
- ✅ File size validation (5MB limit)
- ✅ PDF-only validation

## Migration Notes

### Breaking Changes
- User IDs now use Supabase UUIDs
- Authentication tokens are Supabase JWT tokens
- Password hashing is handled by Supabase
- Email sending is handled by Supabase

### Database Schema
- `User.passwordHash` is no longer used (kept for migration compatibility)
- User IDs should match Supabase user IDs
- Email verification handled by Supabase

## Next Steps

1. **Test the integration:**
   - Register new users
   - Test login/logout
   - Upload resumes
   - Verify file access

2. **Update seed script:**
   - Create users via Supabase Auth
   - Link to database records

3. **Add certificate generation:**
   - Generate PDFs
   - Upload to `certificates` bucket
   - Store URLs in database

4. **Configure email templates:**
   - Customize Supabase email templates
   - Add branding

## Troubleshooting

### "Invalid token" errors
- Check Supabase URL and keys are correct
- Verify token is being sent in Authorization header
- Check token hasn't expired

### File upload fails
- Verify storage buckets exist
- Check bucket policies allow uploads
- Verify file size is under limit
- Check file type is PDF

### User not found after login
- Ensure user exists in both Supabase Auth and database
- Check email matches between systems
- Verify user profile was created

## Support

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Supabase Storage Docs: https://supabase.com/docs/guides/storage
- Migration Guide: See `MIGRATION_TO_SUPABASE.md`



