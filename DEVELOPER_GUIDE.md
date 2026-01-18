# Developer Guide - Interns Project Hub

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Authentication System](#authentication-system)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Development Workflow](#development-workflow)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

The Interns Project Hub is a full-stack web application built with a modern tech stack. It follows a **monorepo structure** with separate frontend and backend applications that communicate via REST APIs.

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    Prisma ORM    ┌─────────────────┐
│                 │ ──────────────► │                 │ ──────────────► │                 │
│   Next.js       │                 │   Express.js    │                 │   Supabase      │
│   Frontend      │ ◄────────────── │   Backend       │ ◄────────────── │   PostgreSQL    │
│   (Port 3000)   │    JSON/JWT     │   (Port 3001)   │    SQL Queries  │   Database      │
└─────────────────┘                 └─────────────────┘                 └─────────────────┘
         │                                   │                                   │
         │                                   │                                   │
         └─────────────── Supabase Auth ────┴─────────────── Supabase Storage ──┘
                         (Authentication)                    (File Storage)
```

### Key Components

1. **Frontend (Next.js 14)**: React-based UI with App Router, TypeScript, and Tailwind CSS
2. **Backend (Express.js)**: RESTful API server with TypeScript
3. **Database (Supabase PostgreSQL)**: Managed PostgreSQL with Prisma ORM
4. **Authentication (Supabase Auth)**: Handles user authentication and session management
5. **File Storage (Supabase Storage)**: Stores resumes and certificates

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Supabase Client**: Authentication and API client
- **React Hook Form**: Form handling and validation

### Backend
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript
- **Prisma**: Database ORM and migration tool
- **Supabase Admin**: Server-side Supabase operations
- **bcryptjs**: Password hashing (legacy, now using Supabase Auth)
- **express-validator**: Request validation middleware
- **multer**: File upload handling

### Database & Infrastructure
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Relational database
- **Supabase Auth**: Authentication service
- **Supabase Storage**: File storage service

### Development Tools
- **tsx**: TypeScript execution for development
- **Prisma CLI**: Database migrations and schema management
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Project Structure

```
interns-project-hub/
├── backend/                    # Express.js API server
│   ├── prisma/
│   │   ├── migrations/         # Database migration files
│   │   └── schema.prisma       # Database schema definition
│   ├── src/
│   │   ├── lib/               # Shared libraries
│   │   │   ├── supabase.ts    # Supabase client configuration
│   │   │   └── supabase-auth.ts # Supabase Auth helpers
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts        # Authentication middleware
│   │   │   ├── cors.ts        # CORS configuration
│   │   │   └── validation.ts  # Request validation
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   ├── users.ts       # User management routes
│   │   │   ├── projects.ts    # Project management routes
│   │   │   └── applications.ts # Application routes
│   │   ├── services/          # Business logic layer
│   │   │   ├── userService.ts # User-related operations
│   │   │   ├── projectService.ts # Project operations
│   │   │   └── applicationService.ts # Application logic
│   │   ├── utils/             # Utility functions
│   │   │   ├── password.ts    # Password hashing utilities
│   │   │   ├── email.ts       # Email utilities
│   │   │   └── jwt.ts         # JWT utilities (legacy)
│   │   ├── scripts/           # Database scripts
│   │   │   └── seed.ts        # Database seeding script
│   │   └── index.ts           # Application entry point
│   ├── .env                   # Environment variables
│   ├── package.json           # Dependencies and scripts
│   └── tsconfig.json          # TypeScript configuration
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration page
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   └── page.tsx       # Home page (redirects)
│   │   ├── components/        # Reusable React components
│   │   │   ├── ui/            # Base UI components
│   │   │   ├── forms/         # Form components
│   │   │   └── layout/        # Layout components
│   │   ├── lib/               # Frontend libraries
│   │   │   ├── supabase/      # Supabase client setup
│   │   │   ├── auth.ts        # Authentication utilities
│   │   │   └── api.ts         # API client utilities
│   │   └── types/             # TypeScript type definitions
│   ├── .env.local             # Environment variables
│   ├── package.json           # Dependencies and scripts
│   ├── tailwind.config.ts     # Tailwind CSS configuration
│   └── tsconfig.json          # TypeScript configuration
├── context/                   # Project documentation
├── infra/                     # Infrastructure configuration
│   └── docker-compose.yml     # Docker setup (if needed)
├── package.json               # Root package.json (monorepo)
└── README.md                  # Project overview
```

## Authentication System

The application uses **Supabase Auth** for authentication with a custom user profile system.

### Authentication Flow

1. **Registration**:
   ```typescript
   // Frontend calls backend API
   POST /api/auth/register
   
   // Backend creates user in Supabase Auth
   supabaseAdmin.auth.admin.createUser({
     email, password, email_confirm: true
   })
   
   // Backend creates user profile in database
   prisma.user.create({
     id: supabaseUser.id, // Link via Supabase user ID
     email, role, emailVerified: true
   })
   ```

2. **Login**:
   ```typescript
   // Frontend authenticates with Supabase
   supabase.auth.signInWithPassword({ email, password })
   
   // Backend verifies token and gets user profile
   const user = await prisma.user.findUnique({
     where: { email: supabaseUser.email }
   })
   ```

3. **Authorization**:
   ```typescript
   // Middleware verifies Supabase token
   const supabaseUser = await verifyToken(token);
   
   // Gets user profile from database
   const user = await prisma.user.findUnique({
     where: { email: supabaseUser.email }
   })
   ```

### User Roles

- **INTERN**: Can apply to projects, upload resumes, view assignments
- **GUIDE**: Can create projects, review applications, manage interns
- **ADMIN**: Full system access, user management, system configuration

### Key Files

- `backend/src/lib/supabase-auth.ts`: Supabase Auth helper functions
- `backend/src/middleware/auth.ts`: Authentication middleware
- `frontend/src/lib/auth.ts`: Frontend authentication utilities
- `backend/src/services/userService.ts`: User management logic

## Database Schema

The application uses **PostgreSQL** via **Supabase** with **Prisma ORM**.

### Core Models

#### User System
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    // Legacy - now empty with Supabase Auth
  role          UserRole  // INTERN, GUIDE, ADMIN
  emailVerified Boolean   @default(false)
  
  // Profile relationships (one-to-one)
  internProfile InternProfile?
  guideProfile  GuideProfile?
  adminProfile  AdminProfile?
}

model InternProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  firstName   String
  lastName    String
  bio         String?
  skills      String[] // Array of skills
  institution String?
  yearOfStudy String?
  
  // Relationships
  resumes     Resume[]
  applications Application[]
  assignments Assignment[]
}

model GuideProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  firstName   String
  lastName    String
  bio         String?
  expertise   String[] // Array of expertise areas
  organization String?
  
  // Relationships
  projects    Project[]
}
```

#### Project System
```prisma
model Project {
  id                String        @id @default(uuid())
  guideId           String
  title             String
  shortDescription  String
  detailedDescription String      @db.Text
  scope             String        @db.Text
  useCases          String[]      // Array of use cases
  status            ProjectStatus @default(DRAFT)
  durationWeeks     Int
  
  // Relationships
  guide             GuideProfile  @relation(fields: [guideId], references: [id])
  phases            ProjectPhase[]
  roles             ProjectRole[]
  applications      Application[]
}

model ProjectRole {
  id          String   @id @default(uuid())
  projectId   String
  title       String
  description String   @db.Text
  requiredSkills String[] // Array of required skills
  maxInterns  Int      @default(1)
  
  // Relationships
  applications Application[]
  assignments Assignment[]
}
```

#### Application System
```prisma
model Application {
  id          String            @id @default(uuid())
  internId    String
  projectId   String
  roleId      String
  status      ApplicationStatus @default(APPLIED)
  fitmentScore Float?           // 0-100 skills match score
  
  // Relationships
  intern      InternProfile     @relation(fields: [internId], references: [id])
  project     Project           @relation(fields: [projectId], references: [id])
  role        ProjectRole       @relation(fields: [roleId], references: [id])
}
```

### Database Operations

#### Migrations
```bash
# Generate migration
cd backend
npx prisma migrate dev --name migration_name

# Deploy to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

#### Seeding
```bash
# Run seed script
cd backend
npm run seed

# Creates sample users:
# admin@internshub.com / admin123
# guide@internshub.com / guide123
# intern@internshub.com / intern123
```

## API Endpoints

### Authentication Routes (`/api/auth`)

```typescript
POST   /api/auth/register     // Register new user
POST   /api/auth/login        // Login user
POST   /api/auth/logout       // Logout user
GET    /api/auth/me           // Get current user profile
POST   /api/auth/forgot       // Request password reset
POST   /api/auth/reset        // Reset password
```

### User Routes (`/api/users`)

```typescript
GET    /api/users             // Get all users (admin only)
GET    /api/users/:id         // Get user by ID
PUT    /api/users/:id         // Update user profile
DELETE /api/users/:id         // Delete user (admin only)
POST   /api/users/:id/resume  // Upload resume (intern only)
```

### Project Routes (`/api/projects`)

```typescript
GET    /api/projects          // Get all projects
POST   /api/projects          // Create project (guide only)
GET    /api/projects/:id      // Get project details
PUT    /api/projects/:id      // Update project (guide only)
DELETE /api/projects/:id      // Delete project (guide only)
POST   /api/projects/:id/apply // Apply to project (intern only)
```

### Application Routes (`/api/applications`)

```typescript
GET    /api/applications      // Get user's applications
PUT    /api/applications/:id  // Update application status (guide only)
DELETE /api/applications/:id  // Withdraw application (intern only)
```

### Request/Response Examples

#### Register User
```typescript
// Request
POST /api/auth/register
{
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "INTERN"
}

// Response
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "INTERN",
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "token": "jwt_token"
}
```

#### Create Project
```typescript
// Request
POST /api/projects
Authorization: Bearer <token>
{
  "title": "E-commerce Platform",
  "shortDescription": "Build a modern e-commerce platform",
  "detailedDescription": "Full description...",
  "scope": "Frontend, Backend, Database",
  "useCases": ["Product catalog", "Shopping cart"],
  "durationWeeks": 12,
  "roles": [
    {
      "title": "Frontend Developer",
      "description": "React development",
      "requiredSkills": ["React", "TypeScript"],
      "maxInterns": 2
    }
  ]
}
```

## Frontend Components

### Page Structure

```typescript
// App Router structure
app/
├── page.tsx              // Home (redirects to dashboard or login)
├── login/page.tsx        // Login form
├── register/page.tsx     // Registration form
├── dashboard/
│   ├── page.tsx          // Role-based dashboard
│   ├── projects/         // Project management
│   ├── applications/     // Application management
│   └── profile/          // User profile
└── layout.tsx            // Root layout
```

### Key Components

#### Authentication Components
```typescript
// Login Form
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    // Handle response...
  };
}
```

#### Protected Routes
```typescript
// Middleware for protected pages
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Render protected content
}
```

#### Role-based Components
```typescript
// Conditional rendering based on user role
export function RoleBasedComponent({ user }: { user: User }) {
  if (user.role === 'ADMIN') {
    return <AdminPanel />;
  } else if (user.role === 'GUIDE') {
    return <GuidePanel />;
  } else {
    return <InternPanel />;
  }
}
```

### State Management

The application uses **React Server Components** and **Server Actions** for state management, avoiding complex client-side state libraries.

```typescript
// Server Action example
'use server';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  const user = await getUser();
  if (user?.role !== 'GUIDE') {
    throw new Error('Unauthorized');
  }
  
  // Create project logic...
  redirect('/dashboard/projects');
}
```

## Development Workflow

### Setup Development Environment

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd interns-project-hub
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Environment**:
   ```bash
   # Backend (.env)
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url
   
   # Frontend (.env.local)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Setup Database**:
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   ```

5. **Start Development Servers**:
   ```bash
   # From root directory
   npm run dev
   
   # Or separately
   npm run dev:backend  # Port 3001
   npm run dev:frontend # Port 3000
   ```

### Development Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run generate     # Generate Prisma client
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data

# Frontend
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Root (both)
npm run dev          # Start both servers
npm run build        # Build both applications
```

