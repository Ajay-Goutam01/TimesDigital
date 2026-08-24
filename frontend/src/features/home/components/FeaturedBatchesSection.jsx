import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { BatchCard } from '../../batches/components/BatchCard';
import { Button } from '../../../components/ui/Button';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicBatchesQuery } from '../../batches/services/batchApi';

export const FeaturedBatchesSection = ({ data }) => {
  const { data: batchesData, isLoading } = useGetPublicBatchesQuery({
    isFeatured: true,
    limit: 3,
  });

  const batches = batchesData?.data?.batches || batchesData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-[#E5E1D7]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Target Batches"
            title={data?.title || 'Featured Academic Batches for 2025–26'}
            subtitle={
              data?.subtitle ||
              'Explore targeted batch schedules designed for JEE, NEET, and CBSE Foundation.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/batches" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Batches
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : batches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <BatchCard key={batch._id} batch={batch} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/batches">
            <Button variant="secondary" size="md" className="w-full">
              View All Batches
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
