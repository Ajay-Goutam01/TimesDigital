import { Router } from 'express';
import {
  getPublicFacilities,
  getPublicFacilityBySlug,
  getAdminFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  togglePublishFacility,
  deleteFacility
} from '../controllers/facility.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createFacilityValidator,
  updateFacilityValidator
} from '../validations/facility.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicFacilities);
router.get('/:slug', getPublicFacilityBySlug);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminFacilities);
router.get('/admin/:id', verifyAdminAccess, getFacilityById);
router.post(
  '/',
  verifyAdminAccess,
  upload.fields([{ name: 'images', maxCount: 10 }]),
  createFacilityValidator,
  validate,
  createFacility
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.fields([{ name: 'images', maxCount: 10 }]),
  updateFacilityValidator,
  validate,
  updateFacility
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishFacility);
router.delete('/:id', verifyAdminAccess, deleteFacility);

export default router;
