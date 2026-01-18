import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  if (process.env.NODE_ENV === 'test') {
    console.log('Email would be sent:', { to, subject });
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@internshub.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw - email failures shouldn't break the flow
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <h2>Verify your email</h2>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>This link will expire in 24 hours.</p>
  `;

  await sendEmail(email, 'Verify your email - Interns Project Hub', html);
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <h2>Reset your password</h2>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
  `;

  await sendEmail(email, 'Reset your password - Interns Project Hub', html);
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const html = `
    <h2>Welcome to Interns Project Hub!</h2>
    <p>Hi ${name},</p>
    <p>Your account has been created successfully. You can now start exploring projects and applying for internships.</p>
  `;

  await sendEmail(email, 'Welcome to Interns Project Hub', html);
};

