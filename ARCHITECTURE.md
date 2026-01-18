# Architecture Overview

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: Supabase Auth
- **Validation**: express-validator
- **File Storage**: Supabase Storage

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios

## Architecture Patterns

### Backend Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── routes/               # API route handlers
│   │   ├── auth.ts          # Authentication routes
│   │   ├── intern.ts        # Intern-specific routes
│   │   ├── guide.ts         # Guide-specific routes
│   │   ├── admin.ts         # Admin-specific routes
│   │   └── health.ts        # Health check
│   ├── services/            # Business logic layer
│   │   ├── userService.ts
│   │   ├── internService.ts
│   │   ├── guideService.ts
│   │   └── adminService.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   └── errorHandler.ts  # Error handling
│   └── utils/               # Utility functions
│       ├── jwt.ts
│       ├── password.ts
│       ├── email.ts
│       └── tokens.ts
└── prisma/
    └── schema.prisma        # Database schema
```

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home/redirect
│   │   ├── login/           # Authentication pages
│   │   ├── register/
│   │   └── dashboard/      # Protected routes
│   │       ├── layout.tsx   # Dashboard layout
│   │       ├── page.tsx     # Role-based dashboard
│   │       ├── projects/
│   │       ├── applications/
│   │       ├── certificates/
│   │       └── guides/
│   └── lib/                 # Utilities
│       ├── api.ts           # Axios client
│       ├── auth.ts          # Auth helpers
│       └── utils.ts         # General utilities
```

## Database Schema

### Core Entities

1. **User**: Base user account with authentication
2. **InternProfile**: Intern-specific profile data
3. **GuideProfile**: Guide-specific profile data
4. **AdminProfile**: Admin-specific profile data
5. **Resume**: Intern resume files
6. **Project**: Project definitions with phases and roles
7. **ProjectPhase**: Project execution phases
8. **ProjectRole**: Roles within a project
9. **Application**: Intern applications to project roles
10. **Assignment**: Active project assignments
11. **OptOut**: Records of interns opting out
12. **Certificate**: Generated certificates
13. **AuditLog**: System audit trail

### Key Relationships

- User → Profile (1:1, role-specific)
- Guide → Projects (1:many)
- Intern → Applications (1:many)
- Project → Roles (1:many)
- Project → Phases (1:many)
- Application → Project + Role + Intern (many-to-many with metadata)

## Authentication Flow

1. User registers/logs in
2. Backend validates credentials
3. JWT token generated with `userId` and `role`
4. Token stored in localStorage (frontend)
5. Token sent in `Authorization: Bearer <token>` header
6. Middleware validates token and extracts user info

## Role-Based Access Control

- **INTERN**: Can view/apply to projects, manage profile
- **GUIDE**: Can create/manage projects, review applications
- **ADMIN**: Can manage guides, oversee all projects

Routes are protected using middleware:
```typescript
router.use(authenticate);
router.use(requireRole(UserRole.INTERN));
```

## API Design

### RESTful Conventions

- `GET /api/resource` - List resources
- `GET /api/resource/:id` - Get single resource
- `POST /api/resource` - Create resource
- `PATCH /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

### Error Handling

All errors follow consistent format:
```json
{
  "error": "Error message",
  "stack": "..." // Only in development
}
```

## Security Considerations

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Signed with secret, expiration configured
3. **Input Validation**: express-validator on all inputs
4. **SQL Injection**: Prisma ORM prevents SQL injection
5. **CORS**: Configured for specific frontend origin
6. **Environment Variables**: Secrets stored in .env files

## Deployment Considerations

### Backend
- Environment variables for configuration
- Database migrations via Prisma
- Health check endpoint for monitoring
- Error logging and monitoring

### Frontend
- Static generation where possible
- API URL configuration via environment variables
- Token-based authentication
- Client-side routing with Next.js

## Future Enhancements (Phase 2+)

- File upload handling (multer + S3)
- GitHub API integration
- Email notifications
- Real-time updates (WebSockets)
- Advanced search and filtering
- Analytics and reporting

