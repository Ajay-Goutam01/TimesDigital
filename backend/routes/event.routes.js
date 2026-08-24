import { Router } from 'express';
import {
  getPublicEvents,
  getPublicEventBySlug,
  getAdminEvents,
  getEventById,
  createEvent,
  updateEvent,
  togglePublishEvent,
  deleteEvent
} from '../controllers/event.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createEventValidator,
  updateEventValidator
} from '../validations/event.validation.js';

const router = Router();

// Public routes
router.get('/', getPublicEvents);
router.get('/:slug', getPublicEventBySlug);

// Protected Admin routes
router.get('/admin/list', verifyAdminAccess, getAdminEvents);
router.get('/admin/:id', verifyAdminAccess, getEventById);
router.post(
  '/',
  verifyAdminAccess,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  createEventValidator,
  validate,
  createEvent
);
router.put(
  '/:id',
  verifyAdminAccess,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  updateEventValidator,
  validate,
  updateEvent
);
router.patch('/:id/toggle-publish', verifyAdminAccess, togglePublishEvent);
router.delete('/:id', verifyAdminAccess, deleteEvent);

export default router;
