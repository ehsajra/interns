# Setup Instructions

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (or use Docker Compose)
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

#### Option A: Using Docker Compose (Recommended)

```bash
cd infra
docker-compose up -d
```

#### Option B: Local PostgreSQL

Create a database named `interns_hub` and update the `DATABASE_URL` in `backend/.env`.

### 3. Configure Environment Variables

#### Backend

Copy `backend/.env.example` to `backend/.env` and update:

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT signing
- `FRONTEND_URL`: Frontend URL (default: http://localhost:3000)
- `SMTP_*`: Email configuration (use Ethereal Email for development)

#### Frontend

Copy `frontend/.env.example` to `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local if needed
```

### 4. Initialize Database

```bash
cd backend
npm run generate  # Generate Prisma client
npm run migrate    # Run migrations
npm run seed       # Seed sample data
```

### 5. Start Development Servers

From the root directory:

```bash
npm run dev
```

This starts both:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

Or start them separately:

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

## Sample Credentials

After seeding, you can login with:

- **Admin**: admin@internshub.com / admin123
- **Guide**: guide@internshub.com / guide123
- **Intern**: intern@internshub.com / intern123

## Project Structure

```
/
├── backend/          # Node.js/TypeScript API
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   ├── middleware/ # Auth, error handling
│   │   └── utils/    # Utilities
│   └── prisma/       # Database schema
├── frontend/         # Next.js/React app
│   └── src/
│       ├── app/      # Next.js App Router pages
│       └── lib/      # Utilities and API client
└── infra/            # Infrastructure configs
```

## Development Phases

This project is implemented in phases:

- **Phase 1** (Current): Foundation - User management, authentication, basic profiles
- **Phase 2**: Projects & Applications - Full application flow
- **Phase 3**: Execution & Completion - GitHub integration, certificates
- **Phase 4**: Polish & Scale - UX improvements, analytics

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Verify database exists: `psql -U interns_user -d interns_hub`

### Port Already in Use

- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/package.json` scripts

### Prisma Issues

```bash
cd backend
npm run generate  # Regenerate Prisma client
npm run migrate    # Reset and migrate (WARNING: deletes data)
```

## Next Steps

1. Complete Phase 1 testing
2. Review API documentation
3. Proceed to Phase 2 implementation

