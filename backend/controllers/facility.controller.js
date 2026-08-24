import { Facility } from '../models/facility.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicFacilities = asyncHandler(async (req, res) => {
  const { category, isFeatured, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (category) query.category = category;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) query.title = new RegExp(search, 'i');

  const facilities = await Facility.find(query).sort({ displayOrder: 1, createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, facilities, 'Facilities fetched successfully'));
});

export const getPublicFacilityBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const facility = await Facility.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
    isDeleted: false
  });

  if (!facility) {
    throw new ApiError(404, `Facility '${slug}' not found`);
  }

  return res.status(200).json(new ApiResponse(200, facility, 'Facility details fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminFacilities = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) query.title = new RegExp(search, 'i');
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Facility.countDocuments(query);

  const facilities = await Facility.find(query)
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        facilities,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin facilities fetched successfully'
    )
  );
});

export const getFacilityById = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  if (!facility || facility.isDeleted) {
    throw new ApiError(404, 'Facility not found');
  }
  return res.status(200).json(new ApiResponse(200, facility, 'Facility fetched successfully'));
});

export const createFacility = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    shortDescription,
    description,
    icon,
    features,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  const slug = await createUniqueSlug(Facility, title);

  let imagesList = [];
  if (req.files && req.files.images && req.files.images.length > 0) {
    const uploaded = await ImageKitService.uploadMultipleFiles(
      req.files.images,
      IMAGEKIT_FOLDERS.FACILITIES
    );
    imagesList = uploaded.map((u) => ({
      url: u.url,
      fileId: u.fileId,
      fileName: u.fileName,
      caption: ''
    }));
  }

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field.split(',').map((s) => s.trim());
    }
  };

  const facility = await Facility.create({
    title: title.trim(),
    slug,
    category: category || 'Infrastructure',
    shortDescription: shortDescription ? shortDescription.trim() : '',
    description,
    icon: icon ? icon.trim() : '',
    features: parseArray(features),
    images: imagesList,
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res.status(201).json(new ApiResponse(201, facility, 'Facility created successfully'));
});

export const updateFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const facility = await Facility.findById(id);

  if (!facility || facility.isDeleted) {
    throw new ApiError(404, 'Facility not found');
  }

  const {
    title,
    category,
    shortDescription,
    description,
    icon,
    features,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  if (title && title.trim() !== facility.title) {
    facility.title = title.trim();
    facility.slug = await createUniqueSlug(Facility, title, id);
  }

  if (category) facility.category = category;
  if (shortDescription !== undefined) facility.shortDescription = shortDescription.trim();
  if (description !== undefined) facility.description = description;
  if (icon !== undefined) facility.icon = icon.trim();
  if (displayOrder !== undefined) facility.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) facility.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) facility.isPublished = isPublished === 'true' || isPublished === true;

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field.split(',').map((s) => s.trim());
    }
  };

  if (features !== undefined) facility.features = parseArray(features);

  if (req.files && req.files.images && req.files.images.length > 0) {
    const uploaded = await ImageKitService.uploadMultipleFiles(
      req.files.images,
      IMAGEKIT_FOLDERS.FACILITIES
    );
    const newImgs = uploaded.map((u) => ({
      url: u.url,
      fileId: u.fileId,
      fileName: u.fileName,
      caption: ''
    }));
    facility.images.push(...newImgs);
  }

  await facility.save();

  return res.status(200).json(new ApiResponse(200, facility, 'Facility updated successfully'));
});

export const togglePublishFacility = asyncHandler(async (req, res) => {
  const facility = await Facility.findById(req.params.id);
  if (!facility || facility.isDeleted) {
    throw new ApiError(404, 'Facility not found');
  }

  facility.isPublished = !facility.isPublished;
  await facility.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      facility,
      `Facility ${facility.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const deleteFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const facility = await Facility.findById(id);
  if (!facility) {
    throw new ApiError(404, 'Facility not found');
  }

  if (permanent === 'true') {
    const fileIds = facility.images.map((i) => i.fileId).filter(Boolean);
    await ImageKitService.bulkDeleteFiles(fileIds);
    await Facility.findByIdAndDelete(id);
  } else {
    facility.isDeleted = true;
    await facility.save();
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Facility deleted successfully'));
});
