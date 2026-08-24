import mongoose from 'mongoose';

const homepageSchema = new mongoose.Schema(
  {
    hero: {
      isVisible: { type: Boolean, default: true },
      badgeText: { type: String, default: 'Admissions Open 2025-26 | JEE • NEET • Foundation' },
      title: { type: String, default: 'Shaping Academic Excellence in Shahdol' },
      subtitle: { type: String, default: 'TIME Public School & TIMES DIGITAL provide integrated schooling and top-tier IIT-JEE / NEET coaching with Kota & National faculty.' },
      primaryCtaText: { type: String, default: 'Explore Target Batches' },
      primaryCtaLink: { type: String, default: '/batches' },
      secondaryCtaText: { type: String, default: 'Apply for Admission' },
      secondaryCtaLink: { type: String, default: '/admissions' },
      bannerImage: {
        url: { type: String, default: '' },
        fileId: { type: String, default: '' }
      },
      slides: [
        {
          title: { type: String, default: '' },
          subtitle: { type: String, default: '' },
          ctaText: { type: String, default: '' },
          ctaLink: { type: String, default: '' },
          image: {
            url: { type: String, default: '' },
            fileId: { type: String, default: '' }
          }
        }
      ]
    },
    whyChooseUs: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Why Choose TIME School & TIMES DIGITAL?' },
      subtitle: { type: String, default: 'Combining holistic school education with rigorous competitive exam training under one roof.' },
      items: [
        {
          title: { type: String, default: '' },
          description: { type: String, default: '' },
          icon: { type: String, default: '' },
          displayOrder: { type: Number, default: 0 }
        }
      ]
    },
    achievements: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Our Proven Track Record' },
      subtitle: { type: String, default: 'Consistent top ranks in Shahdol and Vindhya region in JEE & NEET' },
      stats: [
        {
          label: { type: String, default: 'Students Mentored' },
          count: { type: String, default: '2500+' },
          icon: { type: String, default: 'students' }
        },
        {
          label: { type: String, default: 'JEE / NEET Selections' },
          count: { type: String, default: '350+' },
          icon: { type: String, default: 'award' }
        },
        {
          label: { type: String, default: 'Expert Faculty' },
          count: { type: String, default: '45+' },
          icon: { type: String, default: 'teacher' }
        },
        {
          label: { type: String, default: 'Success Rate' },
          count: { type: String, default: '98%' },
          icon: { type: String, default: 'chart' }
        }
      ]
    },
    featuredBatches: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Flagship Batches for IIT-JEE & NEET' },
      subtitle: { type: String, default: 'Comprehensive batches designed for class 8th to 12th & 12th pass students.' },
      maxItems: { type: Number, default: 6 }
    },
    coursesSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Academic & Competitive Programs' },
      subtitle: { type: String, default: 'From Foundation to Target batches, explore our structured curriculum.' }
    },
    resultsSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Hall of Fame & Top Rankers' },
      subtitle: { type: String, default: 'Celebrating our stars who made Shahdol proud in JEE Main, Advanced & NEET.' },
      maxItems: { type: Number, default: 8 }
    },
    facultySection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Learn from Master Educators' },
      subtitle: { type: String, default: 'Experienced Kota & national faculty with proven track records.' },
      maxItems: { type: Number, default: 8 }
    },
    gallerySection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Campus Life & Moments' },
      subtitle: { type: String, default: 'Glimpses into classrooms, sports, labs, and celebrations.' },
      maxItems: { type: Number, default: 6 }
    },
    videoSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Watch Us in Action' },
      subtitle: { type: String, default: 'Campus walkthrough, faculty orientations, and student reactions.' },
      maxItems: { type: Number, default: 4 }
    },
    facilitiesSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'World-Class Infrastructure' },
      subtitle: { type: String, default: 'Modern smart classes, advanced science labs, library, and secure hostel.' }
    },
    testimonialsSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'What Parents & Students Say' },
      subtitle: { type: String, default: 'Real feedback from parents and students experiencing the transformation.' }
    },
    announcementsSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Latest Notices & Circulars' },
      subtitle: { type: String, default: 'Stay updated with all important dates, exam schedules, and circulars.' }
    },
    hostelSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Secure Hostel & Residential Facility' },
      description: { type: String, default: 'Dedicated boys & girls hostel facilities with hygienic food, 24/7 security, disciplined study hours, and warden supervision.' },
      features: {
        type: [String],
        default: ['Separate Boys & Girls Hostels', 'Nutritious & Hygienic Meals', 'Daily Doubt Clearing Sessions', '24x7 Security & CCTV', 'Clean & Spacious Rooms']
      },
      image: {
        url: { type: String, default: '' },
        fileId: { type: String, default: '' }
      }
    },
    scholarshipSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Times Talent Scholarship Exam' },
      description: { type: String, default: 'Avail up to 100% scholarship on tuition fees based on performance in our entrance and talent recognition exam.' },
      ctaText: { type: String, default: 'Register for Scholarship Test' },
      ctaLink: { type: String, default: '/admissions' },
      image: {
        url: { type: String, default: '' },
        fileId: { type: String, default: '' }
      }
    },
    ctaSection: {
      isVisible: { type: Boolean, default: true },
      title: { type: String, default: 'Start Your Journey Toward Academic Excellence' },
      subtitle: { type: String, default: 'Enroll today in TIME Public School or TIMES DIGITAL target batches.' },
      buttonText: { type: String, default: 'Apply for Admission Now' },
      buttonLink: { type: String, default: '/admissions' },
      bgImage: {
        url: { type: String, default: '' },
        fileId: { type: String, default: '' }
      }
    },
    sectionOrder: {
      type: [String],
      default: [
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
      ]
    }
  },
  {
    timestamps: true
  }
);

export const Homepage = mongoose.model('Homepage', homepageSchema);
