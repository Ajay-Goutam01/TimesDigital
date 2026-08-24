import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicFacilitiesQuery } from '../services/facilityApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const FacilitiesPage = () => {
  useDocumentTitle('Campus Infrastructure & Facilities');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading } = useGetPublicFacilitiesQuery();
  const facilities = data?.data?.facilities || data?.data || [];

  const categories = ['All', 'Academic', 'Laboratories', 'Library', 'Sports', 'Hostel'];

  const filteredFacilities =
    selectedCategory === 'All'
      ? facilities
      : facilities.filter(
          (f) => f.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Campus Infrastructure"
        title="Modern Learning Spaces & Student Amenities"
        subtitle="Designed to provide an enriching, disciplined environment with smart classrooms, advanced laboratories, reading halls, and sports grounds."
        breadcrumbs={[{ label: 'Facilities' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {cat} {cat !== 'All' && 'Facilities'}
              </button>
            ))}
          </div>

          {/* Facilities Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((fac) => (
                <Card
                  key={fac._id}
                  hover
                  className="overflow-hidden flex flex-col justify-between h-full bg-white border border-[#E5E1D7] group"
                >
                  <div className="relative overflow-hidden">
                    <AppImage
                      src={fac.images?.[0]?.url || fac.image?.url}
                      alt={fac.title}
                      aspectRatio="course"
                      rounded="none"
                    />
                    {fac.category && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="dark" size="sm">
                          {fac.category}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors leading-snug">
                        {fac.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
                        {fac.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E5E1D7]">
                      <Link to={`/facilities/${fac.slug || fac._id}`}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={ArrowRight}
                          iconPosition="right"
                          className="w-full"
                        >
                          View Facility Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No facilities found"
              message="No campus facilities match the selected filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Facilities
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default FacilitiesPage;
