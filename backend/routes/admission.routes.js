import { Router } from 'express';
import {
  submitAdmissionApplication,
  getAdminAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
  deleteAdmission
} from '../controllers/admission.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { admissionLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  createAdmissionValidator,
  updateAdmissionStatusValidator
} from '../validations/admission.validation.js';

const router = Router();

// Public: Submit admission application (Rate-limited)
router.post(
  '/',
  admissionLimiter,
  upload.fields([{ name: 'documents', maxCount: 5 }]),
  createAdmissionValidator,
  validate,
  submitAdmissionApplication
);

// Protected Admin routes
router.get('/', verifyAdminAccess, getAdminAdmissions);
router.get('/:id', verifyAdminAccess, getAdmissionById);
router.patch(
  '/:id/status',
  verifyAdminAccess,
  updateAdmissionStatusValidator,
  validate,
  updateAdmissionStatus
);
router.delete('/:id', verifyAdminAccess, deleteAdmission);

export default router;
