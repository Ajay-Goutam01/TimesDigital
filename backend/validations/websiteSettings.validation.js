import { body } from 'express-validator';

export const updateWebsiteSettingsValidator = [
  body('schoolName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('School name cannot be empty'),
  body('coachingName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Coaching name cannot be empty'),
  body('primaryPhone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Primary phone cannot be empty'),
  body('whatsappNumber')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('WhatsApp number cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
];
