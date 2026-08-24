import React, { useState } from 'react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { BatchCard } from '../components/BatchCard';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicBatchesQuery } from '../services/batchApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const BatchesPage = () => {
  useDocumentTitle('Academic Batches & Schedules');
  const [selectedExam, setSelectedExam] = useState('All');

  const { data, isLoading } = useGetPublicBatchesQuery();
  const batches = data?.data?.batches || data?.data || [];

  const examFilters = ['All', 'JEE', 'NEET', 'Foundation', 'CBSE'];

  const filteredBatches =
    selectedExam === 'All'
      ? batches
      : batches.filter(
          (b) =>
            b.targetExam?.toLowerCase().includes(selectedExam.toLowerCase()) ||
            b.name?.toLowerCase().includes(selectedExam.toLowerCase())
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Batch Timings & Schedules"
        title="Upcoming Academic & Target Batches"
        subtitle="Explore classroom batch schedules, Kota faculty allocations, hostel availability, and merit scholarships for 2025–26."
        breadcrumbs={[{ label: 'Batches' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Exam Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {examFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedExam(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedExam === filter
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {filter} {filter !== 'All' && 'Batches'}
              </button>
            ))}
          </div>

          {/* Batches Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredBatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBatches.map((batch) => (
                <BatchCard key={batch._id} batch={batch} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No batches found"
              message="No batches currently match the selected exam filter."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedExam('All')}
                >
                  View All Batches
                </Button>
              }
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default BatchesPage;
