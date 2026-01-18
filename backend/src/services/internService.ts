import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export class InternService {
  async getProfile(internId: string) {
    const intern = await prisma.internProfile.findUnique({
      where: { userId: internId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            emailVerified: true,
          },
        },
        resumes: {
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!intern) {
      throw new AppError('Intern profile not found', 404);
    }

    return intern;
  }

  async updateProfile(internId: string, data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    skills?: string[];
    institution?: string;
    yearOfStudy?: string;
  }) {
    const intern = await prisma.internProfile.findUnique({
      where: { userId: internId },
    });

    if (!intern) {
      throw new AppError('Intern profile not found', 404);
    }

    const updated = await prisma.internProfile.update({
      where: { userId: internId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.skills && { skills: data.skills }),
        ...(data.institution !== undefined && { institution: data.institution }),
        ...(data.yearOfStudy !== undefined && { yearOfStudy: data.yearOfStudy }),
      },
    });

    return updated;
  }

  async getApplications(internId: string) {
    const applications = await prisma.application.findMany({
      where: { internId },
      include: {
        project: {
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
          },
        },
        role: true,
        resume: true,
      },
      orderBy: { appliedAt: 'desc' },
    });

    return applications;
  }

  async getCertificates(internId: string) {
    const certificates = await prisma.certificate.findMany({
      where: { internId },
      include: {
        project: {
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
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return certificates;
  }
}

