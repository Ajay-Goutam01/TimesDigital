import { Course } from '../models/course.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicCourses = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (category) {
    query.category = new RegExp(escapeRegex(category), 'i');
  }
  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { title: new RegExp(escapedSearch, 'i') },
      { description: new RegExp(escapedSearch, 'i') },
      { category: new RegExp(escapedSearch, 'i') }
    ];
  }

  const courses = await Course.find(query)
    .populate('faculty', 'name designation subject profilePhoto slug')
    .populate({
      path: 'batches',
      match: { isPublished: true, isDeleted: false },
      select: 'name slug class program duration startDate timings status isFeatured feeStructure'
    })
    .sort({ displayOrder: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, 'Courses fetched successfully'));
});

export const getPublicCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const course = await Course.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
    isDeleted: false
  })
    .populate('faculty', 'name designation subject profilePhoto slug qualification experienceYears')
    .populate({
      path: 'batches',
      match: { isPublished: true, isDeleted: false },
      select: 'name slug class program duration startDate timings status isFeatured feeStructure subjects batchImage'
    });

  if (!course) {
    throw new ApiError(404, `Course with slug '${slug}' was not found or is currently unpublished`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, 'Course details fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { title: new RegExp(escapedSearch, 'i') },
      { category: new RegExp(escapedSearch, 'i') }
    ];
  }
  if (category) query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Course.countDocuments(query);

  const courses = await Course.find(query)
    .populate('faculty', 'name designation subject')
    .populate({
      path: 'batches',
      select: 'name status isPublished'
    })
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin courses fetched successfully'
    )
  );
});

export const getAdminCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('faculty', 'name designation subject profilePhoto')
    .populate('batches');

  if (!course || course.isDeleted) {
    throw new ApiError(404, 'Course not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, course, 'Course details fetched successfully'));
});

export const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    classes,
    duration,
    shortDescription,
    description,
    subjects,
    features,
    eligibility,
    syllabusOverview,
    faculty,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  const slug = await createUniqueSlug(Course, title);

  let imageData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    imageData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.COURSES
    );
  }

  // Parse arrays if received as JSON strings
  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field.split(',').map((s) => s.trim());
    }
  };

  const course = await Course.create({
    title: title.trim(),
    slug,
    category: category.trim(),
    classes: parseArray(classes),
    duration: duration || '1 Year / 2 Year',
    shortDescription: shortDescription ? shortDescription.trim() : '',
    description,
    subjects: parseArray(subjects),
    features: parseArray(features),
    eligibility: eligibility ? eligibility.trim() : '',
    syllabusOverview: syllabusOverview ? syllabusOverview.trim() : '',
    faculty: parseArray(faculty),
    image: imageData,
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, course, 'Course created successfully'));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course || course.isDeleted) {
    throw new ApiError(404, 'Course not found');
  }

  const {
    title,
    category,
    classes,
    duration,
    shortDescription,
    description,
    subjects,
    features,
    eligibility,
    syllabusOverview,
    faculty,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  if (title && title.trim() !== course.title) {
    course.title = title.trim();
    course.slug = await createUniqueSlug(Course, title, id);
  }

  if (category) course.category = category.trim();
  if (duration !== undefined) course.duration = duration;
  if (shortDescription !== undefined) course.shortDescription = shortDescription;
  if (description !== undefined) course.description = description;
  if (eligibility !== undefined) course.eligibility = eligibility;
  if (syllabusOverview !== undefined) course.syllabusOverview = syllabusOverview;
  if (displayOrder !== undefined) course.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) course.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) course.isPublished = isPublished === 'true' || isPublished === true;

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field.split(',').map((s) => s.trim());
    }
  };

  if (classes !== undefined) course.classes = parseArray(classes);
  if (subjects !== undefined) course.subjects = parseArray(subjects);
  if (features !== undefined) course.features = parseArray(features);
  if (faculty !== undefined) course.faculty = parseArray(faculty);

  if (req.file) {
    if (course.image?.fileId) {
      await ImageKitService.deleteFile(course.image.fileId);
    }
    course.image = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.COURSES
    );
  }

  await course.save();

  return res
    .status(200)
    .json(new ApiResponse(200, course, 'Course updated successfully'));
});

export const togglePublishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course || course.isDeleted) {
    throw new ApiError(404, 'Course not found');
  }

  course.isPublished = !course.isPublished;
  await course.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      course,
      `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const toggleFeatureCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course || course.isDeleted) {
    throw new ApiError(404, 'Course not found');
  }

  course.isFeatured = !course.isFeatured;
  await course.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      course,
      `Course ${course.isFeatured ? 'featured' : 'unfeatured'} successfully`
    )
  );
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (permanent === 'true') {
    if (course.image?.fileId) {
      await ImageKitService.deleteFile(course.image.fileId);
    }
    await Course.findByIdAndDelete(id);
  } else {
    course.isDeleted = true;
    await course.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Course deleted successfully'));
});
