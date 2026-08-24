import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Globe, Share2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { AdminFileUpload } from '../components/AdminFileUpload';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetWebsiteSettingsQuery,
  useUpdateWebsiteSettingsMutation,
} from '../../school/services/websiteSettingsApi';
import { PageLoader } from '../../../components/ui/Loader';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const WebsiteSettingsAdminPage = () => {
  useDocumentTitle('Website Settings CMS');
  const { showToast } = useToast();
  const { data, isLoading, refetch } = useGetWebsiteSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateWebsiteSettingsMutation();

  const settings = data?.data || {};

  const [formData, setFormData] = useState({
    schoolName: '',
    coachingName: '',
    tagline: '',
    locationTag: '',
    primaryPhone: '',
    secondaryPhone: '',
    admissionPhone: '',
    whatsappNumber: '',
    email: '',
    admissionEmail: '',
    schoolAddress: '',
    coachingAddress: '',
    googleMapsEmbedUrl: '',
    googleMapsUrl: '',
    isAdmissionOpen: true,
    admissionNoticeText: '',
    // Social Links
    facebook: '',
    instagram: '',
    youtube: '',
    telegram: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [coachingLogoFile, setCoachingLogoFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        schoolName: settings.schoolName || 'TIME PUBLIC SCHOOL',
        coachingName: settings.coachingName || 'TIMES DIGITAL',
        tagline: settings.tagline || '',
        locationTag: settings.locationTag || 'Shahdol',
        primaryPhone: settings.primaryPhone || '',
        secondaryPhone: settings.secondaryPhone || '',
        admissionPhone: settings.admissionPhone || '',
        whatsappNumber: settings.whatsappNumber || '',
        email: settings.email || '',
        admissionEmail: settings.admissionEmail || '',
        schoolAddress: settings.schoolAddress || '',
        coachingAddress: settings.coachingAddress || '',
        googleMapsEmbedUrl: settings.googleMapsEmbedUrl || '',
        googleMapsUrl: settings.googleMapsUrl || '',
        isAdmissionOpen: settings.isAdmissionOpen !== false,
        admissionNoticeText: settings.admissionNoticeText || '',
        facebook: settings.socialLinks?.facebook || '',
        instagram: settings.socialLinks?.instagram || '',
        youtube: settings.socialLinks?.youtube || '',
        telegram: settings.socialLinks?.telegram || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (
        key !== 'facebook' &&
        key !== 'instagram' &&
        key !== 'youtube' &&
        key !== 'telegram'
      ) {
        payload.append(key, formData[key]);
      }
    });

    // Social links serialized as JSON string for backend JSON.parse
    const socialObj = {
      facebook: formData.facebook,
      instagram: formData.instagram,
      youtube: formData.youtube,
      telegram: formData.telegram,
    };
    payload.append('socialLinks', JSON.stringify(socialObj));

    if (logoFile) payload.append('logo', logoFile);
    if (coachingLogoFile) payload.append('coachingLogo', coachingLogoFile);

    try {
      await updateSettings(payload).unwrap();
      showToast('Website institutional settings updated live!', 'success');
      refetch();
    } catch (err) {
      const msg = err?.data?.message || 'Failed to update website settings.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  if (isLoading) return <PageLoader message="Loading settings..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-[#164A35]">
          Website Branding, Helplines & Location
        </h2>
        <p className="text-xs text-[#68736D]">
          These settings dynamically update phone numbers, WhatsApp links, Google Maps embeds, and branding across the entire public site.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-[12px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs text-[#C94A4A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Brand Names & Tagline */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider border-b border-[#E5E1D7] pb-2">
            1. Institutional Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="School Name"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />

            <Input
              label="Coaching Brand Name"
              name="coachingName"
              value={formData.coachingName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / Location Tag"
              name="locationTag"
              value={formData.locationTag}
              onChange={handleChange}
              placeholder="e.g. Shahdol"
            />

            <Input
              label="Institutional Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Where Learning Meets Excellence"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <AdminFileUpload
              file={logoFile}
              setFile={setLogoFile}
              existingUrl={settings.logo?.url}
              label="School Official Logo"
            />

            <AdminFileUpload
              file={coachingLogoFile}
              setFile={setCoachingLogoFile}
              existingUrl={settings.coachingLogo?.url}
              label="Coaching Logo (Optional)"
            />
          </div>
        </Card>

        {/* Contact Numbers & WhatsApp */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider border-b border-[#E5E1D7] pb-2">
            2. Helplines & WhatsApp Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Admissions Helpline"
              name="admissionPhone"
              value={formData.admissionPhone}
              onChange={handleChange}
              placeholder="+91 90000 00001"
              required
            />

            <Input
              label="WhatsApp Inquiry Number"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="+91 90000 00001"
              required
            />

            <Input
              label="Secondary Office Phone"
              name="secondaryPhone"
              value={formData.secondaryPhone}
              onChange={handleChange}
              placeholder="+91 90000 00002"
            />

            <Input
              label="Official Admissions Email"
              name="admissionEmail"
              type="email"
              value={formData.admissionEmail}
              onChange={handleChange}
              placeholder="admissions@timepublicschool.edu.in"
              required
            />
          </div>
        </Card>

        {/* Admissions Portal Live Configuration */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider border-b border-[#E5E1D7] pb-2">
            3. Online Admissions Availability
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#FAF8F2] border border-[#E5E1D7] cursor-pointer">
              <input
                type="checkbox"
                name="isAdmissionOpen"
                checked={formData.isAdmissionOpen}
                onChange={(e) => setFormData({ ...formData, isAdmissionOpen: e.target.checked })}
                className="w-5 h-5 text-[#164A35] rounded"
              />
              <div>
                <span className="text-sm font-bold text-[#17231D] block">
                  Online Admissions Open
                </span>
                <span className="text-xs text-[#68736D]">
                  When disabled, the public admissions form displays the closed announcement notice and routes queries to enquiry waitlist.
                </span>
              </div>
            </label>

            <Input
              label="Admission Notice / Banner Announcement"
              name="admissionNoticeText"
              value={formData.admissionNoticeText}
              onChange={handleChange}
              placeholder="e.g. Admissions Open for Academic Session 2025-26 & Target Batches for JEE/NEET"
            />
          </div>
        </Card>

        {/* Campus Address & Google Maps Embed */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider border-b border-[#E5E1D7] pb-2">
            4. Addresses & Google Maps Embed
          </h3>

          <Textarea
            label="School Campus Physical Address"
            name="schoolAddress"
            rows={2}
            value={formData.schoolAddress}
            onChange={handleChange}
            placeholder="TIME Public School Campus, Shahdol (M.P.) - 484001"
            required
          />

          <Textarea
            label="Coaching Centre Address (If separate)"
            name="coachingAddress"
            rows={2}
            value={formData.coachingAddress}
            onChange={handleChange}
            placeholder="TIMES DIGITAL Coaching Centre, Main Road, Shahdol (M.P.)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Google Maps Iframe Embed URL"
              name="googleMapsEmbedUrl"
              value={formData.googleMapsEmbedUrl}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />

            <Input
              label="Google Maps Direct Link (Get Directions)"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </Card>

        {/* Social Media Links */}
        <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
          <h3 className="text-sm font-bold text-[#164A35] uppercase tracking-wider border-b border-[#E5E1D7] pb-2">
            4. Official Social Media Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Facebook Page URL"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/timepublicschool"
            />

            <Input
              label="Instagram Profile URL"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/timepublicschool"
            />

            <Input
              label="YouTube Channel URL"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="https://youtube.com/@timepublicschool"
            />

            <Input
              label="Telegram Group / Channel"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              placeholder="https://t.me/timesdigital"
            />
          </div>
        </Card>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            icon={Save}
            className="w-full sm:w-auto"
          >
            Save All Settings Live
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteSettingsAdminPage;
