import { Router } from 'express';
import {
  getPublicVideos,
  getAdminVideos,
  getVideoById,
  createVideo,
  updateVideo,
  togglePublishVideo,
  deleteVideo
} from '../controllers/video.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createVideoValidator,
  updateVideoValidator
} from '../validations/video.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicVideos);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminVideos);
router.get('/admin/:id', verifyAdminAccess, getVideoById);
router.post(
  '/',
  verifyAdminAccess,
  upload.single('thumbnail'),
  createVideoValidator,
  validate,
  createVideo
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.single('thumbnail'),
  updateVideoValidator,
  validate,
  updateVideo
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishVideo);
router.delete('/:id', verifyAdminAccess, deleteVideo);

export default router;
