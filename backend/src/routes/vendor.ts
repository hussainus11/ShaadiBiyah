import express from 'express';
import { VendorController } from '../controllers/vendorController';
import { validateRequest, schemas } from '../middleware/validation';
import { protect, authorize, requireVendorVerification } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', VendorController.getVendors);
router.get('/:id', VendorController.getVendor);
router.get('/:id/services', VendorController.getVendorServices);
router.get('/:id/reviews', VendorController.getVendorReviews);

// Protected routes
router.use(protect);

// Vendor registration and management
router.post('/register', validateRequest(schemas.vendorRegistration), VendorController.registerVendor);
router.put('/profile', authorize('VENDOR'), VendorController.updateVendorProfile);
router.get('/profile/me', authorize('VENDOR'), VendorController.getMyVendorProfile);

// Service management (requires verification)
router.post('/services', protect, requireVendorVerification, VendorController.createService);
router.put('/services/:serviceId', protect, requireVendorVerification, VendorController.updateService);
router.delete('/services/:serviceId', protect, requireVendorVerification, VendorController.deleteService);

// Booking management (requires verification)
router.get('/bookings/my', protect, requireVendorVerification, VendorController.getMyBookings);
router.put('/bookings/:bookingId/status', protect, requireVendorVerification, VendorController.updateBookingStatus);

// Analytics (requires verification)
router.get('/analytics/dashboard', protect, requireVendorVerification, VendorController.getVendorAnalytics);

export default router;




