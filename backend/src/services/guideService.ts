import { PrismaClient } from '@prisma/client';
import { ProjectStatus } from '../types/prisma';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class GuideService {
  async getProfile(guideId: string) {
    const guide = await prisma.guideProfile.findUnique({
      where: { userId: guideId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    return guide;
  }

  async updateProfile(guideId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    expertise?: string[];
    organization?: string;
  }) {
    const guide = await prisma.guideProfile.findUnique({
      where: { userId: guideId },
    });

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const updated = await prisma.guideProfile.update({
      where: { userId: guideId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.expertise && { expertise: data.expertise }),
        ...(data.organization !== undefined && { organization: data.organization }),
      },
    });

    return updated;
  }

  async createProject(guideId: string, data: {
    title: string;
    shortDescription: string;
    detailedDescription: string;
    scope: string;
    useCases: string[];
    durationWeeks: number;
    phases: Array<{ title: string; description: string; order: number }>;
    roles: Array<{ title: string; description: string; requiredSkills: string[]; maxInterns?: number }>;
  }) {
    const guide = await prisma.guideProfile.findUnique({
      where: { userId: guideId },
    });

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const project = await prisma.project.create({
      data: {
        guideId: guide.id,
        title: data.title,
        shortDescription: data.shortDescription,
        detailedDescription: data.detailedDescription,
        scope: data.scope,
        useCases: data.useCases,
        durationWeeks: data.durationWeeks,
        status: ProjectStatus.DRAFT,
        phases: {
          create: data.phases.map(phase => ({
            title: phase.title,
            description: phase.description,
            order: phase.order,
          })),
        },
        roles: {
          create: data.roles.map(role => ({
            title: role.title,
            description: role.description,
            requiredSkills: role.requiredSkills,
            maxInterns: role.maxInterns || 1,
          })),
        },
      },
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
        roles: true,
      },
    });

    return project;
  }

  async getProjects(guideId: string) {
    const guide = await prisma.guideProfile.findUnique({
      where: { userId: guideId },
    });

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const projects = await prisma.project.findMany({
      where: { guideId: guide.id },
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
        roles: true,
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

  async getProject(guideId: string, projectId: string) {
    const guide = await prisma.guideProfile.findUnique({
      where: { userId: guideId },
    });

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        guideId: guide.id,
      },
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
        roles: true,
        applications: {
          include: {
            intern: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            role: true,
            resume: true,
          },
        },
        assignments: {
          include: {
            intern: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            role: true,
          },
        },
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    return project;
  }

  async updateProject(guideId: string, projectId: string, data: any) {
    const guide = await prisma.guideProfile.findUnique({
      where: { userId: guideId },
    });

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        guideId: guide.id,
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Only allow updates to DRAFT projects
    if (project.status !== ProjectStatus.DRAFT) {
      throw new AppError('Only draft projects can be updated', 400);
    }

    // Update project fields
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.shortDescription && { shortDescription: data.shortDescription }),
        ...(data.detailedDescription && { detailedDescription: data.detailedDescription }),
        ...(data.scope && { scope: data.scope }),
        ...(data.useCases && { useCases: data.useCases }),
        ...(data.durationWeeks && { durationWeeks: data.durationWeeks }),
      },
      include: {
        phases: {
          orderBy: { order: 'asc' },
        },
        roles: true,
      },
    });

    return updated;
  }
}

