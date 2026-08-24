import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Trophy, Calendar, ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export const ScholarshipSection = ({ data }) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#164A35] text-white">
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="gold" size="md">
            <Sparkles className="w-3 h-3 mr-1 text-[#C5A55A]" />
            {data?.badge || 'TIMES Talent Scholarship Exam (TTSE)'}
          </Badge>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            {data?.title || 'Scholarships Up to 90% for Meritorious Students'}
          </h2>

          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl mx-auto">
            {data?.description ||
              'We believe financial constraints should never stop brilliant minds. Appear for the Times Talent Search Examination and secure merit-based fee waivers for 2025–26 batches.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/admissions" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto text-[#103728]"
              >
                Register for TTSE Exam
              </Button>
            </Link>

            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline-white" size="lg" className="w-full sm:w-auto">
                Download Syllabus
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
