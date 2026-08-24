import mongoose from 'mongoose';
import { EXAM_TYPES } from '../utils/constants.js';

const resultSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true
    },
    studentPhoto: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    exam: {
      type: String,
      enum: Object.values(EXAM_TYPES),
      required: [true, 'Exam type is required'],
      index: true
    },
    year: {
      type: Number,
      required: [true, 'Exam year is required'],
      index: true
    },
    score: {
      type: String,
      trim: true // e.g. '685 / 720' or '99.42 %ile'
    },
    rank: {
      type: String,
      trim: true // e.g. 'AIR 215'
    },
    allIndiaRank: {
      type: Number
    },
    categoryRank: {
      type: Number
    },
    percentile: {
      type: String,
      trim: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    },
    collegeAllotted: {
      type: String,
      trim: true // e.g. 'IIT Bombay (Computer Science)', 'AIIMS Bhopal'
    },
    achievementTitle: {
      type: String,
      trim: true // e.g. 'District Topper Shahdol', 'Vindhya Region 1st Rank'
    },
    description: {
      type: String,
      trim: true
    },
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

export const Result = mongoose.model('Result', resultSchema);
