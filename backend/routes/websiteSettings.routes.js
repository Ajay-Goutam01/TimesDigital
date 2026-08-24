import { Router } from 'express';
import {
  getWebsiteSettings,
  updateWebsiteSettings
} from '../controllers/websiteSettings.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateWebsiteSettingsValidator } from '../validations/websiteSettings.validation.js';

const router = Router();

// Public: Fetch website settings (branding, contact numbers, social links, coords)
router.get('/', getWebsiteSettings);

// Admin: Update website settings and upload logo / coaching logo / favicon
router.put(
  '/',
  verifyAdminAccess,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coachingLogo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]),
  updateWebsiteSettingsValidator,
  validate,
  updateWebsiteSettings
);

export default router;
