import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export class AdminController {
  static getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
      totalUsers,
      totalVendors,
      totalBookings,
      pendingVendors,
      totalRevenue,
      recentBookings,
      recentUsers
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.vendor.count(),
      prisma.booking.count(),
      prisma.vendor.count({ where: { isVerified: false } }),
      prisma.booking.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      prisma.booking.findMany({
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          vendor: {
            select: {
              businessName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.user.findMany({
        where: { role: 'USER' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalVendors,
          totalBookings,
          pendingVendors,
          totalRevenue: totalRevenue._sum.totalAmount || 0
        },
        recentBookings,
        recentUsers
      }
    });
  });

  static getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, role } = req.query;

    const filters: any = {};
    if (role) {
      filters.role = role;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const users = await prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where: filters });

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  });

  static updateUserStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { isVerified } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isVerified },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true
      }
    });

    res.status(200).json({
      success: true,
      data: user,
      message: 'User status updated successfully'
    });
  });

  static deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  });

  static getVendors = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, status } = req.query;

    const filters: any = {};
    if (status === 'pending') {
      filters.isVerified = false;
    } else if (status === 'verified') {
      filters.isVerified = true;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const vendors = await prisma.vendor.findMany({
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
        _count: {
          select: {
            bookings: true,
            reviews: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.vendor.count({ where: filters });

    res.status(200).json({
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

  static approveVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isVerified: true },
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

    // Send approval email
    // await sendEmail({
    //   email: vendor.user.email,
    //   subject: 'Vendor Application Approved',
    //   template: 'vendor-approved',
    //   data: {
    //     vendorName: vendor.businessName,
    //     firstName: vendor.user.firstName
    //   }
    // });

    res.status(200).json({
      success: true,
      data: vendor,
      message: 'Vendor approved successfully'
    });
  });

  static rejectVendor = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;

    const vendor = await prisma.vendor.update({
      where: { id },
      data: { isActive: false },
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

    // Send rejection email
    // await sendEmail({
    //   email: vendor.user.email,
    //   subject: 'Vendor Application Status',
    //   template: 'vendor-rejected',
    //   data: {
    //     vendorName: vendor.businessName,
    //     firstName: vendor.user.firstName,
    //     reason
    //   }
    // });

    res.status(200).json({
      success: true,
      data: vendor,
      message: 'Vendor rejected successfully'
    });
  });

  static getAllBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = 1, limit = 10, status } = req.query;

    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const bookings = await prisma.booking.findMany({
      where: filters,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        vendor: {
          select: {
            businessName: true,
            category: true
          }
        },
        service: {
          select: {
            name: true,
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

  static updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status: status as any },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        vendor: {
          select: {
            businessName: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking status updated successfully'
    });
  });

  static getAnalyticsOverview = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
      monthlyUsers,
      monthlyBookings,
      monthlyRevenue,
      vendorCategories
    ] = await Promise.all([
      prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        },
        _count: { id: true }
      }),
      prisma.booking.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        },
        _count: { id: true }
      }),
      prisma.booking.groupBy({
        by: ['createdAt'],
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        },
        _sum: { totalAmount: true }
      }),
      prisma.vendor.groupBy({
        by: ['category'],
        _count: { id: true }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        monthlyUsers,
        monthlyBookings,
        monthlyRevenue,
        vendorCategories
      }
    });
  });

  static getRevenueAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { period = 'month' } = req.query;

    let dateFilter;
    if (period === 'week') {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === 'year') {
      dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    }

    const revenue = await prisma.booking.aggregate({
      where: {
        paymentStatus: 'COMPLETED',
        createdAt: {
          gte: dateFilter
        }
      },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: revenue._sum.totalAmount || 0,
        totalTransactions: revenue._count.id || 0,
        averageTransaction: revenue._count.id > 0 ? (revenue._sum.totalAmount || 0) / revenue._count.id : 0
      }
    });
  });

  static getUserAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
    const [
      userGrowth,
      userRoles,
      activeUsers
    ] = await Promise.all([
      prisma.user.groupBy({
        by: ['createdAt'],
        _count: { id: true }
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true }
      }),
      prisma.user.count({
        where: {
          bookings: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        userRoles,
        activeUsers
      }
    });
  });
}







