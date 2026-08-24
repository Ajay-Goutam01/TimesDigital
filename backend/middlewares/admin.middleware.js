import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../utils/constants.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      throw new ApiError(401, 'Unauthorized request: Admin authentication required');
    }

    if (!allowedRoles.includes(req.admin.role)) {
      throw new ApiError(
        403,
        `Access forbidden: You need one of the following roles [${allowedRoles.join(', ')}] to perform this action`
      );
    }

    next();
  };
};

export const requireSuperAdmin = requireRole(ROLES.SUPERADMIN);
