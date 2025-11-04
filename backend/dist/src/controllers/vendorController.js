"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class VendorController {
}
exports.VendorController = VendorController;
_a = VendorController;
VendorController.getVendors = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, location, minPrice, maxPrice, rating, page = 1, limit = 10 } = req.query;
    const filters = {
        isActive: true,
        isVerified: true
    };
    if (category)
        filters.category = category;
    if (location)
        filters.location = {
            contains: location,
            mode: 'insensitive'
        };
    if (minPrice || maxPrice) {
        filters.basePrice = {};
        if (minPrice)
            filters.basePrice.gte = parseFloat(minPrice);
        if (maxPrice)
            filters.basePrice.lte = parseFloat(maxPrice);
    }
    if (rating)
        filters.rating = {
            gte: parseFloat(rating)
        };
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
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
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
VendorController.getVendor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
VendorController.getVendorServices = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
VendorController.getVendorReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.review.count({ where: { vendorId: id } });
    return res.status(200).json({
        success: true,
        data: reviews,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
VendorController.registerVendor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const vendorData = req.body;
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
            category: vendorData.category
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
    await prisma.user.update({
        where: { id: userId },
        data: { role: 'VENDOR' }
    });
    return res.status(201).json({
        success: true,
        data: vendor,
        message: 'Vendor registration submitted for review'
    });
});
VendorController.getMyVendorProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
VendorController.updateVendorProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
VendorController.createService = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
VendorController.updateService = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
VendorController.deleteService = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
VendorController.getMyBookings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
    const filters = { vendorId: vendor.id };
    if (status)
        filters.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.booking.count({ where: filters });
    return res.status(200).json({
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
VendorController.updateBookingStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
            status: status,
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
VendorController.getVendorAnalytics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
    const [totalBookings, pendingBookings, completedBookings, totalEarnings, monthlyEarnings, reviews] = await Promise.all([
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
//# sourceMappingURL=vendorController.js.map