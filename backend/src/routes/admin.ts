import express from 'express';
import { AdminController } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('ADMIN'));

// Admin dashboard
router.get('/dashboard', AdminController.getDashboard);

// User management
router.get('/users', AdminController.getUsers);
router.put('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);

// Vendor management
router.get('/vendors', AdminController.getVendors);
router.put('/vendors/:id/approve', AdminController.approveVendor);
router.put('/vendors/:id/reject', AdminController.rejectVendor);

// Booking management
router.get('/bookings', AdminController.getAllBookings);
router.put('/bookings/:id/status', AdminController.updateBookingStatus);

// Analytics
router.get('/analytics/overview', AdminController.getAnalyticsOverview);
router.get('/analytics/revenue', AdminController.getRevenueAnalytics);
router.get('/analytics/users', AdminController.getUserAnalytics);

export default router;







