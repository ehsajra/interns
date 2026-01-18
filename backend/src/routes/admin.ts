import { Router, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { UserRole } from '../types/prisma';
import { AdminService } from '../services/adminService';
import { AppError } from '../middleware/errorHandler';

export const adminRoutes = Router();
const adminService = new AdminService();

// All routes require authentication and ADMIN role
adminRoutes.use(authenticate);
adminRoutes.use(requireRole(UserRole.ADMIN));

// Create guide
adminRoutes.post(
  '/guides',
  [
    body('email').isEmail().normalizeEmail(),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, firstName, lastName } = req.body;
      const result = await adminService.createGuide(email, firstName, lastName, req.userId!);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// Get all guides
adminRoutes.get('/guides', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const guides = await adminService.getGuides();
    res.json(guides);
  } catch (error) {
    next(error);
  }
});

// Activate/deactivate guide
adminRoutes.patch(
  '/guides/:id/status',
  [body('isActive').isBoolean()],
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { isActive } = req.body;
      const guide = await adminService.updateGuideStatus(req.params.id, isActive);
      res.json(guide);
    } catch (error) {
      next(error);
    }
  }
);

// Get all projects (overview)
adminRoutes.get('/projects', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await adminService.getProjects();
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

