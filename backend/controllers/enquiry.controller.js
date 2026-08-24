import { Enquiry } from '../models/enquiry.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { escapeRegex } from '../utils/escapeRegex.js';

// ==================== PUBLIC APIS ====================

export const submitEnquiry = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    class: studentClass,
    interestedProgram,
    interestedCourse,
    interestedBatch,
    message,
    source,
    sourceUrl
  } = req.body;

  const enquiry = await Enquiry.create({
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.toLowerCase().trim() : '',
    class: studentClass ? studentClass.trim() : '',
    interestedProgram: interestedProgram ? interestedProgram.trim() : '',
    interestedCourse: interestedCourse || undefined,
    interestedBatch: interestedBatch || undefined,
    message: message ? message.trim() : '',
    source: source || 'Website',
    sourceUrl: sourceUrl || ''
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      { id: enquiry._id, name: enquiry.name },
      'Thank you for reaching out! Our academic counsellor will get in touch with you shortly.'
    )
  );
});

// ==================== ADMIN APIS ====================

export const getAdminEnquiries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, status, interestedBatch, interestedCourse } = req.query;

  const query = { isDeleted: false };
  if (status) query.status = status;
  if (interestedBatch) query.interestedBatch = interestedBatch;
  if (interestedCourse) query.interestedCourse = interestedCourse;

  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: new RegExp(escapedSearch, 'i') },
      { phone: new RegExp(escapedSearch, 'i') },
      { email: new RegExp(escapedSearch, 'i') },
      { source: new RegExp(escapedSearch, 'i') }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Enquiry.countDocuments(query);

  const enquiries = await Enquiry.find(query)
    .populate('interestedCourse', 'title category')
    .populate('interestedBatch', 'name class')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        enquiries,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Enquiries fetched successfully'
    )
  );
});

export const getEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id)
    .populate('interestedCourse')
    .populate('interestedBatch');

  if (!enquiry || enquiry.isDeleted) {
    throw new ApiError(404, 'Enquiry lead not found');
  }

  return res.status(200).json(new ApiResponse(200, enquiry, 'Enquiry fetched successfully'));
});

export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const enquiry = await Enquiry.findById(id);
  if (!enquiry || enquiry.isDeleted) {
    throw new ApiError(404, 'Enquiry not found');
  }

  enquiry.status = status;

  if (note && note.trim()) {
    enquiry.adminNotes.push({
      note: note.trim(),
      date: new Date(),
      author: req.admin?.name || 'Admin'
    });
  }

  await enquiry.save();

  return res.status(200).json(new ApiResponse(200, enquiry, 'Enquiry status updated successfully'));
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const enquiry = await Enquiry.findById(id);
  if (!enquiry) {
    throw new ApiError(404, 'Enquiry not found');
  }

  if (permanent === 'true') {
    await Enquiry.findByIdAndDelete(id);
  } else {
    enquiry.isDeleted = true;
    await enquiry.save();
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Enquiry lead deleted successfully'));
});
