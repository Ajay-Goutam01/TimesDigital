import { body } from 'express-validator';
import { FACULTY_CATEGORIES } from '../utils/constants.js';

export const createFacultyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Faculty name is required'),
  body('designation')
    .trim()
    .notEmpty()
    .withMessage('Designation is required'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  body('qualification')
    .trim()
    .notEmpty()
    .withMessage('Qualification is required'),
  body('category')
    .optional()
    .isIn(Object.values(FACULTY_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(FACULTY_CATEGORIES).join(', ')}`)
];

export const updateFacultyValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Faculty name cannot be empty'),
  body('designation')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Designation cannot be empty'),
  body('subject')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subject cannot be empty'),
  body('category')
    .optional()
    .isIn(Object.values(FACULTY_CATEGORIES))
    .withMessage(`Category must be one of: ${Object.values(FACULTY_CATEGORIES).join(', ')}`)
];
