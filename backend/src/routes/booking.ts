import express from 'express';
import { BookingController } from '../controllers/bookingController';
import { validateRequest, schemas } from '../middleware/validation';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// User booking routes
router.post('/', validateRequest(schemas.createBooking), BookingController.createBooking);
router.get('/my', BookingController.getUserBookings);
router.get('/:id', BookingController.getBooking);
router.put('/:id', BookingController.updateBooking);
router.delete('/:id', BookingController.cancelBooking);

// Vendor booking routes
router.get('/vendor/my', authorize('VENDOR'), BookingController.getVendorBookings);
router.put('/:id/status', authorize('VENDOR'), validateRequest(schemas.updateBookingStatus), BookingController.updateBookingStatus);

export default router;







