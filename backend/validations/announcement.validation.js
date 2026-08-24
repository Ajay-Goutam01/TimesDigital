import { body } from 'express-validator';
import { ANNOUNCEMENT_PRIORITY } from '../utils/constants.js';

export const createAnnouncementValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Announcement title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Announcement description is required'),
  body('priority')
    .optional()
    .isIn(Object.values(ANNOUNCEMENT_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(ANNOUNCEMENT_PRIORITY).join(', ')}`)
];

export const updateAnnouncementValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Announcement title cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Announcement description cannot be empty'),
  body('priority')
    .optional()
    .isIn(Object.values(ANNOUNCEMENT_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(ANNOUNCEMENT_PRIORITY).join(', ')}`)
];
