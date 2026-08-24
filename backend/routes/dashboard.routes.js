import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { verifyAdminAccess } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected: Get aggregated admin dashboard statistics
router.get('/stats', verifyAdminAccess, getDashboardStats);

export default router;
