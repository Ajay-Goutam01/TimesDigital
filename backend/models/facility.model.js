import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Facility title is required'],
      trim: true // e.g. 'Smart Classrooms', 'Advanced Physics & Chemistry Labs', 'Hostel Facility'
    },
    slug: {
      type: String,
      required: [true, 'Facility slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      default: 'Infrastructure',
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Facility description is required']
    },
    icon: {
      type: String,
      default: '' // e.g. 'microscope', 'book', 'wifi', 'bus'
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    images: [
      {
        url: { type: String, default: '' },
        fileId: { type: String, default: '' },
        fileName: { type: String, default: '' },
        caption: { type: String, default: '' }
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

export const Facility = mongoose.model('Facility', facilitySchema);
