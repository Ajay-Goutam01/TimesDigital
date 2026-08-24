import mongoose from 'mongoose';
import { ADMISSION_STATUS } from '../utils/constants.js';

const admissionSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      index: true
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    fatherName: {
      type: String,
      trim: true
    },
    motherName: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male'
    },
    mobile: {
      type: String,
      required: [true, 'Contact mobile number is required'],
      trim: true,
      index: true
    },
    altMobile: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: 'Madhya Pradesh' },
      pincode: { type: String, default: '' }
    },
    previousSchool: {
      type: String,
      trim: true
    },
    previousScoreOrPercentage: {
      type: String,
      trim: true
    },
    currentClass: {
      type: String,
      trim: true
    },
    applyingForClass: {
      type: String,
      required: [true, 'Applying for class is required'],
      trim: true
    },
    program: {
      type: String,
      default: 'School + Coaching Integrated',
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
    hostelRequired: {
      type: Boolean,
      default: false
    },
    transportRequired: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      trim: true
    },
    documents: [
      {
        title: { type: String, default: '' },
        url: { type: String, default: '' },
        fileId: { type: String, default: '' }
      }
    ],
    status: {
      type: String,
      enum: Object.values(ADMISSION_STATUS),
      default: ADMISSION_STATUS.NEW,
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

// Auto-generate unique application number before saving
admissionSchema.pre('save', function (next) {
  if (!this.applicationNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.applicationNumber = `TPS-${timestamp}-${random}`;
  }
  next();
});

export const Admission = mongoose.model('Admission', admissionSchema);
