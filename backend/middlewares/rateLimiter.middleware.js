import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

/**
 * Creates a configured rate limiter with consistent ApiError response
 */
const createLimiter = (options) => {
  return rateLimit({
    standardHeaders: true, // Return standard rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, opts) => {
      throw new ApiError(
        429,
        options.message || 'Too many requests from this IP. Please try again later.',
        [],
        '',
        'RATE_LIMIT_EXCEEDED'
      );
    },
    ...options
  });
};

/**
 * Rate limiter for Admin Login endpoint (prevents brute-force attacks)
 * Limit: 10 attempts per 15 minutes per IP
 */
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts. For security reasons, please try again after 15 minutes.'
});

/**
 * Rate limiter for Public Online Admission Application Submissions (prevents spam)
 * Limit: 15 applications per hour per IP
 */
export const admissionLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  message: 'Too many admission applications submitted from this IP address. Please try again later.'
});

/**
 * Rate limiter for Public Enquiry / Lead capture (prevents spam form submissions)
 * Limit: 20 enquiries per hour per IP
 */
export const enquiryLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many enquiry submissions from this IP address. Please try again later.'
});
