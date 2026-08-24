import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicEventsQuery } from '../../events/services/eventApi';

export const EventsSection = ({ data }) => {
  const { data: eventsData, isLoading } = useGetPublicEventsQuery({ limit: 3 });
  const events = eventsData?.data?.events || eventsData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Institutional Calendar"
            title={data?.title || 'Upcoming School & Coaching Events'}
            subtitle={
              data?.subtitle ||
              'Participate in academic seminars, talent scholarship tests, science fests, and sports meets.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/events" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View Full Calendar
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => {
              const evtDate = evt.startDate
                ? new Date(evt.startDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '';

              return (
                <Card key={evt._id} hover className="overflow-hidden flex flex-col h-full bg-white group">
                  <AppImage
                    src={evt.coverImage?.url}
                    alt={evt.title}
                    aspectRatio="course"
                    rounded="none"
                  />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-[#68736D]">
                        {evtDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#C5A55A]" />
                            {evtDate}
                          </span>
                        )}
                        {evt.venue && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#C5A55A]" />
                            {evt.venue}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
                        {evt.shortDescription || evt.description}
                      </p>
                    </div>

                    <Link
                      to={`/events/${evt.slug || evt._id}`}
                      className="pt-2 text-xs font-bold text-[#164A35] flex items-center gap-1 hover:text-[#103728]"
                    >
                      <span>Event Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A55A]" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
};
