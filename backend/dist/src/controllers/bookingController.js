"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
class BookingController {
}
exports.BookingController = BookingController;
_a = BookingController;
BookingController.createBooking = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { vendorId, serviceId, eventDate, eventTime, eventDuration, guestCount, location, specialRequests } = req.body;
    const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
            vendor: {
                include: {
                    user: { select: { firstName: true, lastName: true, email: true } }
                }
            }
        }
    });
    if (!service) {
        return res.status(404).json({ success: false, error: 'Service not found' });
    }
    if (service.vendorId !== vendorId) {
        return res.status(400).json({
            success: false,
            error: 'Service does not belong to the specified vendor'
        });
    }
    const basePrice = service.price;
    const additionalCosts = 0;
    const totalAmount = basePrice + additionalCosts;
    const booking = await prisma.booking.create({
        data: {
            userId,
            vendorId,
            serviceId,
            eventDate: new Date(eventDate),
            eventTime,
            eventDuration,
            guestCount,
            location,
            specialRequests,
            basePrice,
            additionalCosts,
            totalAmount
        },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            vendor: {
                select: {
                    businessName: true,
                    user: { select: { email: true } }
                }
            },
            service: true
        }
    });
    if (service.vendor.user?.email) {
        await (0, email_1.sendEmail)({
            email: service.vendor.user.email,
            subject: 'New Booking Request',
            template: 'booking-notification',
            data: {
                vendorName: service.vendor.businessName,
                customerName: `${req.user?.firstName ?? ''} ${req.user?.lastName ?? ''}`,
                serviceName: service.name,
                eventDate,
                totalAmount
            }
        });
    }
    await prisma.notification.create({
        data: {
            userId: vendorId,
            title: 'New Booking Request',
            message: `You have a new booking request from ${booking.user.firstName} ${booking.user.lastName}`,
            type: 'booking'
        }
    });
    return res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking request submitted successfully'
    });
});
BookingController.getUserBookings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { status, page = 1, limit = 10 } = req.query;
    const filters = { userId };
    if (status)
        filters.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where: filters,
            include: {
                vendor: {
                    select: {
                        businessName: true,
                        category: true,
                        rating: true,
                        profileImage: true,
                        location: true,
                        user: { select: { firstName: true, lastName: true, phone: true } }
                    }
                },
                service: { select: { name: true, description: true, price: true } }
            },
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        }),
        prisma.booking.count({ where: filters })
    ]);
    return res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
        }
    });
});
BookingController.getVendorBookings = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { status, page = 1, limit = 10 } = req.query;
    const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } });
    if (!vendor) {
        return res.status(404).json({ success: false, error: 'Vendor profile not found' });
    }
    const filters = { vendorId: vendor.id };
    if (status)
        filters.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where: filters,
            include: {
                user: { select: { firstName: true, lastName: true, email: true, phone: true } },
                service: { select: { name: true, description: true, price: true } }
            },
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        }),
        prisma.booking.count({ where: filters })
    ]);
    return res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
        }
    });
});
BookingController.getBooking = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const booking = await prisma.booking.findFirst({
        where: { id, OR: [{ userId }, { vendor: { userId } }] },
        include: {
            user: { select: { firstName: true, lastName: true, email: true, phone: true } },
            vendor: {
                select: {
                    businessName: true,
                    category: true,
                    rating: true,
                    profileImage: true,
                    location: true,
                    user: { select: { firstName: true, lastName: true, phone: true } }
                }
            },
            service: { select: { name: true, description: true, price: true } },
            payments: true
        }
    });
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    return res.status(200).json({ success: true, data: booking });
});
BookingController.updateBooking = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;
    const booking = await prisma.booking.findFirst({ where: { id, userId } });
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    if (booking.status !== 'PENDING') {
        return res.status(400).json({ success: false, error: 'Cannot update booking that has been processed' });
    }
    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: updateData,
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            vendor: { select: { businessName: true, user: { select: { email: true } } } },
            service: true
        }
    });
    return res.status(200).json({
        success: true,
        data: updatedBooking,
        message: 'Booking updated successfully'
    });
});
BookingController.cancelBooking = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const booking = await prisma.booking.findFirst({ where: { id, userId } });
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    if (!['PENDING', 'APPROVED'].includes(booking.status)) {
        return res.status(400).json({
            success: false,
            error: 'Cannot cancel booking that has been confirmed or completed'
        });
    }
    const cancelledBooking = await prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            vendor: { select: { businessName: true, user: { select: { email: true } } } },
            service: true
        }
    });
    await (0, email_1.sendEmail)({
        email: cancelledBooking.vendor.user.email,
        subject: 'Booking Cancelled',
        template: 'booking-cancellation',
        data: {
            vendorName: cancelledBooking.vendor.businessName,
            customerName: `${cancelledBooking.user.firstName} ${cancelledBooking.user.lastName}`,
            serviceName: cancelledBooking.service.name,
            eventDate: cancelledBooking.eventDate
        }
    });
    return res.status(200).json({
        success: true,
        data: cancelledBooking,
        message: 'Booking cancelled successfully'
    });
});
BookingController.updateBookingStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } });
    if (!vendor) {
        return res.status(404).json({ success: false, error: 'Vendor profile not found' });
    }
    const booking = await prisma.booking.findFirst({ where: { id, vendorId: vendor.id } });
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    const updatedBooking = await prisma.booking.update({
        where: { id },
        data: {
            status: status,
            ...(status === 'APPROVED' && { approvedAt: new Date() }),
            ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
            ...(status === 'COMPLETED' && { completedAt: new Date() })
        },
        include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            vendor: { select: { businessName: true } },
            service: true
        }
    });
    await (0, email_1.sendEmail)({
        email: updatedBooking.user.email,
        subject: 'Booking Status Update',
        template: 'booking-status-update',
        data: {
            customerName: `${updatedBooking.user.firstName} ${updatedBooking.user.lastName}`,
            vendorName: updatedBooking.vendor.businessName,
            serviceName: updatedBooking.service.name,
            status: status.toLowerCase(),
            eventDate: updatedBooking.eventDate
        }
    });
    await prisma.notification.create({
        data: {
            userId: booking.userId,
            title: 'Booking Status Update',
            message: `Your booking with ${updatedBooking.vendor.businessName} has been ${status.toLowerCase()}`,
            type: 'booking'
        }
    });
    return res.status(200).json({
        success: true,
        data: updatedBooking,
        message: 'Booking status updated successfully'
    });
});
//# sourceMappingURL=bookingController.js.map