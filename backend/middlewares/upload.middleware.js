import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Use memoryStorage so buffers can be streamed directly to ImageKit
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images, PDFs, and videos
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Only JPEG, PNG, WEBP, SVG, GIF, PDF, and MP4/WEBM videos are allowed.`), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  }
});
