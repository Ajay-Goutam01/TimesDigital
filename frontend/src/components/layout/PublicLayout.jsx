import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FloatingContactActions } from '../ui/FloatingContactActions';

/**
 * Global Public Layout wrapper:
 * - Compact Sticky Navbar with smooth elevation
 * - Main routed content outlet
 * - Dynamic Floating Contact Actions (Call & WhatsApp)
 * - Deep Forest Green Footer
 * - Automatic instant scroll-to-top on route change & smooth scroll on hash anchors
 */
export const PublicLayout = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        const timer = setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] font-sans antialiased text-[#17231D] selection:bg-[#E3D2A0] selection:text-[#103728]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      {/* Floating Quick Action Contacts */}
      <FloatingContactActions />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
