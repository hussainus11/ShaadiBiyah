import express from 'express';
import { VendorVerificationController } from '../controllers/vendorVerificationController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.use(protect);

// Vendor verification routes
router.post('/vendors/:vendorId/generate-document', VendorVerificationController.generateVerificationDocument);
router.get('/vendors/:vendorId/verification-status', VendorVerificationController.getVerificationStatus);

// Admin routes
router.get('/admin/vendors/pending-verification', authorize('ADMIN'), VendorVerificationController.getPendingVerifications);
router.post('/admin/vendors/:vendorId/review', authorize('ADMIN'), VendorVerificationController.reviewVerification);

// Public routes (for document signing)
router.get('/verify-document/:token', VendorVerificationController.getDocumentForSigning);
router.post('/sign-document/:token', VendorVerificationController.signDocument);

export default router;
