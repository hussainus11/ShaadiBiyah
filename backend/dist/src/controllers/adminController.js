"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class AdminController {
}
exports.AdminController = AdminController;
_a = AdminController;
AdminController.getDashboard = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [totalUsers, totalVendors, totalBookings, pendingVendors, totalRevenue, recentBookings, recentUsers] = await Promise.all([
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
AdminController.getUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, role } = req.query;
    const filters = {};
    if (role) {
        filters.role = role;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.user.count({ where: filters });
    res.status(200).json({
        success: true,
        data: users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
AdminController.updateUserStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
AdminController.deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
        where: { id }
    });
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
AdminController.getVendors = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const filters = {};
    if (status === 'pending') {
        filters.isVerified = false;
    }
    else if (status === 'verified') {
        filters.isVerified = true;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.vendor.count({ where: filters });
    res.status(200).json({
        success: true,
        data: vendors,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
AdminController.approveVendor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    res.status(200).json({
        success: true,
        data: vendor,
        message: 'Vendor approved successfully'
    });
});
AdminController.rejectVendor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
    res.status(200).json({
        success: true,
        data: vendor,
        message: 'Vendor rejected successfully'
    });
});
AdminController.getAllBookings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const filters = {};
    if (status) {
        filters.status = status;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.booking.count({ where: filters });
    res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
AdminController.updateBookingStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const booking = await prisma.booking.update({
        where: { id },
        data: { status: status },
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
AdminController.getAnalyticsOverview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [monthlyUsers, monthlyBookings, monthlyRevenue, vendorCategories] = await Promise.all([
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
AdminController.getRevenueAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { period = 'month' } = req.query;
    let dateFilter;
    if (period === 'week') {
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    else if (period === 'month') {
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    else if (period === 'year') {
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
AdminController.getUserAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const [userGrowth, userRoles, activeUsers] = await Promise.all([
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
//# sourceMappingURL=adminController.js.map