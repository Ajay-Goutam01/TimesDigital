import { Admission } from '../models/admission.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ImageKitService from '../services/imagekit.service.js';
import { escapeRegex } from '../utils/escapeRegex.js';

// ==================== PUBLIC APIS ====================

export const submitAdmissionApplication = asyncHandler(async (req, res) => {
  const {
    studentName,
    fatherName,
    motherName,
    dateOfBirth,
    gender,
    mobile,
    altMobile,
    email,
    street,
    city,
    state,
    pincode,
    previousSchool,
    previousScoreOrPercentage,
    currentClass,
    applyingForClass,
    program,
    course,
    batch,
    hostelRequired,
    transportRequired,
    message
  } = req.body;

  let documentsList = [];
  if (req.files && req.files.documents && req.files.documents.length > 0) {
    const uploadedDocs = await ImageKitService.uploadMultipleFiles(
      req.files.documents,
      'times-school/admissions'
    );
    documentsList = uploadedDocs.map((doc) => ({
      title: doc.fileName,
      url: doc.url,
      fileId: doc.fileId
    }));
  }

  const admission = await Admission.create({
    studentName: studentName.trim(),
    fatherName: fatherName ? fatherName.trim() : '',
    motherName: motherName ? motherName.trim() : '',
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    gender: gender || 'Male',
    mobile: mobile.trim(),
    altMobile: altMobile ? altMobile.trim() : '',
    email: email ? email.toLowerCase().trim() : '',
    address: {
      street: street || '',
      city: city || '',
      state: state || 'Madhya Pradesh',
      pincode: pincode || ''
    },
    previousSchool: previousSchool ? previousSchool.trim() : '',
    previousScoreOrPercentage: previousScoreOrPercentage ? previousScoreOrPercentage.trim() : '',
    currentClass: currentClass ? currentClass.trim() : '',
    applyingForClass: applyingForClass.trim(),
    program: program || 'School + Coaching Integrated',
    course: course || undefined,
    batch: batch || undefined,
    hostelRequired: hostelRequired === 'true' || hostelRequired === true,
    transportRequired: transportRequired === 'true' || transportRequired === true,
    message: message ? message.trim() : '',
    documents: documentsList
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        applicationNumber: admission.applicationNumber,
        studentName: admission.studentName,
        createdAt: admission.createdAt
      },
      'Admission application submitted successfully! Our admissions team will reach out to you shortly.'
    )
  );
});

// ==================== ADMIN APIS ====================

export const getAdminAdmissions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, status, applyingForClass, course, batch } = req.query;

  const query = { isDeleted: false };
  if (status) query.status = status;
  if (applyingForClass) query.applyingForClass = applyingForClass;
  if (course) query.course = course;
  if (batch) query.batch = batch;

  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { studentName: new RegExp(escapedSearch, 'i') },
      { applicationNumber: new RegExp(escapedSearch, 'i') },
      { mobile: new RegExp(escapedSearch, 'i') },
      { fatherName: new RegExp(escapedSearch, 'i') },
      { email: new RegExp(escapedSearch, 'i') }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Admission.countDocuments(query);

  const admissions = await Admission.find(query)
    .populate('course', 'title category')
    .populate('batch', 'name class')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        admissions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admissions fetched successfully'
    )
  );
});

export const getAdmissionById = asyncHandler(async (req, res) => {
  const admission = await Admission.findById(req.params.id)
    .populate('course')
    .populate('batch');

  if (!admission || admission.isDeleted) {
    throw new ApiError(404, 'Admission record not found');
  }

  return res.status(200).json(new ApiResponse(200, admission, 'Admission record fetched successfully'));
});

export const updateAdmissionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const admission = await Admission.findById(id);
  if (!admission || admission.isDeleted) {
    throw new ApiError(404, 'Admission record not found');
  }

  admission.status = status;

  if (note && note.trim()) {
    admission.adminNotes.push({
      note: note.trim(),
      date: new Date(),
      author: req.admin?.name || 'Admin'
    });
  }

  await admission.save();

  return res
    .status(200)
    .json(new ApiResponse(200, admission, 'Admission status updated successfully'));
});

export const deleteAdmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const admission = await Admission.findById(id);
  if (!admission) {
    throw new ApiError(404, 'Admission record not found');
  }

  if (permanent === 'true') {
    const fileIds = admission.documents.map((d) => d.fileId).filter(Boolean);
    await ImageKitService.bulkDeleteFiles(fileIds);
    await Admission.findByIdAndDelete(id);
  } else {
    admission.isDeleted = true;
    await admission.save();
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Admission record deleted successfully'));
});
