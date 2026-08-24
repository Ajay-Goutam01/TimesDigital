import { body } from 'express-validator';

export const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Course category is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Course description is required')
];

export const updateCourseValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course title cannot be empty'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course category cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course description cannot be empty')
];
