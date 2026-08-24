import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

export const CTASection = ({ data, settings }) => {
  const phone = settings?.admissionPhone || settings?.primaryPhone || '+91 90000 00001';

  return (
    <section className="py-14 sm:py-16 md:py-20 bg-[#103728] text-white relative overflow-hidden">
      <Container>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="gold" size="md">
            {settings?.isAdmissionOpen !== false
              ? 'Admissions Open for Session 2025–26'
              : 'Admissions Closed — Register for Priority Waitlist'}
          </Badge>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {data?.title || 'Give Your Child the Advantage of Premier Education & Kota Mentorship'}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            {data?.subtitle ||
              'Join TIME Public School & TIMES DIGITAL. Experience holistic CBSE schooling combined with national-level coaching.'}
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to={settings?.isAdmissionOpen !== false ? '/admissions' : '/contact'} className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto text-[#103728]"
              >
                {settings?.isAdmissionOpen !== false ? 'Apply for Admission' : 'Inquire for Next Session'}
              </Button>
            </Link>

            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline-white"
                size="lg"
                icon={Phone}
                className="w-full sm:w-auto"
              >
                Call: {phone}
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};
