import { Announcement } from '../models/announcement.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateSlug } from '../utils/generateSlug.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicAnnouncements = asyncHandler(async (req, res) => {
  const { category, priority, isTicker, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (isTicker !== undefined) query.isTicker = isTicker === 'true';
  if (search) query.title = new RegExp(search, 'i');

  const announcements = await Announcement.find(query)
    .sort({ priority: -1, date: -1, displayOrder: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, announcements, 'Announcements fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminAnnouncements = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, priority, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) query.title = new RegExp(search, 'i');
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Announcement.countDocuments(query);

  const announcements = await Announcement.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        announcements,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin announcements fetched successfully'
    )
  );
});

export const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement || announcement.isDeleted) {
    throw new ApiError(404, 'Announcement not found');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, announcement, 'Announcement fetched successfully'));
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    category,
    priority,
    link,
    isTicker,
    displayOrder,
    isPublished
  } = req.body;

  let attachmentData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    attachmentData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.ANNOUNCEMENTS
    );
  }

  const slug = `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;

  const announcement = await Announcement.create({
    title: title.trim(),
    slug,
    description,
    date: date ? new Date(date) : new Date(),
    category: category ? category.trim() : 'General',
    priority: priority || 'medium',
    attachment: attachmentData,
    link: link ? link.trim() : '',
    isTicker: isTicker === 'true' || isTicker === true,
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, announcement, 'Announcement created successfully'));
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await Announcement.findById(id);

  if (!announcement || announcement.isDeleted) {
    throw new ApiError(404, 'Announcement not found');
  }

  const {
    title,
    description,
    date,
    category,
    priority,
    link,
    isTicker,
    displayOrder,
    isPublished
  } = req.body;

  if (title) {
    announcement.title = title.trim();
    announcement.slug = `${generateSlug(title)}-${Date.now().toString().slice(-4)}`;
  }

  if (description !== undefined) announcement.description = description;
  if (date !== undefined) announcement.date = date ? new Date(date) : announcement.date;
  if (category !== undefined) announcement.category = category.trim();
  if (priority !== undefined) announcement.priority = priority;
  if (link !== undefined) announcement.link = link.trim();
  if (isTicker !== undefined) announcement.isTicker = isTicker === 'true' || isTicker === true;
  if (displayOrder !== undefined) announcement.displayOrder = parseInt(displayOrder);
  if (isPublished !== undefined) announcement.isPublished = isPublished === 'true' || isPublished === true;

  if (req.file) {
    if (announcement.attachment?.fileId) {
      await ImageKitService.deleteFile(announcement.attachment.fileId);
    }
    announcement.attachment = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.ANNOUNCEMENTS
    );
  }

  await announcement.save();

  return res
    .status(200)
    .json(new ApiResponse(200, announcement, 'Announcement updated successfully'));
});

export const togglePublishAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (!announcement || announcement.isDeleted) {
    throw new ApiError(404, 'Announcement not found');
  }

  announcement.isPublished = !announcement.isPublished;
  await announcement.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      announcement,
      `Announcement ${announcement.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const announcement = await Announcement.findById(id);
  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  if (permanent === 'true') {
    if (announcement.attachment?.fileId) {
      await ImageKitService.deleteFile(announcement.attachment.fileId);
    }
    await Announcement.findByIdAndDelete(id);
  } else {
    announcement.isDeleted = true;
    await announcement.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Announcement deleted successfully'));
});
