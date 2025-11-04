import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class VendorController {
  static getVendors = asyncHandler(async (req: Request, res: Response) => {
    const { category, location, minPrice, maxPrice, rating, page = 1, limit = 10 } = req.query;

    const filters: any = {
      isActive: true,
      isVerified: true
    };

    if (category) filters.category = category;
    if (location)
      filters.location = {
        contains: location as string,
        mode: 'insensitive'
      };

    if (minPrice || maxPrice) {
      filters.basePrice = {};
      if (minPrice) filters.basePrice.gte = parseFloat(minPrice as string);
      if (maxPrice) filters.basePrice.lte = parseFloat(maxPrice as string);
    }

    if (rating)
      filters.rating = {
        gte: parseFloat(rating as string)
      };

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const vendors = await prisma.vendor.findMany({
      where: filters,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        },
        services: {
          where: { isActive: true }
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: [
        { rating: 'desc' },
        { totalReviews: 'desc' }
      ]
    });

    const total = await prisma.vendor.count({ where: filters });

    return res.status(200).json({
      success: true,
      data: vendors,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });

  static getVendor = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
            email: true,
            phone: true
          }
        },
        services: {
          where: { isActive: true }
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor
    });
  });

  static getVendorServices = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const services = await prisma.service.findMany({
      where: {
        vendorId: id,
        isActive: true
      },
      orderBy: { price: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: services
    });
  });

  static getVendorReviews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await prisma.review.findMany({
      where: { vendorId: id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.review.count({ where: { vendorId: id } });

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });

  static registerVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { dynamicFields, ...vendorData } = req.body;

    const existingVendor = await prisma.vendor.findUnique({
      where: { userId }
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        error: 'User is already registered as a vendor'
      });
    }

    const vendor = await prisma.vendor.create({
      data: {
        ...vendorData,
        userId,
        category: vendorData.category as any,
        verificationStatus: 'PENDING'
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Create dynamic fields if provided
    if (dynamicFields && dynamicFields.length > 0) {
      await prisma.vendorDynamicField.createMany({
        data: dynamicFields.map((field: any, index: number) => ({
          vendorId: vendor.id,
          fieldName: `customField_${Date.now()}_${index}`,
          fieldLabel: field.fieldLabel || 'Custom Field',
          fieldType: field.fieldType || 'text',
          fieldOptions: field.fieldOptions || [],
          fieldValue: field.fieldValue || '',
          isRequired: field.isRequired || false,
          displayOrder: index
        }))
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'VENDOR' }
    });

    return res.status(201).json({
      success: true,
      data: vendor,
      message: 'Vendor registration submitted. Please complete verification to activate your account.'
    });
  });

  static getMyVendorProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        services: {
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                profileImage: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        verificationDocuments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        dynamicFields: {
          orderBy: { displayOrder: 'asc' }
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
            services: true
          }
        }
      }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: vendor
    });
  });

  static updateVendorProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const updateData = req.body;

    const vendor = await prisma.vendor.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: vendor,
      message: 'Vendor profile updated successfully'
    });
  });

  static createService = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const serviceData = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        vendorId: vendor.id
      }
    });

    return res.status(201).json({
      success: true,
      data: service,
      message: 'Service created successfully'
    });
  });

  static updateService = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { serviceId } = req.params;
    const updateData = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const service = await prisma.service.updateMany({
      where: { id: serviceId, vendorId: vendor.id },
      data: updateData
    });

    return res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  });

  static deleteService = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { serviceId } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    await prisma.service.deleteMany({
      where: { id: serviceId, vendorId: vendor.id }
    });

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  });

  static getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const filters: any = { vendorId: vendor.id };
    if (status) filters.status = status;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const bookings = await prisma.booking.findMany({
      where: filters,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        service: true
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.booking.count({ where: filters });

    return res.status(200).json({
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

  static updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { bookingId } = req.params;
    const { status } = req.body;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const booking = await prisma.booking.updateMany({
      where: { id: bookingId, vendorId: vendor.id },
      data: {
        status: status as any,
        ...(status === 'APPROVED' && { approvedAt: new Date() }),
        ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      }
    });

    return res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking status updated successfully'
    });
  });

  static getVendorAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        error: 'Vendor profile not found'
      });
    }

    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      totalEarnings,
      monthlyEarnings,
      reviews
    ] = await Promise.all([
      prisma.booking.count({ where: { vendorId: vendor.id } }),
      prisma.booking.count({ where: { vendorId: vendor.id, status: 'PENDING' } }),
      prisma.booking.count({ where: { vendorId: vendor.id, status: 'COMPLETED' } }),
      prisma.booking.aggregate({
        where: { vendorId: vendor.id, paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      prisma.booking.aggregate({
        where: {
          vendorId: vendor.id,
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        },
        _sum: { totalAmount: true }
      }),
      prisma.review.findMany({
        where: { vendorId: vendor.id },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalEarnings: totalEarnings._sum.totalAmount || 0,
        monthlyEarnings: monthlyEarnings._sum.totalAmount || 0,
        recentReviews: reviews
      }
    });
  });
}




