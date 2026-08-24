import { body } from 'express-validator';
import { ENQUIRY_STATUS } from '../utils/constants.js';

export const createEnquiryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 15 })
    .withMessage('Please provide a valid phone number (10-15 digits)'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('interestedCourse')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid course MongoDB ID'),
  body('interestedBatch')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid batch MongoDB ID')
];

export const updateEnquiryStatusValidator = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(ENQUIRY_STATUS))
    .withMessage(`Status must be one of: ${Object.values(ENQUIRY_STATUS).join(', ')}`),
  body('note')
    .optional()
    .trim()
];
