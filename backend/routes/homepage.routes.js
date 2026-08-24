import { Router } from 'express';
import {
  getHomepageData,
  updateHomepageData
} from '../controllers/homepage.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

// Public: Fetch homepage dynamic CMS config
router.get('/', getHomepageData);

// Admin: Update homepage dynamic CMS sections & banners
router.put(
  '/',
  verifyAdminAccess,
  upload.fields([
    { name: 'heroBanner', maxCount: 1 },
    { name: 'hostelImage', maxCount: 1 },
    { name: 'scholarshipImage', maxCount: 1 },
    { name: 'ctaBgImage', maxCount: 1 }
  ]),
  updateHomepageData
);

export default router;
