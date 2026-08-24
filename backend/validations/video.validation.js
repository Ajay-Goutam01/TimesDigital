import { body } from 'express-validator';
import { VIDEO_CATEGORIES } from '../utils/constants.js';

export const createVideoValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Video title is required'),
  body('videoUrl')
    .trim()
    .notEmpty()
    .withMessage('Video URL or embed link is required'),
  body('category')
    .optional()
    .isIn(Object.values(VIDEO_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(VIDEO_CATEGORIES).join(', ')}`)
];

export const updateVideoValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Video title cannot be empty'),
  body('videoUrl')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Video URL cannot be empty'),
  body('category')
    .optional()
    .isIn(Object.values(VIDEO_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(VIDEO_CATEGORIES).join(', ')}`)
];
