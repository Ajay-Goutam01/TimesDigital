import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { useGetPublicAnnouncementsQuery } from '../../announcements/services/announcementApi';

export const AnnouncementsTicker = () => {
  const { data } = useGetPublicAnnouncementsQuery({ limit: 3 });
  const announcements = data?.data?.announcements || [];

  if (!announcements.length) return null;

  const latest = announcements[0];

  return (
    <div className="bg-[#103728] text-white py-2 px-4 border-b border-[#164A35] text-xs select-none">
      <Container className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="bg-[#C5A55A] text-[#103728] font-bold text-[10px] uppercase px-2 py-0.5 rounded-full shrink-0">
            Notice
          </span>
          <span className="font-medium truncate text-white/90">
            {latest.title}
          </span>
        </div>

        <Link
          to="/announcements"
          className="flex items-center gap-1 font-bold text-[#C5A55A] hover:text-white transition-colors shrink-0 text-[11px]"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </Container>
    </div>
  );
};
