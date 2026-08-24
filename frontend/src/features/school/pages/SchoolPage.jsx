import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const SchoolPage = () => {
  useDocumentTitle('TIME Public School | Holistic CBSE Education');

  const levels = [
    {
      title: 'Pre-Primary & Primary (Nursery to 5th)',
      description: 'Activity-based, experiential foundational learning nurturing curiosity, phonics, mathematics, and expressive creativity.',
      highlights: ['Interactive smart classrooms', 'Phonics & numeracy focus', 'Safe play arenas & arts'],
    },
    {
      title: 'Middle School (Classes 6th to 8th)',
      description: 'Transitioning to conceptual understanding in sciences and languages, setting strong foundations for higher academics.',
      highlights: ['Science lab experiments', 'Language & communication mastery', 'Coding & robotics exposure'],
    },
    {
      title: 'Secondary & Senior Secondary (9th to 12th)',
      description: 'Rigorous CBSE board curriculum integrated with competitive exam foundation in Science (PCM / PCB) and Commerce streams.',
      highlights: ['CBSE Board practical labs', 'Integrated entrance test practice', 'Individual career counseling'],
    },
  ];

  return (
    <div className="w-full">
      <PageHero
        badge="TIME Public School"
        title="Holistic CBSE Education with Modern Pedagogy"
        subtitle="A vibrant, student-centered campus nurturing intellect, character, and leadership from early childhood to Senior Secondary."
        breadcrumbs={[{ label: 'TIME Public School' }]}
        actions={
          <Link to="/admissions">
            <Button variant="primary" size="md">
              Apply for School Admission
            </Button>
          </Link>
        }
      />

      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-[#E5E1D7]">
        <Container>
          <SectionHeading
            badge="Academic Divisions"
            title="Comprehensive CBSE Curriculum Architecture"
            subtitle="Designed to foster critical thinking, academic mastery, and character development at every developmental stage."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((lvl, idx) => (
              <Card key={idx} hover className="p-6 space-y-4 bg-[#FAF8F2] border border-[#E5E1D7] flex flex-col justify-between">
                <div className="space-y-3">
                  <Badge variant="dark" size="sm">
                    Division 0{idx + 1}
                  </Badge>
                  <h3 className="text-lg font-bold text-[#164A35]">
                    {lvl.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                    {lvl.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-[#E5E1D7]">
                    {lvl.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#17231D]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A55A] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Link to="/admissions" className="w-full block">
                    <Button variant="secondary" size="sm" className="w-full">
                      Admission Form
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SchoolPage;
