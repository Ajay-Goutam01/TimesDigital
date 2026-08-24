import { Homepage } from '../models/homepage.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ImageKitService from '../services/imagekit.service.js';
import { IMAGEKIT_FOLDERS } from '../utils/constants.js';

const getOrCreateHomepage = async () => {
  let homepage = await Homepage.findOne();
  if (!homepage) {
    homepage = await Homepage.create({});
  }
  return homepage;
};

export const getHomepageData = asyncHandler(async (req, res) => {
  const homepage = await getOrCreateHomepage();
  return res
    .status(200)
    .json(new ApiResponse(200, homepage, 'Homepage CMS data fetched successfully'));
});

export const updateHomepageData = asyncHandler(async (req, res) => {
  let homepage = await getOrCreateHomepage();

  const sections = [
    'hero',
    'whyChooseUs',
    'achievements',
    'featuredBatches',
    'coursesSection',
    'resultsSection',
    'facultySection',
    'gallerySection',
    'videoSection',
    'facilitiesSection',
    'testimonialsSection',
    'announcementsSection',
    'hostelSection',
    'scholarshipSection',
    'ctaSection',
    'sectionOrder'
  ];

  sections.forEach((section) => {
    if (req.body[section] !== undefined) {
      let data = req.body[section];
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }
      homepage[section] = data;
    }
  });

  // Check file uploads for specific sections
  if (req.files) {
    if (req.files.heroBanner && req.files.heroBanner[0]) {
      if (homepage.hero?.bannerImage?.fileId) {
        await ImageKitService.deleteFile(homepage.hero.bannerImage.fileId);
      }
      homepage.hero.bannerImage = await ImageKitService.uploadFile(
        req.files.heroBanner[0].buffer,
        req.files.heroBanner[0].originalname,
        IMAGEKIT_FOLDERS.HOMEPAGE
      );
    }

    if (req.files.hostelImage && req.files.hostelImage[0]) {
      if (homepage.hostelSection?.image?.fileId) {
        await ImageKitService.deleteFile(homepage.hostelSection.image.fileId);
      }
      homepage.hostelSection.image = await ImageKitService.uploadFile(
        req.files.hostelImage[0].buffer,
        req.files.hostelImage[0].originalname,
        IMAGEKIT_FOLDERS.HOMEPAGE
      );
    }

    if (req.files.scholarshipImage && req.files.scholarshipImage[0]) {
      if (homepage.scholarshipSection?.image?.fileId) {
        await ImageKitService.deleteFile(homepage.scholarshipSection.image.fileId);
      }
      homepage.scholarshipSection.image = await ImageKitService.uploadFile(
        req.files.scholarshipImage[0].buffer,
        req.files.scholarshipImage[0].originalname,
        IMAGEKIT_FOLDERS.HOMEPAGE
      );
    }

    if (req.files.ctaBgImage && req.files.ctaBgImage[0]) {
      if (homepage.ctaSection?.bgImage?.fileId) {
        await ImageKitService.deleteFile(homepage.ctaSection.bgImage.fileId);
      }
      homepage.ctaSection.bgImage = await ImageKitService.uploadFile(
        req.files.ctaBgImage[0].buffer,
        req.files.ctaBgImage[0].originalname,
        IMAGEKIT_FOLDERS.HOMEPAGE
      );
    }
  }

  await homepage.save();

  return res
    .status(200)
    .json(new ApiResponse(200, homepage, 'Homepage CMS updated successfully'));
});
