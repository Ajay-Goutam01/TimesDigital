import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || (error.name === 'ValidationError' ? 422 : 500);
    let message = error.message || 'Internal Server Error';
    let errors = [];
    let code = error.code || null;

    // Handle Mongoose Validation Error
    if (error.name === 'ValidationError' && error.errors) {
      statusCode = 422;
      message = 'Mongoose validation failed';
      errors = Object.values(error.errors).map((val) => ({
        field: val.path,
        message: val.message
      }));
    }

    // Handle Mongoose Duplicate Key Error (E11000)
    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      message = `Duplicate field value entered for '${field}'. Please use another value.`;
      errors = [{ field, message }];
    }

    // Handle Mongoose CastError (Invalid ObjectId)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Resource not found or invalid identifier format for '${error.path}'`;
      errors = [{ field: error.path, value: error.value }];
    }

    // Handle JWT Errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token. Please log in again.';
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token has expired. Please log in again.';
    }

    // Handle Multer Errors
    if (error.name === 'MulterError') {
      statusCode = 400;
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = 'File size is too large. Maximum allowed size is 15MB.';
      } else {
        message = `File upload error: ${error.message}`;
      }
    }

    error = new ApiError(statusCode, message, errors, error.stack, code);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || []
  };

  if (error.code) {
    response.code = error.code;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode || 500).json(response);
};
