import { Router } from 'express';
import {
  getPublicTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  togglePublishTestimonial,
  deleteTestimonial
} from '../controllers/testimonial.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createTestimonialValidator,
  updateTestimonialValidator
} from '../validations/testimonial.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicTestimonials);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminTestimonials);
router.get('/admin/:id', verifyAdminAccess, getTestimonialById);
router.post(
  '/',
  verifyAdminAccess,
  upload.single('photo'),
  createTestimonialValidator,
  validate,
  createTestimonial
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.single('photo'),
  updateTestimonialValidator,
  validate,
  updateTestimonial
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishTestimonial);
router.delete('/:id', verifyAdminAccess, deleteTestimonial);

export default router;
