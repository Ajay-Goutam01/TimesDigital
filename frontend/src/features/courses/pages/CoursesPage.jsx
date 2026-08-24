import React, { useState } from 'react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { CourseCard } from '../components/CourseCard';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicCoursesQuery } from '../services/courseApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const CoursesPage = () => {
  useDocumentTitle('Academic Courses & Programs');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data, isLoading } = useGetPublicCoursesQuery();
  const courses = data?.data?.courses || data?.data || [];

  const categories = ['All', 'Coaching', 'School', 'Integrated', 'Foundation'];

  const filteredCourses =
    selectedCategory === 'All'
      ? courses
      : courses.filter(
          (c) =>
            c.category?.toLowerCase() === selectedCategory.toLowerCase() ||
            c.targetExam?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Academic Catalog"
        title="Comprehensive Academic & Competitive Programs"
        subtitle="Explore CBSE schooling divisions, IIT-JEE engineering excellence, NEET medical streams, and Olympiad Foundation programs."
        breadcrumbs={[{ label: 'Courses' }]}
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
                {cat} {cat !== 'All' && 'Programs'}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No courses found"
              message="No programs currently match the selected category. Try selecting another filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Programs
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default CoursesPage;
