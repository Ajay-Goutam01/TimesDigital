import { body } from 'express-validator';
import { GALLERY_CATEGORIES } from '../utils/constants.js';

export const createGalleryValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Gallery album title is required'),
  body('category')
    .optional()
    .isIn(Object.values(GALLERY_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(GALLERY_CATEGORIES).join(', ')}`)
];

export const updateGalleryValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Gallery title cannot be empty'),
  body('category')
    .optional()
    .isIn(Object.values(GALLERY_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(GALLERY_CATEGORIES).join(', ')}`)
];
