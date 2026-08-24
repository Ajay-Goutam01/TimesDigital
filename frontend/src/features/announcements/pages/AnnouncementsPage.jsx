import React, { useState } from 'react';
import { Bell, Calendar, Download, FileText, Filter } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicAnnouncementsQuery } from '../services/announcementApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AnnouncementsPage = () => {
  useDocumentTitle('Circulars & Important Announcements');
  const [selectedPriority, setSelectedPriority] = useState('All');

  const { data, isLoading } = useGetPublicAnnouncementsQuery();
  const announcements = data?.data?.announcements || data?.data || [];

  const priorityFilters = ['All', 'Urgent', 'Normal'];

  const filteredAnnouncements =
    selectedPriority === 'All'
      ? announcements
      : announcements.filter(
          (a) => a.priority?.toLowerCase() === selectedPriority.toLowerCase()
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Official Notice Board"
        title="School Circulars & Examination Announcements"
        subtitle="Official updates regarding CBSE board schedules, holiday notifications, competitive test dates, and scholarship circulars."
        breadcrumbs={[{ label: 'Announcements' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Priority Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {priorityFilters.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPriority(p)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedPriority === p
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {p} {p !== 'All' && 'Notices'}
              </button>
            ))}
          </div>

          {/* Announcements Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredAnnouncements.map((item) => {
                const publishDate = item.publishDate
                  ? new Date(item.publishDate).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '';

                return (
                  <Card
                    key={item._id}
                    hover
                    className="p-6 flex flex-col justify-between space-y-4 bg-white border border-[#E5E1D7]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={item.priority === 'urgent' ? 'danger' : 'green'}
                          size="sm"
                        >
                          {item.priority === 'urgent' ? 'Urgent Circular' : 'Notice'}
                        </Badge>
                        {publishDate && (
                          <span className="text-xs text-[#68736D] flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A55A]" />
                            {publishDate}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#17231D] leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>

                    {item.attachment?.url && (
                      <div className="pt-3 border-t border-[#E5E1D7]">
                        <a
                          href={item.attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-[#164A35] hover:text-[#103728]"
                        >
                          <FileText className="w-4 h-4 text-[#C5A55A]" />
                          <span>Download Official PDF Document</span>
                        </a>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No circulars found"
              message="No announcements match the selected filter."
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default AnnouncementsPage;
