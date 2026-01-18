import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { UserRole } from '../types/prisma';
import { InternService } from '../services/internService';
import { AppError } from '../middleware/errorHandler';

export const internRoutes = Router();
const internService = new InternService();

// All routes require authentication and INTERN role
internRoutes.use(authenticate);
internRoutes.use(requireRole(UserRole.INTERN));

// Get profile
internRoutes.get('/profile', async (req: AuthRequest, res, next) => {
  try {
    const profile = await internService.getProfile(req.userId!);
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// Update profile
internRoutes.patch(
  '/profile',
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('phone').optional().trim(),
    body('bio').optional().trim(),
    body('skills').optional().isArray(),
    body('institution').optional().trim(),
    body('yearOfStudy').optional().trim(),
  ],
  async (req: AuthRequest, res: any, next: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profile = await internService.updateProfile(req.userId!, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
);

// Resume upload is handled in upload routes
// This endpoint redirects to the upload endpoint
internRoutes.post('/resume', async (req: AuthRequest, res, next) => {
  try {
    res.status(400).json({ 
      message: 'Please use POST /api/upload/resume with multipart/form-data',
      endpoint: '/api/upload/resume'
    });
  } catch (error) {
    next(error);
  }
});

// Get my applications (placeholder for Phase 2)
internRoutes.get('/applications', async (req: AuthRequest, res, next) => {
  try {
    const applications = await internService.getApplications(req.userId!);
    res.json(applications);
  } catch (error) {
    next(error);
  }
});

// Get completed internships
internRoutes.get('/certificates', async (req: AuthRequest, res, next) => {
  try {
    const certificates = await internService.getCertificates(req.userId!);
    res.json(certificates);
  } catch (error) {
    next(error);
  }
});

