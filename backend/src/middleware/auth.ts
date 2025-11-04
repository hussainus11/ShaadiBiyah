import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;
  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isVerified: true
        }
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
  
      req.user = user;
      return next(); // ✅ added return here
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  };
  

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route'
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: `User role ${req.user.role} is not authorized to access this route`
        });
      }
  
      return next(); // ✅ ensure a return here
    };
  };
  

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isVerified: true
        }
      });

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we continue without setting req.user
    }
  }

  next();
};

// Middleware to check if vendor is verified
export const requireVendorVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  if (req.user.role !== 'VENDOR') {
    return res.status(403).json({
      success: false,
      error: 'Vendor role required'
    });
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      select: {
        id: true,
        verificationStatus: true,
        isVerified: true,
        isActive: true
      }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    if (!vendor.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Vendor account is inactive'
      });
    }

    if (vendor.verificationStatus !== 'VERIFIED') {
      return res.status(403).json({
        success: false,
        error: 'Vendor verification required',
        verificationStatus: vendor.verificationStatus,
        message: 'Please complete the verification process to access vendor features'
      });
    }

    // Add vendor info to request
    req.user = {
      ...req.user,
      vendorId: vendor.id
    } as any;

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error checking vendor verification'
    });
  }
};