### Code Quality

```bash
# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues

# Formatting
npm run format       # Run Prettier
```

### Database Development

```bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# View database
npx prisma studio

# Reset database (development only)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

## Deployment

### Environment Setup

#### Production Environment Variables

**Backend**:
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
FRONTEND_URL=https://your-domain.com
```

**Frontend**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Build Process

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# Or build both
npm run build
```

### Database Migration

```bash
# Deploy migrations to production
cd backend
npx prisma migrate deploy

# Generate production Prisma client
npx prisma generate
```

### Deployment Options

1. **Vercel (Frontend) + Railway/Render (Backend)**
2. **Docker Containers**
3. **Traditional VPS**

## Troubleshooting

### Common Issues

#### Authentication Issues

**Problem**: "Invalid credentials" with seeded users
**Solution**: Ensure seed script creates users in both Supabase Auth and database
```bash
cd backend
npm run seed  # This should create users in Supabase Auth
```

**Problem**: Token verification fails
**Solution**: Check Supabase configuration and token format
```typescript
// Verify token format
const token = req.headers.authorization?.replace('Bearer ', '');
```

#### Database Issues

**Problem**: Prisma client not found
**Solution**: Generate Prisma client
```bash
cd backend
npx prisma generate
```

**Problem**: Migration fails
**Solution**: Check database connection and schema
```bash
npx prisma migrate status
npx prisma migrate resolve --rolled-back migration_name
```

#### Development Server Issues

**Problem**: Port already in use
**Solution**: Kill process or change port
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill
```

