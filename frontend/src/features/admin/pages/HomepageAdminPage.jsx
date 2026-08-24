import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  LayoutTemplate,
  Sparkles,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { AdminFileUpload } from '../components/AdminFileUpload';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetHomepageDataQuery,
  useUpdateHomepageDataMutation,
} from '../../home/services/homeApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

const DEFAULT_SECTION_ORDER = [
  'hero',
  'whyChooseUs',
  'achievements',
  'featuredBatches',
  'coursesSection',
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

const SECTION_LABELS = {
  hero: '1. Hero Banner',
  whyChooseUs: '2. Why Choose Us (Pillars)',
  achievements: '3. Achievements Counter',
  featuredBatches: '4. Featured Batches',
  coursesSection: '5. Academic Courses',
  resultsSection: '6. Results & Rankers',
  facultySection: '7. Faculty Mentors',
  facilitiesSection: '8. Campus Facilities',
  hostelSection: '9. Hostel & Residential',
  scholarshipSection: '10. Scholarship Exams',
  videoSection: '11. Campus Videos',
  gallerySection: '12. Campus Gallery',
  testimonialsSection: '13. Testimonials & Reviews',
  announcementsSection: '14. Circulars & Notices',
  eventsSection: '15. School Events',
  ctaSection: '16. Bottom Action Banner',
};

export const HomepageAdminPage = () => {
  useDocumentTitle('Homepage CMS & Section Order');
  const { showToast } = useToast();
  const { data: homeData, isLoading, refetch } = useGetHomepageDataQuery();
  const [updateHomepage, { isLoading: isSaving }] = useUpdateHomepageDataMutation();

  const homepage = homeData?.data || {};

  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
  const [sectionVisibility, setSectionVisibility] = useState({});

  // Hero fields
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('');
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState('');
  const [heroBannerFile, setHeroBannerFile] = useState(null);

  // Achievements
  const [statStudents, setStatStudents] = useState('');
  const [statSelections, setStatSelections] = useState('');
  const [statFaculty, setStatFaculty] = useState('');
  const [statYears, setStatYears] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (homepage && Object.keys(homepage).length > 0) {
      if (Array.isArray(homepage.sectionOrder) && homepage.sectionOrder.length > 0) {
        setSectionOrder(homepage.sectionOrder);
      }

      // Build visibility map
      const visMap = {};
      DEFAULT_SECTION_ORDER.forEach((key) => {
        visMap[key] = homepage[key]?.isVisible !== false;
      });
      setSectionVisibility(visMap);

      // Hero
      setHeroBadge(homepage.hero?.badge || 'ADMISSIONS OPEN FOR SESSION 2025-26');
      setHeroTitle(homepage.hero?.title || 'TIME PUBLIC SCHOOL & TIMES DIGITAL');
      setHeroSubtitle(
        homepage.hero?.subtitle ||
          'Nurturing academic brilliance and national competitive excellence in Shahdol.'
      );
      setHeroPrimaryCtaText(homepage.hero?.primaryCta?.text || 'Apply for Admission');
      setHeroPrimaryCtaLink(homepage.hero?.primaryCta?.link || '/admissions');

      // Achievements
      const achItems = homepage.achievements?.items || [];
      setStatStudents(achItems[0]?.value || '2500+');
      setStatSelections(achItems[1]?.value || '500+');
      setStatFaculty(achItems[2]?.value || '50+');
      setStatYears(achItems[3]?.value || '15+');
    }
  }, [homepage]);

  // Shift section order
  const moveSection = (idx, direction) => {
    const newOrder = [...sectionOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;

    const temp = newOrder[idx];
    newOrder[idx] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setSectionOrder(newOrder);
    showToast('Section order changed. Click "Save Homepage Layout" to persist.', 'info', 2500);
  };

  const toggleVisibility = (key) => {
    setSectionVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    setSaveError('');

    const formData = new FormData();

    // Section Order
    formData.append('sectionOrder', JSON.stringify(sectionOrder));

    // Hero Section
    const heroPayload = {
      ...(homepage.hero || {}),
      badge: heroBadge,
      title: heroTitle,
      subtitle: heroSubtitle,
      isVisible: sectionVisibility.hero !== false,
      primaryCta: {
        text: heroPrimaryCtaText,
        link: heroPrimaryCtaLink,
      },
    };
    formData.append('hero', JSON.stringify(heroPayload));

    if (heroBannerFile) {
      formData.append('heroBanner', heroBannerFile);
    }

    // Achievements Section
    const achievementsPayload = {
      ...(homepage.achievements || {}),
      isVisible: sectionVisibility.achievements !== false,
      items: [
        { label: 'Students Enrolled', value: statStudents },
        { label: 'IIT / NEET Selections', value: statSelections },
        { label: 'Kota Expert Faculty', value: statFaculty },
        { label: 'Years of Excellence', value: statYears },
      ],
    };
    formData.append('achievements', JSON.stringify(achievementsPayload));

    // Attach isVisible to all other sections
    DEFAULT_SECTION_ORDER.forEach((key) => {
      if (key !== 'hero' && key !== 'achievements') {
        const secData = {
          ...(homepage[key] || {}),
          isVisible: sectionVisibility[key] !== false,
        };
        formData.append(key, JSON.stringify(secData));
      }
    });

    try {
      await updateHomepage(formData).unwrap();
      setSaveSuccess(true);
      showToast('Homepage layout and CMS sections saved live!', 'success');
      refetch();
      setTimeout(() => setSaveSuccess(false), 4000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err?.data?.message || 'Failed to update homepage CMS.';
      setSaveError(msg);
      showToast(msg, 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#C5A55A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#164A35]">Homepage CMS & Layout</h2>
          <p className="text-xs text-[#68736D]">
            Reorder landing page sections, toggle visibility, and update hero headlines and achievement counters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#164A35] hover:text-[#103728] px-3 py-1.5 rounded-[8px] bg-white border border-[#E5E1D7] flex items-center gap-1"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-[#C5A55A]" />
          </a>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-[14px] bg-[#164A35]/10 border border-[#164A35]/30 text-xs font-semibold text-[#164A35] flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-[#C5A55A]" />
          <span>Homepage CMS layout saved! Changes are live on the public website.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-[14px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs font-semibold text-[#C94A4A] flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Reorder & Visibility Controller */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <div className="flex items-center justify-between border-b border-[#E5E1D7] pb-3">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#C5A55A]" />
              <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider">
                1. Homepage Section Order & Visibility Controller
              </h3>
            </div>
            <span className="text-[11px] text-[#68736D] font-medium">
              Drag / Arrow shift order
            </span>
          </div>

          <div className="space-y-2">
            {sectionOrder.map((secKey, idx) => {
              const label = SECTION_LABELS[secKey] || secKey;
              const isVis = sectionVisibility[secKey] !== false;

              return (
                <div
                  key={secKey}
                  className={`flex items-center justify-between p-3 rounded-[12px] border transition-all ${
                    isVis
                      ? 'bg-[#FAF8F2] border-[#E5E1D7]'
                      : 'bg-[#F3F0E7]/60 border-[#E5E1D7] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-[#E5E1D7] flex items-center justify-center text-[11px] font-bold text-[#164A35]">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#17231D]">
                      {label}
                    </span>
                    {!isVis && (
                      <Badge variant="cream" size="sm">
                        Hidden from Website
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Order Shift Up / Down */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 rounded-[6px] bg-white border border-[#E5E1D7] hover:bg-[#FAF8F2] disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-[#164A35]" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === sectionOrder.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 rounded-[6px] bg-white border border-[#E5E1D7] hover:bg-[#FAF8F2] disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-[#164A35]" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleVisibility(secKey)}
                      className={`ml-2 px-2.5 py-1 rounded-[6px] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        isVis
                          ? 'bg-[#164A35]/10 text-[#164A35] hover:bg-[#164A35]/20'
                          : 'bg-[#C94A4A]/10 text-[#C94A4A] hover:bg-[#C94A4A]/20'
                      }`}
                    >
                      {isVis ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Hero Section Content CMS */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <div className="flex items-center gap-2 border-b border-[#E5E1D7] pb-3">
            <Sparkles className="w-4 h-4 text-[#C5A55A]" />
            <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider">
              2. Hero Banner Headlines & Image
            </h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Top Eyebrow Badge"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="e.g. ADMISSIONS OPEN FOR 2025–26"
            />

            <Input
              label="Main Hero Headline"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="e.g. TIME PUBLIC SCHOOL & TIMES DIGITAL"
              required
            />

            <Textarea
              label="Hero Supporting Subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              rows={2}
              placeholder="Empowering students with premier CBSE schooling and Kota mentorship..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Button CTA Text"
                value={heroPrimaryCtaText}
                onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                placeholder="Apply for Admission"
              />

              <Input
                label="Primary Button Destination Link"
                value={heroPrimaryCtaLink}
                onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
                placeholder="/admissions"
              />
            </div>

            <AdminFileUpload
              file={heroBannerFile}
              setFile={setHeroBannerFile}
              existingUrl={homepage.hero?.bannerImage?.url}
              label="Hero Campus Image"
            />
          </div>
        </Card>

        {/* Achievement Counters CMS */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <div className="flex items-center gap-2 border-b border-[#E5E1D7] pb-3">
            <Trophy className="w-4 h-4 text-[#C5A55A]" />
            <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider">
              3. Achievement Metric Counters
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Enrolled Students"
              value={statStudents}
              onChange={(e) => setStatStudents(e.target.value)}
              placeholder="2500+"
            />

            <Input
              label="IIT / NEET Selections"
              value={statSelections}
              onChange={(e) => setStatSelections(e.target.value)}
              placeholder="500+"
            />

            <Input
              label="Kota Expert Faculty"
              value={statFaculty}
              onChange={(e) => setStatFaculty(e.target.value)}
              placeholder="50+"
            />

            <Input
              label="Years of Excellence"
              value={statYears}
              onChange={(e) => setStatYears(e.target.value)}
              placeholder="15+"
            />
          </div>
        </Card>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            icon={Save}
            className="w-full sm:w-auto"
          >
            Save Homepage Layout Live
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HomepageAdminPage;
