import express from 'express';
import { AuthController } from '../controllers/authController';
import { validateRequest, schemas } from '../middleware/validation';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(schemas.register), AuthController.register);
router.post('/login', validateRequest(schemas.login), AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);

// Protected routes
router.use(protect);
router.get('/me', AuthController.getMe);
router.post('/logout', AuthController.logout);
router.put('/change-password', AuthController.changePassword);

export default router;







