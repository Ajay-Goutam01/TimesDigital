import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LayoutTemplate,
  BookOpen,
  GraduationCap,
  Users,
  Trophy,
  Images,
  Video,
  Bell,
  Calendar,
  Building2,
  MessageSquareQuote,
  FileSpreadsheet,
  UserCheck,
  UserCog,
  KeyRound,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { cn } from '../../../utils/cn';

export const AdminSidebar = ({ isOpen, onClose, onLogout }) => {
  const { admin, isSuperAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navGroups = [
    {
      title: 'CORE',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'CMS & BRANDING',
      items: [
        { label: 'Website Settings', path: '/admin/website-settings', icon: Settings },
        { label: 'Homepage CMS', path: '/admin/homepage', icon: LayoutTemplate },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        { label: 'Courses', path: '/admin/courses', icon: GraduationCap },
        { label: 'Batches', path: '/admin/batches', icon: BookOpen },
        { label: 'Faculty Profiles', path: '/admin/faculty', icon: Users },
        { label: 'Results & Ranks', path: '/admin/results', icon: Trophy },
      ],
    },
    {
      title: 'CAMPUS CONTENT',
      items: [
        { label: 'Gallery Albums', path: '/admin/gallery', icon: Images },
        { label: 'Video Library', path: '/admin/videos', icon: Video },
        { label: 'Announcements', path: '/admin/announcements', icon: Bell },
        { label: 'Events Calendar', path: '/admin/events', icon: Calendar },
        { label: 'Campus Facilities', path: '/admin/facilities', icon: Building2 },
        { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
      ],
    },
    {
      title: 'LEADS & ADMISSIONS',
      items: [
        { label: 'Admissions Desk', path: '/admin/admissions', icon: FileSpreadsheet },
        { label: 'Enquiries & CRM', path: '/admin/enquiries', icon: UserCheck },
      ],
    },
    {
      title: 'SECURITY & ACCOUNT',
      items: [
        ...(isSuperAdmin
          ? [{ label: 'Admin Users', path: '/admin/users', icon: UserCog }]
          : []),
        { label: 'Change Password', path: '/admin/change-password', icon: KeyRound },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#103728] text-white flex flex-col justify-between border-r border-[#164A35] transition-transform duration-250 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-[#164A35] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-[#164A35] text-[#C5A55A] flex items-center justify-center font-bold text-xs">
                TPS
              </div>
              <div className="leading-none">
                <span className="font-extrabold text-xs tracking-tight text-white block">
                  ADMIN CONSOLE
                </span>
                <span className="text-[10px] font-bold text-[#C5A55A] uppercase tracking-wider">
                  TIME School & Digital
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-white/70 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Groups Menu */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="px-3 text-[10px] font-extrabold text-[#C5A55A] uppercase tracking-wider block">
                  {grp.title}
                </span>

                <div className="space-y-0.5 pt-1">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => onClose?.()}
                        className={({ isActive: matchActive }) =>
                          cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors',
                            matchActive
                              ? 'bg-[#164A35] text-white font-bold shadow-xs'
                              : 'text-white/80 hover:text-white hover:bg-white/5'
                          )
                        }
                      >
                        <Icon className="w-4 h-4 text-[#C5A55A] shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Profile & Logout */}
        <div className="p-3 border-t border-[#164A35] bg-[#0D2E21]">
          <div className="flex items-center justify-between gap-2 p-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#164A35] text-[#C5A55A] flex items-center justify-center font-bold text-xs shrink-0">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {admin?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#C5A55A] uppercase truncate font-semibold">
                  {admin?.role || 'Admin'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="text-white/70 hover:text-[#C94A4A] p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
