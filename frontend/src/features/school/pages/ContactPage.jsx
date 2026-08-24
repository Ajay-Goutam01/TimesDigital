import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { EnquiryForm } from '../../enquiries/components/EnquiryForm';
import { useGetWebsiteSettingsQuery } from '../services/websiteSettingsApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const ContactPage = () => {
  useDocumentTitle('Contact Us & Campus Location');
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const settings = settingsData?.data || {};

  const phone = settings.admissionPhone || settings.primaryPhone || '+91 90000 00001';
  const secondaryPhone = settings.secondaryPhone || '+91 90000 00002';
  const email = settings.admissionEmail || settings.email || 'admissions@timepublicschool.edu.in';
  const rawWhatsApp = settings.whatsappNumber || settings.primaryPhone || '+91 90000 00001';
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');
  const schoolAddress = settings.schoolAddress || 'TIME Public School Campus, Shahdol, Madhya Pradesh - 484001';
  const coachingAddress = settings.coachingAddress || 'TIMES DIGITAL Coaching Centre, Main Road, Shahdol (M.P.)';
  const mapEmbedUrl = settings.googleMapsEmbedUrl || settings.googleMapsUrl;

  return (
    <div className="w-full">
      <PageHero
        badge="Get in Touch"
        title="Contact Admissions Desk & Campus Office"
        subtitle="Have questions regarding admissions, batch schedules, fees, or hostel accommodation? Reach out to our admissions team."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-[#E5E1D7]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Dynamic Contact Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C5A55A] block">
                  Campus Communication
                </span>
                <h2 className="text-2xl font-extrabold text-[#164A35]">
                  Helplines & Addresses
                </h2>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  Our admissions counselors are available Monday to Saturday (9:00 AM – 6:00 PM) to assist parents and students.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone Card */}
                <Card className="p-5 flex items-start gap-3.5 bg-[#FAF8F2] border border-[#E5E1D7]">
                  <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#C5A55A]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#68736D]">
                      Admissions Helpline
                    </h4>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-sm font-bold text-[#164A35] hover:underline block"
                    >
                      {phone}
                    </a>
                    {secondaryPhone && (
                      <a
                        href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                        className="text-xs text-[#17231D] hover:underline block"
                      >
                        {secondaryPhone}
                      </a>
                    )}
                  </div>
                </Card>

                {/* WhatsApp Card */}
                <Card className="p-5 flex items-start gap-3.5 bg-[#FAF8F2] border border-[#E5E1D7]">
                  <div className="w-10 h-10 rounded-[10px] bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#68736D]">
                      WhatsApp Direct Chat
                    </h4>
                    <a
                      href={`https://wa.me/${cleanWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#164A35] hover:underline flex items-center gap-1"
                    >
                      <span>{rawWhatsApp}</span>
                      <ExternalLink className="w-3 h-3 text-[#C5A55A]" />
                    </a>
                  </div>
                </Card>

                {/* Email Card */}
                <Card className="p-5 flex items-start gap-3.5 bg-[#FAF8F2] border border-[#E5E1D7]">
                  <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#C5A55A]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#68736D]">
                      Email Address
                    </h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-xs sm:text-sm font-bold text-[#164A35] hover:underline break-all block"
                    >
                      {email}
                    </a>
                  </div>
                </Card>

                {/* Addresses */}
                <Card className="p-5 space-y-4 bg-[#FAF8F2] border border-[#E5E1D7]">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-[#C5A55A]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#68736D]">
                        School Campus Address
                      </h4>
                      <p className="text-xs sm:text-sm text-[#17231D] font-medium leading-relaxed">
                        {schoolAddress}
                      </p>
                    </div>
                  </div>

                  {coachingAddress && coachingAddress !== schoolAddress && (
                    <div className="pt-3 border-t border-[#E5E1D7] pl-13">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#68736D]">
                        Coaching Centre
                      </h4>
                      <p className="text-xs sm:text-sm text-[#17231D] font-medium leading-relaxed">
                        {coachingAddress}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Right Column: Enquiry Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-[#FAF8F2] p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C5A55A] block">
                    Online Inquiry
                  </span>
                  <h3 className="text-xl font-bold text-[#164A35]">
                    Request an Academic Counseling Call
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68736D]">
                    Fill in your details below and our academic advisor will contact you with batch schedules, syllabus details, and fee structure.
                  </p>
                </div>

                <EnquiryForm source="contact_page" />
              </div>
            </div>
          </div>

          {/* Dynamic Google Maps Location Embed */}
          {mapEmbedUrl && (
            <div className="mt-12 sm:mt-16 rounded-[22px] overflow-hidden border border-[#E5E1D7] shadow-sm">
              <div className="p-4 bg-[#FAF8F2] border-b border-[#E5E1D7] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#164A35]">
                  <MapPin className="w-4 h-4 text-[#C5A55A]" />
                  <span>Interactive Campus Map (Shahdol)</span>
                </div>
                {settings.googleMapsUrl && (
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#164A35] hover:underline flex items-center gap-1"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 text-[#C5A55A]" />
                  </a>
                )}
              </div>
              <div className="w-full h-80 sm:h-96 bg-[#E5E1D7]">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Campus Location Map"
                />
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;
