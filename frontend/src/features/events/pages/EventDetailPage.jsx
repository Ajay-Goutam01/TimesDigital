import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { PageLoader } from '../../../components/ui/Loader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useGetEventBySlugQuery } from '../services/eventApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const EventDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetEventBySlugQuery(slug);
  const event = data?.data?.event || data?.data;

  useDocumentTitle(event?.title || 'Event Details');

  if (isLoading) return <PageLoader message="Loading event details..." />;
  if (isError || !event) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Event Not Found"
          message="The requested school event details could not be retrieved."
          onRetry={refetch}
        />
      </Container>
    );
  }

  const startDateFormatted = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="w-full">
      <PageHero
        badge={event.category || 'School Event'}
        title={event.title}
        subtitle={event.shortDescription || event.description}
        breadcrumbs={[
          { label: 'Events', path: '/events' },
          { label: event.title },
        ]}
        actions={
          <Link to="/events">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              All Events
            </Button>
          </Link>
        }
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Media & Full Schedule (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-[20px] overflow-hidden border border-[#E5E1D7] shadow-xs">
                <AppImage
                  src={event.coverImage?.url}
                  alt={event.title}
                  aspectRatio="banner"
                  rounded="none"
                />
              </div>

              {/* Event Description */}
              <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-[#164A35]">
                  About This Event
                </h3>
                <div className="text-sm text-[#17231D] leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Gallery of Past Editions if Available */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-[#164A35]">
                    Event Highlights & Photographs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {event.gallery.map((img, idx) => (
                      <div key={idx} className="rounded-[12px] overflow-hidden border border-[#E5E1D7]">
                        <AppImage
                          src={img.url || img}
                          alt={`Event highlight ${idx + 1}`}
                          aspectRatio="course"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Schedule & Location Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-6 space-y-5 bg-white border border-[#E5E1D7]">
                <h4 className="text-xs font-bold text-[#68736D] uppercase tracking-wider">
                  Event Logistics
                </h4>

                <div className="space-y-3.5 text-xs text-[#17231D]">
                  {startDateFormatted && (
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[#164A35]">Date</span>
                        <span className="text-[#68736D]">{startDateFormatted}</span>
                      </div>
                    </div>
                  )}

                  {event.time && (
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[#164A35]">Time</span>
                        <span className="text-[#68736D]">{event.time}</span>
                      </div>
                    </div>
                  )}

                  {event.venue && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-[#164A35]">Venue</span>
                        <span className="text-[#68736D]">{event.venue}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E5E1D7] space-y-2">
                  <Link to="/contact" className="block">
                    <Button variant="primary" size="md" className="w-full">
                      Contact for Registration
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default EventDetailPage;
