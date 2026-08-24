import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ImageKitService from '../services/imagekit.service.js';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!admin.isActive) {
    throw new ApiError(403, 'Your account is deactivated. Please contact Super Admin.');
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login
  admin.lastLoginAt = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = admin.generateAccessToken();

  const loggedInAdmin = {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    phone: admin.phone,
    avatar: admin.avatar,
    mustChangePassword: admin.mustChangePassword,
    lastLoginAt: admin.lastLoginAt
  };

  const message = admin.mustChangePassword
    ? 'Password change required before accessing the admin dashboard'
    : 'Admin logged in successfully';

  return res
    .status(200)
    .cookie('accessToken', token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          mustChangePassword: admin.mustChangePassword,
          admin: loggedInAdmin,
          token
        },
        message
      )
    );
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'Admin logged out successfully'));
});

export const getCurrentAdmin = asyncHandler(async (req, res) => {
  const safeAdmin = {
    _id: req.admin._id,
    name: req.admin.name,
    email: req.admin.email,
    role: req.admin.role,
    phone: req.admin.phone,
    avatar: req.admin.avatar,
    mustChangePassword: req.admin.mustChangePassword,
    lastLoginAt: req.admin.lastLoginAt,
    createdAt: req.admin.createdAt
  };

  return res
    .status(200)
    .json(new ApiResponse(200, safeAdmin, 'Current admin profile fetched successfully'));
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const admin = await Admin.findById(req.admin._id);

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (name) admin.name = name.trim();
  if (phone !== undefined) admin.phone = phone.trim();

  // If avatar upload is provided
  if (req.file) {
    if (admin.avatar?.fileId) {
      await ImageKitService.deleteFile(admin.avatar.fileId);
    }
    const uploadedAvatar = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      'times-school/admin-avatars'
    );
    admin.avatar = uploadedAvatar;
  }

  await admin.save({ validateBeforeSave: false });

  const updatedAdmin = {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    phone: admin.phone,
    avatar: admin.avatar,
    mustChangePassword: admin.mustChangePassword,
    lastLoginAt: admin.lastLoginAt
  };

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAdmin, 'Profile updated successfully'));
});

export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id);
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  const isCorrect = await admin.isPasswordCorrect(currentPassword);
  if (!isCorrect) {
    throw new ApiError(400, 'Current password entered is incorrect');
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, 'New password must be different from the current password');
  }

  admin.password = newPassword;
  admin.mustChangePassword = false;
  admin.passwordChangedAt = new Date();
  await admin.save();

  // Generate fresh token with updated mustChangePassword status
  const freshToken = admin.generateAccessToken();

  const safeAdmin = {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    phone: admin.phone,
    avatar: admin.avatar,
    mustChangePassword: false,
    lastLoginAt: admin.lastLoginAt,
    passwordChangedAt: admin.passwordChangedAt
  };

  return res
    .status(200)
    .cookie('accessToken', freshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { admin: safeAdmin, token: freshToken },
        'Password changed successfully! You now have full access to the admin dashboard.'
      )
    );
});
