import { Result } from '../models/result.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateSlug } from '../utils/generateSlug.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicResults = asyncHandler(async (req, res) => {
  const { exam, year, isFeatured, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (exam) query.exam = exam;
  if (year) query.year = parseInt(year);
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

  if (search) {
    query.$or = [
      { studentName: new RegExp(search, 'i') },
      { rank: new RegExp(search, 'i') },
      { collegeAllotted: new RegExp(search, 'i') },
      { achievementTitle: new RegExp(search, 'i') }
    ];
  }

  const results = await Result.find(query)
    .populate('course', 'title category')
    .populate('batch', 'name class')
    .sort({ year: -1, displayOrder: 1, allIndiaRank: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, results, 'Results and achievements fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminResults = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, exam, year, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) {
    query.$or = [
      { studentName: new RegExp(search, 'i') },
      { rank: new RegExp(search, 'i') },
      { collegeAllotted: new RegExp(search, 'i') }
    ];
  }
  if (exam) query.exam = exam;
  if (year) query.year = parseInt(year);
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Result.countDocuments(query);

  const results = await Result.find(query)
    .populate('course', 'title')
    .populate('batch', 'name')
    .sort({ year: -1, displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        results,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin results fetched successfully'
    )
  );
});

export const getResultById = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id)
    .populate('course')
    .populate('batch');

  if (!result || result.isDeleted) {
    throw new ApiError(404, 'Result record not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Result details fetched successfully'));
});

export const createResult = asyncHandler(async (req, res) => {
  const {
    studentName,
    exam,
    year,
    score,
    rank,
    allIndiaRank,
    categoryRank,
    percentile,
    course,
    batch,
    collegeAllotted,
    achievementTitle,
    description,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  let photoData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    photoData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.RESULTS
    );
  }

  const slug = `${generateSlug(studentName)}-${exam.toLowerCase().replace(/\s+/g, '-')}-${year}`;

  const result = await Result.create({
    studentName: studentName.trim(),
    slug,
    studentPhoto: photoData,
    exam,
    year: parseInt(year),
    score: score ? score.trim() : '',
    rank: rank ? rank.trim() : '',
    allIndiaRank: allIndiaRank ? parseInt(allIndiaRank) : undefined,
    categoryRank: categoryRank ? parseInt(categoryRank) : undefined,
    percentile: percentile ? percentile.trim() : '',
    course: course || undefined,
    batch: batch || undefined,
    collegeAllotted: collegeAllotted ? collegeAllotted.trim() : '',
    achievementTitle: achievementTitle ? achievementTitle.trim() : '',
    description: description ? description.trim() : '',
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, result, 'Result record created successfully'));
});

export const updateResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await Result.findById(id);

  if (!result || result.isDeleted) {
    throw new ApiError(404, 'Result record not found');
  }

  const {
    studentName,
    exam,
    year,
    score,
    rank,
    allIndiaRank,
    categoryRank,
    percentile,
    course,
    batch,
    collegeAllotted,
    achievementTitle,
    description,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  if (studentName) result.studentName = studentName.trim();
  if (exam) result.exam = exam;
  if (year) result.year = parseInt(year);
  if (score !== undefined) result.score = score.trim();
  if (rank !== undefined) result.rank = rank.trim();
  if (allIndiaRank !== undefined) result.allIndiaRank = allIndiaRank ? parseInt(allIndiaRank) : undefined;
  if (categoryRank !== undefined) result.categoryRank = categoryRank ? parseInt(categoryRank) : undefined;
  if (percentile !== undefined) result.percentile = percentile.trim();
  if (course !== undefined) result.course = course || undefined;
  if (batch !== undefined) result.batch = batch || undefined;
  if (collegeAllotted !== undefined) result.collegeAllotted = collegeAllotted.trim();
  if (achievementTitle !== undefined) result.achievementTitle = achievementTitle.trim();
  if (description !== undefined) result.description = description.trim();
  if (displayOrder !== undefined) result.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) result.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) result.isPublished = isPublished === 'true' || isPublished === true;

  if (req.file) {
    if (result.studentPhoto?.fileId) {
      await ImageKitService.deleteFile(result.studentPhoto.fileId);
    }
    result.studentPhoto = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.RESULTS
    );
  }

  await result.save();

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Result record updated successfully'));
});

export const togglePublishResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result || result.isDeleted) {
    throw new ApiError(404, 'Result record not found');
  }

  result.isPublished = !result.isPublished;
  await result.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      `Result record ${result.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const toggleFeatureResult = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id);
  if (!result || result.isDeleted) {
    throw new ApiError(404, 'Result record not found');
  }

  result.isFeatured = !result.isFeatured;
  await result.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      `Result record ${result.isFeatured ? 'featured' : 'unfeatured'} successfully`
    )
  );
});

export const deleteResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const result = await Result.findById(id);
  if (!result) {
    throw new ApiError(404, 'Result record not found');
  }

  if (permanent === 'true') {
    if (result.studentPhoto?.fileId) {
      await ImageKitService.deleteFile(result.studentPhoto.fileId);
    }
    await Result.findByIdAndDelete(id);
  } else {
    result.isDeleted = true;
    await result.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Result record deleted successfully'));
});
