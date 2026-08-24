import { Router } from 'express';
import {
  getPublicBatches,
  getPublicBatchBySlug,
  getAdminBatches,
  getAdminBatchById,
  createBatch,
  updateBatch,
  togglePublishBatch,
  toggleFeatureBatch,
  deleteBatch
} from '../controllers/batch.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createBatchValidator,
  updateBatchValidator
} from '../validations/batch.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicBatches);
router.get('/:slug', getPublicBatchBySlug);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminBatches);
router.get('/admin/:id', verifyAdminAccess, getAdminBatchById);
router.post(
  '/',
  verifyAdminAccess,
  upload.fields([
    { name: 'batchImage', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  createBatchValidator,
  validate,
  createBatch
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.fields([
    { name: 'batchImage', maxCount: 1 },
    { name: 'brochure', maxCount: 1 }
  ]),
  updateBatchValidator,
  validate,
  updateBatch
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishBatch);
router.patch('/:id/toggle-feature', verifyAdminAccess, toggleFeatureBatch);
router.delete('/:id', verifyAdminAccess, deleteBatch);

export default router;
