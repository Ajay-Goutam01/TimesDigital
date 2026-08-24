import { Router } from 'express';
import {
  submitEnquiry,
  getAdminEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/enquiry.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { enquiryLimiter } from '../middlewares/rateLimiter.middleware.js';
import {
  createEnquiryValidator,
  updateEnquiryStatusValidator
} from '../validations/enquiry.validation.js';

const router = Router();

// Public: Submit enquiry / lead (Rate-limited)
router.post('/', enquiryLimiter, createEnquiryValidator, validate, submitEnquiry);

// Protected Admin routes
router.get('/', verifyAdminAccess, getAdminEnquiries);
router.get('/:id', verifyAdminAccess, getEnquiryById);
router.patch(
  '/:id/status',
  verifyAdminAccess,
  updateEnquiryStatusValidator,
  validate,
  updateEnquiryStatus
);
router.delete('/:id', verifyAdminAccess, deleteEnquiry);

export default router;
