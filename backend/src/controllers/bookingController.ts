import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';

const prisma = new PrismaClient();

export class BookingController {
  static createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
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

    // Optional email sending
    if (service.vendor.user?.email) {
      await sendEmail({
        to: service.vendor.user.email,
        subject: 'New Booking Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Booking Request</h2>
            <p>Hello ${service.vendor.businessName},</p>
            <p>You have received a new booking request:</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
              <h3>Booking Details:</h3>
              <p><strong>Customer:</strong> ${req.user?.firstName ?? ''} ${req.user?.lastName ?? ''}</p>
              <p><strong>Service:</strong> ${service.name}</p>
              <p><strong>Date:</strong> ${eventDate}</p>
              <p><strong>Amount:</strong> $${totalAmount}</p>
            </div>
          </div>
        `
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

  static getUserBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const filters: any = { userId };
    if (status) filters.status = status;

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

  static getVendorBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const vendor = await prisma.vendor.findUnique({ where: { userId }, select: { id: true } });

    if (!vendor) {
      return res.status(404).json({ success: false, error: 'Vendor profile not found' });
    }

    const filters: any = { vendorId: vendor.id };
    if (status) filters.status = status;

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

  static getBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  static updateBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  static cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
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

    await sendEmail({
      to: cancelledBooking.vendor.user.email,
      subject: 'Booking Cancelled',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Booking Cancelled</h2>
          <p>Hello ${cancelledBooking.vendor.businessName},</p>
          <p>A booking has been cancelled:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <h3>Booking Details:</h3>
            <p><strong>Customer:</strong> ${cancelledBooking.user.firstName} ${cancelledBooking.user.lastName}</p>
            <p><strong>Service:</strong> ${cancelledBooking.service.name}</p>
            <p><strong>Date:</strong> ${cancelledBooking.eventDate}</p>
          </div>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      data: cancelledBooking,
      message: 'Booking cancelled successfully'
    });
  });

  static updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
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
        status: status as any,
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

    await sendEmail({
      to: updatedBooking.user.email,
      subject: 'Booking Status Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Booking Status Update</h2>
          <p>Hello ${updatedBooking.user.firstName} ${updatedBooking.user.lastName},</p>
          <p>Your booking status has been updated:</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <h3>Booking Details:</h3>
            <p><strong>Vendor:</strong> ${updatedBooking.vendor.businessName}</p>
            <p><strong>Service:</strong> ${updatedBooking.service.name}</p>
            <p><strong>Status:</strong> ${status.toLowerCase()}</p>
            <p><strong>Date:</strong> ${updatedBooking.eventDate}</p>
          </div>
        </div>
      `
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
}




