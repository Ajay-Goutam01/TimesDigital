import mongoose from 'mongoose';
import { GALLERY_CATEGORIES } from '../utils/constants.js';

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Gallery album title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Gallery slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      enum: Object.values(GALLERY_CATEGORIES),
      default: GALLERY_CATEGORIES.CAMPUS,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    coverImage: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
        fileName: { type: String, default: '' },
        caption: { type: String, default: '' },
        displayOrder: { type: Number, default: 0 }
      }
    ],
    eventDate: {
      type: Date
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

export const Gallery = mongoose.model('Gallery', gallerySchema);
