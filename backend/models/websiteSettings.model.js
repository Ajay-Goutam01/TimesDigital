import mongoose from 'mongoose';

const websiteSettingsSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: 'TIME PUBLIC SCHOOL'
    },
    coachingName: {
      type: String,
      default: 'TIMES DIGITAL'
    },
    tagline: {
      type: String,
      default: 'Excellence in School Education & Competitive Exam Preparation (IIT-JEE / NEET / Foundation)'
    },
    locationTag: {
      type: String,
      default: 'Shahdol, Madhya Pradesh'
    },
    logo: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    coachingLogo: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    favicon: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    primaryPhone: {
      type: String,
      default: '+91 98765 43210'
    },
    secondaryPhone: {
      type: String,
      default: ''
    },
    whatsappNumber: {
      type: String,
      default: '+919876543210'
    },
    admissionPhone: {
      type: String,
      default: '+91 98765 43210'
    },
    email: {
      type: String,
      default: 'info@timepublicschool.edu.in'
    },
    admissionEmail: {
      type: String,
      default: 'admissions@timepublicschool.edu.in'
    },
    schoolAddress: {
      type: String,
      default: 'TIME Public School Campus, Shahdol, Madhya Pradesh - 484001'
    },
    coachingAddress: {
      type: String,
      default: 'TIMES DIGITAL Division, TIME Public School Campus, Shahdol, MP - 484001'
    },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=Shahdol+Madhya+Pradesh'
    },
    googleMapsEmbedUrl: {
      type: String,
      default: ''
    },
    coordinates: {
      lat: { type: Number, default: 23.2957 },
      lng: { type: Number, default: 81.3578 }
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      telegram: { type: String, default: '' }
    },
    footerText: {
      type: String,
      default: 'Nurturing future leaders and top rankers in Shahdol with world-class faculty, modern digital classrooms, and personalized mentorship.'
    },
    copyrightText: {
      type: String,
      default: `© ${new Date().getFullYear()} TIME Public School & TIMES DIGITAL. All Rights Reserved.`
    },
    isAdmissionOpen: {
      type: Boolean,
      default: true
    },
    admissionNoticeText: {
      type: String,
      default: 'Admissions Open for Academic Session 2025-26 & Target Batches for JEE/NEET 2026-27'
    },
    workingHours: {
      type: String,
      default: 'Mon - Sat: 8:00 AM - 6:00 PM'
    },
    affiliationNumber: {
      type: String,
      default: ''
    },
    schoolCode: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const WebsiteSettings = mongoose.model('WebsiteSettings', websiteSettingsSchema);
