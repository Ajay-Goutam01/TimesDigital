import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Download, ArrowRight, FileText } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicAnnouncementsQuery } from '../../announcements/services/announcementApi';

export const AnnouncementsSection = ({ data }) => {
  const { data: annData, isLoading } = useGetPublicAnnouncementsQuery({ limit: 4 });
  const announcements = annData?.data?.announcements || annData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-[#E5E1D7]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Notices & Circulars"
            title={data?.title || 'Important School & Coaching Notices'}
            subtitle={
              data?.subtitle ||
              'Stay updated with timely circulars on admissions, exams, holidays, and academic events.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/announcements" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              All Circulars
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CardSkeleton count={4} />
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {announcements.map((item) => {
              const publishDate = item.publishDate
                ? new Date(item.publishDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '';

              return (
                <Card
                  key={item._id}
                  hover
                  className="p-5 flex flex-col justify-between space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={item.priority === 'urgent' ? 'danger' : 'green'} size="sm">
                        {item.priority === 'urgent' ? 'Urgent Notice' : 'Circular'}
                      </Badge>
                      {publishDate && (
                        <span className="text-[11px] text-[#68736D] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C5A55A]" />
                          {publishDate}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#17231D] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.attachment?.url && (
                    <div className="pt-2">
                      <a
                        href={item.attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164A35] hover:text-[#103728]"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C5A55A]" />
                        <span>Download PDF Attachment</span>
                      </a>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
};
