import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  UserCheck,
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Images,
  Bell,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { PageLoader } from '../../../components/ui/Loader';
import { useGetDashboardStatsQuery } from '../services/adminDashboardApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AdminDashboardPage = () => {
  useDocumentTitle('Dashboard Overview');
  const { data, isLoading } = useGetDashboardStatsQuery();
  const stats = data?.data || {};

  if (isLoading) return <PageLoader message="Loading dashboard statistics..." />;

  const counts = stats.counts || {};
  const admissionsCount = typeof counts.admissions === 'object' ? counts.admissions?.total : (counts.admissions ?? stats.admissionsCount ?? stats.admissions ?? 0);
  const newAdmissionsCount = typeof counts.admissions === 'object' ? counts.admissions?.new : 0;
  const enquiriesCount = typeof counts.enquiries === 'object' ? counts.enquiries?.total : (counts.enquiries ?? stats.enquiriesCount ?? stats.enquiries ?? 0);
  const newEnquiriesCount = typeof counts.enquiries === 'object' ? counts.enquiries?.new : 0;
  const batchesCount = typeof counts.batches === 'object' ? counts.batches?.total : (counts.batches ?? stats.batchesCount ?? stats.batches ?? 0);

  const metricCards = [
    {
      title: 'Online Admissions',
      count: admissionsCount,
      icon: FileSpreadsheet,
      link: '/admin/admissions',
      color: 'text-[#164A35] bg-[#164A35]/10',
      badge: newAdmissionsCount > 0 ? `${newAdmissionsCount} New` : 'Action Desk',
    },
    {
      title: 'CRM Enquiries (Leads)',
      count: enquiriesCount,
      icon: UserCheck,
      link: '/admin/enquiries',
      color: 'text-[#C5A55A] bg-[#C5A55A]/15',
      badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} New` : 'New Leads',
    },
    {
      title: 'Active Courses',
      count: counts.courses ?? stats.coursesCount ?? stats.courses ?? 0,
      icon: GraduationCap,
      link: '/admin/courses',
      color: 'text-[#164A35] bg-[#164A35]/10',
    },
    {
      title: 'Academic Batches',
      count: batchesCount,
      icon: BookOpen,
      link: '/admin/batches',
      color: 'text-[#164A35] bg-[#164A35]/10',
    },
    {
      title: 'Faculty Mentors',
      count: counts.faculty ?? stats.facultyCount ?? stats.faculty ?? 0,
      icon: Users,
      link: '/admin/faculty',
      color: 'text-[#164A35] bg-[#164A35]/10',
    },
    {
      title: 'Results & Rankers',
      count: counts.results ?? stats.resultsCount ?? stats.results ?? 0,
      icon: Trophy,
      link: '/admin/results',
      color: 'text-[#C5A55A] bg-[#C5A55A]/15',
    },
    {
      title: 'Gallery Albums',
      count: counts.galleries ?? stats.galleryCount ?? stats.gallery ?? 0,
      icon: Images,
      link: '/admin/gallery',
      color: 'text-[#164A35] bg-[#164A35]/10',
    },
    {
      title: 'Circulars & Notices',
      count: counts.announcements ?? stats.announcementsCount ?? stats.announcements ?? 0,
      icon: Bell,
      link: '/admin/announcements',
      color: 'text-[#164A35] bg-[#164A35]/10',
    },
    {
      title: 'Scheduled Events',
      count: counts.events ?? stats.eventsCount ?? stats.events ?? 0,
      icon: Calendar,
      link: '/admin/events',
      color: 'text-[#164A35] bg-[#164A35]/10',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#103728] text-white p-6 sm:p-8 rounded-[24px] border border-[#164A35] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="gold" size="sm">
            Control Center
          </Badge>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            TIME Public School & TIMES DIGITAL Management Console
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Real-time control over public website content, online admissions, CRM leads, and institutional media assets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin/website-settings">
            <Button variant="gold" size="md" className="text-[#103728]">
              Website Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {metricCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} to={item.link} className="group block">
              <Card hover className="p-5 flex items-center justify-between bg-white border border-[#E5E1D7]">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#68736D] block">
                    {item.title}
                  </span>
                  <p className="text-2xl sm:text-3xl font-extrabold text-[#164A35] leading-tight">
                    {item.count}
                  </p>
                  {item.badge && (
                    <span className="inline-block text-[10px] font-bold text-[#8A6D23] bg-[#C5A55A]/20 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div
                  className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
