import { body } from 'express-validator';

export const createEventValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required'),
  body('eventDate')
    .notEmpty()
    .withMessage('Event start date is required')
    .isISO8601()
    .withMessage('Please provide a valid ISO date for eventDate')
];

export const updateEventValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event title cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Event description cannot be empty'),
  body('eventDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid ISO date for eventDate')
];
