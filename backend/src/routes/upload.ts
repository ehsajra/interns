import { Router } from 'express';
import multer from 'multer';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { UserRole } from '../types/prisma';
import { uploadFile, getPublicUrl } from '../lib/supabase-storage';
import { AppError } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

export const uploadRoutes = Router();
const prisma = new PrismaClient();

// Configure multer for memory storage (we'll upload directly to Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files for resumes
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new AppError('Only PDF files are allowed', 400) as any);
    }
  },
});

// Upload resume (Intern only)
uploadRoutes.post(
  '/resume',
  authenticate,
  requireRole(UserRole.INTERN),
  upload.single('resume'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const intern = await prisma.internProfile.findUnique({
        where: { userId: req.userId! },
      });

      if (!intern) {
        throw new AppError('Intern profile not found', 404);
      }

      // Generate unique file path
      const fileName = `${req.userId}/${Date.now()}-${req.file.originalname}`;
      const filePath = `resumes/${fileName}`;

      // Upload to Supabase Storage
      const uploadResult = await uploadFile({
        bucket: 'resumes',
        path: filePath,
        file: req.file.buffer,
        contentType: req.file.mimetype,
      });

      // Get public URL (or signed URL for private files)
      const fileUrl = getPublicUrl('resumes', filePath);

      // Save resume record in database
      const resume = await prisma.resume.create({
        data: {
          internId: intern.id,
          fileName: req.file.originalname,
          fileUrl: fileUrl,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          isPrimary: true, // Set as primary, unset others
        },
      });

      // Unset other resumes as primary
      await prisma.resume.updateMany({
        where: {
          internId: intern.id,
          id: { not: resume.id },
        },
        data: {
          isPrimary: false,
        },
      });

      res.status(201).json({
        message: 'Resume uploaded successfully',
        resume: {
          id: resume.id,
          fileName: resume.fileName,
          fileUrl: resume.fileUrl,
          uploadedAt: resume.uploadedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get signed URL for resume (for private access)
uploadRoutes.get(
  '/resume/:id/url',
  authenticate,
  requireRole(UserRole.INTERN, UserRole.GUIDE, UserRole.ADMIN),
  async (req: AuthRequest, res, next) => {
    try {
      const resume = await prisma.resume.findUnique({
        where: { id: req.params.id },
        include: {
          intern: true,
        },
      });

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // Check permissions
      if (req.userRole === UserRole.INTERN && resume.intern.userId !== req.userId) {
        throw new AppError('Access denied', 403);
      }

      // Extract path from URL or store path separately
      // For now, return the stored URL
      res.json({
        url: resume.fileUrl,
      });
    } catch (error) {
      next(error);
    }
  }
);



