import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { FacultyCard } from '../../faculty/components/FacultyCard';
import { Button } from '../../../components/ui/Button';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicFacultyQuery } from '../../faculty/services/facultyApi';

export const FacultySection = ({ data }) => {
  const { data: facultyData, isLoading } = useGetPublicFacultyQuery({
    isFeatured: true,
    limit: 4,
  });

  const facultyList = facultyData?.data?.faculty || facultyData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Master Mentors"
            title={data?.title || 'Learn from Kota Expert Faculty'}
            subtitle={
              data?.subtitle ||
              'Distinguished academicians and subject specialists committed to mentoring every student.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/faculty" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Mentors
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton count={4} />
          </div>
        ) : facultyList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyList.map((faculty) => (
              <FacultyCard key={faculty._id} faculty={faculty} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/faculty">
            <Button variant="secondary" size="md" className="w-full">
              View All Mentors
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
