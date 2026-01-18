import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { UserService } from '../services/userService';
import { AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

export const authRoutes = Router();
const userService = new UserService();

// Register intern
authRoutes.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName } = req.body;
      const user = await userService.createIntern(email, password, firstName, lastName);

      // Check if email confirmation is disabled
      const disableEmailConfirmation = process.env.DISABLE_EMAIL_CONFIRMATION === 'true';
      const message = disableEmailConfirmation
        ? 'Registration successful. You can now login.'
        : 'Registration successful. Please check your email to verify your account.';

      res.status(201).json({
        message,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Alternative register endpoint that accepts Supabase user token
authRoutes.post(
  '/register-profile',
  authenticate,
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // User is already authenticated via Supabase, just create profile
      const { firstName, lastName } = req.body;
      // Profile should already be created, but we can update it here if needed
      res.status(200).json({
        message: 'Profile created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify email
authRoutes.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new AppError('Verification token is required', 400);
    }

    const result = await userService.verifyEmail(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Login
authRoutes.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await userService.login(email, password);

      // Return Supabase session tokens
      res.json({
        access_token: result.supabaseSession?.access_token,
        refresh_token: result.supabaseSession?.refresh_token,
        expires_in: result.supabaseSession?.expires_in,
        user: {
          id: result.id,
          email: result.email,
          role: result.role,
          profile: result.internProfile || result.guideProfile || result.adminProfile,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user (for frontend)
authRoutes.get('/me', authenticate, async (req: any, res, next) => {
  try {
    const user = await userService.getUserById(req.userId!);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.internProfile || user.guideProfile || user.adminProfile,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Request password reset
authRoutes.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const result = await userService.requestPasswordReset(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Reset password
authRoutes.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;
      const result = await userService.resetPassword(token, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);
