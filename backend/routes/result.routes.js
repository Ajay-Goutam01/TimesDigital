import { Router } from 'express';
import {
  getPublicResults,
  getAdminResults,
  getResultById,
  createResult,
  updateResult,
  togglePublishResult,
  toggleFeatureResult,
  deleteResult
} from '../controllers/result.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createResultValidator,
  updateResultValidator
} from '../validations/result.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicResults);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminResults);
router.get('/admin/:id', verifyAdminAccess, getResultById);
router.post(
  '/',
  verifyAdminAccess,
  upload.single('studentPhoto'),
  createResultValidator,
  validate,
  createResult
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.single('studentPhoto'),
  updateResultValidator,
  validate,
  updateResult
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishResult);
router.patch('/:id/toggle-feature', verifyAdminAccess, toggleFeatureResult);
router.delete('/:id', verifyAdminAccess, deleteResult);

export default router;
