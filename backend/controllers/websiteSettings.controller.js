import { WebsiteSettings } from '../models/websiteSettings.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

/**
 * Helper to ensure a settings document exists in DB
 */
const getOrCreateSettings = async () => {
  let settings = await WebsiteSettings.findOne();
  if (!settings) {
    settings = await WebsiteSettings.create({});
  }
  return settings;
};

export const getWebsiteSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  return res
    .status(200)
    .json(new ApiResponse(200, settings, 'Website settings fetched successfully'));
});

export const updateWebsiteSettings = asyncHandler(async (req, res) => {
  let settings = await getOrCreateSettings();

  const fieldsToUpdate = [
    'schoolName',
    'coachingName',
    'tagline',
    'locationTag',
    'primaryPhone',
    'secondaryPhone',
    'whatsappNumber',
    'admissionPhone',
    'email',
    'admissionEmail',
    'schoolAddress',
    'coachingAddress',
    'googleMapsUrl',
    'googleMapsEmbedUrl',
    'footerText',
    'copyrightText',
    'isAdmissionOpen',
    'admissionNoticeText',
    'workingHours',
    'affiliationNumber',
    'schoolCode'
  ];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      settings[field] = req.body[field];
    }
  });

  // Handle coordinates if passed
  if (req.body.coordinates) {
    if (typeof req.body.coordinates === 'string') {
      try {
        settings.coordinates = JSON.parse(req.body.coordinates);
      } catch (e) {
        // ignore parse error
      }
    } else {
      settings.coordinates = req.body.coordinates;
    }
  }

  // Handle social links
  if (req.body.socialLinks) {
    let links = req.body.socialLinks;
    if (typeof links === 'string') {
      try {
        links = JSON.parse(links);
      } catch (e) {}
    }
    settings.socialLinks = { ...settings.socialLinks.toObject(), ...links };
  }

  // Handle file uploads if any (logo, coachingLogo, favicon)
  if (req.files) {
    if (req.files.logo && req.files.logo[0]) {
      if (settings.logo?.fileId) {
        await ImageKitService.deleteFile(settings.logo.fileId);
      }
      settings.logo = await ImageKitService.uploadFile(
        req.files.logo[0].buffer,
        req.files.logo[0].originalname,
        IMAGEKIT_FOLDERS.SETTINGS
      );
    }

    if (req.files.coachingLogo && req.files.coachingLogo[0]) {
      if (settings.coachingLogo?.fileId) {
        await ImageKitService.deleteFile(settings.coachingLogo.fileId);
      }
      settings.coachingLogo = await ImageKitService.uploadFile(
        req.files.coachingLogo[0].buffer,
        req.files.coachingLogo[0].originalname,
        IMAGEKIT_FOLDERS.SETTINGS
      );
    }

    if (req.files.favicon && req.files.favicon[0]) {
      if (settings.favicon?.fileId) {
        await ImageKitService.deleteFile(settings.favicon.fileId);
      }
      settings.favicon = await ImageKitService.uploadFile(
        req.files.favicon[0].buffer,
        req.files.favicon[0].originalname,
        IMAGEKIT_FOLDERS.SETTINGS
      );
    }
  }

  await settings.save();

  return res
    .status(200)
    .json(new ApiResponse(200, settings, 'Website settings updated successfully'));
});
