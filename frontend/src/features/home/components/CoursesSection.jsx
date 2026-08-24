import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { CourseCard } from '../../courses/components/CourseCard';
import { Button } from '../../../components/ui/Button';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicCoursesQuery } from '../../courses/services/courseApi';

export const CoursesSection = ({ data }) => {
  const { data: coursesData, isLoading } = useGetPublicCoursesQuery({
    isFeatured: true,
    limit: 3,
  });

  const courses = coursesData?.data?.courses || coursesData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Programs & Courses"
            title={data?.title || 'Academic & Competitive Programs'}
            subtitle={
              data?.subtitle ||
              'From kindergarten and primary schooling to high-school IIT-JEE and NEET medical coaching.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/courses" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Programs
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/courses">
            <Button variant="secondary" size="md" className="w-full">
              View All Programs
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
