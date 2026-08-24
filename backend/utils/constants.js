export const ROLES = Object.freeze({
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin'
});

export const ADMISSION_STATUS = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  PROCESSING: 'processing',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CONVERTED: 'converted'
});

export const ENQUIRY_STATUS = Object.freeze({
  NEW: 'new',
  CONTACTED: 'contacted',
  FOLLOW_UP: 'follow-up',
  CONVERTED: 'converted',
  CLOSED: 'closed'
});

export const FACULTY_CATEGORIES = Object.freeze({
  SCHOOL: 'School Faculty',
  JEE: 'JEE Faculty',
  NEET: 'NEET Faculty',
  FOUNDATION: 'Foundation Faculty'
});

export const EXAM_TYPES = Object.freeze({
  JEE_MAIN: 'JEE Main',
  JEE_ADVANCED: 'JEE Advanced',
  NEET: 'NEET',
  SCHOOL_BOARDS: 'School Results',
  FOUNDATION_OLYMPIAD: 'Foundation & Olympiad',
  OTHER: 'Other'
});

export const GALLERY_CATEGORIES = Object.freeze({
  CAMPUS: 'Campus',
  ANNUAL_FUNCTION: 'Annual Function',
  SPORTS: 'Sports',
  CULTURAL_EVENTS: 'Cultural Events',
  INDEPENDENCE_DAY: 'Independence Day',
  REPUBLIC_DAY: 'Republic Day',
  CLASSROOM: 'Classroom',
  JEE_NEET: 'JEE/NEET',
  ACHIEVEMENTS: 'Achievements',
  EDUCATIONAL_TOURS: 'Educational Tours',
  OTHER: 'Other'
});

export const VIDEO_CATEGORIES = Object.freeze({
  CAMPUS: 'Campus',
  SCHOOL_EVENTS: 'School Events',
  TIMES_DIGITAL: 'Times Digital',
  JEE: 'JEE',
  NEET: 'NEET',
  ACHIEVEMENTS: 'Achievements',
  TESTIMONIALS: 'Testimonials',
  OTHER: 'Other'
});

export const ANNOUNCEMENT_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
});

export const IMAGEKIT_FOLDERS = Object.freeze({
  SETTINGS: 'times-school/settings',
  FACULTY: 'times-school/faculty',
  GALLERY: 'times-school/gallery',
  RESULTS: 'times-school/results',
  BATCHES: 'times-school/batches',
  COURSES: 'times-school/courses',
  EVENTS: 'times-school/events',
  FACILITIES: 'times-school/facilities',
  TESTIMONIALS: 'times-school/testimonials',
  VIDEOS: 'times-school/videos',
  ANNOUNCEMENTS: 'times-school/announcements',
  HOMEPAGE: 'times-school/homepage'
});
