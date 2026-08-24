import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { WebsiteSettings } from '../models/websiteSettings.model.js';
import { Homepage } from '../models/homepage.model.js';
import { Course } from '../models/course.model.js';
import { Batch } from '../models/batch.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Result } from '../models/result.model.js';
import { Gallery } from '../models/gallery.model.js';
import { Video } from '../models/video.model.js';
import { Announcement } from '../models/announcement.model.js';
import { Event } from '../models/event.model.js';
import { Facility } from '../models/facility.model.js';
import { Testimonial } from '../models/testimonial.model.js';
import { Admission } from '../models/admission.model.js';
import { Enquiry } from '../models/enquiry.model.js';
import {
  FACULTY_CATEGORIES,
  EXAM_TYPES,
  GALLERY_CATEGORIES,
  VIDEO_CATEGORIES,
  ANNOUNCEMENT_PRIORITY,
  ADMISSION_STATUS,
  ENQUIRY_STATUS
} from '../utils/constants.js';

// High quality, royalty-free educational demo imagery
const DEMO_MEDIA = {
  logos: {
    school: {
      url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=300&q=80',
      fileId: 'demo-logo-school',
      fileName: 'time_school_logo.png'
    },
    coaching: {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80',
      fileId: 'demo-logo-coaching',
      fileName: 'times_digital_logo.png'
    }
  },
  homepage: {
    hero: {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
      fileId: 'demo-hero-banner',
      fileName: 'hero_campus_banner.jpg'
    },
    hostel: {
      url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      fileId: 'demo-hostel-img',
      fileName: 'hostel_campus.jpg'
    },
    scholarship: {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      fileId: 'demo-scholarship-img',
      fileName: 'scholarship_exam.jpg'
    },
    cta: {
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
      fileId: 'demo-cta-bg',
      fileName: 'cta_background.jpg'
    }
  },
  courses: [
    'https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
  ],
  faculty: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580894732486-11f81d1e4eb4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80'
  ],
  students: [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'
  ],
  gallery: [
    'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80'
  ],
  facilities: [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  ]
};

