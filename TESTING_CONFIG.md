# Testing Configuration Guide

## Disable Email Confirmation for Testing

To make unit testing and development easier, you can disable email confirmation requirements.

## Configuration

### Backend Configuration

Add to `backend/.env`:

```env
# Disable email confirmation (useful for testing)
DISABLE_EMAIL_CONFIRMATION=true
```

### Frontend Configuration (Optional)

Add to `frontend/.env.local`:

```env
# Disable email confirmation message (optional, for UI consistency)
NEXT_PUBLIC_DISABLE_EMAIL_CONFIRMATION=true
```

## What This Does

When `DISABLE_EMAIL_CONFIRMATION=true`:

1. **User Registration**:
   - Users are automatically confirmed in Supabase (`email_confirm: true`)
   - No email verification required
   - Users can login immediately after registration

2. **Login**:
   - Email verification check is skipped
   - Users can login even if email is not verified

3. **UI Messages**:
   - Registration success message changes to "You can now login" instead of "Check your email"
   - No email verification prompts

## Usage

### For Development/Testing

```env
# backend/.env
DISABLE_EMAIL_CONFIRMATION=true
```

This is perfect for:
- Unit testing authentication flows
- Integration testing
- Local development
- CI/CD pipelines

### For Production

```env
# backend/.env
DISABLE_EMAIL_CONFIRMATION=false
# Or simply omit the variable (defaults to false)
```

**Important**: Always disable email confirmation in production for security!

## Testing Example

With email confirmation disabled, you can write tests like:

```typescript
// Test user registration and immediate login
test('user can register and login immediately', async () => {
  // Register
  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });
  
  expect(registerResponse.status).toBe(201);
  
  // Login immediately (no email verification needed)
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123',
    });
  
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.access_token).toBeDefined();
});
```

## Environment-Specific Settings

### Development
```env
DISABLE_EMAIL_CONFIRMATION=true
NODE_ENV=development
```

### Testing
```env
DISABLE_EMAIL_CONFIRMATION=true
NODE_ENV=test
```

### Production
```env
DISABLE_EMAIL_CONFIRMATION=false
NODE_ENV=production
```

## Supabase Configuration

Note: This setting only affects the application behavior. You may also want to configure Supabase:

1. Go to **Authentication** → **Settings** in Supabase dashboard
2. Under **Email Auth**, you can:
   - Disable "Confirm email" requirement (for testing)
   - Or keep it enabled and use `DISABLE_EMAIL_CONFIRMATION` to auto-confirm via API

## Security Considerations

⚠️ **Warning**: 
- Never disable email confirmation in production
- This setting should only be used in development/testing environments
- Always verify emails in production for security

## Troubleshooting

### Users still can't login after registration

1. Check `DISABLE_EMAIL_CONFIRMATION=true` is set in `backend/.env`
2. Restart the backend server after changing the setting
3. Verify Supabase user was created with `email_confirm: true` in Supabase dashboard

### Email confirmation still required

1. Ensure the environment variable is exactly `DISABLE_EMAIL_CONFIRMATION=true` (case-sensitive)
2. Check for typos in the variable name
3. Restart the server after changing `.env` file

