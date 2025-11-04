import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class UserController {
    static getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user!.id;
      
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isVerified: true,
            profileImage: true,
            weddingDate: true,
            budget: true,
            location: true,
            createdAt: true,
            updatedAt: true
          }
        });
      
        if (!user) {
          return res.status(404).json({
            success: false,
            error: 'User not found'
          });
        }
      
        return res.status(200).json({   // ✅ added 'return'
          success: true,
          data: user
        });
      });
      

  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const updateData = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        profileImage: true,
        weddingDate: true,
        budget: true,
        location: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  });

  static uploadProfileImage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    // Implementation for image upload using Cloudinary or similar service
    // This would handle file upload and update user profile image
    
    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully'
    });
  });

  static getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const [
      user,
      bookings,
      unreadNotifications,
      checklistItems
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          weddingDate: true,
          budget: true,
          location: true,
          firstName: true
        }
      }),
      prisma.booking.findMany({
        where: { userId },
        include: {
          vendor: {
            select: {
              businessName: true,
              category: true,
              rating: true
            }
          },
          service: {
            select: {
              name: true,
              price: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      }),
      prisma.weddingChecklist.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    // Calculate days until wedding
    const daysUntilWedding = user?.weddingDate 
      ? Math.ceil((new Date(user.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Calculate budget spent
    const totalSpent = await prisma.booking.aggregate({
      where: {
        userId,
        paymentStatus: 'COMPLETED'
      },
      _sum: {
        totalAmount: true
      }
    });

    const budgetRemaining = user?.budget 
      ? user.budget - (totalSpent._sum.totalAmount || 0)
      : null;

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          daysUntilWedding,
          budgetRemaining,
          totalBookings: bookings.length,
          unreadNotifications,
          completedChecklistItems: checklistItems.filter(item => item.isCompleted).length,
          totalChecklistItems: checklistItems.length
        },
        recentBookings: bookings,
        recentChecklistItems: checklistItems
      }
    });
  });

  static getUserBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const filters: any = { userId };
    if (status) {
      filters.status = status;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const bookings = await prisma.booking.findMany({
      where: filters,
      include: {
        vendor: {
          select: {
            businessName: true,
            category: true,
            rating: true,
            profileImage: true,
            location: true
          }
        },
        service: {
          select: {
            name: true,
            description: true,
            price: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.booking.count({ where: filters });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });

  static getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.notification.count({ where: { userId } });

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });

  static markNotificationRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.notification.updateMany({
      where: {
        id,
        userId
      },
      data: { isRead: true }
    });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  });

  static createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { vendorId, rating, comment } = req.body;
  
    // Check if user has completed booking with this vendor
    const hasBooking = await prisma.booking.findFirst({
      where: {
        userId,
        vendorId,
        status: 'COMPLETED'
      }
    });
  
    if (!hasBooking) {
      return res.status(400).json({
        success: false,
        error: 'You can only review vendors you have completed bookings with'
      });
    }
  
    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_vendorId: {
          userId,
          vendorId
        }
      }
    });
  
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this vendor'
      });
    }
  
    const review = await prisma.review.create({
      data: {
        userId,
        vendorId,
        rating,
        comment
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
  
    // Update vendor rating
    const vendorReviews = await prisma.review.findMany({
      where: { vendorId }
    });
  
    const averageRating = vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length;
  
    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        rating: averageRating,
        totalReviews: vendorReviews.length
      }
    });
  
    return res.status(201).json({   // ✅ added 'return'
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  });
  

  static getUserReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        vendor: {
          select: {
            businessName: true,
            category: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: reviews
    });
  });

  static getWeddingChecklist = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const checklistItems = await prisma.weddingChecklist.findMany({
      where: { userId },
      orderBy: [
        { priority: 'asc' },
        { dueDate: 'asc' }
      ]
    });

    res.status(200).json({
      success: true,
      data: checklistItems
    });
  });

  static createChecklistItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { title, description, category, dueDate, priority } = req.body;

    const checklistItem = await prisma.weddingChecklist.create({
      data: {
        userId,
        title,
        description,
        category,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium'
      }
    });

    res.status(201).json({
      success: true,
      data: checklistItem,
      message: 'Checklist item created successfully'
    });
  });

  static updateChecklistItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const checklistItem = await prisma.weddingChecklist.updateMany({
      where: {
        id,
        userId
      },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: 'Checklist item updated successfully'
    });
  });

  static deleteChecklistItem = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await prisma.weddingChecklist.deleteMany({
      where: {
        id,
        userId
      }
    });

    res.status(200).json({
      success: true,
      message: 'Checklist item deleted successfully'
    });
  });
}







