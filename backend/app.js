import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import websiteSettingsRoutes from './routes/websiteSettings.routes.js';
import homepageRoutes from './routes/homepage.routes.js';
import courseRoutes from './routes/course.routes.js';
import batchRoutes from './routes/batch.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import resultRoutes from './routes/result.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import videoRoutes from './routes/video.routes.js';
import announcementRoutes from './routes/announcement.routes.js';
import eventRoutes from './routes/event.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import admissionRoutes from './routes/admission.routes.js';
import enquiryRoutes from './routes/enquiry.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Import Middlewares
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ApiResponse } from './utils/ApiResponse.js';

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or if allowed
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Request Loggers
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request Parsers
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie_secret_times_digital'));

// Health Check API
app.get('/api/health', (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        institution: 'TIME PUBLIC SCHOOL & TIMES DIGITAL, Shahdol, MP',
        environment: process.env.NODE_ENV || 'development'
      },
      'Times Digital Backend Server is running healthy'
    )
  );
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/website-settings', websiteSettingsRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/enquiries', enquiryRoutes);

// 404 Handler
app.use(notFound);

// Centralized Error Middleware
app.use(errorHandler);

export default app;
