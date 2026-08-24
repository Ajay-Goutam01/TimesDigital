import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Course } from '../models/course.model.js';
import { Batch } from '../models/batch.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Result } from '../models/result.model.js';
import { Gallery } from '../models/gallery.model.js';
import { Video } from '../models/video.model.js';
import { Announcement } from '../models/announcement.model.js';
import { Event } from '../models/event.model.js';
import { Facility } from '../models/facility.model.js';
import { Testimonial } from '../models/testimonial.model.js';
import { Admission } from '../models/admission.model.js';
import { Enquiry } from '../models/enquiry.model.js';

export const clearDemoData = async () => {
  console.log('\n==================================================');
  console.log('TIME PUBLIC SCHOOL + TIMES DIGITAL');
  console.log('CLEAR DEMO DATA');
  console.log('==================================================\n');
  console.log('Clearing only records with demo identifiers (slug /^demo-/)...');

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/times_digital_db';
  await mongoose.connect(mongoUri);

  try {
    const demoFilter = { slug: /^demo-/ };

    const deletedCourses = await Course.deleteMany(demoFilter);
    const deletedBatches = await Batch.deleteMany(demoFilter);
    const deletedFaculty = await Faculty.deleteMany(demoFilter);
    const deletedResults = await Result.deleteMany(demoFilter);
    const deletedGalleries = await Gallery.deleteMany(demoFilter);
    const deletedVideos = await Video.deleteMany(demoFilter);
    const deletedAnnouncements = await Announcement.deleteMany(demoFilter);
    const deletedEvents = await Event.deleteMany(demoFilter);
    const deletedFacilities = await Facility.deleteMany(demoFilter);
    const deletedTestimonials = await Testimonial.deleteMany({
      $or: [{ name: /DEMO/i }, { name: /\(Parent of/i }]
    });
    const deletedAdmissions = await Admission.deleteMany({
      $or: [{ applicationNumber: /^TPS-2025-001/ }, { studentName: /DEMO/i }]
    });
    const deletedEnquiries = await Enquiry.deleteMany({
      $or: [{ name: /DEMO/i }, { email: /\.example$/ }]
    });

    console.log(`Cleared:`);
    console.log(`- Courses:       ${deletedCourses.deletedCount}`);
    console.log(`- Batches:       ${deletedBatches.deletedCount}`);
    console.log(`- Faculty:       ${deletedFaculty.deletedCount}`);
    console.log(`- Results:       ${deletedResults.deletedCount}`);
    console.log(`- Galleries:     ${deletedGalleries.deletedCount}`);
    console.log(`- Videos:        ${deletedVideos.deletedCount}`);
    console.log(`- Announcements: ${deletedAnnouncements.deletedCount}`);
    console.log(`- Events:        ${deletedEvents.deletedCount}`);
    console.log(`- Facilities:    ${deletedFacilities.deletedCount}`);
    console.log(`- Testimonials:  ${deletedTestimonials.deletedCount}`);
    console.log(`- Admissions:    ${deletedAdmissions.deletedCount}`);
    console.log(`- Enquiries:     ${deletedEnquiries.deletedCount}`);

    console.log('\n==================================================');
    console.log('DEMO DATA CLEANUP COMPLETE (Real data intact)');
    console.log('==================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing demo data:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
};

clearDemoData();
