import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { Container } from './Container';
import { BrandLogo } from '../ui/BrandLogo';
import { useGetWebsiteSettingsQuery } from '../../features/school/services/websiteSettingsApi';

export const Footer = () => {
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const settings = settingsData?.data || {};

  const currentYear = new Date().getFullYear();
  const phone = settings.admissionPhone || settings.primaryPhone || '+91 90000 00001';
  const email = settings.admissionEmail || settings.email || 'admissions@timepublicschool.edu.in';
  const address = settings.schoolAddress || 'TIME Public School Campus, Shahdol, Madhya Pradesh - 484001';
  const socialLinks = settings.socialLinks || {};

  return (
    <footer className="w-full bg-[#103728] text-white border-t border-[#164A35]">
      {/* Main Footer Links */}
      <div className="pt-12 sm:pt-16 pb-10 sm:pb-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Brand & Bio (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <BrandLogo variant="light" />
              <p className="text-xs sm:text-sm text-[#FAF8F2]/75 leading-relaxed max-w-sm">
                {settings.tagline ||
                  'Nurturing academic brilliance and national competitive excellence through holistic CBSE schooling and premier Kota-pedagogy coaching for IIT-JEE and NEET in Shahdol.'}
              </p>

              {/* Social Media Links */}
              <div className="pt-2 flex items-center gap-2">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A55A] hover:text-[#103728] flex items-center justify-center transition-all text-white"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                    </svg>
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A55A] hover:text-[#103728] flex items-center justify-center transition-all text-white"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A55A] hover:text-[#103728] flex items-center justify-center transition-all text-white"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {socialLinks.telegram && (
                  <a
                    href={socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C5A55A] hover:text-[#103728] flex items-center justify-center transition-all text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Academic Programs (2.5 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#C5A55A]">
                Academic Programs
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#FAF8F2]/80">
                <li>
                  <Link to="/courses" className="hover:text-white transition-colors">
                    CBSE Schooling (Nursery to 12th)
                  </Link>
                </li>
                <li>
                  <Link to="/batches" className="hover:text-white transition-colors">
                    IIT-JEE Main & Advanced Integrated
                  </Link>
                </li>
                <li>
                  <Link to="/batches" className="hover:text-white transition-colors">
                    NEET-UG Medical Excellence
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="hover:text-white transition-colors">
                    Junior Foundation (Classes 8th–10th)
                  </Link>
                </li>
                <li>
                  <Link to="/results" className="hover:text-white transition-colors">
                    Hall of Fame & Top Rankers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Campus & Resources (2.5 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#C5A55A]">
                Explore Campus
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#FAF8F2]/80">
                <li>
                  <Link to="/faculty" className="hover:text-white transition-colors">
                    Master Faculty Directory
                  </Link>
                </li>
                <li>
                  <Link to="/facilities" className="hover:text-white transition-colors">
                    Hostel & Campus Facilities
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="hover:text-white transition-colors">
                    Photo & Media Albums
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-white transition-colors">
                    Events Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/announcements" className="hover:text-white transition-colors">
                    Circulars & Notices
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Admissions & Helpline (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#C5A55A]">
                Contact & Helplines
              </h4>
              <div className="space-y-2.5 text-xs text-[#FAF8F2]/80">
                <a
                  href={`tel:${phone.replace(/\s+/g, '')}`}
                  className="flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                  <span>{phone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                  <span className="truncate">{email}</span>
                </a>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                  <span className="leading-snug">{address}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Copyright Sub-footer */}
      <div className="py-5 border-t border-[#164A35] text-xs text-[#FAF8F2]/60">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {currentYear} {settings.schoolName || 'TIME PUBLIC SCHOOL'} & {settings.coachingName || 'TIMES DIGITAL'}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/admissions" className="hover:text-white transition-colors">
              Online Admissions
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-[#C5A55A] transition-colors font-semibold">
              Admin Portal
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};
