import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { UserRole } from '@prisma/client';
import { GuideService } from '../services/guideService';
import { AppError } from '../middleware/errorHandler';

export const guideRoutes = Router();
const guideService = new GuideService();

// All routes require authentication and GUIDE role
guideRoutes.use(authenticate);
guideRoutes.use(requireRole(UserRole.GUIDE));

// Get profile
guideRoutes.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const profile = await guideService.getProfile(req.userId!);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// Update profile
guideRoutes.patch(
  '/profile',
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
    body('expertise').optional().isArray(),
    body('organization').optional().trim(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profile = await guideService.updateProfile(req.userId!, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
);

// Create project (draft)
guideRoutes.post(
  '/projects',
  [
    body('title').trim().notEmpty(),
    body('shortDescription').trim().notEmpty(),
    body('detailedDescription').trim().notEmpty(),
    body('scope').trim().notEmpty(),
    body('useCases').isArray(),
    body('durationWeeks').isInt({ min: 1 }),
    body('phases').isArray(),
    body('roles').isArray(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await guideService.createProject(req.userId!, req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }
);

// Get my projects
guideRoutes.get('/projects', async (req: AuthRequest, res, next) => {
  try {
    const projects = await guideService.getProjects(req.userId!);
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get project by ID
guideRoutes.get('/projects/:id', async (req: AuthRequest, res, next) => {
  try {
    const project = await guideService.getProject(req.userId!, req.params.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Update project (draft only)
guideRoutes.patch(
  '/projects/:id',
  async (req: AuthRequest, res, next) => {
    try {
      const project = await guideService.updateProject(req.userId!, req.params.id, req.body);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }
);

