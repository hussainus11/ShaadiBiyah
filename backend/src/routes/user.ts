import express from 'express';
import { UserController } from '../controllers/userController';
import { validateRequest, schemas } from '../middleware/validation';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// User profile management
router.get('/profile', UserController.getProfile);
router.put('/profile', validateRequest(schemas.updateProfile), UserController.updateProfile);
router.post('/profile/image', UserController.uploadProfileImage);

// User dashboard
router.get('/dashboard', UserController.getDashboard);
router.get('/bookings', UserController.getUserBookings);
router.get('/notifications', UserController.getNotifications);
router.put('/notifications/:id/read', UserController.markNotificationRead);

// Reviews
router.post('/reviews', validateRequest(schemas.createReview), UserController.createReview);
router.get('/reviews', UserController.getUserReviews);

// Wedding checklist
router.get('/checklist', UserController.getWeddingChecklist);
router.post('/checklist', UserController.createChecklistItem);
router.put('/checklist/:id', UserController.updateChecklistItem);
router.delete('/checklist/:id', UserController.deleteChecklistItem);

export default router;







