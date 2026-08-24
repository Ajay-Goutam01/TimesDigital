import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicEventsQuery } from '../services/eventApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const EventsPage = () => {
  useDocumentTitle('Institutional Events Calendar');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const { data, isLoading } = useGetPublicEventsQuery();
  const events = data?.data?.events || data?.data || [];

  const filters = ['All', 'Academic', 'Scholarship', 'Competition', 'Celebration'];

  const filteredEvents =
    selectedFilter === 'All'
      ? events
      : events.filter(
          (e) => e.category?.toLowerCase() === selectedFilter.toLowerCase()
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Events & Seminars"
        title="Institutional Calendar & Competitions"
        subtitle="Stay engaged with upcoming academic seminars, scholarship examinations, science exhibitions, and annual sports events."
        breadcrumbs={[{ label: 'Events' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === f
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {f} {f !== 'All' && 'Events'}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => {
                const evtDate = evt.startDate
                  ? new Date(evt.startDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '';

                return (
                  <Card
                    key={evt._id}
                    hover
                    className="overflow-hidden flex flex-col justify-between h-full bg-white border border-[#E5E1D7] group"
                  >
                    <div className="relative overflow-hidden">
                      <AppImage
                        src={evt.coverImage?.url}
                        alt={evt.title}
                        aspectRatio="course"
                        rounded="none"
                      />
                      {evt.category && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="dark" size="sm">
                            {evt.category}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
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

                        <h3 className="text-base sm:text-lg font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
                          {evt.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
                          {evt.shortDescription || evt.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E5E1D7]">
                        <Link to={`/events/${evt.slug || evt._id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full"
                          >
                            Event Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No events found"
              message="No events match the selected category."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedFilter('All')}
                >
                  View All Events
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default EventsPage;
