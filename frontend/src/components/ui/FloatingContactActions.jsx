import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useGetWebsiteSettingsQuery } from '../../features/school/services/websiteSettingsApi';

export const FloatingContactActions = () => {
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const settings = settingsData?.data || {};

  const phoneNumber = settings.admissionPhone || settings.primaryPhone || '+91 90000 00001';
  const rawWhatsApp = settings.whatsappNumber || settings.primaryPhone || '+91 90000 00001';
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello TIME Public School & TIMES DIGITAL, I would like to inquire about admissions and batch details.`
  );

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
      {/* WhatsApp Quick Action Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline font-bold text-xs">WhatsApp</span>
      </a>

      {/* Direct Call Button */}
      <a
        href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
        aria-label="Call Admissions Desk"
        className="pointer-events-auto group flex items-center gap-2.5 p-3 sm:px-4 sm:py-3 rounded-full bg-[#164A35] text-[#FAF8F2] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border border-[#C5A55A]/30"
      >
        <Phone className="w-5 h-5 text-[#C5A55A]" />
        <span className="hidden sm:inline font-bold text-xs">Helpline</span>
      </a>
    </div>
  );
};
