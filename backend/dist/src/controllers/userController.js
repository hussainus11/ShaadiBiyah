"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
    return res.status(200).json({
        success: true,
        data: user
    });
});
UserController.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
UserController.uploadProfileImage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully'
    });
});
UserController.getDashboard = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const [user, bookings, unreadNotifications, checklistItems] = await Promise.all([
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
    const daysUntilWedding = user?.weddingDate
        ? Math.ceil((new Date(user.weddingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;
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
UserController.getUserBookings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const filters = { userId };
    if (status) {
        filters.status = status;
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
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
UserController.getNotifications = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const notifications = await prisma.notification.findMany({
        where: { userId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.notification.count({ where: { userId } });
    res.status(200).json({
        success: true,
        data: notifications,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});
UserController.markNotificationRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
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
UserController.createReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { vendorId, rating, comment } = req.body;
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
    return res.status(201).json({
        success: true,
        data: review,
        message: 'Review created successfully'
    });
});
UserController.getUserReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
UserController.getWeddingChecklist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
UserController.createChecklistItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
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
UserController.updateChecklistItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
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
UserController.deleteChecklistItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
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
//# sourceMappingURL=userController.js.map