**Problem**: Module not found errors
**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Debugging

#### Backend Debugging
```typescript
// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Database query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

#### Frontend Debugging
```typescript
// Add console logging
console.log('User:', user);
console.log('API Response:', response);

// Use React DevTools
// Install React Developer Tools browser extension
```

### Performance Monitoring

#### Database Performance
```sql
-- Check slow queries in Supabase dashboard
-- Monitor connection pool usage
-- Review query execution plans
```

#### Application Performance
```typescript
// Add performance monitoring
console.time('API Call');
const response = await fetch('/api/endpoint');
console.timeEnd('API Call');
```

### Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use different keys for development/production
3. **CORS**: Configure properly for production domains
4. **Rate Limiting**: Implement for production APIs
5. **Input Validation**: Validate all user inputs
6. **SQL Injection**: Use Prisma parameterized queries
7. **XSS Protection**: Sanitize user content

### Monitoring and Logging

#### Production Logging
```typescript
// Use structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

#### Error Tracking
- Use services like Sentry for error tracking
- Monitor API response times
- Track user authentication failures
- Monitor database performance

---

## Getting Help

- **Supabase Documentation**: https://supabase.com/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Express.js Documentation**: https://expressjs.com/

For project-specific issues, check the existing documentation files:
- `QUICK_START.md` - Getting started guide
- `INSTALLATION.md` - Detailed installation instructions
- `SUPABASE_SETUP.md` - Supabase configuration
- `TESTING_CONFIG.md` - Testing setup

---

*This guide covers the core architecture and development practices. For specific feature implementation details, refer to the code comments and individual component documentation.*