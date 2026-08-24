import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { Container } from './Container';
import { BrandLogo } from '../ui/BrandLogo';
import { Button } from '../ui/Button';
import { useGetWebsiteSettingsQuery } from '../../features/school/services/websiteSettingsApi';
import { cn } from '../../utils/cn';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const location = useLocation();

  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const settings = settingsData?.data || {};
  const phone = settings.admissionPhone || settings.primaryPhone || '+91 90000 00001';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Primary Top Navigation Links
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'School', path: '/school' },
    { label: 'Times Digital', path: '/times-digital' },
    { label: 'Courses', path: '/courses' },
    { label: 'Batches', path: '/batches' },
    { label: 'Faculty', path: '/faculty' },
    { label: 'Results', path: '/results' },
    { label: 'Gallery', path: '/gallery' },
  ];

  // Secondary Links under "More"
  const secondaryLinks = [
    { label: 'Campus Videos', path: '/videos' },
    { label: 'Circulars & Notices', path: '/announcements' },
    { label: 'School Events', path: '/events' },
    { label: 'Campus Facilities', path: '/facilities' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E5E1D7]',
          isScrolled
            ? 'h-[62px] sm:h-[68px] shadow-xs'
            : 'h-[70px] sm:h-[74px]'
        )}
      >
        <Container className="h-full flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo variant="dark" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'px-2.5 xl:px-3 py-1.5 rounded-[8px] text-[13px] xl:text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-[#164A35] bg-[#164A35]/10 font-bold'
                      : 'text-[#17231D] hover:text-[#164A35] hover:bg-[#F3F0E7]'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                className={cn(
                  'flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-[8px] text-[13px] xl:text-sm font-semibold transition-colors cursor-pointer',
                  moreDropdownOpen
                    ? 'text-[#164A35] bg-[#164A35]/10'
                    : 'text-[#17231D] hover:text-[#164A35] hover:bg-[#F3F0E7]'
                )}
              >
                <span>More</span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200',
                    moreDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-[14px] border border-[#E5E1D7] shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {secondaryLinks.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-2 text-xs font-semibold text-[#17231D] hover:text-[#164A35] hover:bg-[#FAF8F2] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Right Actions: Enquire Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/admissions">
              <Button variant="primary" size="sm">
                Enquire Now
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden w-10 h-10 rounded-[10px] bg-white border border-[#E5E1D7] text-[#17231D] hover:text-[#164A35] flex items-center justify-center transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </Container>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[70px] z-50 lg:hidden bg-white/98 backdrop-blur-md flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C5A55A]">
              Navigation
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...navLinks, ...secondaryLinks].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-between p-3 rounded-[12px] bg-[#FAF8F2] hover:bg-[#F3F0E7] text-sm font-bold text-[#17231D] transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A55A]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Drawer Bottom Actions */}
          <div className="pt-6 border-t border-[#E5E1D7] space-y-3 mt-6">
            <Link to="/admissions" className="block w-full">
              <Button variant="primary" size="lg" className="w-full">
                {settings?.isAdmissionOpen !== false ? 'Apply for Admission' : 'Register Pre-Admission Enquiry'}
              </Button>
            </Link>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 text-xs font-bold text-[#164A35] py-2"
            >
              <Phone className="w-4 h-4 text-[#C5A55A]" />
              <span>Admissions Helpline: {phone}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
