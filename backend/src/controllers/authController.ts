import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone, role = 'USER' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role as any
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' } as SignOptions
    );

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to ShaadiBiyah - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to ShaadiBiyah!</h2>
          <p>Hello ${user.firstName},</p>
          <p>Thank you for joining our wedding planning platform. Please verify your email address to get started.</p>
          <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}" 
             style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Verify Email
          </a>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${process.env.FRONTEND_URL}/verify-email?token=${token}</p>
        </div>
      `
    });

    return res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'User registered successfully. Please check your email for verification.'
    });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: password ? '***' : 'undefined' });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        vendor: true
      }
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' } as SignOptions
    );

    const { password: _, ...userWithoutPassword } = user;

    console.log('Login successful for user:', email);
    return res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    });
  });

  static getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        vendor: true,
        bookings: {
          include: {
            vendor: true,
            service: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  });

  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    // In a real app, you might want to blacklist the token
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Send reset email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request - ShaadiBiyah',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.firstName},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" 
             style="background-color: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Reset Password
          </a>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p>${process.env.FRONTEND_URL}/reset-password?token=${resetToken}</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { id: decoded.id },
        data: { password: hashedPassword }
      });

      return res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  });

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      await prisma.user.update({
        where: { id: decoded.id },
        data: { isVerified: true }
      });

      return res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
  });

  static changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  });
}
