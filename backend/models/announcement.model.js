import mongoose from 'mongoose';
import { ANNOUNCEMENT_PRIORITY } from '../utils/constants.js';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Announcement title is required'],
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Announcement description is required']
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    category: {
      type: String,
      default: 'General',
      trim: true // e.g. 'Admissions', 'Exams', 'Holidays', 'Coaching'
    },
    priority: {
      type: String,
      enum: Object.values(ANNOUNCEMENT_PRIORITY),
      default: ANNOUNCEMENT_PRIORITY.MEDIUM
    },
    attachment: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    link: {
      type: String,
      default: ''
    },
    isTicker: {
      type: Boolean,
      default: false
    },
    displayOrder: {
      type: Number,
      default: 0
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

export const Announcement = mongoose.model('Announcement', announcementSchema);
