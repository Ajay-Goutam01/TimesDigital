import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicVideos = asyncHandler(async (req, res) => {
  const { category, isFeatured, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (category) query.category = category;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) query.title = new RegExp(search, 'i');

  const videos = await Video.find(query).sort({ displayOrder: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, 'Videos fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) query.title = new RegExp(search, 'i');
  if (category) query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Video.countDocuments(query);

  const videos = await Video.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin videos fetched successfully'
    )
  );
});

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video || video.isDeleted) {
    throw new ApiError(404, 'Video record not found');
  }
  return res.status(200).json(new ApiResponse(200, video, 'Video record fetched successfully'));
});

export const createVideo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    videoUrl,
    videoType,
    category,
    duration,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  const slug = await createUniqueSlug(Video, title);

  let thumbnailData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    thumbnailData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.VIDEOS
    );
  }

  const video = await Video.create({
    title: title.trim(),
    slug,
    description: description ? description.trim() : '',
    videoUrl: videoUrl.trim(),
    videoType: videoType || 'youtube',
    thumbnail: thumbnailData,
    category: category || 'Campus',
    duration: duration ? duration.trim() : '',
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res.status(201).json(new ApiResponse(201, video, 'Video added successfully'));
});

export const updateVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video || video.isDeleted) {
    throw new ApiError(404, 'Video record not found');
  }

  const {
    title,
    description,
    videoUrl,
    videoType,
    category,
    duration,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  if (title && title.trim() !== video.title) {
    video.title = title.trim();
    video.slug = await createUniqueSlug(Video, title, id);
  }

  if (description !== undefined) video.description = description.trim();
  if (videoUrl) video.videoUrl = videoUrl.trim();
  if (videoType) video.videoType = videoType;
  if (category) video.category = category;
  if (duration !== undefined) video.duration = duration.trim();
  if (displayOrder !== undefined) video.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) video.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) video.isPublished = isPublished === 'true' || isPublished === true;

  if (req.file) {
    if (video.thumbnail?.fileId) {
      await ImageKitService.deleteFile(video.thumbnail.fileId);
    }
    video.thumbnail = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.VIDEOS
    );
  }

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, 'Video record updated successfully'));
});

export const togglePublishVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video || video.isDeleted) {
    throw new ApiError(404, 'Video record not found');
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      video,
      `Video ${video.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const video = await Video.findById(id);
  if (!video) {
    throw new ApiError(404, 'Video record not found');
  }

  if (permanent === 'true') {
    if (video.thumbnail?.fileId) {
      await ImageKitService.deleteFile(video.thumbnail.fileId);
    }
    await Video.findByIdAndDelete(id);
  } else {
    video.isDeleted = true;
    await video.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Video deleted successfully'));
});
