import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `API Route Not Found - [${req.method}] ${req.originalUrl}`);
  next(error);
};
