"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
class PaymentController {
}
exports.PaymentController = PaymentController;
_a = PaymentController;
PaymentController.createPaymentIntent = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.body;
    const userId = req.user.id;
    const booking = await prisma.booking.findFirst({
        where: { id: bookingId, userId },
        include: {
            vendor: { select: { businessName: true } },
            service: { select: { name: true } },
        },
    });
    if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    if (booking.status !== 'APPROVED') {
        return res.status(400).json({
            success: false,
            error: 'Payment can only be processed for approved bookings',
        });
    }
    if (booking.paymentStatus === 'COMPLETED') {
        return res.status(400).json({
            success: false,
            error: 'Payment already completed for this booking',
        });
    }
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(booking.totalAmount * 100),
            currency: 'usd',
            metadata: { bookingId, userId, vendorId: booking.vendorId },
            description: `Payment for ${booking.service.name} from ${booking.vendor.businessName}`,
        });
        const payment = await prisma.payment.create({
            data: {
                bookingId,
                amount: booking.totalAmount,
                currency: 'USD',
                paymentMethod: 'stripe',
                transactionId: paymentIntent.id,
                status: 'PENDING',
            },
        });
        return res.status(200).json({
            success: true,
            data: {
                clientSecret: paymentIntent.client_secret,
                paymentId: payment.id,
            },
        });
    }
    catch (error) {
        console.error('Stripe Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create payment intent',
        });
    }
});
PaymentController.confirmPayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { paymentId, paymentIntentId } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            const payment = await prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: 'COMPLETED',
                    gatewayResponse: JSON.parse(JSON.stringify(paymentIntent)),
                },
                include: {
                    booking: {
                        include: {
                            user: { select: { firstName: true, lastName: true, email: true } },
                            vendor: {
                                select: {
                                    businessName: true,
                                    user: { select: { email: true } },
                                },
                            },
                            service: { select: { name: true } },
                        },
                    },
                },
            });
            await prisma.booking.update({
                where: { id: payment.bookingId },
                data: { paymentStatus: 'COMPLETED' },
            });
            return res.status(200).json({
                success: true,
                data: payment,
                message: 'Payment confirmed successfully',
            });
        }
        return res.status(400).json({
            success: false,
            error: 'Payment not completed',
        });
    }
    catch (error) {
        console.error('Payment Confirmation Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to confirm payment',
        });
    }
});
PaymentController.getPaymentHistory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where: { booking: { userId } },
            include: {
                booking: {
                    include: {
                        vendor: { select: { businessName: true, category: true } },
                        service: { select: { name: true } },
                    },
                },
            },
            skip,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' },
        }),
        prisma.payment.count({ where: { booking: { userId } } }),
    ]);
    return res.status(200).json({
        success: true,
        data: payments,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit)),
        },
    });
});
PaymentController.processRefund = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { paymentId, reason } = req.body;
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { booking: true },
        });
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        if (payment.status !== 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'Can only refund completed payments',
            });
        }
        const refund = await stripe.refunds.create({
            payment_intent: payment.transactionId,
            reason: reason || 'requested_by_customer',
        });
        await prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: 'REFUNDED',
                gatewayResponse: JSON.parse(JSON.stringify({
                    ...payment.gatewayResponse,
                    refund,
                })),
            },
        });
        await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: 'REFUNDED' },
        });
        return res.status(200).json({
            success: true,
            data: refund,
            message: 'Refund processed successfully',
        });
    }
    catch (error) {
        console.error('Refund Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process refund',
        });
    }
});
PaymentController.handleStripeWebhook = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (error) {
        console.error('Webhook signature verification failed:', error);
        return res.status(400).send('Webhook Error');
    }
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            await prisma.payment.updateMany({
                where: { transactionId: paymentIntent.id },
                data: {
                    status: 'COMPLETED',
                    gatewayResponse: JSON.parse(JSON.stringify(paymentIntent)),
                },
            });
            const payment = await prisma.payment.findFirst({
                where: { transactionId: paymentIntent.id },
                include: { booking: true },
            });
            if (payment) {
                await prisma.booking.update({
                    where: { id: payment.bookingId },
                    data: { paymentStatus: 'COMPLETED' },
                });
            }
            break;
        }
        case 'payment_intent.payment_failed': {
            const failedPayment = event.data.object;
            await prisma.payment.updateMany({
                where: { transactionId: failedPayment.id },
                data: {
                    status: 'FAILED',
                    gatewayResponse: JSON.parse(JSON.stringify(failedPayment)),
                },
            });
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    return res.status(200).json({ received: true });
});
//# sourceMappingURL=paymentController.js.map