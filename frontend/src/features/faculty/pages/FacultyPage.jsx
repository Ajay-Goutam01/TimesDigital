import React, { useState } from 'react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { FacultyCard } from '../components/FacultyCard';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicFacultyQuery } from '../services/facultyApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const FacultyPage = () => {
  useDocumentTitle('Master Faculty & Mentors');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const { data, isLoading } = useGetPublicFacultyQuery();
  const facultyList = data?.data?.faculty || data?.data || [];

  const subjectFilters = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'School'];

  const filteredFaculty =
    selectedSubject === 'All'
      ? facultyList
      : facultyList.filter(
          (f) =>
            f.subject?.toLowerCase().includes(selectedSubject.toLowerCase()) ||
            f.category?.toLowerCase().includes(selectedSubject.toLowerCase())
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Faculty Directory"
        title="Distinguished Faculty & Subject Mentors"
        subtitle="Learn from veteran educators with proven track records from Kota, Delhi, and premier national institutions."
        breadcrumbs={[{ label: 'Faculty' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Subject Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {subjectFilters.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedSubject === sub
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {sub} {sub !== 'All' && 'Faculty'}
              </button>
            ))}
          </div>

          {/* Faculty 4:5 Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CardSkeleton count={4} />
            </div>
          ) : filteredFaculty.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFaculty.map((faculty) => (
                <FacultyCard key={faculty._id} faculty={faculty} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No faculty profiles found"
              message="No mentors found matching the selected subject filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedSubject('All')}
                >
                  View All Mentors
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default FacultyPage;
