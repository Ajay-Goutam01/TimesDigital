import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';

export const ApplicationErrorPage = () => {
  const error = useRouteError();
  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF8F2] font-sans antialiased text-[#17231D]">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-[24px] border border-[#E5E1D7] shadow-lg">
        <div className="w-16 h-16 rounded-full bg-[#164A35]/10 text-[#164A35] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-[#C5A55A]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C5A55A]">
            {isAdmin ? 'Admin Console Notice' : 'Institutional Notice'}
          </span>
          <h1 className="text-2xl font-extrabold text-[#164A35]">
            Something went wrong
          </h1>
          <p className="text-sm text-[#68736D] leading-relaxed">
            We encountered an unexpected issue while loading this page. Please try refreshing or return to the main dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            icon={RefreshCw}
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            Reload Page
          </Button>

          {isAdmin ? (
            <Link to="/admin/dashboard" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                icon={LayoutDashboard}
                className="w-full"
              >
                Admin Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                icon={Home}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
