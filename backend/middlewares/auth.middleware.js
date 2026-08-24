import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Admin } from '../models/admin.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request: No authentication token provided');
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_jwt_secret_times_digital'
    );

    const admin = await Admin.findById(decodedToken._id).select('-password');

    if (!admin) {
      throw new ApiError(401, 'Invalid authentication token: Admin user no longer exists');
    }

    if (!admin.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact the administrator.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, error?.message || 'Invalid or expired authentication token');
  }
});

/**
 * Blocks access to normal admin/CMS APIs if the admin has not yet changed their temporary password
 */
export const requirePasswordChanged = (req, res, next) => {
  if (req.admin && req.admin.mustChangePassword) {
    throw new ApiError(
      403,
      'Password change required before accessing the admin panel',
      [],
      '',
      'PASSWORD_CHANGE_REQUIRED'
    );
  }
  next();
};

/**
 * Combined authentication & password-change verification middleware
 */
export const verifyAdminAccess = [verifyJWT, requirePasswordChanged];
