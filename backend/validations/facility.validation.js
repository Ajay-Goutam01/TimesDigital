import { body } from 'express-validator';

export const createFacilityValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Facility title is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Facility description is required')
];

export const updateFacilityValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Facility title cannot be empty'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Facility description cannot be empty')
];
