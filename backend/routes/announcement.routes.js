import { Router } from 'express';
import {
  getPublicAnnouncements,
  getAdminAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  togglePublishAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createAnnouncementValidator,
  updateAnnouncementValidator
} from '../validations/announcement.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicAnnouncements);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminAnnouncements);
router.get('/admin/:id', verifyAdminAccess, getAnnouncementById);
router.post(
  '/',
  verifyAdminAccess,
  upload.single('attachment'),
  createAnnouncementValidator,
  validate,
  createAnnouncement
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.single('attachment'),
  updateAnnouncementValidator,
  validate,
  updateAnnouncement
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishAnnouncement);
router.delete('/:id', verifyAdminAccess, deleteAnnouncement);

export default router;
