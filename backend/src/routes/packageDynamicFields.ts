import express from 'express';
import { PackageDynamicFieldsController } from '../controllers/packageDynamicFieldsController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Package dynamic fields management routes
router.get('/packages/:packageId/fields', authorize('VENDOR'), PackageDynamicFieldsController.getPackageDynamicFields);
router.post('/packages/:packageId/fields', authorize('VENDOR'), PackageDynamicFieldsController.addPackageDynamicField);
router.put('/packages/fields/:fieldId', authorize('VENDOR'), PackageDynamicFieldsController.updatePackageDynamicField);
router.delete('/packages/fields/:fieldId', authorize('VENDOR'), PackageDynamicFieldsController.deletePackageDynamicField);
router.put('/packages/:packageId/fields/values', authorize('VENDOR'), PackageDynamicFieldsController.updatePackageFieldValues);
router.put('/packages/:packageId/fields/reorder', authorize('VENDOR'), PackageDynamicFieldsController.reorderPackageFields);

export default router;
