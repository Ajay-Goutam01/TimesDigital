import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    role: {
      type: String,
      default: 'Student',
      trim: true // e.g. 'Student', 'Parent', 'JEE 2024 Ranker', 'Alumni'
    },
    studentOrParent: {
      type: String,
      enum: ['Student', 'Parent', 'Alumni', 'Faculty'],
      default: 'Student'
    },
    photo: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    classOrCourse: {
      type: String,
      trim: true // e.g. 'Class 12 - JEE Target 2024'
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    },
    message: {
      type: String,
      required: [true, 'Testimonial message is required'],
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
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

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