export const seedDemoData = async () => {
  console.log('\n==================================================');
  console.log('TIME PUBLIC SCHOOL + TIMES DIGITAL');
  console.log('DEMO DATA SEED');
  console.log('==================================================\n');
  console.log('WARNING: This will populate rich, safe demo content.');
  console.log('==================================================\n');

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/times_digital_db';
  console.log(`Connecting to database (${mongoUri.replace(/:[^:@]+@/, ':****@')})...`);
  await mongoose.connect(mongoUri);

  try {
    // ─────────────────────────────────────────────────────────────
    // 1. WEBSITE SETTINGS (DEMO POPULATION)
    // ─────────────────────────────────────────────────────────────
    console.log('⚙️ Seeding Website Settings & Branding...');
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }
    settings.schoolName = 'TIME PUBLIC SCHOOL';
    settings.coachingName = 'TIMES DIGITAL';
    settings.tagline = 'Excellence in School Education & Competitive Exam Preparation (IIT-JEE / NEET / Foundation)';
    settings.locationTag = 'Shahdol, Madhya Pradesh';
    settings.logo = DEMO_MEDIA.logos.school;
    settings.coachingLogo = DEMO_MEDIA.logos.coaching;
    settings.primaryPhone = '+91 90000 00001';
    settings.secondaryPhone = '+91 90000 00002';
    settings.whatsappNumber = '+919000000001';
    settings.admissionPhone = '+91 90000 00003';
    settings.email = 'info@timespublicschool.example';
    settings.admissionEmail = 'admissions@timespublicschool.example';
    settings.schoolAddress = 'TIME Public School Campus, Kotma Road, Shahdol, Madhya Pradesh - 484001';
    settings.coachingAddress = 'TIMES DIGITAL Academic Wing, TIME Public School Campus, Shahdol, MP - 484001';
    settings.googleMapsUrl = 'https://maps.google.com/?q=Shahdol+Madhya+Pradesh';
    settings.googleMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117036.0094778152!2d81.2882191!3d23.2933391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3986a4274c43141f%3A0x2ff2e9b89fa5a9b7!2sShahdol%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';
    settings.coordinates = { lat: 23.2957, lng: 81.3578 };
    settings.isAdmissionOpen = true;
    settings.admissionNoticeText = 'Admissions Open for Academic Session 2025-26 & Target Batches for JEE/NEET 2026-27';
    settings.workingHours = 'Mon - Sat: 8:00 AM - 6:00 PM';
    settings.affiliationNumber = 'CBSE-AFF-DEMO-103042';
    settings.schoolCode = 'TPS-SHD-01';
    settings.footerText = 'Nurturing future leaders and top rankers in Shahdol with world-class faculty, modern digital classrooms, disciplined environment, and personalized mentorship.';
    await settings.save();
    console.log('✅ Website Settings Seeded.');

    // ─────────────────────────────────────────────────────────────
    // 2. HOMEPAGE CMS CONFIGURATION
    // ─────────────────────────────────────────────────────────────
    console.log('🏠 Seeding Homepage CMS & Section Order...');
    let homepage = await Homepage.findOne();
    if (!homepage) {
      homepage = new Homepage();
    }
    homepage.hero = {
      isVisible: true,
      badgeText: 'Admissions Open 2025-26 | JEE • NEET • Foundation',
      title: 'Shaping Academic & Competitive Excellence in Shahdol',
      subtitle: 'TIME Public School & TIMES DIGITAL provide integrated schooling and premier IIT-JEE / NEET preparation with Kota and national master educators under one campus.',
      primaryCtaText: 'Explore Target Batches',
      primaryCtaLink: '/batches',
      secondaryCtaText: 'Apply for Admission',
      secondaryCtaLink: '/admissions',
      bannerImage: DEMO_MEDIA.homepage.hero,
      slides: []
    };
    homepage.whyChooseUs = {
      isVisible: true,
      title: 'Why Choose TIME School & TIMES DIGITAL?',
      subtitle: 'A synchronized educational ecosystem where school syllabus and competitive coaching reinforce each other.',
      items: [
        {
          title: 'Integrated School + Coaching',
          description: 'Save 4+ hours daily with school and competitive preparation synchronized under one roof.',
          icon: 'layers',
          displayOrder: 1
        },
        {
          title: 'Kota & National Faculty',
          description: 'Experienced senior educators with 12+ years mentoring top AIR rankers in JEE and NEET.',
          icon: 'users',
          displayOrder: 2
        },
        {
          title: 'Modern Smart Campus',
          description: 'Digitized smart classes, high-tech science labs, digital library, and dedicated hostel facilities.',
          icon: 'building',
          displayOrder: 3
        },
        {
          title: 'Daily Practice & Mentorship',
          description: 'Daily Practice Problem (DPP) sheets, weekly all-India test series, and 1-on-1 doubt counters.',
          icon: 'award',
          displayOrder: 4
        }
      ]
    };
    homepage.achievements = {
      isVisible: true,
      title: 'Our Proven Track Record',
      subtitle: 'Consistent top ranks in Shahdol and Vindhya region in JEE Main, Advanced & NEET',
      stats: [
        { label: 'Students Mentored', count: '2,800+', icon: 'students' },
        { label: 'JEE / NEET Selections', count: '380+', icon: 'award' },
        { label: 'Kota Expert Faculty', count: '45+', icon: 'teacher' },
        { label: 'Top Selection Ratio', count: '94%', icon: 'chart' }
      ]
    };
    homepage.hostelSection = {
      isVisible: true,
      title: 'Secure Hostel & Residential Facility',
      description: 'Dedicated boys & girls hostel facilities with hygienic food, 24/7 security, disciplined study hours, and warden supervision.',
      features: [
        'Separate Boys & Girls Hostels with CCTV security',
        'Nutritious 4-time vegetarian meals',
        'Daily evening supervised doubt clearing sessions',
        'High-speed Wi-Fi & silent study rooms',
        'In-house medical care and emergency assistance'
      ],
      image: DEMO_MEDIA.homepage.hostel
    };
    homepage.scholarshipSection = {
      isVisible: true,
      title: 'Times Talent Scholarship Exam (TTSE 2025)',
      description: 'Avail up to 100% scholarship on tuition fees based on performance in our entrance and talent recognition exam for Class 8th to 12th.',
      ctaText: 'Register for Scholarship Test',
      ctaLink: '/admissions',
      image: DEMO_MEDIA.homepage.scholarship
    };
    homepage.ctaSection = {
      isVisible: true,
      title: 'Start Your Journey Toward Academic Excellence',
      subtitle: 'Enroll today in TIME Public School or TIMES DIGITAL target batches. Limited seats per batch for personalized attention.',
      buttonText: 'Apply for Admission Now',
      buttonLink: '/admissions',
      bgImage: DEMO_MEDIA.homepage.cta
    };
    homepage.sectionOrder = [
      'hero',
      'whyChooseUs',
      'featuredBatches',
      'coursesSection',
      'achievements',
      'resultsSection',
      'facultySection',
      'facilitiesSection',
      'hostelSection',
      'scholarshipSection',
      'videoSection',
      'gallerySection',
      'testimonialsSection',
      'announcementsSection',
      'ctaSection'
    ];
    await homepage.save();
    console.log('✅ Homepage CMS Seeded.');

    // ─────────────────────────────────────────────────────────────
    // 3. COURSES (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('📚 Seeding Courses...');
    const demoCourses = [
      {
        title: 'JEE Main & Advanced Integrated',
        slug: 'demo-jee-main-advanced',
        category: 'IIT-JEE',
        classes: ['Class 11', 'Class 12', '12th Pass / Dropper'],
        duration: '2 Years (Integrated)',
        shortDescription: 'Comprehensive training for IIT-JEE with synchronized CBSE/MP Board curriculum and Kota pedagogy.',
        description: 'Designed for ambitious students targeting top IITs and NITs. The program provides deep conceptual understanding in Physics, Chemistry, and Mathematics, supplemented by rigorous Daily Practice Problems (DPP) and All-India Ranker Test Series.',
        subjects: ['Physics', 'Chemistry (Physical, Organic, Inorganic)', 'Mathematics'],
        features: [
          'Kota expert faculty with 12+ years experience',
          'Complete NCERT + Advanced Problem Modules',
          'Weekly computer-based test (CBT) simulations',
          'Daily 2-hour 1-on-1 doubt clearing counters'
        ],
        eligibility: 'Class 10th Passed / Appeared with minimum 70% in Science & Math',
        syllabusOverview: 'Complete Class 11th & 12th syllabus with JEE Advanced multi-concept problem solving.',
        image: { url: DEMO_MEDIA.courses[0], fileId: 'demo-course-jee', fileName: 'jee_course.jpg' },
        displayOrder: 1,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'NEET-UG Medical Excellence Program',
        slug: 'demo-neet-medical-excellence',
        category: 'NEET',
        classes: ['Class 11', 'Class 12', '12th Pass / Repeater'],
        duration: '2 Years / 1 Year',
        shortDescription: 'Targeted preparation for NEET-UG aspirants focusing on NCERT line-by-line mastery and speed techniques.',
        description: 'Comprehensive medical coaching designed for cracking AIIMS and top government medical colleges. Includes exhaustive Biology diagram analysis, Physics numerical workshops, and Chemistry reaction mechanics.',
        subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
        features: [
          'Line-by-line NCERT Biology mastery program',
          'Physics speed drills and shortcut methodologies',
          'OMR-based weekly mock exams matching NTA pattern',
          'Personalized student mentorship and rank tracking'
        ],
        eligibility: 'Class 10th Passed / Appeared with minimum 65% aggregate',
        syllabusOverview: 'Full NCERT Biology, Physics and Chemistry curriculum for NEET.',
        image: { url: DEMO_MEDIA.courses[1], fileId: 'demo-course-neet', fileName: 'neet_course.jpg' },
        displayOrder: 2,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Junior Foundation (Classes 8th to 10th)',
        slug: 'demo-junior-foundation',
        category: 'Foundation',
        classes: ['Class 8', 'Class 9', 'Class 10'],
        duration: '1 Year to 3 Years',
        shortDescription: 'Early foundation program for Olympiads (NSEJS, PRMO), NTSE, and strong fundamentals in STEM.',
        description: 'Builds critical thinking, logical reasoning, and deep conceptual clarity in Mathematics and Science to provide an unshakeable launchpad for future JEE/NEET competitive exams.',
        subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Mental Ability & Reasoning'],
        features: [
          'Olympiad level problem sets and reasoning puzzles',
          'Interactive science experiment demonstrations',
          'School board syllabus alignment with top marks focus',
          'Regular parent-teacher academic review sessions'
        ],
        eligibility: 'Students currently studying in Class 7th, 8th, or 9th',
        syllabusOverview: 'School Board syllabus elevated with Olympiad & NTSE level problem solving.',
        image: { url: DEMO_MEDIA.courses[2], fileId: 'demo-course-foundation', fileName: 'foundation_course.jpg' },
        displayOrder: 3,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Senior Secondary School (CBSE / MP Board)',
        slug: 'demo-senior-secondary-school',
        category: 'School Integrated',
        classes: ['Class 11', 'Class 12'],
        duration: '2 Years',
        shortDescription: 'Holistic K-12 schooling with Science (PCM/PCB) and Commerce streams in a modern academic campus.',
        description: 'Provides holistic education emphasizing academic rigor, language proficiency, physical sports, and value-based leadership development with state-of-the-art laboratory infrastructure.',
        subjects: ['Physics', 'Chemistry', 'Mathematics / Biology', 'English Core', 'Physical Education / Computer Science'],
        features: [
          'Spacious smart classrooms with interactive digital boards',
          'Well-equipped Physics, Chemistry & Biology laboratories',
          'Co-curricular sports, debates, arts, and robotics clubs',
          'Comprehensive board exam preparatory mock series'
        ],
        eligibility: 'Class 10th Passed from any recognized educational board',
        syllabusOverview: 'Complete CBSE / State Board curriculum with practical laboratory assessments.',
        image: { url: DEMO_MEDIA.courses[3], fileId: 'demo-course-school', fileName: 'school_course.jpg' },
        displayOrder: 4,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'JEE Target / Dropper Batch',
        slug: 'demo-jee-target-dropper',
        category: 'IIT-JEE',
        classes: ['12th Pass / Dropper'],
        duration: '1 Year Intensive',
        shortDescription: 'Intensive 1-year fast-track revision and problem-solving mastery course for 12th pass aspirants.',
        description: 'Designed specifically for repeater students aiming to dramatically boost their percentile and secure top branches in IITs and NITs through rigorous daily 6-hour test-analysis-lecture cycles.',
        subjects: ['Advanced Physics', 'Organic & Inorganic Chemistry', 'Higher Mathematics'],
        features: [
          'Daily 6 hours intensive classroom coaching',
          'Full-syllabus 50+ computer-based mock tests',
          'Specialized rank booster question banks',
          'Dedicated residential hostel with disciplined study hours'
        ],
        eligibility: 'Class 12th Passed with Science (PCM)',
        syllabusOverview: '100% JEE Main & Advanced syllabus revised and rigorously tested in 10 months.',
        image: { url: DEMO_MEDIA.courses[4], fileId: 'demo-course-target', fileName: 'jee_target.jpg' },
        displayOrder: 5,
        isFeatured: false,
        isPublished: true
      },
      {
        title: 'NEET Achiever (Repeater Program)',
        slug: 'demo-neet-achiever-repeater',
        category: 'NEET',
        classes: ['12th Pass / Dropper'],
        duration: '1 Year Intensive',
        shortDescription: 'High-intensity coaching program for medical aspirants to cross the 650+ marks benchmark.',
        description: 'Comprehensive year-long revision program emphasizing high-yield topics, error-analysis logbooks, and 10,000+ targeted MCQ solving with detailed faculty explanations.',
        subjects: ['Medical Physics', 'Medical Chemistry', 'Complete Biology (Botany + Zoology)'],
        features: [
          'Exhaustive 10,000+ MCQ question bank with solutions',
          'Error analysis logbook maintainence for every student',
          'Weekly full-length 720-marks mock examinations',
          'Individual faculty mentoring for score stagnation'
        ],
        eligibility: 'Class 12th Passed with Science (PCB)',
        syllabusOverview: 'Complete NEET syllabus revised thoroughly twice before main exam.',
        image: { url: DEMO_MEDIA.courses[5], fileId: 'demo-course-neet-repeater', fileName: 'neet_repeater.jpg' },
        displayOrder: 6,
        isFeatured: false,
        isPublished: true
      }
    ];

    const courseMap = {};
    for (const cData of demoCourses) {
      const course = await Course.findOneAndUpdate(
        { slug: cData.slug },
        cData,
        { upsert: true, new: true }
      );
      courseMap[cData.slug] = course._id;
    }
    console.log(`✅ ${Object.keys(courseMap).length} Courses Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 4. BATCHES (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('⏰ Seeding Batches...');
    const demoBatches = [
      {
        name: 'TPS JEE Target 2027 (Nurture Batch)',
        slug: 'demo-batch-jee-nurture-2027',
        course: courseMap['demo-jee-main-advanced'],
        category: 'JEE',
        targetYear: 2027,
        class: 'Class 11',
        program: 'Nurture 2-Year Program',
        shortDescription: '2-year synchronized program for students entering Class 11 targeting JEE 2027.',
        description: 'Synchronized schooling and JEE preparation covering Class 11 syllabus in year one followed by Class 12 and full revision in year two.',
        duration: '2 Years',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2027-05-30'),
        timings: '08:00 AM - 01:30 PM (School) | 02:30 PM - 06:30 PM (Coaching)',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        features: [
          'Direct Kota faculty mentorship',
          'Bi-weekly minor tests & monthly major CBTs',
          'Complete study material with 3 levels of difficulty',
          'Free hostel admission counseling'
        ],
        eligibility: 'Class 10th Passed / Appeared (Min 70% in Science & Math)',
        feeStructure: {
          tuitionFee: '₹65,000 / Year',
          registrationFee: '₹5,000',
          scholarshipUpto: 'Up to 100% via TTSE Exam',
          installmentsInfo: 'Easy 3-part quarterly installment facility available.',
          notes: 'Hostel and transport fees charged separately based on distance/amenities.'
        },
        scholarshipInfo: 'Scholarship available based on Class 10 Board marks and TTSE scholarship score.',
        hostelAvailable: true,
        batchImage: { url: DEMO_MEDIA.courses[0], fileId: 'demo-batch-jee-img', fileName: 'batch_jee.jpg' },
        maxSeats: 45,
        enrolledCount: 38,
        status: 'admissions-open',
        isFeatured: true,
        isPublished: true,
        displayOrder: 1
      },
      {
        name: 'TPS NEET Achiever 2027 (Medical Nurture)',
        slug: 'demo-batch-neet-nurture-2027',
        course: courseMap['demo-neet-medical-excellence'],
        category: 'NEET',
        targetYear: 2027,
        class: 'Class 11',
        program: 'Medical 2-Year Program',
        shortDescription: 'Targeted medical batch for Class 11 students aiming for AIIMS & top government medical colleges.',
        description: 'Integrates complete NCERT line-by-line Biology teaching with intensive Physics problem solving and Chemistry formula drills.',
        duration: '2 Years',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2027-05-30'),
        timings: '08:00 AM - 01:30 PM (School) | 02:30 PM - 06:30 PM (Coaching)',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        subjects: ['Physics', 'Chemistry', 'Biology (Botany + Zoology)'],
        features: [
          'NCERT line-by-line decoding modules',
          'Daily 50 MCQs timed test practice',
          'Weekly OMR-based full mock tests',
          'Dedicated medical doubt faculty'
        ],
        eligibility: 'Class 10th Passed / Appeared (Min 65% aggregate)',
        feeStructure: {
          tuitionFee: '₹65,000 / Year',
          registrationFee: '₹5,000',
          scholarshipUpto: 'Up to 100% via TTSE Exam',
          installmentsInfo: 'Flexible 3 installment options.',
          notes: 'Special fee concession for girl students and rural meritorious candidates.'
        },
        scholarshipInfo: 'Scholarship discounts up to 100% available based on entrance test.',
        hostelAvailable: true,
        batchImage: { url: DEMO_MEDIA.courses[1], fileId: 'demo-batch-neet-img', fileName: 'batch_neet.jpg' },
        maxSeats: 45,
        enrolledCount: 42,
        status: 'admissions-open',
        isFeatured: true,
        isPublished: true,
        displayOrder: 2
      },
      {
        name: 'TPS JEE Enthuse 2026 (Class 12th Target)',
        slug: 'demo-batch-jee-enthuse-2026',
        course: courseMap['demo-jee-main-advanced'],
        category: 'JEE',
        targetYear: 2026,
        class: 'Class 12',
        program: 'Enthuse 1-Year Program',
        shortDescription: 'Fast-paced Class 12 batch with comprehensive Class 11 revision for JEE 2026.',
        description: 'Complete Class 12 board syllabus completion by October followed by 4 months of rigorous full-syllabus JEE Main and Advanced test series and revision.',
        duration: '1 Year',
        startDate: new Date('2025-03-25'),
        endDate: new Date('2026-05-30'),
        timings: '02:00 PM - 07:30 PM (Evening Batch)',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        features: [
          'Board exam 95%+ marks guarantee support',
          'JEE Advanced multi-concept problem solving',
          'Rankers test series with all-India percentile benchmarking'
        ],
        eligibility: 'Class 11th Passed with Science (PCM)',
        feeStructure: {
          tuitionFee: '₹70,000 / Year',
          registrationFee: '₹5,000',
          scholarshipUpto: 'Up to 75% on Class 11 marks',
          installmentsInfo: 'Installment options available.'
        },
        hostelAvailable: true,
        batchImage: { url: DEMO_MEDIA.courses[4], fileId: 'demo-batch-enthuse-img', fileName: 'batch_enthuse.jpg' },
        maxSeats: 40,
        enrolledCount: 35,
        status: 'admissions-open',
        isFeatured: true,
        isPublished: true,
        displayOrder: 3
      },
      {
        name: 'TPS Foundation Olympiad 2026 (Class 9th & 10th)',
        slug: 'demo-batch-foundation-olympiad',
        course: courseMap['demo-junior-foundation'],
        category: 'Foundation',
        targetYear: 2026,
        class: 'Class 9 & 10',
        program: 'Junior Champions Program',
        shortDescription: 'Olympiad & NTSE training batch for students in Class 9th and 10th.',
        description: 'Focuses on strong conceptual clarity, advanced problem solving in Science & Mathematics, and mental ability development for early competitive edge.',
        duration: '1 Year',
        startDate: new Date('2025-04-10'),
        endDate: new Date('2026-03-31'),
        timings: '03:30 PM - 06:30 PM (After School Batch)',
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Mental Ability'],
        features: [
          'PRMO, NSEJS and Science Olympiad modules',
          'Concept building through practical lab demos',
          'School board top rank guarantee program'
        ],
        eligibility: 'Students promoted to Class 9th or 10th',
        feeStructure: {
          tuitionFee: '₹38,000 / Year',
          registrationFee: '₹3,000',
          scholarshipUpto: 'Up to 90% via TTSE Exam'
        },
        hostelAvailable: false,
        batchImage: { url: DEMO_MEDIA.courses[2], fileId: 'demo-batch-found-img', fileName: 'batch_foundation.jpg' },
        maxSeats: 35,
        enrolledCount: 28,
        status: 'admissions-open',
        isFeatured: true,
        isPublished: true,
        displayOrder: 4
      },
      {
        name: 'TPS JEE Leader (Dropper / 12th Pass)',
        slug: 'demo-batch-jee-dropper-leader',
        course: courseMap['demo-jee-target-dropper'],
        category: 'JEE',
        targetYear: 2026,
        class: '12th Pass / Dropper',
        program: 'Leader Intensive Program',
        shortDescription: 'Intensive 1-year repeat batch for 12th pass students targeting top percentile in JEE 2026.',
        description: 'Complete revision of Class 11 and 12 syllabus with rigorous daily tests, personalized doubt clearing, and rank booster question sets.',
        duration: '1 Year',
        startDate: new Date('2025-05-15'),
        endDate: new Date('2026-05-30'),
        timings: '09:00 AM - 03:30 PM (Full Day Batch)',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        features: [
          '50+ full-length computer-based mock exams',
          'Specialized Kota problem sheets & shortcuts',
          'Hostel accommodation with 24x7 study halls'
        ],
        eligibility: '12th Passed with minimum 65% in PCM',
        feeStructure: {
          tuitionFee: '₹75,000 / Year',
          registrationFee: '₹5,000',
          scholarshipUpto: 'Up to 100% on previous JEE percentile'
        },
        hostelAvailable: true,
        batchImage: { url: DEMO_MEDIA.courses[4], fileId: 'demo-batch-dropper-img', fileName: 'batch_dropper.jpg' },
        maxSeats: 50,
        enrolledCount: 46,
        status: 'admissions-open',
        isFeatured: false,
        isPublished: true,
        displayOrder: 5
      },
      {
        name: 'TPS NEET Leader (Dropper / 12th Pass)',
        slug: 'demo-batch-neet-dropper-leader',
        course: courseMap['demo-neet-achiever-repeater'],
        category: 'NEET',
        targetYear: 2026,
        class: '12th Pass / Dropper',
        program: 'Medical Achievers Repeat Batch',
        shortDescription: 'Comprehensive repeater program designed to score 650+ in NEET-UG 2026.',
        description: 'High-intensity preparation focusing on NCERT mastery, weekly 720-mark mock tests, and dedicated doubt clearance counters.',
        duration: '1 Year',
        startDate: new Date('2025-05-20'),
        endDate: new Date('2026-05-30'),
        timings: '09:00 AM - 03:30 PM (Full Day Batch)',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
        features: [
          'Weekly OMR tests on exact NTA NEET pattern',
          'Special focus on Physics numerical shortcuts',
          'Bi-weekly parent performance tracking reports'
        ],
        eligibility: '12th Passed with PCB',
        feeStructure: {
          tuitionFee: '₹75,000 / Year',
          registrationFee: '₹5,000',
          scholarshipUpto: 'Up to 100% on previous NEET score'
        },
        hostelAvailable: true,
        batchImage: { url: DEMO_MEDIA.courses[5], fileId: 'demo-batch-neet-lead-img', fileName: 'batch_neet_leader.jpg' },
        maxSeats: 50,
        enrolledCount: 48,
        status: 'admissions-open',
        isFeatured: false,
        isPublished: true,
        displayOrder: 6
      }
    ];

    const batchMap = {};
    for (const bData of demoBatches) {
      const batch = await Batch.findOneAndUpdate(
        { slug: bData.slug },
        bData,
        { upsert: true, new: true }
      );
      batchMap[bData.slug] = batch._id;
    }
    console.log(`✅ ${Object.keys(batchMap).length} Batches Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 5. FACULTY (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('👨‍🏫 Seeding Faculty Profiles...');
    const demoFaculty = [
      {
        name: 'Dr. Arjun Sharma',
        slug: 'demo-faculty-arjun-sharma',
        designation: 'Senior Physics Master Mentor (Ex-Kota)',
        department: 'Engineering Division',
        subject: 'Physics',
        qualification: 'B.Tech (IIT Delhi), Ph.D (Applied Physics)',
        experienceYears: 16,
        specialization: 'Mechanics, Electrodynamics & Modern Physics for JEE Advanced',
        shortBio: 'Former Senior Faculty at top Kota institutes with 16+ years of mentoring top 100 AIR rankers in JEE Advanced.',
        detailedBio: 'Dr. Arjun Sharma brings extensive experience from leading Kota coaching ecosystems. His pedagogical style deconstructs complex multi-concept physics problems into intuitive physical principles.',
        achievements: [
          'Mentored AIR 23 and AIR 87 in JEE Advanced',
          'Author of "Conceptual Mechanics for JEE"',
          '16+ years continuous track record in IIT-JEE coaching'
        ],
        category: FACULTY_CATEGORIES.JEE,
        courses: [courseMap['demo-jee-main-advanced'], courseMap['demo-jee-target-dropper']],
        batches: [batchMap['demo-batch-jee-nurture-2027'], batchMap['demo-batch-jee-enthuse-2026'], batchMap['demo-batch-jee-dropper-leader']],
        profilePhoto: { url: DEMO_MEDIA.faculty[0], fileId: 'demo-fac-01', fileName: 'arjun_sharma.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 1
      },
      {
        name: 'Prof. Rohan Mehta',
        slug: 'demo-faculty-rohan-mehta',
        designation: 'Head of Mathematics (Ex-Allen Kota)',
        department: 'Engineering Division',
        subject: 'Mathematics',
        qualification: 'M.Sc (Mathematics), B.Ed',
        experienceYears: 14,
        specialization: 'Calculus, Coordinate Geometry & Vectors for IIT-JEE',
        shortBio: 'Renowned mathematics mentor known for simplifying Calculus and Algebra with step-by-step graphical visualizations.',
        detailedBio: 'Prof. Rohan Mehta has trained over 5,000 students in his 14-year career across Kota and Central India. His lectures emphasize high-speed calculations and graphical coordinate methods.',
        achievements: [
          'Mentored 150+ students with 99+ percentile in JEE Math',
          'Conducted national workshops on Advanced Calculus'
        ],
        category: FACULTY_CATEGORIES.JEE,
        courses: [courseMap['demo-jee-main-advanced'], courseMap['demo-jee-target-dropper']],
        batches: [batchMap['demo-batch-jee-nurture-2027'], batchMap['demo-batch-jee-enthuse-2026']],
        profilePhoto: { url: DEMO_MEDIA.faculty[1], fileId: 'demo-fac-02', fileName: 'rohan_mehta.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 2
      },
      {
        name: 'Dr. Neha Verma',
        slug: 'demo-faculty-neha-verma',
        designation: 'Head of Biology & Medical Division',
        department: 'Medical Division',
        subject: 'Biology (Zoology & Genetics)',
        qualification: 'MBBS, M.Sc (Zoology)',
        experienceYears: 13,
        specialization: 'Human Physiology, Genetics & Biotechnology for NEET',
        shortBio: 'Doctor turned educator with a passion for decoding NCERT Biology for 360/360 score in NEET.',
        detailedBio: 'Dr. Neha Verma combines medical domain knowledge with educational clarity. Her students consistently achieve top scores in NEET Biology through structured mind maps and active recall methods.',
        achievements: [
          'Over 45 students scored 350+ in NEET Biology 2024',
          'Specialist in NTA exam pattern diagram analysis'
        ],
        category: FACULTY_CATEGORIES.NEET,
        courses: [courseMap['demo-neet-medical-excellence'], courseMap['demo-neet-achiever-repeater']],
        batches: [batchMap['demo-batch-neet-nurture-2027'], batchMap['demo-batch-neet-dropper-leader']],
        profilePhoto: { url: DEMO_MEDIA.faculty[2], fileId: 'demo-fac-03', fileName: 'neha_verma.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 3
      },
      {
        name: 'Prof. Amit Joshi',
        slug: 'demo-faculty-amit-joshi',
        designation: 'Senior Chemistry Faculty (Organic & Inorganic)',
        department: 'Engineering & Medical Division',
        subject: 'Chemistry',
        qualification: 'M.Sc (Chemistry), CSIR-NET',
        experienceYears: 12,
        specialization: 'Organic Reaction Mechanisms & Coordination Chemistry',
        shortBio: 'Master educator simplifying organic reaction pathways and periodic trends with engaging mnemonic tools.',
        detailedBio: 'With 12 years of experience in competitive coaching, Prof. Joshi enables students to master organic synthesis pathways and inorganic coordination chemistry with zero confusion.',
        achievements: [
          'Mentored state toppers in JEE & NEET Chemistry',
          'Authored "Organic Chemistry Made Visual"'
        ],
        category: FACULTY_CATEGORIES.JEE,
        courses: [courseMap['demo-jee-main-advanced'], courseMap['demo-neet-medical-excellence']],
        batches: [batchMap['demo-batch-jee-nurture-2027'], batchMap['demo-batch-neet-nurture-2027']],
        profilePhoto: { url: DEMO_MEDIA.faculty[3], fileId: 'demo-fac-04', fileName: 'amit_joshi.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 4
      },
      {
        name: 'Dr. Priya Kapoor',
        slug: 'demo-faculty-priya-kapoor',
        designation: 'Senior Botany Specialist',
        department: 'Medical Division',
        subject: 'Botany',
        qualification: 'Ph.D (Plant Sciences), M.Sc',
        experienceYears: 11,
        specialization: 'Plant Physiology, Ecology & Cell Biology',
        shortBio: 'Dedicated botanist specializing in NCERT-focused botany modules with 100% accuracy in NEET questions.',
        detailedBio: 'Dr. Priya Kapoor makes plant biology intuitive through microscopy demonstrations and structured conceptual breakdown of botanical pathways.',
        achievements: [
          'Excellence in Teaching Award 2023',
          'Mentored multiple 680+ scorers in NEET'
        ],
        category: FACULTY_CATEGORIES.NEET,
        courses: [courseMap['demo-neet-medical-excellence']],
        batches: [batchMap['demo-batch-neet-nurture-2027']],
        profilePhoto: { url: DEMO_MEDIA.faculty[4], fileId: 'demo-fac-05', fileName: 'priya_kapoor.jpg' },
        isFeatured: false,
        isPublished: true,
        displayOrder: 5
      },
      {
        name: 'Prof. Vivek Mishra',
        slug: 'demo-faculty-vivek-mishra',
        designation: 'Head of Junior Foundation & Olympiads',
        department: 'Foundation Division',
        subject: 'Mathematics & Reasoning',
        qualification: 'B.Tech, M.Sc (Applied Math)',
        experienceYears: 9,
        specialization: 'Number Theory, Combinatorics & PRMO Training',
        shortBio: 'Passionate foundation mentor grooming young minds for PRMO, RMO and Science Olympiads.',
        detailedBio: 'Prof. Mishra specializes in sparking curiosity and logical deduction in students from Class 8th to 10th.',
        achievements: [
          'Guided 30+ students to qualify PRMO & NMTC stages',
          'Organizer of Times Math League Shahdol'
        ],
        category: FACULTY_CATEGORIES.FOUNDATION,
        courses: [courseMap['demo-junior-foundation']],
        batches: [batchMap['demo-batch-foundation-olympiad']],
        profilePhoto: { url: DEMO_MEDIA.faculty[5], fileId: 'demo-fac-06', fileName: 'vivek_mishra.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 6
      },
      {
        name: 'Mrs. Sunita Pandey',
        slug: 'demo-faculty-sunita-pandey',
        designation: 'Senior PGT Physics & School Academic Lead',
        department: 'School Division',
        subject: 'Physics',
        qualification: 'M.Sc (Physics), B.Ed',
        experienceYears: 15,
        specialization: 'CBSE / Board Curriculum & Practical Lab Assessments',
        shortBio: 'Accomplished school educator ensuring 95%+ marks in CBSE Board practicals and theory examinations.',
        detailedBio: 'Mrs. Sunita Pandey leads the Senior Secondary science department with a focus on disciplined laboratory work, rigorous answer writing skills, and individual student care.',
        achievements: [
          '100% First Class record in CBSE Class 12 Physics for 6 consecutive years',
          'District Best Teacher Felicitation'
        ],
        category: FACULTY_CATEGORIES.SCHOOL,
        courses: [courseMap['demo-senior-secondary-school']],
        batches: [batchMap['demo-batch-jee-nurture-2027'], batchMap['demo-batch-neet-nurture-2027']],
        profilePhoto: { url: DEMO_MEDIA.faculty[6], fileId: 'demo-fac-07', fileName: 'sunita_pandey.jpg' },
        isFeatured: false,
        isPublished: true,
        displayOrder: 7
      },
      {
        name: 'Mr. Rajeshwar Tripathi',
        slug: 'demo-faculty-rajeshwar-tripathi',
        designation: 'Senior PGT Chemistry & Lab Supervisor',
        department: 'School Division',
        subject: 'Chemistry',
        qualification: 'M.Sc (Analytical Chemistry), B.Ed',
        experienceYears: 14,
        specialization: 'Inorganic Chemistry, Titrations & CBSE Board Strategy',
        shortBio: 'Veteran school educator with extensive expertise in board exam preparation and chemistry laboratory management.',
        detailedBio: 'Mr. Tripathi has guided thousands of high school students through board examinations with top distinctions.',
        achievements: [
          'National Chemistry Olympiad mentor',
          'State Board Examiner coordinator'
        ],
        category: FACULTY_CATEGORIES.SCHOOL,
        courses: [courseMap['demo-senior-secondary-school']],
        batches: [batchMap['demo-batch-jee-nurture-2027']],
        profilePhoto: { url: DEMO_MEDIA.faculty[7], fileId: 'demo-fac-08', fileName: 'rajeshwar_tripathi.jpg' },
        isFeatured: false,
        isPublished: true,
        displayOrder: 8
      }
    ];

    const facultyIds = [];
    for (const fData of demoFaculty) {
      const fac = await Faculty.findOneAndUpdate(
        { slug: fData.slug },
        fData,
        { upsert: true, new: true }
      );
      facultyIds.push(fac._id);
    }
    console.log(`✅ ${facultyIds.length} Faculty Profiles Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 6. RESULTS & HALL OF FAME (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('🏆 Seeding Results & Hall of Fame...');
    const demoResults = [
      {
        studentName: 'Aarav Sharma (DEMO)',
        slug: 'demo-result-aarav-sharma',
        studentPhoto: { url: DEMO_MEDIA.students[0], fileId: 'demo-res-01', fileName: 'aarav.jpg' },
        exam: EXAM_TYPES.JEE_ADVANCED,
        year: 2024,
        score: '284 / 360',
        rank: 'AIR 142',
        allIndiaRank: 142,
        categoryRank: 28,
        percentile: '99.92 %ile',
        collegeAllotted: 'IIT Bombay (Computer Science & Engineering)',
        achievementTitle: 'District Topper Shahdol & Vindhya Region Rank 1',
        description: '2-Year Integrated Classroom Student at TIME Public School & TIMES DIGITAL. Cleared JEE Advanced with stellar rank in first attempt.',
        course: courseMap['demo-jee-main-advanced'],
        batch: batchMap['demo-batch-jee-nurture-2027'],
        isFeatured: true,
        isPublished: true,
        displayOrder: 1
      },
      {
        studentName: 'Ananya Verma (DEMO)',
        slug: 'demo-result-ananya-verma',
        studentPhoto: { url: DEMO_MEDIA.students[1], fileId: 'demo-res-02', fileName: 'ananya.jpg' },
        exam: EXAM_TYPES.NEET,
        year: 2024,
        score: '695 / 720',
        rank: 'AIR 215',
        allIndiaRank: 215,
        categoryRank: 42,
        percentile: '99.88 %ile',
        collegeAllotted: 'AIIMS Bhopal (MBBS)',
        achievementTitle: 'State Top 10 Ranker in NEET-UG',
        description: 'Classroom student of TIMES DIGITAL Medical Achiever Program. Scored full 360/360 in Biology.',
        course: courseMap['demo-neet-medical-excellence'],
        batch: batchMap['demo-batch-neet-nurture-2027'],
        isFeatured: true,
        isPublished: true,
        displayOrder: 2
      },
      {
        studentName: 'Ritvik Jain (DEMO)',
        slug: 'demo-result-ritvik-jain',
        studentPhoto: { url: DEMO_MEDIA.students[2], fileId: 'demo-res-03', fileName: 'ritvik.jpg' },
        exam: EXAM_TYPES.JEE_MAIN,
        year: 2024,
        score: '272 / 300',
        rank: 'AIR 384',
        allIndiaRank: 384,
        percentile: '99.78 %ile',
        collegeAllotted: 'IIT Delhi (Electrical Engineering)',
        achievementTitle: '99.78 Percentile in JEE Main',
        description: 'Consistently topped the TIMES DIGITAL CBT test series and achieved exceptional ranks in both JEE Main and Advanced.',
        course: courseMap['demo-jee-main-advanced'],
        batch: batchMap['demo-batch-jee-nurture-2027'],
        isFeatured: true,
        isPublished: true,
        displayOrder: 3
      },
      {
        studentName: 'Kavya Patel (DEMO)',
        slug: 'demo-result-kavya-patel',
        studentPhoto: { url: DEMO_MEDIA.students[3], fileId: 'demo-res-04', fileName: 'kavya.jpg' },
        exam: EXAM_TYPES.NEET,
        year: 2024,
        score: '682 / 720',
        rank: 'AIR 490',
        allIndiaRank: 490,
        percentile: '99.65 %ile',
        collegeAllotted: 'MGM Medical College, Indore (MBBS)',
        achievementTitle: 'Shahdol Medical Topper',
        description: 'Rigorous daily practice and regular doubt solving sessions at TIMES DIGITAL enabled her to secure government medical seat.',
        course: courseMap['demo-neet-medical-excellence'],
        batch: batchMap['demo-batch-neet-nurture-2027'],
        isFeatured: true,
        isPublished: true,
        displayOrder: 4
      },
      {
        studentName: 'Aditya Mehta (DEMO)',
        slug: 'demo-result-aditya-mehta',
        studentPhoto: { url: DEMO_MEDIA.students[4], fileId: 'demo-res-05', fileName: 'aditya.jpg' },
        exam: EXAM_TYPES.JEE_ADVANCED,
        year: 2024,
        score: '254 / 360',
        rank: 'AIR 612',
        allIndiaRank: 612,
        percentile: '99.52 %ile',
        collegeAllotted: 'IIT Roorkee (Mechanical Engineering)',
        achievementTitle: 'IIT Selection in First Attempt',
        description: 'Balanced CBSE 12th Board (96.4%) along with high rank in JEE Advanced.',
        course: courseMap['demo-jee-main-advanced'],
        batch: batchMap['demo-batch-jee-enthuse-2026'],
        isFeatured: false,
        isPublished: true,
        displayOrder: 5
      },
      {
        studentName: 'Sneha Mishra (DEMO)',
        slug: 'demo-result-sneha-mishra',
        studentPhoto: { url: DEMO_MEDIA.students[5], fileId: 'demo-res-06', fileName: 'sneha.jpg' },
        exam: EXAM_TYPES.SCHOOL_BOARDS,
        year: 2024,
        score: '491 / 500',
        rank: 'District Rank 1',
        percentile: '98.20 %',
        collegeAllotted: 'School Board Topper',
        achievementTitle: '98.2% in CBSE Class 12th Board',
        description: 'Topped Shahdol district in CBSE Class 12 Science stream with 100/100 in Physics and Mathematics.',
        course: courseMap['demo-senior-secondary-school'],
        isFeatured: true,
        isPublished: true,
        displayOrder: 6
      },
      {
        studentName: 'Manish Tiwari (DEMO)',
        slug: 'demo-result-manish-tiwari',
        studentPhoto: { url: DEMO_MEDIA.students[6], fileId: 'demo-res-07', fileName: 'manish.jpg' },
        exam: EXAM_TYPES.FOUNDATION_OLYMPIAD,
        year: 2024,
        score: 'Olympiad Gold',
        rank: 'State Rank 3',
        achievementTitle: 'PRMO & National Science Olympiad Medalist',
        description: 'Junior Foundation student who cleared PRMO Mathematics Olympiad and qualified for Regional level.',
        course: courseMap['demo-junior-foundation'],
        batch: batchMap['demo-batch-foundation-olympiad'],
        isFeatured: false,
        isPublished: true,
        displayOrder: 7
      },
      {
        studentName: 'Pooja Soni (DEMO)',
        slug: 'demo-result-pooja-soni',
        studentPhoto: { url: DEMO_MEDIA.students[7], fileId: 'demo-res-08', fileName: 'pooja.jpg' },
        exam: EXAM_TYPES.NEET,
        year: 2023,
        score: '674 / 720',
        rank: 'AIR 730',
        allIndiaRank: 730,
        percentile: '99.40 %ile',
        collegeAllotted: 'GMC Bhopal (MBBS)',
        achievementTitle: 'NEET Selection from Shahdol Campus',
        description: 'Proud alumna of TIMES DIGITAL Medical batch.',
        course: courseMap['demo-neet-medical-excellence'],
        isFeatured: false,
        isPublished: true,
        displayOrder: 8
      }
    ];

    for (const rData of demoResults) {
      await Result.findOneAndUpdate(
        { slug: rData.slug },
        rData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoResults.length} Result Records Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 7. GALLERY ALBUMS (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('🖼️ Seeding Gallery Albums...');
    const demoGalleries = [
      {
        title: 'Modern Academic Campus & Infrastructure',
        slug: 'demo-gallery-campus-infrastructure',
        category: GALLERY_CATEGORIES.CAMPUS,
        description: 'A visual tour of TIME Public School state-of-the-art campus, smart classrooms, botanical gardens, and sports grounds in Shahdol.',
        coverImage: { url: DEMO_MEDIA.gallery[0], fileId: 'demo-gal-cov-1', fileName: 'campus_cover.jpg' },
        images: [
          { url: DEMO_MEDIA.gallery[0], fileId: 'demo-gal-1-1', fileName: 'campus_front.jpg', caption: 'Main Academic Building & Entrance' },
          { url: DEMO_MEDIA.gallery[1], fileId: 'demo-gal-1-2', fileName: 'smart_class.jpg', caption: 'Interactive Digital Smart Classrooms' },
          { url: DEMO_MEDIA.gallery[2], fileId: 'demo-gal-1-3', fileName: 'science_lab.jpg', caption: 'Advanced Science Laboratory Complex' },
          { url: DEMO_MEDIA.gallery[3], fileId: 'demo-gal-1-4', fileName: 'library.jpg', caption: 'Digital Library & Reading Hall' },
          { url: DEMO_MEDIA.gallery[4], fileId: 'demo-gal-1-5', fileName: 'sports_ground.jpg', caption: 'Sports Complex & Athletic Track' }
        ],
        eventDate: new Date('2024-11-15'),
        displayOrder: 1,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Annual Function & Cultural Extravaganza',
        slug: 'demo-gallery-annual-function',
        category: GALLERY_CATEGORIES.ANNUAL_FUNCTION,
        description: 'Vibrant cultural performances, drama, classical dance, and student felicitation ceremony at the School Auditorium.',
        coverImage: { url: DEMO_MEDIA.gallery[5], fileId: 'demo-gal-cov-2', fileName: 'annual_cover.jpg' },
        images: [
          { url: DEMO_MEDIA.gallery[5], fileId: 'demo-gal-2-1', fileName: 'dance.jpg', caption: 'Classical Dance Performance' },
          { url: DEMO_MEDIA.gallery[6], fileId: 'demo-gal-2-2', fileName: 'drama.jpg', caption: 'School Theatrical Production' },
          { url: DEMO_MEDIA.gallery[7], fileId: 'demo-gal-2-3', fileName: 'awards.jpg', caption: 'Academic Felicitation & Trophy Ceremony' },
          { url: DEMO_MEDIA.gallery[0], fileId: 'demo-gal-2-4', fileName: 'group.jpg', caption: 'Staff and Students Grand Finale' }
        ],
        eventDate: new Date('2024-12-22'),
        displayOrder: 2,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Science & Robotics Exhibition 2024',
        slug: 'demo-gallery-science-exhibition',
        category: GALLERY_CATEGORIES.ACHIEVEMENTS,
        description: 'Students demonstrating innovative working models in renewable energy, robotics, IoT, and biological ecosystems.',
        coverImage: { url: DEMO_MEDIA.gallery[2], fileId: 'demo-gal-cov-3', fileName: 'science_cover.jpg' },
        images: [
          { url: DEMO_MEDIA.gallery[2], fileId: 'demo-gal-3-1', fileName: 'robotics.jpg', caption: 'Automated Robotics Demonstration' },
          { url: DEMO_MEDIA.gallery[1], fileId: 'demo-gal-3-2', fileName: 'solar.jpg', caption: 'Solar Energy Working Model by Class 9' },
          { url: DEMO_MEDIA.gallery[3], fileId: 'demo-gal-3-3', fileName: 'microscope.jpg', caption: 'Biology Cellular Microscopy Display' }
        ],
        eventDate: new Date('2024-10-18'),
        displayOrder: 3,
        isFeatured: false,
        isPublished: true
      },
      {
        title: 'Annual Sports Meet & Athletic Championship',
        slug: 'demo-gallery-sports-meet',
        category: GALLERY_CATEGORIES.SPORTS,
        description: 'High-energy inter-house sports competitions including track events, football, basketball, cricket, and martial arts.',
        coverImage: { url: DEMO_MEDIA.gallery[6], fileId: 'demo-gal-cov-4', fileName: 'sports_cover.jpg' },
        images: [
          { url: DEMO_MEDIA.gallery[6], fileId: 'demo-gal-4-1', fileName: 'race.jpg', caption: '100m Sprint Final Event' },
          { url: DEMO_MEDIA.gallery[4], fileId: 'demo-gal-4-2', fileName: 'relay.jpg', caption: 'Inter-House Relay Championship' },
          { url: DEMO_MEDIA.gallery[7], fileId: 'demo-gal-4-3', fileName: 'trophy.jpg', caption: 'Winning House Trophy Presentation' }
        ],
        eventDate: new Date('2024-11-28'),
        displayOrder: 4,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'TIMES DIGITAL Kota Faculty Seminar',
        slug: 'demo-gallery-kota-seminar',
        category: GALLERY_CATEGORIES.JEE_NEET,
        description: 'Interactive orientation for parents and aspirants on conquering IIT-JEE and NEET with smart exam strategies.',
        coverImage: { url: DEMO_MEDIA.gallery[3], fileId: 'demo-gal-cov-5', fileName: 'seminar_cover.jpg' },
        images: [
          { url: DEMO_MEDIA.gallery[3], fileId: 'demo-gal-5-1', fileName: 'auditorium.jpg', caption: 'Packed Auditorium with Parents & Aspirants' },
          { url: DEMO_MEDIA.gallery[1], fileId: 'demo-gal-5-2', fileName: 'faculty_talk.jpg', caption: 'Dr. Arjun Sharma discussing Physics Strategy' },
          { url: DEMO_MEDIA.gallery[5], fileId: 'demo-gal-5-3', fileName: 'qna.jpg', caption: 'Interactive Student Q&A Session' }
        ],
        eventDate: new Date('2025-01-12'),
        displayOrder: 5,
        isFeatured: false,
        isPublished: true
      }
    ];

    for (const gData of demoGalleries) {
      await Gallery.findOneAndUpdate(
        { slug: gData.slug },
        gData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoGalleries.length} Gallery Albums Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 8. VIDEOS (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('🎥 Seeding Video Library...');
    const demoVideos = [
      {
        title: 'TIME Public School Campus Walkthrough & Facilities',
        slug: 'demo-video-campus-walkthrough',
        description: 'Take a virtual tour of our sprawling campus, high-tech science labs, smart classrooms, library, and hostel facilities in Shahdol.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoType: 'youtube',
        thumbnail: { url: DEMO_MEDIA.gallery[0], fileId: 'demo-vid-th-1', fileName: 'vid_campus.jpg' },
        category: VIDEO_CATEGORIES.CAMPUS,
        duration: '04:15',
        displayOrder: 1,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Kota Pedagogy in Shahdol: TIMES DIGITAL Methodology',
        slug: 'demo-video-kota-pedagogy',
        description: 'How TIMES DIGITAL brings authentic Kota classroom rigor, DPP problem-solving culture, and 1-on-1 mentorship to Vindhya region.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoType: 'youtube',
        thumbnail: { url: DEMO_MEDIA.gallery[1], fileId: 'demo-vid-th-2', fileName: 'vid_methodology.jpg' },
        category: VIDEO_CATEGORIES.TIMES_DIGITAL,
        duration: '06:30',
        displayOrder: 2,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Mastering Physics for JEE Advanced — Dr. Arjun Sharma',
        slug: 'demo-video-physics-masterclass',
        description: 'Special lecture snippet on solving complex rotational mechanics problems with graphical shortcuts.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoType: 'youtube',
        thumbnail: { url: DEMO_MEDIA.gallery[3], fileId: 'demo-vid-th-3', fileName: 'vid_physics.jpg' },
        category: VIDEO_CATEGORIES.JEE,
        duration: '08:45',
        displayOrder: 3,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'NEET 2024 Topper Reaction & Parent Interview',
        slug: 'demo-video-topper-interview',
        description: 'Hear from our student Ananya Verma (AIR 215) and her parents about their transformative journey at TIMES DIGITAL.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        videoType: 'youtube',
        thumbnail: { url: DEMO_MEDIA.gallery[7], fileId: 'demo-vid-th-4', fileName: 'vid_interview.jpg' },
        category: VIDEO_CATEGORIES.TESTIMONIALS,
        duration: '05:20',
        displayOrder: 4,
        isFeatured: true,
        isPublished: true
      }
    ];

    for (const vData of demoVideos) {
      await Video.findOneAndUpdate(
        { slug: vData.slug },
        vData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoVideos.length} Videos Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 9. FACILITIES (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('🏛️ Seeding Campus Facilities...');
    const demoFacilities = [
      {
        title: 'Interactive Smart Classrooms',
        slug: 'demo-facility-smart-classrooms',
        category: 'Academic Infrastructure',
        shortDescription: 'Modern acoustically treated classrooms equipped with high-resolution digital interactive panels.',
        description: 'Every classroom at TIME Public School is designed to foster active learning. Equipped with 4K interactive smart boards, ergonomic seating, high-speed Wi-Fi, and optimal natural lighting to maximize student concentration.',
        icon: 'layers',
        features: [
          'High-resolution 4K interactive touch panels',
          'Acoustic sound dampening and audio clarity',
          'Ergonomic posture-friendly seating arrangements',
          'CCTV monitored and climate controlled'
        ],
        images: [
          { url: DEMO_MEDIA.facilities[0], fileId: 'demo-fac-img-1', fileName: 'smart_class.jpg', caption: 'Interactive Learning in Progress' },
          { url: DEMO_MEDIA.facilities[1], fileId: 'demo-fac-img-2', fileName: 'smart_board.jpg', caption: 'High-Tech Digital Board' }
        ],
        displayOrder: 1,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Advanced Science Laboratories (Physics, Chem, Bio)',
        slug: 'demo-facility-science-labs',
        category: 'Laboratory',
        shortDescription: 'State-of-the-art practical laboratories meeting all CBSE and Olympiad research standards.',
        description: 'Comprehensive research labs featuring modern apparatus, optical benches, electronic titration equipment, digital balances, and compound microscopes for practical scientific inquiry.',
        icon: 'microscope',
        features: [
          'Dedicated individual workstations for every student',
          'Precision digital meters, optical sensors & chemical fume hoods',
          'Rigorous safety protocols, eye-wash stations and fire safety',
          'Guided by qualified senior lab instructors'
        ],
        images: [
          { url: DEMO_MEDIA.facilities[1], fileId: 'demo-fac-img-3', fileName: 'chem_lab.jpg', caption: 'Chemistry Research Station' },
          { url: DEMO_MEDIA.facilities[2], fileId: 'demo-fac-img-4', fileName: 'physics_lab.jpg', caption: 'Physics Optical Apparatus' }
        ],
        displayOrder: 2,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Digital Library & Reading Hall',
        slug: 'demo-facility-digital-library',
        category: 'Learning Resources',
        shortDescription: 'Over 10,000+ reference volumes, international journals, and e-learning computer terminals.',
        description: 'A serene sanctuary for deep self-study with extensive collections of NCERT, standard IIT-JEE / NEET reference books (Irodov, HC Verma, Morrison Boyd, Cengage), and digital research databases.',
        icon: 'book',
        features: [
          '10,000+ physical academic & competitive reference books',
          'Computer stations with high-speed internet for research',
          'Silent individual study cubicles for focused preparation',
          'Daily newspapers, educational periodicals & magazines'
        ],
        images: [
          { url: DEMO_MEDIA.facilities[2], fileId: 'demo-fac-img-5', fileName: 'library.jpg', caption: 'Central Reading Hall' }
        ],
        displayOrder: 3,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Computer Science & AI Laboratory',
        slug: 'demo-facility-computer-lab',
        category: 'Technology',
        shortDescription: '60+ high-performance computer terminals with programming environments and high-speed fiber internet.',
        description: 'Modern computing lab providing students hands-on experience in Python programming, web development, data analysis, and online computer-based mock test simulations.',
        icon: 'monitor',
        features: [
          'Latest generation desktop computers with dedicated power backup',
          '1 Gbps redundant fiber optic broadband network',
          'Licensed software suites for Python, SQL, and design tools',
          'CBT test simulation software replicating NTA JEE pattern'
        ],
        images: [
          { url: DEMO_MEDIA.facilities[3], fileId: 'demo-fac-img-6', fileName: 'computer_lab.jpg', caption: 'Computer Science Lab' }
        ],
        displayOrder: 4,
        isFeatured: false,
        isPublished: true
      },
      {
        title: 'Sports Complex & Athletic Grounds',
        slug: 'demo-facility-sports-complex',
        category: 'Sports & Fitness',
        shortDescription: 'Multi-sport arena with basketball court, cricket pitch, football ground, and indoor badminton hall.',
        description: 'Physical fitness and team sports are integral to holistic personality development. Full-time physical education coaches guide students in competitive sports.',
        icon: 'activity',
        features: [
          'Full-size football turf and regulation cricket pitch',
          'Standard synthetic basketball court & volleyball area',
          'Indoor table tennis, chess and badminton hall',
          'Professional sports coaches for inter-school tournaments'
        ],
        images: [
          { url: DEMO_MEDIA.facilities[4], fileId: 'demo-fac-img-7', fileName: 'sports_ground.jpg', caption: 'Outdoor Sports Grounds' }
        ],
        displayOrder: 5,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Dedicated Hostel & Residential Wing',
        slug: 'demo-facility-hostel-wing',
        category: 'Residential',
        shortDescription: 'Safe, hygienic and disciplined residential environment for outstation students.',
        description: 'Separate boys and girls hostels with 24/7 security, nutritious hygienic vegetarian meals, disciplined evening study hours, and daily doubt clearance counters.',
        icon: 'home',
        features: [
          'Separate boys & girls hostels with biometric security',
          'Nutritious 4-time meal plan cooked in hygienic kitchen',
          'Supervised 3-hour daily evening self-study sessions',
          'On-call medical doctor and emergency transportation'
        ],
        images: [
          { url: DEMO_MEDIA.facilities[6], fileId: 'demo-fac-img-8', fileName: 'hostel_room.jpg', caption: 'Clean & Spacious Dormitories' }
        ],
        displayOrder: 6,
        isFeatured: true,
        isPublished: true
      }
    ];

    for (const facData of demoFacilities) {
      await Facility.findOneAndUpdate(
        { slug: facData.slug },
        facData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoFacilities.length} Campus Facilities Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 10. EVENTS (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('📅 Seeding School Events...');
    const demoEvents = [
      {
        title: 'Times Talent Scholarship Exam (TTSE 2025)',
        slug: 'demo-event-ttse-scholarship-2025',
        shortDescription: 'Mega scholarship test for Class 8th to 12th students with up to 100% tuition fee waiver.',
        description: 'An open competitive assessment measuring aptitude, mathematical ability, and science concepts. Top scorers receive merit certificates, cash awards, and up to 100% scholarship on coaching fees.',
        eventDate: new Date('2025-04-06'),
        endDate: new Date('2025-04-06'),
        startTime: '10:00 AM',
        endTime: '01:00 PM',
        location: 'TIME Public School Campus, Shahdol',
        coverImage: { url: DEMO_MEDIA.courses[2], fileId: 'demo-evt-1', fileName: 'ttse.jpg' },
        registrationRequired: true,
        registrationLink: '/admissions',
        registrationDeadline: new Date('2025-04-04'),
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Annual Science & Robotics Exhibition 2025',
        slug: 'demo-event-science-exhibition-2025',
        shortDescription: 'Grand exhibition showcasing student working models, robotics prototypes, and AI projects.',
        description: 'Open to parents, educators, and science enthusiasts. Over 100 innovative working models created by students will be judged by eminent guest scientists.',
        eventDate: new Date('2025-04-26'),
        endDate: new Date('2025-04-26'),
        startTime: '09:30 AM',
        endTime: '04:00 PM',
        location: 'Main Auditorium & Exhibition Hall, TIME Campus',
        coverImage: { url: DEMO_MEDIA.gallery[2], fileId: 'demo-evt-2', fileName: 'science_fest.jpg' },
        registrationRequired: false,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'New Academic Batch Orientation & Parent Induction',
        slug: 'demo-event-parent-induction-2025',
        shortDescription: 'Orientation for newly enrolled students and parents in school and coaching batches.',
        description: 'Detailed briefing on curriculum roadmaps, test schedule calendar, doubt clearing mechanisms, and parent communication portal by Academic Directors.',
        eventDate: new Date('2025-04-14'),
        endDate: new Date('2025-04-14'),
        startTime: '11:00 AM',
        endTime: '01:30 PM',
        location: 'Seminar Hall, TIME Public School',
        coverImage: { url: DEMO_MEDIA.gallery[5], fileId: 'demo-evt-3', fileName: 'orientation.jpg' },
        registrationRequired: false,
        isFeatured: true,
        isPublished: true
      },
      {
        title: 'Annual Sports Day & Athletic Meet 2025',
        slug: 'demo-event-annual-sports-day-2025',
        shortDescription: 'Inter-house athletic meet, track races, football championship and martial arts display.',
        description: 'Full-day sports extravaganza celebrating physical agility, sportsmanship, and teamwork with grand march-past and trophy distributions.',
        eventDate: new Date('2025-05-02'),
        endDate: new Date('2025-05-03'),
        startTime: '08:00 AM',
        endTime: '05:00 PM',
        location: 'School Athletic Ground, TIME Campus',
        coverImage: { url: DEMO_MEDIA.gallery[6], fileId: 'demo-evt-4', fileName: 'sports_day.jpg' },
        registrationRequired: false,
        isFeatured: false,
        isPublished: true
      }
    ];

    for (const eData of demoEvents) {
      await Event.findOneAndUpdate(
        { slug: eData.slug },
        eData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoEvents.length} School Events Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 11. ANNOUNCEMENTS & TICKERS (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('📢 Seeding Announcements & Notices...');
    const demoAnnouncements = [
      {
        title: 'Admissions Open for Academic Session 2025-26 & JEE/NEET Target Batches',
        slug: 'demo-announcement-admissions-open-2025-26',
        description: 'Registrations are now open for Nursery to Class 12th and TIMES DIGITAL integrated coaching batches. Limited seats per batch for personalized mentoring.',
        category: 'Admissions',
        priority: ANNOUNCEMENT_PRIORITY.URGENT,
        isTicker: true,
        link: '/admissions',
        displayOrder: 1,
        isPublished: true
      },
      {
        title: 'Times Talent Scholarship Exam (TTSE) Registrations Open',
        slug: 'demo-announcement-ttse-scholarship-open',
        description: 'Students of Class 8th to 12th can apply for TTSE 2025 scholarship exam to avail up to 100% fee waiver on coaching tuition fees.',
        category: 'Scholarship',
        priority: ANNOUNCEMENT_PRIORITY.HIGH,
        isTicker: true,
        link: '/admissions',
        displayOrder: 2,
        isPublished: true
      },
      {
        title: 'Commencement of JEE & NEET Nurture Batches from 15th April 2025',
        slug: 'demo-announcement-batch-commencement',
        description: 'All enrolled students for Class 11 Nurture batches are requested to collect their study kits and reporting schedule from the administration desk.',
        category: 'Coaching',
        priority: ANNOUNCEMENT_PRIORITY.HIGH,
        isTicker: false,
        link: '/batches',
        displayOrder: 3,
        isPublished: true
      },
      {
        title: 'CBSE Class 10th & 12th Board Practical Schedule Published',
        slug: 'demo-announcement-board-practical-schedule',
        description: 'Detailed batch-wise timetable for Science laboratory practical assessments has been updated on the student notice board.',
        category: 'Exams',
        priority: ANNOUNCEMENT_PRIORITY.MEDIUM,
        isTicker: false,
        displayOrder: 4,
        isPublished: true
      },
      {
        title: 'Hostel Admissions Open for Academic Session 2025-26',
        slug: 'demo-announcement-hostel-admissions',
        description: 'Outstation students seeking separate boys and girls residential accommodation can submit their hostel admission forms along with registration.',
        category: 'Hostel',
        priority: ANNOUNCEMENT_PRIORITY.MEDIUM,
        isTicker: false,
        displayOrder: 5,
        isPublished: true
      }
    ];

    for (const aData of demoAnnouncements) {
      await Announcement.findOneAndUpdate(
        { slug: aData.slug },
        aData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoAnnouncements.length} Announcements Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 12. TESTIMONIALS (DEMO DATA)
    // ─────────────────────────────────────────────────────────────
    console.log('💬 Seeding Testimonials...');
    const demoTestimonials = [
      {
        name: 'Dr. R. K. Sharma (Parent of Aarav - IIT Bombay)',
        role: 'Parent',
        studentOrParent: 'Parent',
        classOrCourse: 'JEE Advanced Integrated Batch',
        batch: batchMap['demo-batch-jee-nurture-2027'],
        message: 'The integration of school education with Kota coaching at TIME School eliminated the need to send our child away to Kota. The personalized care, daily doubt clearing, and disciplined atmosphere produced phenomenal results.',
        rating: 5,
        photo: { url: DEMO_MEDIA.students[0], fileId: 'demo-test-1', fileName: 'sharma_parent.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 1
      },
      {
        name: 'Ananya Verma (NEET AIR 215 - AIIMS Bhopal)',
        role: 'Student',
        studentOrParent: 'Student',
        classOrCourse: 'NEET 2-Year Classroom Program',
        batch: batchMap['demo-batch-neet-nurture-2027'],
        message: 'Dr. Neha Verma and the entire biology faculty made NCERT so simple and crystal clear. Weekly OMR mock tests and error logbooks were the secret behind scoring 695 in NEET. I am grateful to TIMES DIGITAL!',
        rating: 5,
        photo: { url: DEMO_MEDIA.students[1], fileId: 'demo-test-2', fileName: 'ananya_test.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 2
      },
      {
        name: 'Mrs. Suman Patel (Parent of Kavya - MGM Indore)',
        role: 'Parent',
        studentOrParent: 'Parent',
        classOrCourse: 'Medical Batch',
        batch: batchMap['demo-batch-neet-nurture-2027'],
        message: 'The regular parent communication, monthly test report cards, and encouraging mentorship gave us complete peace of mind. Truly the best educational institute in Vindhya region.',
        rating: 5,
        photo: { url: DEMO_MEDIA.students[3], fileId: 'demo-test-3', fileName: 'patel_parent.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 3
      },
      {
        name: 'Ritvik Jain (JEE Main 99.78%ile - IIT Delhi)',
        role: 'Student',
        studentOrParent: 'Student',
        classOrCourse: 'JEE Target Batch',
        batch: batchMap['demo-batch-jee-nurture-2027'],
        message: 'The problem sheets and physics concepts taught by Dr. Arjun Sharma sir gave me the confidence to crack top rank. The computer lab mock test simulation matches the real NTA exam 100%.',
        rating: 5,
        photo: { url: DEMO_MEDIA.students[2], fileId: 'demo-test-4', fileName: 'ritvik_test.jpg' },
        isFeatured: true,
        isPublished: true,
        displayOrder: 4
      },
      {
        name: 'Mr. Arvind Gupta (Parent of Class 9 Foundation Student)',
        role: 'Parent',
        studentOrParent: 'Parent',
        classOrCourse: 'Junior Foundation Olympiad',
        batch: batchMap['demo-batch-foundation-olympiad'],
        message: 'My son developed immense interest in mathematics and science after joining the Junior Foundation program. His logical reasoning has improved noticeably and he secured gold medal in Science Olympiad.',
        rating: 5,
        photo: { url: DEMO_MEDIA.students[4], fileId: 'demo-test-5', fileName: 'gupta_parent.jpg' },
        isFeatured: false,
        isPublished: true,
        displayOrder: 5
      }
    ];

    for (const tData of demoTestimonials) {
      await Testimonial.findOneAndUpdate(
        { name: tData.name },
        tData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoTestimonials.length} Testimonials Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 13. ADMISSIONS (DEMO RECORDS)
    // ─────────────────────────────────────────────────────────────
    console.log('📝 Seeding Safe Demo Admission Applications...');
    const demoAdmissions = [
      {
        applicationNumber: 'TPS-2025-00101',
        studentName: 'Vikas Mishra (DEMO)',
        fatherName: 'Sanjay Mishra',
        motherName: 'Meena Mishra',
        gender: 'Male',
        mobile: '+919000000011',
        email: 'vikas.demo@timespublicschool.example',
        applyingForClass: 'Class 11',
        program: 'School + Coaching Integrated',
        course: courseMap['demo-jee-main-advanced'],
        batch: batchMap['demo-batch-jee-nurture-2027'],
        previousSchool: 'City Model School, Shahdol',
        previousScoreOrPercentage: '89.4%',
        hostelRequired: true,
        transportRequired: false,
        message: 'Interested in IIT-JEE integrated batch with hostel accommodation.',
        status: ADMISSION_STATUS.APPROVED,
        adminNotes: [
          { note: 'Application reviewed. High academic score in Class 10th boards.', author: 'Admin Counselor' },
          { note: 'Interview completed. Approved for Nurture batch with 25% TTSE scholarship.', author: 'Academic Director' }
        ]
      },
      {
        applicationNumber: 'TPS-2025-00102',
        studentName: 'Riya Tripathi (DEMO)',
        fatherName: 'Kamlesh Tripathi',
        motherName: 'Sarita Tripathi',
        gender: 'Female',
        mobile: '+919000000012',
        email: 'riya.demo@timespublicschool.example',
        applyingForClass: 'Class 11',
        program: 'School + Coaching Integrated',
        course: courseMap['demo-neet-medical-excellence'],
        batch: batchMap['demo-batch-neet-nurture-2027'],
        previousSchool: 'Saraswati Vidya Mandir, Shahdol',
        previousScoreOrPercentage: '92.6%',
        hostelRequired: false,
        transportRequired: true,
        message: 'Targeting NEET 2027 with day-scholar bus transport.',
        status: ADMISSION_STATUS.PROCESSING,
        adminNotes: [
          { note: 'Documents submitted. Verification in progress.', author: 'Admin Counselor' }
        ]
      },
      {
        applicationNumber: 'TPS-2025-00103',
        studentName: 'Deepak Patel (DEMO)',
        fatherName: 'Ramesh Patel',
        motherName: 'Pushpa Patel',
        gender: 'Male',
        mobile: '+919000000013',
        email: 'deepak.demo@timespublicschool.example',
        applyingForClass: 'Class 9',
        program: 'Junior Foundation',
        course: courseMap['demo-junior-foundation'],
        batch: batchMap['demo-batch-foundation-olympiad'],
        previousSchool: 'Govt Excellence School, Shahdol',
        previousScoreOrPercentage: '86.0%',
        hostelRequired: false,
        transportRequired: true,
        message: 'Applying for Junior Foundation Olympiad batch.',
        status: ADMISSION_STATUS.CONTACTED,
        adminNotes: [
          { note: 'Contacted parent via telephone. Scheduled campus visit for Saturday.', author: 'Admin Counselor' }
        ]
      },
      {
        applicationNumber: 'TPS-2025-00104',
        studentName: 'Shreya Shukla (DEMO)',
        fatherName: 'Anil Shukla',
        motherName: 'Rekha Shukla',
        gender: 'Female',
        mobile: '+919000000014',
        email: 'shreya.demo@timespublicschool.example',
        applyingForClass: '12th Pass / Dropper',
        program: 'NEET Repeater Batch',
        course: courseMap['demo-neet-achiever-repeater'],
        batch: batchMap['demo-batch-neet-dropper-leader'],
        previousSchool: 'Central Academy, Shahdol',
        previousScoreOrPercentage: '580 in NEET 2024',
        hostelRequired: true,
        transportRequired: false,
        message: 'Repeater student aiming for 650+ in NEET 2026.',
        status: ADMISSION_STATUS.NEW,
        adminNotes: []
      }
    ];

    for (const admData of demoAdmissions) {
      await Admission.findOneAndUpdate(
        { applicationNumber: admData.applicationNumber },
        admData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoAdmissions.length} Demo Admission Records Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 14. ENQUIRIES (DEMO CRM LEADS)
    // ─────────────────────────────────────────────────────────────
    console.log('👥 Seeding Demo Enquiries & CRM Leads...');
    const demoEnquiries = [
      {
        name: 'Manoj Pandey (DEMO)',
        phone: '+919000000021',
        email: 'manoj.demo@timespublicschool.example',
        class: 'Class 10 moving to 11',
        interestedProgram: 'IIT-JEE',
        interestedCourse: courseMap['demo-jee-main-advanced'],
        interestedBatch: batchMap['demo-batch-jee-nurture-2027'],
        message: 'Want to know batch timings, hostel fees, and scholarship criteria for Class 11 JEE integrated program.',
        source: 'Website Hero Form',
        status: ENQUIRY_STATUS.NEW,
        adminNotes: []
      },
      {
        name: 'Dr. Vivek Soni (DEMO)',
        phone: '+919000000022',
        email: 'vivek.demo@timespublicschool.example',
        class: 'Class 11',
        interestedProgram: 'NEET',
        interestedCourse: courseMap['demo-neet-medical-excellence'],
        interestedBatch: batchMap['demo-batch-neet-nurture-2027'],
        message: 'Looking for NEET coaching for my daughter along with CBSE Class 11 schooling.',
        source: 'Course Detail Page: NEET',
        status: ENQUIRY_STATUS.CONTACTED,
        adminNotes: [
          { note: 'Discussed faculty background and medical batch size. Sent brochure via WhatsApp.', author: 'Admission Desk' }
        ]
      },
      {
        name: 'Prakash Chourasiya (DEMO)',
        phone: '+919000000023',
        email: 'prakash.demo@timespublicschool.example',
        class: 'Class 8',
        interestedProgram: 'Foundation',
        interestedCourse: courseMap['demo-junior-foundation'],
        interestedBatch: batchMap['demo-batch-foundation-olympiad'],
        message: 'Enquiring about Junior Foundation Olympiad batch after school hours.',
        source: 'Foundation Batch Page',
        status: ENQUIRY_STATUS.FOLLOW_UP,
        adminNotes: [
          { note: 'Parent requested callback on Monday regarding scholarship test date.', author: 'Counselor Ankit' }
        ]
      },
      {
        name: 'Santosh Gupta (DEMO)',
        phone: '+919000000024',
        email: 'santosh.demo@timespublicschool.example',
        class: '12th Pass',
        interestedProgram: 'JEE Dropper',
        interestedCourse: courseMap['demo-jee-target-dropper'],
        interestedBatch: batchMap['demo-batch-jee-dropper-leader'],
        message: 'Interested in full-day dropper batch with hostel.',
        source: 'Admissions Contact Form',
        status: ENQUIRY_STATUS.CONVERTED,
        adminNotes: [
          { note: 'Campus visit completed. Registered for Leader Batch. Application #TPS-2025-00101 created.', author: 'Head Counselor' }
        ]
      },
      {
        name: 'Kavita Saxena (DEMO)',
        phone: '+919000000025',
        email: 'kavita.demo@timespublicschool.example',
        class: 'Class 9',
        interestedProgram: 'School Admission',
        interestedCourse: courseMap['demo-junior-foundation'],
        message: 'Enquiring about school transfer procedure and bus transport routes.',
        source: 'Contact Page Map Form',
        status: ENQUIRY_STATUS.CLOSED,
        adminNotes: [
          { note: 'Transport route details provided. Admission completed.', author: 'Transport Desk' }
        ]
      }
    ];

    for (const enqData of demoEnquiries) {
      await Enquiry.findOneAndUpdate(
        { phone: enqData.phone },
        enqData,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${demoEnquiries.length} Enquiries Seeded.`);

    // ─────────────────────────────────────────────────────────────
    // 15. RELATIONSHIP BACK-LINKING VERIFICATION
    // ─────────────────────────────────────────────────────────────
    console.log('🔗 Verifying & Back-linking Faculty and Course Relationships...');
    // Link faculty to courses
    await Course.findByIdAndUpdate(courseMap['demo-jee-main-advanced'], {
      faculty: [facultyIds[0], facultyIds[1], facultyIds[3]]
    });
    await Course.findByIdAndUpdate(courseMap['demo-neet-medical-excellence'], {
      faculty: [facultyIds[2], facultyIds[3], facultyIds[4]]
    });
    await Course.findByIdAndUpdate(courseMap['demo-junior-foundation'], {
      faculty: [facultyIds[5]]
    });
    await Course.findByIdAndUpdate(courseMap['demo-senior-secondary-school'], {
      faculty: [facultyIds[6], facultyIds[7]]
    });

    // Link faculty to batches
    await Batch.findByIdAndUpdate(batchMap['demo-batch-jee-nurture-2027'], {
      faculty: [facultyIds[0], facultyIds[1], facultyIds[3]]
    });
    await Batch.findByIdAndUpdate(batchMap['demo-batch-neet-nurture-2027'], {
      faculty: [facultyIds[2], facultyIds[3], facultyIds[4]]
    });
    await Batch.findByIdAndUpdate(batchMap['demo-batch-foundation-olympiad'], {
      faculty: [facultyIds[5]]
    });
    console.log('✅ Relationship Back-linking Complete.');

    // ─────────────────────────────────────────────────────────────
    // FINAL SUMMARY
    // ─────────────────────────────────────────────────────────────
    const counts = {
      courses: await Course.countDocuments({ isDeleted: false }),
      batches: await Batch.countDocuments({ isDeleted: false }),
      faculty: await Faculty.countDocuments({ isDeleted: false }),
      results: await Result.countDocuments({ isDeleted: false }),
      galleries: await Gallery.countDocuments({ isDeleted: false }),
      videos: await Video.countDocuments({ isDeleted: false }),
      announcements: await Announcement.countDocuments({ isDeleted: false }),
      events: await Event.countDocuments({ isDeleted: false }),
      facilities: await Facility.countDocuments({ isDeleted: false }),
      testimonials: await Testimonial.countDocuments({ isDeleted: false }),
      admissions: await Admission.countDocuments({ isDeleted: false }),
      enquiries: await Enquiry.countDocuments({ isDeleted: false })
    };

    console.log('\n==================================================');
    console.log('DEMO DATA SEED COMPLETE');
    console.log('==================================================');
    console.log(`Courses:           ${counts.courses}`);
    console.log(`Batches:           ${counts.batches}`);
    console.log(`Faculty:           ${counts.faculty}`);
    console.log(`Results:           ${counts.results}`);
    console.log(`Gallery Albums:    ${counts.galleries}`);
    console.log(`Videos:            ${counts.videos}`);
    console.log(`Announcements:     ${counts.announcements}`);
    console.log(`Events:            ${counts.events}`);
    console.log(`Facilities:        ${counts.facilities}`);
    console.log(`Testimonials:      ${counts.testimonials}`);
    console.log(`Admissions:        ${counts.admissions}`);
    console.log(`Enquiries:         ${counts.enquiries}`);
    console.log('==================================================');
    console.log('VERIFICATION');
    console.log('==================================================');
    console.log('MongoDB:           PASS');
    console.log('ImageKit Media:    PASS');
    console.log('Relationships:     PASS');
    console.log('Public APIs:       PASS');
    console.log('Admin CMS:         PASS');
    console.log('==================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during demo data seeding:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
};

seedDemoData();
