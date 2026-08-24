import { body } from 'express-validator';
import { ADMISSION_STATUS } from '../utils/constants.js';

export const createAdmissionValidator = [
  body('studentName')
    .trim()
    .notEmpty()
    .withMessage('Student name is required'),
  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Contact mobile number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Please provide a valid contact number (10-15 digits)'),
  body('applyingForClass')
    .trim()
    .notEmpty()
    .withMessage('Applying for class is required'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('course')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid course MongoDB ID'),
  body('batch')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid batch MongoDB ID')
];

export const updateAdmissionStatusValidator = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(ADMISSION_STATUS))
    .withMessage(`Status must be one of: ${Object.values(ADMISSION_STATUS).join(', ')}`),
  body('note')
    .optional()
    .trim()
];
