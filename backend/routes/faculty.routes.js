import { Router } from 'express';
import {
  getPublicFaculty,
  getPublicFacultyBySlug,
  getAdminFaculty,
  getAdminFacultyById,
  createFaculty,
  updateFaculty,
  togglePublishFaculty,
  toggleFeatureFaculty,
  deleteFaculty
} from '../controllers/faculty.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createFacultyValidator,
  updateFacultyValidator
} from '../validations/faculty.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicFaculty);
router.get('/:slug', getPublicFacultyBySlug);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminFaculty);
router.get('/admin/:id', verifyAdminAccess, getAdminFacultyById);
router.post(
  '/',
  verifyAdminAccess,
  upload.single('profilePhoto'),
  createFacultyValidator,
  validate,
  createFaculty
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.single('profilePhoto'),
  updateFacultyValidator,
  validate,
  updateFaculty
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishFaculty);
router.patch('/:id/toggle-feature', verifyAdminAccess, toggleFeatureFaculty);
router.delete('/:id', verifyAdminAccess, deleteFaculty);

export default router;
