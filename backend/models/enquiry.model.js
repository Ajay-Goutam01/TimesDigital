import mongoose from 'mongoose';
import { ENQUIRY_STATUS } from '../utils/constants.js';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Enquirer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    class: {
      type: String,
      trim: true
    },
    interestedProgram: {
      type: String,
      trim: true // e.g. 'IIT-JEE', 'NEET', 'Foundation', 'Class 11 School'
    },
    interestedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    interestedBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      index: true
    },
    message: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      default: 'Website',
      trim: true // e.g. 'Batch Page: TPS JEE Target 2027', 'Home Hero Form', 'Contact Page'
    },
    sourceUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: ENQUIRY_STATUS.NEW,
      index: true
    },
    adminNotes: [
      {
        note: { type: String, required: true },
        date: { type: Date, default: Date.now },
        author: { type: String, default: 'Admin' }
      }
    ],
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

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
