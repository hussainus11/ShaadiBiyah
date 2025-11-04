import express from 'express';
import { PaymentController } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All payment routes require authentication
router.use(protect);

// Payment routes
router.post('/create-intent', PaymentController.createPaymentIntent);
router.post('/confirm', PaymentController.confirmPayment);
router.get('/history', PaymentController.getPaymentHistory);
router.post('/refund', PaymentController.processRefund);

// Webhook for payment providers
router.post('/webhook/stripe', PaymentController.handleStripeWebhook);

export default router;







