import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Phone } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="py-20 sm:py-28 flex items-center justify-center">
      <Container>
        <div className="max-w-lg mx-auto text-center space-y-6 bg-white p-8 sm:p-12 rounded-[24px] border border-[#E5E1D7] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F2] border border-[#E5E1D7] text-[#164A35] flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8 text-[#C5A55A]" />
          </div>

          <div className="space-y-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#164A35]">
              404
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17231D]">
              Page Not Found
            </h1>
            <p className="text-sm text-[#68736D] leading-relaxed">
              The page you are looking for might have been moved, removed, or is temporarily unavailable.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="primary" size="md" icon={Home} className="w-full">
                Back to Homepage
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="secondary" size="md" icon={Phone} className="w-full">
                Contact Office
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
