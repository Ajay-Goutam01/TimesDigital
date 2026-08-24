import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Batch name is required'],
      trim: true // e.g. 'TPS JEE Target 2027'
    },
    slug: {
      type: String,
      required: [true, 'Batch slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required'],
      index: true
    },
    category: {
      type: String,
      required: [true, 'Batch category is required'],
      trim: true // e.g. 'JEE', 'NEET', 'Foundation', 'School Integrated'
    },
    targetYear: {
      type: Number,
      default: new Date().getFullYear() + 1
    },
    class: {
      type: String,
      required: [true, 'Class level is required'],
      trim: true // e.g. 'Class 11', 'Class 12', '12th Pass / Dropper'
    },
    program: {
      type: String,
      trim: true // e.g. 'Target Batch', 'Nurture Batch', 'Achiever Batch'
    },
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Batch description is required']
    },
    duration: {
      type: String,
      default: '1 Year'
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    timings: {
      type: String,
      default: '8:00 AM - 1:30 PM (School) | 2:30 PM - 6:30 PM (Coaching)'
    },
    days: [
      {
        type: String,
        trim: true
      }
    ],
    subjects: [
      {
        type: String,
        trim: true
      }
    ],
    faculty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
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
    feeStructure: {
      tuitionFee: { type: String, default: '' },
      registrationFee: { type: String, default: '' },
      scholarshipUpto: { type: String, default: 'Up to 100%' },
      installmentsInfo: { type: String, default: '' },
      notes: { type: String, default: '' }
    },
    scholarshipInfo: {
      type: String,
      default: 'Scholarships available based on TTSE (Times Talent Scholarship Exam) & Board marks.'
    },
    hostelAvailable: {
      type: Boolean,
      default: true
    },
    batchImage: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    brochure: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    maxSeats: {
      type: Number,
      default: 40
    },
    enrolledCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'admissions-open', 'seats-full', 'completed'],
      default: 'admissions-open'
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
    displayOrder: {
      type: Number,
      default: 0
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

export const Batch = mongoose.model('Batch', batchSchema);
