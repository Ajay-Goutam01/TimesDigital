import { Testimonial } from '../models/testimonial.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const { isFeatured, rating } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (rating) query.rating = parseInt(rating);

  const testimonials = await Testimonial.find(query)
    .populate('batch', 'name class')
    .sort({ displayOrder: 1, rating: -1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, testimonials, 'Testimonials fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminTestimonials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { message: new RegExp(search, 'i') },
      { role: new RegExp(search, 'i') }
    ];
  }
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Testimonial.countDocuments(query);

  const testimonials = await Testimonial.find(query)
    .populate('batch', 'name')
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        testimonials,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin testimonials fetched successfully'
    )
  );
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id).populate('batch');
  if (!testimonial || testimonial.isDeleted) {
    throw new ApiError(404, 'Testimonial not found');
  }
  return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial fetched successfully'));
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const {
    name,
    role,
    studentOrParent,
    classOrCourse,
    batch,
    message,
    rating,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  let photoData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    photoData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.TESTIMONIALS
    );
  }

  const testimonial = await Testimonial.create({
    name: name.trim(),
    role: role || 'Student',
    studentOrParent: studentOrParent || 'Student',
    photo: photoData,
    classOrCourse: classOrCourse ? classOrCourse.trim() : '',
    batch: batch || undefined,
    message: message.trim(),
    rating: rating ? parseInt(rating) : 5,
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res.status(201).json(new ApiResponse(201, testimonial, 'Testimonial created successfully'));
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findById(id);

  if (!testimonial || testimonial.isDeleted) {
    throw new ApiError(404, 'Testimonial not found');
  }

  const {
    name,
    role,
    studentOrParent,
    classOrCourse,
    batch,
    message,
    rating,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  if (name) testimonial.name = name.trim();
  if (role !== undefined) testimonial.role = role.trim();
  if (studentOrParent) testimonial.studentOrParent = studentOrParent;
  if (classOrCourse !== undefined) testimonial.classOrCourse = classOrCourse.trim();
  if (batch !== undefined) testimonial.batch = batch || undefined;
  if (message) testimonial.message = message.trim();
  if (rating !== undefined) testimonial.rating = parseInt(rating);
  if (displayOrder !== undefined) testimonial.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) testimonial.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) testimonial.isPublished = isPublished === 'true' || isPublished === true;

  if (req.file) {
    if (testimonial.photo?.fileId) {
      await ImageKitService.deleteFile(testimonial.photo.fileId);
    }
    testimonial.photo = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.TESTIMONIALS
    );
  }

  await testimonial.save();

  return res.status(200).json(new ApiResponse(200, testimonial, 'Testimonial updated successfully'));
});

export const togglePublishTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial || testimonial.isDeleted) {
    throw new ApiError(404, 'Testimonial not found');
  }

  testimonial.isPublished = !testimonial.isPublished;
  await testimonial.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      testimonial,
      `Testimonial ${testimonial.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  if (permanent === 'true') {
    if (testimonial.photo?.fileId) {
      await ImageKitService.deleteFile(testimonial.photo.fileId);
    }
    await Testimonial.findByIdAndDelete(id);
  } else {
    testimonial.isDeleted = true;
    await testimonial.save();
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Testimonial deleted successfully'));
});
