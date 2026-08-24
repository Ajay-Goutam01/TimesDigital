import { Router } from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  updateAdminProfile,
  changeAdminPassword
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
} from '../validations/auth.validation.js';

const router = Router();

// Public auth routes
router.post('/login', authLimiter, loginValidator, validate, loginAdmin);
router.post('/logout', logoutAdmin);

// Protected admin auth routes (allowed even if mustChangePassword === true)
router.get('/me', verifyJWT, getCurrentAdmin);
router.patch(
  '/profile',
  verifyJWT,
  upload.single('avatar'),
  updateProfileValidator,
  validate,
  updateAdminProfile
);

// Support both PATCH and POST for password change
router.patch(
  '/change-password',
  verifyJWT,
  changePasswordValidator,
  validate,
  changeAdminPassword
);

router.post(
  '/change-password',
  verifyJWT,
  changePasswordValidator,
  validate,
  changeAdminPassword
);

export default router;
