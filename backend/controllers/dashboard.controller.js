import { Batch } from '../models/batch.model.js';
import { Course } from '../models/course.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Result } from '../models/result.model.js';
import { Gallery } from '../models/gallery.model.js';
import { Video } from '../models/video.model.js';
import { Announcement } from '../models/announcement.model.js';
import { Admission } from '../models/admission.model.js';
import { Enquiry } from '../models/enquiry.model.js';
import { Event } from '../models/event.model.js';
import { Facility } from '../models/facility.model.js';
import { Testimonial } from '../models/testimonial.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ADMISSION_STATUS, ENQUIRY_STATUS } from '../utils/constants.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalBatches,
    publishedBatches,
    totalCourses,
    totalFaculty,
    totalResults,
    totalGalleries,
    totalVideos,
    totalAnnouncements,
    totalEvents,
    totalFacilities,
    totalTestimonials,
    totalAdmissions,
    newAdmissions,
    totalEnquiries,
    newEnquiries,
    recentAdmissions,
    recentEnquiries
  ] = await Promise.all([
    Batch.countDocuments({ isDeleted: false }),
    Batch.countDocuments({ isDeleted: false, isPublished: true }),
    Course.countDocuments({ isDeleted: false }),
    Faculty.countDocuments({ isDeleted: false }),
    Result.countDocuments({ isDeleted: false }),
    Gallery.countDocuments({ isDeleted: false }),
    Video.countDocuments({ isDeleted: false }),
    Announcement.countDocuments({ isDeleted: false }),
    Event.countDocuments({ isDeleted: false }),
    Facility.countDocuments({ isDeleted: false }),
    Testimonial.countDocuments({ isDeleted: false }),
    Admission.countDocuments({ isDeleted: false }),
    Admission.countDocuments({ isDeleted: false, status: ADMISSION_STATUS.NEW }),
    Enquiry.countDocuments({ isDeleted: false }),
    Enquiry.countDocuments({ isDeleted: false, status: ENQUIRY_STATUS.NEW }),
    Admission.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('applicationNumber studentName applyingForClass mobile status createdAt')
      .populate('batch', 'name'),
    Enquiry.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name phone class interestedProgram status createdAt source')
      .populate('interestedBatch', 'name')
  ]);

  const stats = {
    counts: {
      batches: {
        total: totalBatches,
        published: publishedBatches
      },
      courses: totalCourses,
      faculty: totalFaculty,
      results: totalResults,
      galleries: totalGalleries,
      videos: totalVideos,
      announcements: totalAnnouncements,
      events: totalEvents,
      facilities: totalFacilities,
      testimonials: totalTestimonials,
      admissions: {
        total: totalAdmissions,
        new: newAdmissions
      },
      enquiries: {
        total: totalEnquiries,
        new: newEnquiries
      }
    },
    recentActivity: {
      admissions: recentAdmissions,
      enquiries: recentEnquiries
    }
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, 'Admin dashboard stats aggregated successfully'));
});
