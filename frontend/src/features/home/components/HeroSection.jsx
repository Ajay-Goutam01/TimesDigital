import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles, Phone, Award } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';

export const HeroSection = ({ data, settings }) => {
  const hero = data || {};
  const phone = settings?.admissionPhone || settings?.primaryPhone || '+91 90000 00001';

  return (
    <section className="relative overflow-hidden bg-[#FAF8F2] border-b border-[#E5E1D7] py-10 sm:py-14 md:py-16 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Focused Copy & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            {hero.badge && (
              <div>
                <Badge variant="gold" size="md">
                  <Sparkles className="w-3 h-3 mr-1 text-[#C5A55A]" />
                  {hero.badge}
                </Badge>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#164A35] leading-[1.12] tracking-tight">
              {hero.title || 'Where Academic Brilliance Meets National Excellence.'}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#68736D] leading-relaxed max-w-xl">
              {hero.subtitle ||
                'Empowering students of Shahdol with premier CBSE schooling and Kota-pedagogy preparation for IIT-JEE, NEET, and Olympiads under top national mentors.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
              <Link
                to={settings?.isAdmissionOpen !== false ? (hero.primaryCta?.link || '/admissions') : '/courses'}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full"
                >
                  {settings?.isAdmissionOpen !== false
                    ? (hero.primaryCta?.text || 'Apply for Admission')
                    : 'Explore Programs'}
                </Button>
              </Link>

              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  {settings?.isAdmissionOpen !== false ? 'Explore Programs' : 'Contact Admissions Desk'}
                </Button>
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="pt-3 border-t border-[#E5E1D7] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-[#17231D]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A55A] shrink-0" />
                <span className="font-semibold">CBSE Affiliation Curriculum</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C5A55A] shrink-0" />
                <span className="font-semibold">Ex-Kota Master Faculty</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A55A] shrink-0" />
                <span className="font-semibold">Integrated Coaching</span>
              </div>
            </div>
          </div>

          {/* Right Column: Campus Visual (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[22px] overflow-hidden border border-[#E5E1D7] shadow-md bg-white p-2">
              <AppImage
                src={hero.bannerImage?.url}
                alt="TIME Public School Campus"
                aspectRatio="course"
                rounded="md"
                priority
              />
              <div className="p-3 bg-[#FAF8F2] rounded-[14px] mt-2 border border-[#E5E1D7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C5A55A] block">
                    Admissions Desk
                  </span>
                  <span className="text-xs font-bold text-[#164A35]">
                    {settings?.isAdmissionOpen !== false ? 'Session 2025–26 Open' : 'Admissions Closed'}
                  </span>
                </div>
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="text-xs font-bold text-[#164A35] hover:text-[#103728] flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A55A]" />
                  <span>{phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
