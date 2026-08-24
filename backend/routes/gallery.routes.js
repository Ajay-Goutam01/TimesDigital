import { Router } from 'express';
import {
  getPublicGalleries,
  getPublicGalleryBySlug,
  getAdminGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  addImagesToGallery,
  deleteGalleryImage,
  togglePublishGallery,
  deleteGallery
} from '../controllers/gallery.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createGalleryValidator,
  updateGalleryValidator
} from '../validations/gallery.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicGalleries);
router.get('/:slug', getPublicGalleryBySlug);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminGalleries);
router.get('/admin/:id', verifyAdminAccess, getGalleryById);
router.post(
  '/',
  verifyAdminAccess,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 20 }
  ]),
  createGalleryValidator,
  validate,
  createGallery
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.fields([{ name: 'coverImage', maxCount: 1 }]),
  updateGalleryValidator,
  validate,
  updateGallery
);
router.post(
  '/:id/images',
  verifyAdminAccess,
  upload.fields([{ name: 'images', maxCount: 20 }]),
  addImagesToGallery
);
router.delete('/:id/images/:imageId', verifyAdminAccess, deleteGalleryImage);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishGallery);
router.delete('/:id', verifyAdminAccess, deleteGallery);

export default router;
