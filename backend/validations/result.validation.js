import { body } from 'express-validator';
import { EXAM_TYPES } from '../utils/constants.js';

export const createResultValidator = [
  body('studentName')
    .trim()
    .notEmpty()
    .withMessage('Student name is required'),
  body('exam')
    .trim()
    .notEmpty()
    .withMessage('Exam name is required')
    .isIn(Object.values(EXAM_TYPES))
    .withMessage(`Exam must be one of: ${Object.values(EXAM_TYPES).join(', ')}`),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Please provide a valid 4-digit year')
];

export const updateResultValidator = [
  body('studentName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Student name cannot be empty'),
  body('exam')
    .optional()
    .isIn(Object.values(EXAM_TYPES))
    .withMessage(`Exam must be one of: ${Object.values(EXAM_TYPES).join(', ')}`),
  body('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Please provide a valid 4-digit year')
];
