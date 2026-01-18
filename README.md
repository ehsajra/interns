# Interns Project Hub

A production-grade web application for managing internship-to-prototype projects, connecting interns with project guides and facilitating the complete lifecycle from application to certificate issuance.

## Architecture

- **Backend**: Node.js with TypeScript, Express
- **Frontend**: React 19 with TypeScript, Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage

## Project Structure

```
/
├── backend/          # Node.js/TypeScript backend API
├── frontend/         # React/Next.js frontend
├── infra/            # Infrastructure and deployment configs
└── shared/           # Shared types and utilities
```

## Getting Started

### Prerequisites

- **Node.js 18+** and npm - [Download here](https://nodejs.org/)
- **Supabase Account** - [Sign up here](https://supabase.com) (free tier available)
- Supabase project with database, auth, and storage configured

### Quick Setup

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**

1. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

2. Set up Supabase:
   - Create a project at https://supabase.com
   - Get your project URL and API keys (see `SUPABASE_SETUP.md`)
   - Create storage buckets: `resumes` and `certificates`

3. Create environment files:
   - Create `backend/.env` with Supabase credentials (see `MIGRATION_TO_SUPABASE.md`)
   - Create `frontend/.env.local` with Supabase credentials

4. Run database migration:
```bash
cd backend
npm run generate  # Generate Prisma client
npm run migrate   # Run migrations
npm run seed      # Seed sample data
cd ..
```

5. Start development servers:
```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 3000).

## Development Phases

- **Phase 1**: Foundation / Core User Management
- **Phase 2**: MVP Core - Projects & Applications
- **Phase 3**: Execution & Completion
- **Phase 4**: Polish & Scale

## Testing Configuration

For easier unit testing and development, you can disable email confirmation:

```env
# backend/.env
DISABLE_EMAIL_CONFIRMATION=true
```

See `TESTING_CONFIG.md` for details.

## License

MIT

