import React, { useState } from 'react';
import { Trophy, Award, Star, Filter, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicResultsQuery } from '../services/resultApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const ResultsPage = () => {
  useDocumentTitle('Hall of Fame | Top Selections & Rankers');
  const [selectedExam, setSelectedExam] = useState('All');

  const { data, isLoading } = useGetPublicResultsQuery();
  const results = data?.data?.results || data?.data || [];

  const examFilters = ['All', 'JEE Advanced', 'JEE Main', 'NEET', 'CBSE Board', 'Olympiad'];

  const filteredResults =
    selectedExam === 'All'
      ? results
      : results.filter((r) =>
          r.exam?.toLowerCase().includes(selectedExam.toLowerCase())
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Hall of Fame"
        title="Glorious Selections & Top National Rankers"
        subtitle="Celebrating our shining stars who secured admissions into IITs, AIIMS, NITs, and prestigious medical and engineering colleges."
        breadcrumbs={[{ label: 'Results & Rankers' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Exam Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {examFilters.map((exam) => (
              <button
                key={exam}
                type="button"
                onClick={() => setSelectedExam(exam)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedExam === exam
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>

          {/* Results Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <CardSkeleton count={8} />
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredResults.map((item) => (
                <Card
                  key={item._id}
                  hover
                  className="overflow-hidden p-6 flex flex-col items-center text-center space-y-4 bg-white border border-[#E5E1D7]"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#C5A55A] shadow-sm relative shrink-0">
                    <AppImage
                      src={item.studentPhoto?.url}
                      alt={item.studentName}
                      aspectRatio="square"
                      rounded="full"
                    />
                  </div>

                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-center">
                      <Badge variant="dark" size="sm">
                        {item.exam} {item.year}
                      </Badge>
                    </div>

                    <h3 className="text-base font-extrabold text-[#17231D]">
                      {item.studentName}
                    </h3>

                    {item.rank && (
                      <div className="text-sm font-extrabold text-[#164A35] flex items-center justify-center gap-1.5 pt-1">
                        <Trophy className="w-4 h-4 text-[#C5A55A]" />
                        <span>{item.rank}</span>
                      </div>
                    )}

                    {item.percentile && (
                      <p className="text-xs font-bold text-[#8A6D23]">
                        {item.percentile} Percentile
                      </p>
                    )}

                    {item.score && (
                      <p className="text-xs font-semibold text-[#68736D]">
                        Score: {item.score}
                      </p>
                    )}

                    {item.collegeAllotted && (
                      <div className="pt-2 border-t border-[#E5E1D7] text-xs font-semibold text-[#164A35] truncate">
                        {item.collegeAllotted}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No rankers found"
              message="No student selections match the chosen filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedExam('All')}
                >
                  View All Rankers
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default ResultsPage;
