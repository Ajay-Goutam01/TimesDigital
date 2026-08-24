import { Gallery } from '../models/gallery.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicGalleries = asyncHandler(async (req, res) => {
  const { category, isFeatured, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (category) query.category = category;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) query.title = new RegExp(search, 'i');

  const galleries = await Gallery.find(query)
    .sort({ displayOrder: 1, eventDate: -1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, galleries, 'Gallery albums fetched successfully'));
});

export const getPublicGalleryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const gallery = await Gallery.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
    isDeleted: false
  });

  if (!gallery) {
    throw new ApiError(404, `Gallery album '${slug}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, gallery, 'Gallery album details fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminGalleries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) query.title = new RegExp(search, 'i');
  if (category) query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Gallery.countDocuments(query);

  const galleries = await Gallery.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        galleries,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin galleries fetched successfully'
    )
  );
});

export const getGalleryById = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, 'Gallery album not found');
  }
  return res.status(200).json(new ApiResponse(200, gallery, 'Gallery album fetched successfully'));
});

export const createGallery = asyncHandler(async (req, res) => {
  const { title, category, description, eventDate, displayOrder, isFeatured, isPublished } = req.body;

  const slug = await createUniqueSlug(Gallery, title);

  let coverImageData = { url: '', fileId: '', fileName: '' };
  let imagesArray = [];

  if (req.files) {
    if (req.files.coverImage && req.files.coverImage[0]) {
      coverImageData = await ImageKitService.uploadFile(
        req.files.coverImage[0].buffer,
        req.files.coverImage[0].originalname,
        IMAGEKIT_FOLDERS.GALLERY
      );
    }

    if (req.files.images && req.files.images.length > 0) {
      const uploadedFiles = await ImageKitService.uploadMultipleFiles(
        req.files.images,
        IMAGEKIT_FOLDERS.GALLERY
      );
      imagesArray = uploadedFiles.map((f, idx) => ({
        url: f.url,
        fileId: f.fileId,
        fileName: f.fileName,
        caption: '',
        displayOrder: idx
      }));
    }
  }

  // If no cover image uploaded but multiple images exist, use first image as cover
  if (!coverImageData.url && imagesArray.length > 0) {
    coverImageData = {
      url: imagesArray[0].url,
      fileId: imagesArray[0].fileId,
      fileName: imagesArray[0].fileName
    };
  }

  const gallery = await Gallery.create({
    title: title.trim(),
    slug,
    category: category || 'Campus',
    description: description ? description.trim() : '',
    coverImage: coverImageData,
    images: imagesArray,
    eventDate: eventDate ? new Date(eventDate) : undefined,
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res.status(201).json(new ApiResponse(201, gallery, 'Gallery album created successfully'));
});

export const updateGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const gallery = await Gallery.findById(id);

  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, 'Gallery album not found');
  }

  const { title, category, description, eventDate, displayOrder, isFeatured, isPublished } = req.body;

  if (title && title.trim() !== gallery.title) {
    gallery.title = title.trim();
    gallery.slug = await createUniqueSlug(Gallery, title, id);
  }

  if (category) gallery.category = category;
  if (description !== undefined) gallery.description = description.trim();
  if (eventDate !== undefined) gallery.eventDate = eventDate ? new Date(eventDate) : undefined;
  if (displayOrder !== undefined) gallery.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) gallery.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) gallery.isPublished = isPublished === 'true' || isPublished === true;

  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    if (gallery.coverImage?.fileId) {
      await ImageKitService.deleteFile(gallery.coverImage.fileId);
    }
    gallery.coverImage = await ImageKitService.uploadFile(
      req.files.coverImage[0].buffer,
      req.files.coverImage[0].originalname,
      IMAGEKIT_FOLDERS.GALLERY
    );
  }

  await gallery.save();

  return res.status(200).json(new ApiResponse(200, gallery, 'Gallery album updated successfully'));
});

export const addImagesToGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const gallery = await Gallery.findById(id);

  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, 'Gallery album not found');
  }

  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new ApiError(400, 'No image files provided for upload');
  }

  const uploadedFiles = await ImageKitService.uploadMultipleFiles(
    req.files.images,
    IMAGEKIT_FOLDERS.GALLERY
  );

  const startOrder = gallery.images.length;
  const newImages = uploadedFiles.map((f, idx) => ({
    url: f.url,
    fileId: f.fileId,
    fileName: f.fileName,
    caption: '',
    displayOrder: startOrder + idx
  }));

  gallery.images.push(...newImages);
  await gallery.save();

  return res
    .status(200)
    .json(new ApiResponse(200, gallery, 'Images added to gallery successfully'));
});

export const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  const gallery = await Gallery.findById(id);

  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, 'Gallery album not found');
  }

  const imageIndex = gallery.images.findIndex((img) => img._id.toString() === imageId);
  if (imageIndex === -1) {
    throw new ApiError(404, 'Image not found in this album');
  }

  const imageToDelete = gallery.images[imageIndex];
  if (imageToDelete.fileId) {
    await ImageKitService.deleteFile(imageToDelete.fileId);
  }

  gallery.images.splice(imageIndex, 1);
  await gallery.save();

  return res
    .status(200)
    .json(new ApiResponse(200, gallery, 'Image removed from album successfully'));
});

export const togglePublishGallery = asyncHandler(async (req, res) => {
  const gallery = await Gallery.findById(req.params.id);
  if (!gallery || gallery.isDeleted) {
    throw new ApiError(404, 'Gallery album not found');
  }

  gallery.isPublished = !gallery.isPublished;
  await gallery.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      gallery,
      `Gallery album ${gallery.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const deleteGallery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const gallery = await Gallery.findById(id);
  if (!gallery) {
    throw new ApiError(404, 'Gallery album not found');
  }

  if (permanent === 'true') {
    const fileIds = [];
    if (gallery.coverImage?.fileId) fileIds.push(gallery.coverImage.fileId);
    gallery.images.forEach((img) => {
      if (img.fileId) fileIds.push(img.fileId);
    });
    await ImageKitService.bulkDeleteFiles(fileIds);
    await Gallery.findByIdAndDelete(id);
  } else {
    gallery.isDeleted = true;
    await gallery.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Gallery album deleted successfully'));
});
