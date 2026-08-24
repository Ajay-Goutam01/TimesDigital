import { Batch } from '../models/batch.model.js';
import { Course } from '../models/course.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicBatches = asyncHandler(async (req, res) => {
  const { category, course, class: classLevel, isFeatured, search, status } = req.query;

  const query = { isPublished: true, isDeleted: false };

  if (category) query.category = new RegExp(escapeRegex(category), 'i');
  if (course) query.course = course;
  if (classLevel) query.class = new RegExp(escapeRegex(classLevel), 'i');
  if (status) query.status = status;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: new RegExp(escapedSearch, 'i') },
      { program: new RegExp(escapedSearch, 'i') },
      { description: new RegExp(escapedSearch, 'i') },
      { category: new RegExp(escapedSearch, 'i') }
    ];
  }

  const batches = await Batch.find(query)
    .populate('course', 'title slug category')
    .populate('faculty', 'name designation subject profilePhoto slug qualification')
    .sort({ displayOrder: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, batches, 'Batches fetched successfully'));
});

export const getPublicBatchBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const batch = await Batch.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
    isDeleted: false
  })
    .populate('course', 'title slug category classes duration features description image')
    .populate('faculty', 'name designation subject profilePhoto slug qualification experienceYears achievements');

  if (!batch) {
    throw new ApiError(404, `Batch with slug '${slug}' not found or is currently unpublished`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, batch, 'Batch details fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminBatches = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, course, status, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: new RegExp(escapedSearch, 'i') },
      { program: new RegExp(escapedSearch, 'i') },
      { class: new RegExp(escapedSearch, 'i') }
    ];
  }
  if (category) query.category = category;
  if (course) query.course = course;
  if (status) query.status = status;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Batch.countDocuments(query);

  const batches = await Batch.find(query)
    .populate('course', 'title category')
    .populate('faculty', 'name designation subject')
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        batches,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin batches fetched successfully'
    )
  );
});

export const getAdminBatchById = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id)
    .populate('course')
    .populate('faculty');

  if (!batch || batch.isDeleted) {
    throw new ApiError(404, 'Batch not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, batch, 'Batch details fetched successfully'));
});

