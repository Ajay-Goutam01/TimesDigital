import { body } from 'express-validator';

export const createTestimonialValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Testimonial message is required'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  body('studentOrParent')
    .optional()
    .isIn(['Student', 'Parent', 'Alumni', 'Faculty'])
    .withMessage('Must be Student, Parent, Alumni, or Faculty')
];

export const updateTestimonialValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),
  body('message')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Testimonial message cannot be empty'),
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5')
];
