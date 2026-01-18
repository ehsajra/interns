# GitHub Setup Guide

## Repository Setup Complete ✅

Your local git repository has been initialized and the initial commit has been created.

## Next Steps: Connect to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `interns-project-hub` (or your choice)
   - **Description**: "Internship-to-Prototype Platform - Full-stack web application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/interns-project-hub.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/interns-project-hub.git
git branch -M main
git push -u origin main
```

## Verify Connection

After pushing, verify your repository:

```bash
# Check remote
git remote -v

# Should show:
# origin  https://github.com/YOUR_USERNAME/interns-project-hub.git (fetch)
# origin  https://github.com/YOUR_USERNAME/interns-project-hub.git (push)
```

## Git Configuration

Your git is configured with:
- **Email**: ajit.raghavan@gmail.com
- **Name**: Ajit Raghavan (or your configured name)

To verify:
```bash
git config --global user.email
git config --global user.name
```

## Important Files Already in .gitignore

The following are excluded from git (for security):
- `.env` files (backend and frontend)
- `node_modules/`
- `.next/` (Next.js build)
- `dist/` (compiled files)
- `uploads/` (local file storage)
- Database files

## Future Commits

After the initial setup, use these commands for regular commits:

```bash
# Check status
git status

# Add changes
git add .

# Or add specific files
git add path/to/file

# Commit
git commit -m "Your commit message"

# Push to GitHub
git push
```

## Branching Strategy (Optional)

For development, you might want to use branches:

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Make changes, commit
git add .
git commit -m "Add feature"

# Push branch
git push -u origin feature/your-feature-name

# Merge to main (via GitHub Pull Request or locally)
git checkout main
git merge feature/your-feature-name
```

## Security Reminder

⚠️ **Never commit these files:**
- `backend/.env`
- `frontend/.env.local`
- Any file containing API keys or secrets
- `node_modules/`

These are already in `.gitignore`, but always double-check before committing!

## Troubleshooting

### Authentication Issues

If you get authentication errors when pushing:

1. **Use Personal Access Token** (recommended):
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions
   - Use token as password when pushing

2. **Or use GitHub CLI**:
   ```bash
   gh auth login
   ```

### Push Rejected

If push is rejected:
```bash
# Pull first (if repository has content)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

## Repository Structure

Your repository includes:
- ✅ Complete backend (Node.js/TypeScript/Express)
- ✅ Complete frontend (Next.js/React/TypeScript)
- ✅ Database schema (Prisma)
- ✅ Supabase integration
- ✅ Documentation
- ✅ Configuration files

Ready to share and collaborate! 🚀

