import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { useSubmitEnquiryMutation } from '../services/enquiryApi';
import { useGetCoursesQuery } from '../../courses/services/courseApi';
import { useToast } from '../../../components/ui/Toast';
import { cn } from '../../../utils/cn';

export const EnquiryForm = ({
  defaultCourse = '',
  defaultBatch = '',
  defaultCourseId = '',
  defaultBatchId = '',
  source = 'website_form',
  onSuccess,
  className,
  isCompact = false,
}) => {
  const { showToast } = useToast();
  const [submitEnquiry, { isLoading }] = useSubmitEnquiryMutation();
  const { data: coursesData } = useGetCoursesQuery();
  const courses = coursesData?.data || [];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    courseInterested: defaultCourse || '',
    courseId: defaultCourseId || '',
    batchId: defaultBatchId || '',
    classLevel: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'courseInterested') {
      const matchedCourse = courses.find((c) => c.title === value || c._id === value);
      setFormData((prev) => ({
        ...prev,
        courseInterested: matchedCourse ? matchedCourse.title : value,
        courseId: matchedCourse ? matchedCourse._id : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and contact phone number.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setError('Phone number must be between 10 and 15 digits.');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || undefined,
        interestedProgram: formData.courseInterested || defaultCourse || undefined,
        interestedCourse: formData.courseId || defaultCourseId || undefined,
        interestedBatch: formData.batchId || defaultBatchId || undefined,
        class: formData.classLevel || undefined,
        message: formData.message.trim() || undefined,
        source: defaultBatch ? `Batch Page: ${defaultBatch}` : source,
        sourceUrl: window.location.href,
      };

      await submitEnquiry(payload).unwrap();
      setFormSubmitted(true);
      showToast('Thank you! Our admissions counselor will get in touch shortly.', 'success');
      onSuccess?.();
    } catch (err) {
      const msg = err?.data?.message || 'Failed to submit enquiry. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  if (formSubmitted) {
    return (
      <div className="p-6 rounded-[18px] bg-white border border-[#E5E1D7] text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#164A35]/10 text-[#164A35] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-[#C5A55A]" />
        </div>
        <h4 className="text-base font-bold text-[#164A35]">Enquiry Received</h4>
        <p className="text-xs text-[#68736D] leading-relaxed">
          Thank you for reaching out. Our academic counselor will call you within 24 hours.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setFormSubmitted(false);
            setFormData({
              name: '',
              phone: '',
              email: '',
              courseInterested: defaultCourse,
              courseId: defaultCourseId,
              batchId: defaultBatchId,
              classLevel: '',
              message: '',
            });
          }}
        >
          Submit Another Enquiry
        </Button>
      </div>
    );
  }

  const courseOptions =
    courses.length > 0
      ? courses.map((c) => ({ label: `${c.title} (${c.category})`, value: c.title }))
      : [
          { label: 'JEE Main & Advanced Integrated', value: 'JEE Main & Advanced Integrated' },
          { label: 'NEET Medical Excellence', value: 'NEET Medical Excellence' },
          { label: 'Junior Foundation (Classes 8-10)', value: 'Junior Foundation (Classes 8-10)' },
          { label: 'CBSE Senior Secondary (11th-12th)', value: 'CBSE Senior Secondary (11th-12th)' },
          { label: 'CBSE School Admission (Nursery - 10th)', value: 'CBSE School Admission' },
          { label: 'Times Talent Scholarship (TTSE)', value: 'Scholarship Exam' },
        ];

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-3.5', className)}>
      {error && (
        <div className="p-3 rounded-[10px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs text-[#C94A4A] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className={cn('grid gap-3', isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
        <Input
          label="Student / Parent Name *"
          name="name"
          placeholder="e.g. Rahul Sharma"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number *"
          name="phone"
          type="tel"
          placeholder="10-digit mobile number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className={cn('grid gap-3', isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
        <Input
          label="Email Address (Optional)"
          name="email"
          type="email"
          placeholder="e.g. name@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <Select
          label="Target Program / Course"
          name="courseInterested"
          value={formData.courseInterested}
          onChange={handleChange}
          options={courseOptions}
          placeholder="Select program"
        />
      </div>

      <Textarea
        label="Questions or Message (Optional)"
        name="message"
        rows={isCompact ? 2 : 3}
        placeholder="Ask about batch timings, fee structure, hostel facility, or syllabus..."
        value={formData.message}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isLoading}
        icon={Send}
        className="w-full"
      >
        Request Free Counseling Call
      </Button>
    </form>
  );
};

export default EnquiryForm;
