import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Event slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required']
    },
    eventDate: {
      type: Date,
      required: [true, 'Event start date is required'],
      index: true
    },
    endDate: {
      type: Date
    },
    startTime: {
      type: String,
      default: '' // e.g. '09:00 AM'
    },
    endTime: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'School Auditorium, TIME Public School, Shahdol'
    },
    coverImage: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
      fileName: { type: String, default: '' }
    },
    gallery: [
      {
        url: { type: String, default: '' },
        fileId: { type: String, default: '' },
        fileName: { type: String, default: '' }
      }
    ],
    registrationRequired: {
      type: Boolean,
      default: false
    },
    registrationLink: {
      type: String,
      default: ''
    },
    registrationDeadline: {
      type: Date
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

export const Event = mongoose.model('Event', eventSchema);
