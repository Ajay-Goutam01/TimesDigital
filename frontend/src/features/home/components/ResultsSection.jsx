import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, ArrowRight, Star } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicResultsQuery } from '../../results/services/resultApi';

export const ResultsSection = ({ data }) => {
  const { data: resultsData, isLoading } = useGetPublicResultsQuery({
    isFeatured: true,
    limit: 4,
  });

  const results = resultsData?.data?.results || resultsData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-[#E5E1D7]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Hall of Fame"
            title={data?.title || 'Our Pride: Outstanding Rankers & Achievers'}
            subtitle={
              data?.subtitle ||
              'Celebrating the glorious selections of our students in IITs, AIIMS, NITs, and CBSE District Tops.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/results" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View Hall of Fame
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton count={4} />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <Card
                key={item._id}
                hover
                className="overflow-hidden p-5 flex flex-col items-center text-center space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#C5A55A] shadow-sm relative shrink-0">
                  <AppImage
                    src={item.studentPhoto?.url}
                    alt={item.studentName}
                    aspectRatio="square"
                    rounded="full"
                  />
                </div>

                <div className="space-y-1 w-full">
                  <Badge variant="dark" size="sm">
                    {item.exam} {item.year}
                  </Badge>
                  <h3 className="text-base font-extrabold text-[#17231D]">
                    {item.studentName}
                  </h3>
                  {item.rank && (
                    <div className="text-sm font-extrabold text-[#164A35] flex items-center justify-center gap-1">
                      <Trophy className="w-4 h-4 text-[#C5A55A]" />
                      <span>{item.rank}</span>
                    </div>
                  )}
                  {item.percentile && (
                    <p className="text-xs font-bold text-[#8A6D23]">
                      {item.percentile} Percentile
                    </p>
                  )}
                  {item.collegeAllotted && (
                    <p className="text-xs text-[#68736D] truncate font-medium">
                      {item.collegeAllotted}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/results">
            <Button variant="secondary" size="md" className="w-full">
              View Hall of Fame
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
