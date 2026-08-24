import { Event } from '../models/event.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createUniqueSlug } from '../services/slug.service.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

// ==================== PUBLIC APIS ====================

export const getPublicEvents = asyncHandler(async (req, res) => {
  const { type, isFeatured, search } = req.query;

  const query = { isPublished: true, isDeleted: false };
  const now = new Date();

  if (type === 'upcoming') {
    query.eventDate = { $gte: now };
  } else if (type === 'past') {
    query.eventDate = { $lt: now };
  }

  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (search) query.title = new RegExp(search, 'i');

  const events = await Event.find(query).sort({ eventDate: type === 'past' ? -1 : 1 });

  return res.status(200).json(new ApiResponse(200, events, 'Events fetched successfully'));
});

export const getPublicEventBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const event = await Event.findOne({
    slug: slug.toLowerCase(),
    isPublished: true,
    isDeleted: false
  });

  if (!event) {
    throw new ApiError(404, `Event '${slug}' not found`);
  }

  return res.status(200).json(new ApiResponse(200, event, 'Event details fetched successfully'));
});

// ==================== ADMIN APIS ====================

export const getAdminEvents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, isPublished } = req.query;

  const query = { isDeleted: false };
  if (search) query.title = new RegExp(search, 'i');
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Event.countDocuments(query);

  const events = await Event.find(query)
    .sort({ eventDate: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      },
      'Admin events fetched successfully'
    )
  );
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.isDeleted) {
    throw new ApiError(404, 'Event not found');
  }
  return res.status(200).json(new ApiResponse(200, event, 'Event details fetched successfully'));
});

export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    description,
    eventDate,
    endDate,
    startTime,
    endTime,
    location,
    registrationRequired,
    registrationLink,
    registrationDeadline,
    isFeatured,
    isPublished
  } = req.body;

  const slug = await createUniqueSlug(Event, title);

  let coverImageData = { url: '', fileId: '', fileName: '' };
  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    coverImageData = await ImageKitService.uploadFile(
      req.files.coverImage[0].buffer,
      req.files.coverImage[0].originalname,
      IMAGEKIT_FOLDERS.EVENTS
    );
  }

  let galleryImages = [];
  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    const uploaded = await ImageKitService.uploadMultipleFiles(
      req.files.gallery,
      IMAGEKIT_FOLDERS.EVENTS
    );
    galleryImages = uploaded.map((u) => ({
      url: u.url,
      fileId: u.fileId,
      fileName: u.fileName
    }));
  }

  const event = await Event.create({
    title: title.trim(),
    slug,
    shortDescription: shortDescription ? shortDescription.trim() : '',
    description,
    eventDate: new Date(eventDate),
    endDate: endDate ? new Date(endDate) : undefined,
    startTime: startTime ? startTime.trim() : '',
    endTime: endTime ? endTime.trim() : '',
    location: location ? location.trim() : 'School Auditorium, TIME Public School, Shahdol',
    coverImage: coverImageData,
    gallery: galleryImages,
    registrationRequired: registrationRequired === 'true' || registrationRequired === true,
    registrationLink: registrationLink ? registrationLink.trim() : '',
    registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? isPublished === 'true' || isPublished === true : true
  });

  return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);

  if (!event || event.isDeleted) {
    throw new ApiError(404, 'Event not found');
  }

  const {
    title,
    shortDescription,
    description,
    eventDate,
    endDate,
    startTime,
    endTime,
    location,
    registrationRequired,
    registrationLink,
    registrationDeadline,
    isFeatured,
    isPublished
  } = req.body;

  if (title && title.trim() !== event.title) {
    event.title = title.trim();
    event.slug = await createUniqueSlug(Event, title, id);
  }

  if (shortDescription !== undefined) event.shortDescription = shortDescription.trim();
  if (description !== undefined) event.description = description;
  if (eventDate !== undefined) event.eventDate = new Date(eventDate);
  if (endDate !== undefined) event.endDate = endDate ? new Date(endDate) : undefined;
  if (startTime !== undefined) event.startTime = startTime.trim();
  if (endTime !== undefined) event.endTime = endTime.trim();
  if (location !== undefined) event.location = location.trim();
  if (registrationRequired !== undefined) event.registrationRequired = registrationRequired === 'true' || registrationRequired === true;
  if (registrationLink !== undefined) event.registrationLink = registrationLink.trim();
  if (registrationDeadline !== undefined) event.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : undefined;
  if (isFeatured !== undefined) event.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) event.isPublished = isPublished === 'true' || isPublished === true;

  if (req.files && req.files.coverImage && req.files.coverImage[0]) {
    if (event.coverImage?.fileId) {
      await ImageKitService.deleteFile(event.coverImage.fileId);
    }
    event.coverImage = await ImageKitService.uploadFile(
      req.files.coverImage[0].buffer,
      req.files.coverImage[0].originalname,
      IMAGEKIT_FOLDERS.EVENTS
    );
  }

  if (req.files && req.files.gallery && req.files.gallery.length > 0) {
    const uploaded = await ImageKitService.uploadMultipleFiles(
      req.files.gallery,
      IMAGEKIT_FOLDERS.EVENTS
    );
    const newImgs = uploaded.map((u) => ({
      url: u.url,
      fileId: u.fileId,
      fileName: u.fileName
    }));
    event.gallery.push(...newImgs);
  }

  await event.save();

  return res.status(200).json(new ApiResponse(200, event, 'Event updated successfully'));
});

export const togglePublishEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.isDeleted) {
    throw new ApiError(404, 'Event not found');
  }

  event.isPublished = !event.isPublished;
  await event.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      `Event ${event.isPublished ? 'published' : 'unpublished'} successfully`
    )
  );
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permanent } = req.query;

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (permanent === 'true') {
    const fileIds = [];
    if (event.coverImage?.fileId) fileIds.push(event.coverImage.fileId);
    event.gallery.forEach((g) => {
      if (g.fileId) fileIds.push(g.fileId);
    });
    await ImageKitService.bulkDeleteFiles(fileIds);
    await Event.findByIdAndDelete(id);
  } else {
    event.isDeleted = true;
    await event.save();
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Event deleted successfully'));
});
