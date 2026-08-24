import { body } from 'express-validator';

export const createBatchValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Batch name is required'),
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course ID reference is required')
    .isMongoId()
    .withMessage('Invalid course MongoDB ID'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Batch category is required'),
  body('class')
    .trim()
    .notEmpty()
    .withMessage('Class level is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Batch description is required')
];

export const updateBatchValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Batch name cannot be empty'),
  body('course')
    .optional()
    .trim()
    .isMongoId()
    .withMessage('Invalid course MongoDB ID'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Batch category cannot be empty'),
  body('class')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Class level cannot be empty')
];
