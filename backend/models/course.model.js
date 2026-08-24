import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Course slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true // e.g. 'IIT-JEE', 'NEET', 'Foundation', 'School Integrated'
    },
    classes: [
      {
        type: String,
        trim: true // e.g. 'Class 11', 'Class 12', '12th Pass / Dropper'
      }
    ],
    duration: {
      type: String,
      default: '1 Year / 2 Year'
    },
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    subjects: [
      {
        type: String,
        trim: true
      }
    ],
    features: [
      {
        type: String,
        trim: true
      }
    ],
    eligibility: {
      type: String,
      trim: true
    },
    syllabusOverview: {
      type: String,
      trim: true
    },
    image: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    faculty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for batches in this course
courseSchema.virtual('batches', {
  ref: 'Batch',
  localField: '_id',
  foreignField: 'course'
});

export const Course = mongoose.model('Course', courseSchema);
