import { Router } from 'express';
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../controllers/admin.controller.js';
import { verifyJWT, requirePasswordChanged } from '../middlewares/auth.middleware.js';
import { requireSuperAdmin } from '../middlewares/admin.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createAdminValidator } from '../validations/auth.validation.js';

const router = Router();

// Protect all admin management routes with Super Admin authorization & password-change check
router.use(verifyJWT, requirePasswordChanged, requireSuperAdmin);

router
  .route('/')
  .get(getAllAdmins)
  .post(upload.single('avatar'), createAdminValidator, validate, createAdmin);

router
  .route('/:id')
  .get(getAdminById)
  .put(upload.single('avatar'), updateAdmin)
  .delete(deleteAdmin);

export default router;
