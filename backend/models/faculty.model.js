import mongoose from 'mongoose';
import { FACULTY_CATEGORIES } from '../utils/constants.js';

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Faculty slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    profilePhoto: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true // e.g. 'Senior Physics Faculty (Ex-Kota)', 'HOD Chemistry', 'Academic Director'
    },
    department: {
      type: String,
      trim: true // e.g. 'Science & Engineering Division', 'Medical Division', 'School Humanities'
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true // e.g. 'Physics', 'Mathematics', 'Organic Chemistry', 'Botany'
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true // e.g. 'B.Tech (IIT Delhi)', 'M.Sc (Physics), B.Ed', 'MBBS'
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    specialization: {
      type: String,
      trim: true // e.g. 'Mechanics & Electrodynamics Expert for JEE Advanced'
    },
    shortBio: {
      type: String,
      trim: true
    },
    detailedBio: {
      type: String
    },
    achievements: [
      {
        type: String,
        trim: true // e.g. 'Mentored AIR 42 in JEE Advanced', 'Author of Physics Simplified'
      }
    ],
    category: {
      type: String,
      enum: Object.values(FACULTY_CATEGORIES),
      default: FACULTY_CATEGORIES.SCHOOL,
      index: true
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
      }
    ],
    displayOrder: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const Faculty = mongoose.model('Faculty', facultySchema);
