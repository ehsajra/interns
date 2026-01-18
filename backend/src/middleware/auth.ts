import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { UserRole } from '../types/prisma';
import { verifyToken } from '../lib/supabase-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: UserRole;
  supabaseUserId?: string; // Supabase auth user ID
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const supabaseUser = await verifyToken(token);
    req.supabaseUserId = supabaseUser.id;

    // Get our User record linked to Supabase user
    // We'll store Supabase user ID in user metadata or link via email
    const user = await prisma.user.findUnique({
      where: { email: supabaseUser.email! },
      include: {
        internProfile: true,
        guideProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.userId = user.id;
    req.userRole = user.role as UserRole;
    next();
  } catch (error: any) {
    if (error.message?.includes('Invalid token') || error.message?.includes('JWT')) {
      return next(new AppError('Invalid token', 401));
    }
    next(error);
  }
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.userRole)) {
      return next(new AppError('Insufficient permissions', 403));
    }

    next();
  };
};

