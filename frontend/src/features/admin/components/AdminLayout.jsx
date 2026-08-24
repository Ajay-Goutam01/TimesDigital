import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ExternalLink, Shield, LogOut } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../auth/hooks/useAuth';
import { useLogoutMutation } from '../../auth/services/authApi';
import { Button } from '../../../components/ui/Button';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin } = useAuth();
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      navigate('/admin/login');
    } catch {
      navigate('/admin/login');
    }
  };

  const getPageTitle = (path) => {
    const segment = path.split('/')[2] || 'dashboard';
    switch (segment) {
      case 'dashboard': return 'Dashboard Overview';
      case 'website-settings': return 'Website Settings & Contact';
      case 'homepage': return 'Homepage CMS Sections';
      case 'courses': return 'Courses Management';
      case 'batches': return 'Batches Management';
      case 'faculty': return 'Faculty Profiles';
      case 'results': return 'Results & Rankers';
      case 'gallery': return 'Gallery & Media Albums';
      case 'videos': return 'Video Library';
      case 'announcements': return 'Circulars & Announcements';
      case 'events': return 'School Events Calendar';
      case 'facilities': return 'Campus Facilities';
      case 'testimonials': return 'Student & Parent Reviews';
      case 'admissions': return 'Online Admissions Desk';
      case 'enquiries': return 'Enquiries & CRM Leads';
      case 'users': return 'Admin User Accounts';
      case 'change-password': return 'Account Security & Password';
      default: return 'Administration CMS';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E5E1D7] px-4 sm:px-6 md:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-[8px] bg-[#FAF8F2] border border-[#E5E1D7] text-[#17231D]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-extrabold text-[#164A35] truncate">
              {getPageTitle(location.pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#164A35] hover:text-[#103728] px-3 py-1.5 rounded-[8px] bg-[#FAF8F2] border border-[#E5E1D7] transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C5A55A]" />
            </a>

            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E1D7]">
              <div className="w-8 h-8 rounded-full bg-[#164A35] text-[#C5A55A] flex items-center justify-center font-bold text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden md:inline text-xs font-bold text-[#17231D]">
                {admin?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Page Routed Outlet */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
