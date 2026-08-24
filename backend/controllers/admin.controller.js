import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ImageKitService from '../services/imagekit.service.js';

export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, admins, 'Admins fetched successfully'));
});

export const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id).select('-password');
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }
  return res.status(200).json(new ApiResponse(200, admin, 'Admin details fetched successfully'));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new ApiError(409, 'An admin account with this email already exists');
  }

  let avatarData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    avatarData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      'times-school/admin-avatars'
    );
  }

  const newAdmin = await Admin.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: role || 'admin',
    phone: phone ? phone.trim() : '',
    avatar: avatarData,
    isActive: true
  });

  const createdAdmin = await Admin.findById(newAdmin._id).select('-password');

  return res
    .status(201)
    .json(new ApiResponse(201, createdAdmin, 'New admin account created successfully'));
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, phone, isActive, password } = req.body;

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (name) admin.name = name.trim();
  if (role) admin.role = role;
  if (phone !== undefined) admin.phone = phone.trim();
  if (isActive !== undefined) admin.isActive = Boolean(isActive);
  if (password) admin.password = password;

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

  await admin.save();

  const updatedAdmin = await Admin.findById(id).select('-password');
  return res.status(200).json(new ApiResponse(200, updatedAdmin, 'Admin account updated successfully'));
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (req.admin._id.toString() === id) {
    throw new ApiError(400, 'You cannot delete your own admin account');
  }

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (admin.avatar?.fileId) {
    await ImageKitService.deleteFile(admin.avatar.fileId);
  }

  await Admin.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, 'Admin deleted successfully'));
});
