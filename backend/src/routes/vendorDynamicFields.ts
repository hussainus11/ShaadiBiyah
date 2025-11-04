import express from 'express';
import { VendorDynamicFieldsController } from '../controllers/vendorDynamicFieldsController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dynamic fields management routes
router.get('/fields', authorize('VENDOR'), VendorDynamicFieldsController.getDynamicFields);
router.post('/fields', authorize('VENDOR'), VendorDynamicFieldsController.addDynamicField);
router.put('/fields/:fieldId', authorize('VENDOR'), VendorDynamicFieldsController.updateDynamicField);
router.delete('/fields/:fieldId', authorize('VENDOR'), VendorDynamicFieldsController.deleteDynamicField);
router.put('/fields/values', authorize('VENDOR'), VendorDynamicFieldsController.updateFieldValues);
router.put('/fields/reorder', authorize('VENDOR'), VendorDynamicFieldsController.reorderFields);

export default router;
