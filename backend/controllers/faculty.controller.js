import { Faculty } from '../models/faculty.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import { escapeRegex } from '../utils/escapeRegex.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicFaculty = asyncHandler(async (req, res) => {
  const { category, search, isFeatured } = req.query;

  const query = { isPublished: true, isDeleted: false };
  if (category) query.category = category;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: new RegExp(escapedSearch, 'i') },
      { subject: new RegExp(escapedSearch, 'i') },
      { designation: new RegExp(escapedSearch, 'i') },
      { specialization: new RegExp(escapedSearch, 'i') }
    ];
  }

  const faculty = await Faculty.find(query)
    .populate('courses', 'title slug category')
    .populate('batches', 'name slug class program')
    .sort({ displayOrder: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, faculty, 'Faculty list fetched successfully'));
});

export const getPublicFacultyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const member = await Faculty.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
    isDeleted: false
  })
    .populate('courses', 'title slug category classes duration')
    .populate('batches', 'name slug class program timings status');

  if (!member) {
    throw new ApiError(404, `Faculty member with slug '${slug}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, member, 'Faculty details fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminFaculty = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, category, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: new RegExp(escapedSearch, 'i') },
      { subject: new RegExp(escapedSearch, 'i') },
      { designation: new RegExp(escapedSearch, 'i') }
    ];
  }
  if (category) query.category = category;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Faculty.countDocuments(query);

  const facultyList = await Faculty.find(query)
    .populate('courses', 'title')
    .populate('batches', 'name')
    .sort({ displayOrder: 1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        faculty: facultyList,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin faculty list fetched successfully'
    )
  );
});

export const getAdminFacultyById = asyncHandler(async (req, res) => {
  const member = await Faculty.findById(req.params.id)
    .populate('courses')
    .populate('batches');

  if (!member || member.isDeleted) {
    throw new ApiError(404, 'Faculty member not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, member, 'Faculty details fetched successfully'));
});

export const createFaculty = asyncHandler(async (req, res) => {
  const {
    name,
    designation,
    department,
    subject,
    qualification,
    experienceYears,
    specialization,
    shortBio,
    detailedBio,
    achievements,
    category,
    courses,
    batches,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  const slug = await createUniqueSlug(Faculty, name);

  let photoData = { url: '', fileId: '', fileName: '' };
  if (req.file) {
    photoData = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.FACULTY
    );
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

  const member = await Faculty.create({
    name: name.trim(),
    slug,
    profilePhoto: photoData,
    designation: designation.trim(),
    department: department ? department.trim() : '',
    subject: subject.trim(),
    qualification: qualification.trim(),
    experienceYears: experienceYears ? parseInt(experienceYears) : 0,
    specialization: specialization ? specialization.trim() : '',
    shortBio: shortBio ? shortBio.trim() : '',
    detailedBio: detailedBio ? detailedBio.trim() : '',
    achievements: parseArray(achievements),
    category: category || 'School Faculty',
    courses: parseArray(courses),
    batches: parseArray(batches),
    displayOrder: displayOrder ? parseInt(displayOrder) : 0,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, member, 'Faculty member added successfully'));
});

export const updateFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const member = await Faculty.findById(id);

  if (!member || member.isDeleted) {
    throw new ApiError(404, 'Faculty member not found');
  }

  const {
    name,
    designation,
    department,
    subject,
    qualification,
    experienceYears,
    specialization,
    shortBio,
    detailedBio,
    achievements,
    category,
    courses,
    batches,
    displayOrder,
    isFeatured,
    isPublished
  } = req.body;

  if (name && name.trim() !== member.name) {
    member.name = name.trim();
    member.slug = await createUniqueSlug(Faculty, name, id);
  }

  if (designation) member.designation = designation.trim();
  if (department !== undefined) member.department = department.trim();
  if (subject) member.subject = subject.trim();
  if (qualification) member.qualification = qualification.trim();
  if (experienceYears !== undefined) member.experienceYears = parseInt(experienceYears);
  if (specialization !== undefined) member.specialization = specialization.trim();
  if (shortBio !== undefined) member.shortBio = shortBio.trim();
  if (detailedBio !== undefined) member.detailedBio = detailedBio.trim();
  if (category) member.category = category;
  if (displayOrder !== undefined) member.displayOrder = parseInt(displayOrder);
  if (isFeatured !== undefined) member.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) member.isPublished = isPublished === 'true' || isPublished === true;

  const parseArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return field.split(',').map((s) => s.trim());
    }
  };

  if (achievements !== undefined) member.achievements = parseArray(achievements);
  if (courses !== undefined) member.courses = parseArray(courses);
  if (batches !== undefined) member.batches = parseArray(batches);

  if (req.file) {
    if (member.profilePhoto?.fileId) {
      await ImageKitService.deleteFile(member.profilePhoto.fileId);
    }
    member.profilePhoto = await ImageKitService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      IMAGEKIT_FOLDERS.FACULTY
    );
  }

  await member.save();

  return res
    .status(200)
    .json(new ApiResponse(200, member, 'Faculty details updated successfully'));
});

export const togglePublishFaculty = asyncHandler(async (req, res) => {
  const member = await Faculty.findById(req.params.id);
  if (!member || member.isDeleted) {
    throw new ApiError(404, 'Faculty member not found');
  }

  member.isPublished = !member.isPublished;
  await member.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      member,
      `Faculty ${member.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const toggleFeatureFaculty = asyncHandler(async (req, res) => {
  const member = await Faculty.findById(req.params.id);
  if (!member || member.isDeleted) {
    throw new ApiError(404, 'Faculty member not found');
  }

  member.isFeatured = !member.isFeatured;
  await member.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      member,
      `Faculty ${member.isFeatured ? 'featured' : 'unfeatured'} successfully`
    )
  );
});

export const deleteFaculty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const member = await Faculty.findById(id);
  if (!member) {
    throw new ApiError(404, 'Faculty member not found');
  }

  if (permanent === 'true') {
    if (member.profilePhoto?.fileId) {
      await ImageKitService.deleteFile(member.profilePhoto.fileId);
    }
    await Faculty.findByIdAndDelete(id);
  } else {
    member.isDeleted = true;
    await member.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Faculty member deleted successfully'));
});
