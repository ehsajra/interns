import { PrismaClient, UserRole } from '@prisma/client';
import { createSupabaseUser, getUserById, updateUser, verifyToken } from '../lib/supabase-auth';
import { AppError } from '../middleware/errorHandler';
import { supabaseAdmin } from '../lib/supabase';

const prisma = new PrismaClient();

export class UserService {
  async createIntern(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    // Check if user exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create user in Supabase Auth
    const supabaseUser = await createSupabaseUser(email, password, {
      firstName,
      lastName,
      role: 'INTERN',
    });

    // Create user and profile in our database
    // Note: We'll link via email for now, or store supabase_user_id in metadata
    const user = await prisma.user.create({
      data: {
        id: supabaseUser.id, // Use Supabase user ID as our user ID
        email,
        passwordHash: '', // No longer needed with Supabase Auth
        role: UserRole.INTERN,
        emailVerified: true, // Supabase handles email verification
        internProfile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      include: {
        internProfile: true,
      },
    });

    return user;
  }

  async verifyEmail(token: string) {
    // Supabase handles email verification automatically via email links
    // This endpoint can be used for additional verification logic if needed
    // For OTP verification, we can use verifyOtp, but typically Supabase
    // handles this via the confirmation link in the email
    
    // If token is a confirmation token from email link, Supabase handles it client-side
    // This endpoint is mainly for API-based verification if needed
    return { message: 'Email verification is handled by Supabase. Please use the link in your email.' };
  }

  async login(email: string, password: string) {
    // Authenticate with Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Get user from our database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        internProfile: true,
        guideProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new AppError('User profile not found', 404);
    }

    if (!user.emailVerified && !data.user.email_confirmed_at) {
      throw new AppError('Please verify your email before logging in', 401);
    }

    // Return user with Supabase session info
    return {
      ...user,
      supabaseSession: data.session,
    };
  }

  async requestPasswordReset(email: string) {
    // Use Supabase password reset
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    // Don't reveal if email exists
    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Supabase handles password reset via email link
    // When user clicks reset link, they get a session token
    // This endpoint should be called with that session token
    // For now, we'll use the admin API to update password if we have the user ID
    
    // Note: In production, password reset should be handled client-side
    // after user clicks the reset link from email
    // This is a fallback for API-based reset
    
    // If token is a user ID (from session), update password
    try {
      // Try to get user from token (assuming it's a session token)
      const user = await verifyToken(token);
      
      // Update password in Supabase
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        throw new AppError('Failed to reset password', 500);
      }

      // Update our database
      await prisma.user.updateMany({
        where: { email: user.email! },
        data: {
          passwordResetToken: null,
          passwordResetExpires: null,
          mustResetPassword: false,
        },
      });

      return { message: 'Password reset successfully' };
    } catch (error: any) {
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  async createGuide(
    email: string,
    firstName: string,
    lastName: string,
    createdBy: string
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';

    // Create user in Supabase Auth
    const supabaseUser = await createSupabaseUser(email, tempPassword, {
      firstName,
      lastName,
      role: 'GUIDE',
    });

    const user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email,
        passwordHash: '', // No longer needed
        role: UserRole.GUIDE,
        emailVerified: true,
        mustResetPassword: true,
        guideProfile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      include: {
        guideProfile: true,
      },
    });

    return {
      user,
      tempPassword, // Return for admin to share
    };
  }

  async createAdmin(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Create user in Supabase Auth
    const supabaseUser = await createSupabaseUser(email, password, {
      firstName,
      lastName,
      role: 'ADMIN',
    });

    const user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email,
        passwordHash: '', // No longer needed
        role: UserRole.ADMIN,
        emailVerified: true,
        adminProfile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      include: {
        adminProfile: true,
      },
    });

    return user;
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        internProfile: true,
        guideProfile: true,
        adminProfile: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

