import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { useGetWebsiteSettingsQuery } from '../../school/services/websiteSettingsApi';
import { useGetHomepageDataQuery } from '../../home/services/homeApi';

export const BatchCard = ({ batch }) => {
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const { data: homeData } = useGetHomepageDataQuery();

  const settings = settingsData?.data || {};
  const homepage = homeData?.data || {};

  if (!batch) return null;

  const isAdmissionOpen = settings.isAdmissionOpen !== false && batch.status === 'admissions-open';
  const isHostelVisible = homepage.hostelSection?.isVisible !== false && batch.hostelAvailable === true;
  const hasScholarship = Boolean(batch.scholarshipInfo || batch.feeStructure?.scholarshipUpto);

  const startDateFormatted = batch.startDate
    ? new Date(batch.startDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Upcoming';

  const getStatusBadge = () => {
    if (batch.status === 'seats-full') {
      return <Badge variant="danger" size="sm">Seats Full</Badge>;
    }
    if (batch.status === 'upcoming') {
      return <Badge variant="dark" size="sm">Upcoming</Badge>;
    }
    if (batch.status === 'completed') {
      return <Badge variant="dark" size="sm">Completed</Badge>;
    }
    if (isAdmissionOpen) {
      return <Badge variant="gold" size="sm">Admissions Open</Badge>;
    }
    return null;
  };

  return (
    <Card hover className="flex flex-col h-full overflow-hidden group">
      {/* Batch Header / Thumbnail */}
      <div className="relative">
        <AppImage
          src={batch.batchImage?.url}
          alt={batch.name}
          aspectRatio="batch"
          rounded="none"
        />
        {batch.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="dark" size="sm">
              {batch.category}
            </Badge>
          </div>
        )}
        {getStatusBadge() && (
          <div className="absolute top-3 right-3">
            {getStatusBadge()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
            {batch.name}
          </h3>

          {/* Schedule Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#68736D] bg-[#FAF8F2] p-3 rounded-[12px] border border-[#E5E1D7]">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" />
              <span className="truncate">Starts: {startDateFormatted}</span>
            </div>
            {batch.timings && (
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" />
                <span className="truncate">{batch.timings}</span>
              </div>
            )}
            {batch.class && (
              <div className="flex items-center gap-1.5 truncate">
                <BookOpen className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" />
                <span className="truncate">Class: {batch.class}</span>
              </div>
            )}
            {batch.duration && (
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" />
                <span className="truncate">{batch.duration}</span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
            {batch.shortDescription || batch.description}
          </p>

          {/* Key Inclusions (Scholarship / Hostel) - strictly backend-driven */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {isHostelVisible && (
              <span className="text-[11px] font-semibold bg-[#164A35]/10 text-[#164A35] px-2 py-0.5 rounded-full">
                Hostel Facility Available
              </span>
            )}
            {hasScholarship && (
              <span className="text-[11px] font-semibold bg-[#C5A55A]/15 text-[#8A6D23] px-2 py-0.5 rounded-full">
                Scholarship {batch.feeStructure?.scholarshipUpto ? `(${batch.feeStructure.scholarshipUpto})` : 'Available'}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[#E5E1D7] flex items-center justify-between gap-2">
          <Link to={`/batches/${batch.slug || batch._id}`} className="flex-1">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full"
            >
              Batch Details
            </Button>
          </Link>
          <Link to="/admissions" className="shrink-0">
            <Button variant="primary" size="sm">
              {isAdmissionOpen ? 'Apply' : 'Enquire'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BatchCard;
