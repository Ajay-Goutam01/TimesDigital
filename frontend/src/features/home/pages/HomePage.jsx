import React from 'react';
import { useGetHomepageDataQuery } from '../services/homeApi';
import { useGetWebsiteSettingsQuery } from '../../school/services/websiteSettingsApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';
import { PageLoader } from '../../../components/ui/Loader';

// Section Components
import { AnnouncementsTicker } from '../components/AnnouncementsTicker';
import { HeroSection } from '../components/HeroSection';
import { AchievementsSection } from '../components/AchievementsSection';
import { WhyChooseUsSection } from '../components/WhyChooseUsSection';
import { FeaturedBatchesSection } from '../components/FeaturedBatchesSection';
import { CoursesSection } from '../components/CoursesSection';
import { ResultsSection } from '../components/ResultsSection';
import { FacultySection } from '../components/FacultySection';
import { FacilitiesSection } from '../components/FacilitiesSection';
import { HostelSection } from '../components/HostelSection';
import { ScholarshipSection } from '../components/ScholarshipSection';
import { VideoSection } from '../components/VideoSection';
import { GallerySection } from '../components/GallerySection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { AnnouncementsSection } from '../components/AnnouncementsSection';
import { EventsSection } from '../components/EventsSection';
import { CTASection } from '../components/CTASection';

const DEFAULT_SECTION_ORDER = [
  'hero',
  'achievements',
  'coursesSection',
  'featuredBatches',
  'whyChooseUs',
  'resultsSection',
  'facultySection',
  'facilitiesSection',
  'hostelSection',
  'scholarshipSection',
  'videoSection',
  'gallerySection',
  'testimonialsSection',
  'announcementsSection',
  'eventsSection',
  'ctaSection',
];

export const HomePage = () => {
  useDocumentTitle('Where Learning Meets Excellence');

  const { data: homeData, isLoading } = useGetHomepageDataQuery();
  const { data: settingsData } = useGetWebsiteSettingsQuery();

  const homepage = homeData?.data || {};
  const settings = settingsData?.data || {};

  if (isLoading) {
    return <PageLoader message="Loading TIME Public School..." />;
  }

  const sectionOrder =
    Array.isArray(homepage.sectionOrder) && homepage.sectionOrder.length > 0
      ? homepage.sectionOrder
      : DEFAULT_SECTION_ORDER;

  const renderSection = (sectionKey) => {
    const secData = homepage[sectionKey];

    // Respect isVisible flag from backend CMS
    if (secData && secData.isVisible === false) {
      return null;
    }

    switch (sectionKey) {
      case 'hero':
        return <HeroSection key="hero" data={homepage.hero} settings={settings} />;
      case 'achievements':
        return <AchievementsSection key="achievements" data={homepage.achievements} />;
      case 'whyChooseUs':
        return <WhyChooseUsSection key="whyChooseUs" data={homepage.whyChooseUs} />;
      case 'featuredBatches':
        return <FeaturedBatchesSection key="featuredBatches" data={homepage.featuredBatches} />;
      case 'coursesSection':
        return <CoursesSection key="coursesSection" data={homepage.coursesSection} />;
      case 'resultsSection':
        return <ResultsSection key="resultsSection" data={homepage.resultsSection} />;
      case 'facultySection':
        return <FacultySection key="facultySection" data={homepage.facultySection} />;
      case 'facilitiesSection':
        return <FacilitiesSection key="facilitiesSection" data={homepage.facilitiesSection} />;
      case 'hostelSection':
        return <HostelSection key="hostelSection" data={homepage.hostelSection} />;
      case 'scholarshipSection':
        return <ScholarshipSection key="scholarshipSection" data={homepage.scholarshipSection} />;
      case 'videoSection':
        return <VideoSection key="videoSection" data={homepage.videoSection} />;
      case 'gallerySection':
        return <GallerySection key="gallerySection" data={homepage.gallerySection} />;
      case 'testimonialsSection':
        return <TestimonialsSection key="testimonialsSection" data={homepage.testimonialsSection} />;
      case 'announcementsSection':
        return <AnnouncementsSection key="announcementsSection" data={homepage.announcementsSection} />;
      case 'eventsSection':
        return <EventsSection key="eventsSection" data={homepage.eventsSection} />;
      case 'ctaSection':
        return <CTASection key="ctaSection" data={homepage.ctaSection} settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Top Announcement Ticker */}
      <AnnouncementsTicker />

      {/* Dynamic Ordered Sections */}
      {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
    </div>
  );
};

export default HomePage;
