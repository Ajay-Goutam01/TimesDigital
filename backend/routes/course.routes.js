import { Router } from 'express';
import {
  getPublicCourses,
  getPublicCourseBySlug,
  getAdminCourses,
  getAdminCourseById,
  createCourse,
  updateCourse,
  togglePublishCourse,
  toggleFeatureCourse,
  deleteCourse
} from '../controllers/course.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createCourseValidator,
  updateCourseValidator
} from '../validations/course.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicCourses);
router.get('/:slug', getPublicCourseBySlug);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminCourses);
router.get('/admin/:id', verifyAdminAccess, getAdminCourseById);
router.post(
  '/',
  verifyAdminAccess,
  upload.single('image'),
  createCourseValidator,
  validate,
  createCourse
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.single('image'),
  updateCourseValidator,
  validate,
  updateCourse
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishCourse);
router.patch('/:id/toggle-feature', verifyAdminAccess, toggleFeatureCourse);
router.delete('/:id', verifyAdminAccess, deleteCourse);

export default router;
