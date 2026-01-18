// Backup enum definitions in case Prisma client generation fails
export enum UserRole {
  INTERN = 'INTERN',
  GUIDE = 'GUIDE',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED'
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ACTIVE = 'ACTIVE',
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  DELAYED = 'DELAYED',
  READY_FOR_REVIEW = 'READY_FOR_REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PhaseStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  OPTED_OUT = 'OPTED_OUT',
  COMPLETED = 'COMPLETED'
}