export const createBatch = asyncHandler(async (req, res) => {
  const {
    name,
    course,
    category,
    targetYear,
    class: classLevel,
    program,
    shortDescription,
    description,
    duration,
    startDate,
    endDate,
    timings,
    days,
    subjects,
    faculty,
    features,
    eligibility,
    feeStructure,
    scholarshipInfo,
    hostelAvailable,
    maxSeats,
    enrolledCount,
    status,
    isFeatured,
    isPublished,
    displayOrder
  } = req.body;

  // Validate course exists
  const courseExists = await Course.findById(course);
  if (!courseExists) {
    throw new ApiError(404, 'Referenced course does not exist');
  }

  const slug = await createUniqueSlug(Batch, name);

  let batchImageData = { url: '', fileId: '', fileName: '' };
  let brochureData = { url: '', fileId: '', fileName: '' };

  if (req.files) {
    if (req.files.batchImage && req.files.batchImage[0]) {
      batchImageData = await ImageKitService.uploadFile(
        req.files.batchImage[0].buffer,
        req.files.batchImage[0].originalname,
        IMAGEKIT_FOLDERS.BATCHES
      );
    }
    if (req.files.brochure && req.files.brochure[0]) {
      brochureData = await ImageKitService.uploadFile(
        req.files.brochure[0].buffer,
        req.files.brochure[0].originalname,
        `${IMAGEKIT_FOLDERS.BATCHES}/brochures`
      );
    }
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

  let parsedFeeStructure = {
    tuitionFee: '',
    registrationFee: '',
    scholarshipUpto: 'Up to 100%',
    installmentsInfo: '',
    notes: ''
  };

  if (feeStructure) {
    if (typeof feeStructure === 'string') {
      try {
        parsedFeeStructure = { ...parsedFeeStructure, ...JSON.parse(feeStructure) };
      } catch (e) {}
    } else {
      parsedFeeStructure = { ...parsedFeeStructure, ...feeStructure };
    }
  }

  const batch = await Batch.create({
    name: name.trim(),
    slug,
    course,
    category: category.trim(),
    targetYear: targetYear ? parseInt(targetYear) : new Date().getFullYear() + 1,
    class: classLevel.trim(),
    program: program ? program.trim() : '',
    shortDescription: shortDescription ? shortDescription.trim() : '',
    description,
    duration: duration || '1 Year',
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    timings: timings || '8:00 AM - 1:30 PM (School) | 2:30 PM - 6:30 PM (Coaching)',
    days: parseArray(days),
    subjects: parseArray(subjects),
    faculty: parseArray(faculty),
    features: parseArray(features),
    eligibility: eligibility ? eligibility.trim() : '',
    feeStructure: parsedFeeStructure,
    scholarshipInfo: scholarshipInfo ? scholarshipInfo.trim() : undefined,
    hostelAvailable: hostelAvailable === undefined ? true : hostelAvailable === 'true' || hostelAvailable === true,
    batchImage: batchImageData,
    brochure: brochureData,
    maxSeats: maxSeats ? parseInt(maxSeats) : 40,
    enrolledCount: enrolledCount ? parseInt(enrolledCount) : 0,
    status: status || 'admissions-open',
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true,
    displayOrder: displayOrder ? parseInt(displayOrder) : 0
  });

  const createdBatch = await Batch.findById(batch._id).populate('course', 'title category');

  return res
    .status(201)
    .json(new ApiResponse(201, createdBatch, 'Batch created successfully'));
});

export const updateBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const batch = await Batch.findById(id);

  if (!batch || batch.isDeleted) {
    throw new ApiError(404, 'Batch not found');
  }

  const {
    name,
    course,
    category,
    targetYear,
    class: classLevel,
    program,
    shortDescription,
    description,
    duration,
    startDate,
    endDate,
    timings,
    days,
    subjects,
    faculty,
    features,
    eligibility,
    feeStructure,
    scholarshipInfo,
    hostelAvailable,
    maxSeats,
    enrolledCount,
    status,
    isFeatured,
    isPublished,
    displayOrder
  } = req.body;

  if (name && name.trim() !== batch.name) {
    batch.name = name.trim();
    batch.slug = await createUniqueSlug(Batch, name, id);
  }

  if (course) {
    const courseExists = await Course.findById(course);
    if (!courseExists) throw new ApiError(404, 'Referenced course does not exist');
    batch.course = course;
  }

  if (category) batch.category = category.trim();
  if (targetYear !== undefined) batch.targetYear = parseInt(targetYear);
  if (classLevel) batch.class = classLevel.trim();
  if (program !== undefined) batch.program = program.trim();
  if (shortDescription !== undefined) batch.shortDescription = shortDescription.trim();
  if (description !== undefined) batch.description = description;
  if (duration !== undefined) batch.duration = duration;
  if (startDate !== undefined) batch.startDate = startDate ? new Date(startDate) : undefined;
  if (endDate !== undefined) batch.endDate = endDate ? new Date(endDate) : undefined;
  if (timings !== undefined) batch.timings = timings;
  if (eligibility !== undefined) batch.eligibility = eligibility.trim();
  if (scholarshipInfo !== undefined) batch.scholarshipInfo = scholarshipInfo.trim();
  if (hostelAvailable !== undefined) batch.hostelAvailable = hostelAvailable === 'true' || hostelAvailable === true;
  if (maxSeats !== undefined) batch.maxSeats = parseInt(maxSeats);
  if (enrolledCount !== undefined) batch.enrolledCount = parseInt(enrolledCount);
  if (status !== undefined) batch.status = status;
  if (isFeatured !== undefined) batch.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) batch.isPublished = isPublished === 'true' || isPublished === true;
  if (displayOrder !== undefined) batch.displayOrder = parseInt(displayOrder);

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field.split(',').map((s) => s.trim());
    }
  };

  if (days !== undefined) batch.days = parseArray(days);
  if (subjects !== undefined) batch.subjects = parseArray(subjects);
  if (faculty !== undefined) batch.faculty = parseArray(faculty);
  if (features !== undefined) batch.features = parseArray(features);

  if (feeStructure) {
    let parsed = {};
    if (typeof feeStructure === 'string') {
      try {
        parsed = JSON.parse(feeStructure);
      } catch (e) {}
    } else {
      parsed = feeStructure;
    }
    batch.feeStructure = { ...batch.feeStructure.toObject(), ...parsed };
  }

  // Handle file uploads
  if (req.files) {
    if (req.files.batchImage && req.files.batchImage[0]) {
      if (batch.batchImage?.fileId) {
        await ImageKitService.deleteFile(batch.batchImage.fileId);
      }
      batch.batchImage = await ImageKitService.uploadFile(
        req.files.batchImage[0].buffer,
        req.files.batchImage[0].originalname,
        IMAGEKIT_FOLDERS.BATCHES
      );
    }

    if (req.files.brochure && req.files.brochure[0]) {
      if (batch.brochure?.fileId) {
        await ImageKitService.deleteFile(batch.brochure.fileId);
      }
      batch.brochure = await ImageKitService.uploadFile(
        req.files.brochure[0].buffer,
        req.files.brochure[0].originalname,
        `${IMAGEKIT_FOLDERS.BATCHES}/brochures`
      );
    }
  }

  await batch.save();

  const updatedBatch = await Batch.findById(id)
    .populate('course', 'title category')
    .populate('faculty', 'name designation');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBatch, 'Batch updated successfully'));
});

export const togglePublishBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch || batch.isDeleted) {
    throw new ApiError(404, 'Batch not found');
  }

  batch.isPublished = !batch.isPublished;
  await batch.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      batch,
      `Batch ${batch.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const toggleFeatureBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch || batch.isDeleted) {
    throw new ApiError(404, 'Batch not found');
  }

  batch.isFeatured = !batch.isFeatured;
  await batch.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      batch,
      `Batch ${batch.isFeatured ? 'featured' : 'unfeatured'} successfully`
    )
  );
});

export const deleteBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const batch = await Batch.findById(id);
  if (!batch) {
    throw new ApiError(404, 'Batch not found');
  }

  if (permanent === 'true') {
    if (batch.batchImage?.fileId) {
      await ImageKitService.deleteFile(batch.batchImage.fileId);
    }
    if (batch.brochure?.fileId) {
      await ImageKitService.deleteFile(batch.brochure.fileId);
    }
    await Batch.findByIdAndDelete(id);
  } else {
    batch.isDeleted = true;
    await batch.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Batch deleted successfully'));
});
