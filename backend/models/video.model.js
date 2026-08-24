import mongoose from 'mongoose';
import { VIDEO_CATEGORIES } from '../utils/constants.js';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Video slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL or Embed link is required'],
      trim: true
    },
    videoType: {
      type: String,
      enum: ['youtube', 'vimeo', 'imagekit', 'custom'],
      default: 'youtube'
    },
    imagekitVideo: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' }
    },
    thumbnail: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    category: {
      type: String,
      enum: Object.values(VIDEO_CATEGORIES),
      default: VIDEO_CATEGORIES.CAMPUS,
      index: true
    },
    duration: {
      type: String,
      default: '' // e.g. '03:45'
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

export const Video = mongoose.model('Video', videoSchema);
