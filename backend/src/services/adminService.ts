import { PrismaClient } from '@prisma/client';
import { UserService } from './userService';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
const userService = new UserService();

export class AdminService {
  async createGuide(email: string, firstName: string, lastName: string, createdBy: string) {
    const result = await userService.createGuide(email, firstName, lastName, createdBy);
    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
      },
      guide: result.user.guideProfile,
      tempPassword: result.tempPassword,
    };
  }

  async getGuides() {
    const guides = await prisma.guideProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            emailVerified: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return guides;
  }

  async updateGuideStatus(guideId: string, isActive: boolean) {
    const guide = await prisma.guideProfile.findUnique({
      where: { id: guideId },
    });

    if (!guide) {
      throw new AppError('Guide not found', 404);
    }

    const updated = await prisma.guideProfile.update({
      where: { id: guideId },
      data: { isActive },
    });

    return updated;
  }

  async getProjects() {
    const projects = await prisma.project.findMany({
      include: {
        guide: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            assignments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects;
  }
}

