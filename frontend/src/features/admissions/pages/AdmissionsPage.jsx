import React from 'react';
import {
  User,
  Users,
  GraduationCap,
  BookOpen,
  Home,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Printer,
  Copy,
  Sparkles,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { PageLoader } from '../../../components/ui/Loader';
import { EnquiryForm } from '../../enquiries/components/EnquiryForm';
import { useAdmissionForm } from '../hooks/useAdmissionForm';
import { useToast } from '../../../components/ui/Toast';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

const STEPS = [
  { id: 1, title: 'Student', icon: User },
  { id: 2, title: 'Parent', icon: Users },
  { id: 3, title: 'Academic', icon: GraduationCap },
  { id: 4, title: 'Course & Batch', icon: BookOpen },
  { id: 5, title: 'Amenities', icon: Home },
  { id: 6, title: 'Review & Submit', icon: Send },
];

export const AdmissionsPage = () => {
  useDocumentTitle('Online Admission Portal 2025–26');
  const { showToast } = useToast();

  const {
    currentStep,
    formData,
    handleChange,
    handleNext,
    handlePrev,
    handleSubmit,
    formError,
    studentDocumentFile,
    setStudentDocumentFile,
    submissionResult,
    isSubmitting,
    // Availability & Dynamic options
    isAdmissionOpen,
    admissionNoticeText,
    isHostelAvailable,
    publishedCourses,
    availableBatchesForCourse,
    selectedBatchObj,
    isLoading,
  } = useAdmissionForm();

  const [copied, setCopied] = React.useState(false);

  const handleCopyAppNumber = (appNo) => {
    navigator.clipboard.writeText(appNo);
    setCopied(true);
    showToast('Application number copied to clipboard.', 'info', 2500);
    setTimeout(() => setCopied(false), 3000);
  };

  if (isLoading) {
    return <PageLoader message="Loading admissions portal configuration..." />;
  }

  // If Admissions are closed in WebsiteSettings CMS
  if (!isAdmissionOpen) {
    return (
      <div className="w-full">
        <PageHero
          badge="Admissions Notice"
          title="Online Admissions Closed"
          subtitle={admissionNoticeText}
          breadcrumbs={[{ label: 'Admissions' }]}
        />

        <section className="py-14 sm:py-16 md:py-20 bg-[#FAF8F2]">
          <Container>
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Closed State Banner */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E5E1D7] shadow-sm text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#C94A4A]/10 text-[#C94A4A] flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <Badge variant="danger" size="md">
                    Admissions Closed
                  </Badge>
                  <h2 className="text-2xl font-extrabold text-[#164A35]">
                    Admissions for Current Session Are Closed
                  </h2>
                  <p className="text-sm text-[#68736D] leading-relaxed max-w-xl mx-auto">
                    {admissionNoticeText}
                  </p>
                </div>
              </div>

              {/* Lead Registration Form for Next Session */}
              <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E5E1D7] shadow-sm space-y-4">
                <div className="border-b border-[#E5E1D7] pb-3">
                  <h3 className="text-lg font-bold text-[#164A35]">
                    Register Your Interest / Pre-Admission Enquiry
                  </h3>
                  <p className="text-xs text-[#68736D]">
                    Leave your contact details and our admissions desk will notify you immediately once admissions reopen for upcoming target batches.
                  </p>
                </div>

                <EnquiryForm source="admissions_closed_page" />
              </div>
            </div>
          </Container>
        </section>
      </div>
    );
  }

  // If Application submitted successfully
  if (submissionResult) {
    const appNo = submissionResult.applicationNumber || 'TPS-CONFIRMED';

    return (
      <div className="w-full py-16 bg-[#FAF8F2]">
        <Container>
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-[24px] border border-[#E5E1D7] shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#164A35]/10 text-[#164A35] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-[#C5A55A]" />
            </div>

            <div className="space-y-2">
              <Badge variant="gold" size="md">
                Application Received
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#164A35]">
                Admission Form Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                Thank you for applying to TIME Public School & TIMES DIGITAL. Please keep note of your unique application registration number below for all future counseling and fee payment records.
              </p>
            </div>

            {/* Application ID Card */}
            <div className="p-5 rounded-[18px] bg-[#FAF8F2] border-2 border-dashed border-[#C5A55A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#68736D]">
                  Application Registration Number
                </span>
                <p className="font-mono text-xl sm:text-2xl font-extrabold text-[#164A35]">
                  {appNo}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={Copy}
                onClick={() => handleCopyAppNumber(appNo)}
              >
                {copied ? 'Copied!' : 'Copy Number'}
              </Button>
            </div>

            {/* Instructions */}
            <div className="bg-[#FAF8F2] p-5 rounded-[16px] border border-[#E5E1D7] text-left space-y-2.5 text-xs text-[#17231D]">
              <span className="font-bold text-[#164A35] uppercase tracking-wider text-[11px] block">
                Next Steps for Parents:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-[#68736D]">
                <li>Our academic counselor will call you within 24 hours to schedule verification.</li>
                <li>Bring previous class mark sheets and 2 passport photos for entrance counseling.</li>
                <li>For scholarship eligibility, your Times Talent Search Exam slot will be confirmed.</li>
              </ul>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => window.print()}
                icon={Printer}
              >
                Print Application Receipt
              </Button>
              <a href="/">
                <Button variant="secondary" size="md">
                  Return to Home
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Normal Multi-Step Admission Form
  return (
    <div className="w-full">
      <PageHero
        badge="Session 2025–26"
        title="Online Admission Application"
        subtitle="Apply for CBSE Nursery to 12th schooling and TIMES DIGITAL IIT-JEE / NEET integrated batches in Shahdol."
        breadcrumbs={[{ label: 'Admissions' }]}
      />

      <section className="py-10 sm:py-14 md:py-16 bg-[#FAF8F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column: Multi-Step Navigation & Info (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Stepper Progress Card */}
              <div className="bg-white p-5 sm:p-6 rounded-[20px] border border-[#E5E1D7] shadow-xs space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C5A55A] block">
                  Application Steps
                </span>

                <div className="space-y-2">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-[12px] border transition-all ${
                          isCurrent
                            ? 'bg-[#164A35] text-white border-[#164A35] shadow-xs'
                            : isCompleted
                            ? 'bg-[#FAF8F2] text-[#164A35] border-[#E5E1D7]'
                            : 'bg-white text-[#68736D] border-transparent'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCurrent
                              ? 'bg-[#C5A55A] text-[#103728]'
                              : isCompleted
                              ? 'bg-[#164A35] text-white'
                              : 'bg-[#F3F0E7] text-[#68736D]'
                          }`}
                        >
                          {isCompleted ? '✓' : step.id}
                        </div>
                        <span className="text-xs font-bold truncate">{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Helpline Quick Box */}
              <div className="bg-[#103728] text-white p-6 rounded-[20px] space-y-3">
                <span className="text-[10px] font-bold text-[#C5A55A] uppercase tracking-wider block">
                  Need Assistance?
                </span>
                <h4 className="text-base font-extrabold">Admissions Helpdesk</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Call our counselor for guidance regarding stream selection, batch timings, or fee concessions.
                </p>
                <div className="pt-1 space-y-1.5 text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C5A55A]" />
                    <span className="font-bold">+91 90000 00001</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#C5A55A]" />
                    <span>admissions@timepublicschool.edu.in</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Step Content (8 cols) */}
            <div className="lg:col-span-8">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] border border-[#E5E1D7] shadow-sm space-y-6"
              >
                {formError && (
                  <div className="p-4 rounded-[12px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs text-[#C94A4A] flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* STEP 1: Student Details */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-b border-[#E5E1D7] pb-3">
                      <h3 className="text-lg font-bold text-[#164A35]">
                        Step 1: Student Information
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        Enter the personal details of the student as per previous school records.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input
                          label="Student Full Name *"
                          name="studentName"
                          value={formData.studentName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          required
                        />
                      </div>

                      <Input
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                      />

                      <Select
                        label="Gender *"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={['Male', 'Female', 'Other']}
                        required
                      />

                      <Select
                        label="Category / Quota"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={['General', 'OBC', 'SC', 'ST', 'EWS']}
                      />

                      <Input
                        label="Blood Group (Optional)"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        placeholder="e.g. O+ / B+"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: Parent / Guardian Details */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-b border-[#E5E1D7] pb-3">
                      <h3 className="text-lg font-bold text-[#164A35]">
                        Step 2: Parent / Guardian & Address
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        Contact details for admissions correspondence, progress updates, and SMS alerts.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Father / Guardian Name"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Sharma"
                      />

                      <Input
                        label="Father's Occupation"
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleChange}
                        placeholder="e.g. Government Service / Business"
                      />

                      <Input
                        label="Mother's Name"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        placeholder="e.g. Sunita Sharma"
                      />

                      <Input
                        label="Mother's Occupation"
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleChange}
                        placeholder="e.g. Teacher / Homemaker"
                      />

                      <Input
                        label="Primary Contact Mobile *"
                        name="parentPhone"
                        type="tel"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        required
                      />

                      <Input
                        label="Alternate Mobile (Optional)"
                        name="altPhone"
                        type="tel"
                        value={formData.altPhone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543211"
                      />

                      <div className="sm:col-span-2">
                        <Input
                          label="Email Address (Optional)"
                          name="parentEmail"
                          type="email"
                          value={formData.parentEmail}
                          onChange={handleChange}
                          placeholder="e.g. parent@example.com"
                        />
                      </div>
                    </div>

                    <Textarea
                      label="Residential Street / Colony Address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, Street, Colony..."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="City / District"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                      <Input
                        label="PIN Code"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Previous Academic Record */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-b border-[#E5E1D7] pb-3">
                      <h3 className="text-lg font-bold text-[#164A35]">
                        Step 3: Previous Academic History
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        Information about the last attended school and performance.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Previous School Name & Location"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        placeholder="e.g. St. Joseph Convent School, Shahdol"
                      />

                      <Input
                        label="Class Last Passed / Appearing"
                        name="previousClass"
                        value={formData.previousClass}
                        onChange={handleChange}
                        placeholder="e.g. Class 10th CBSE"
                      />

                      <Input
                        label="Percentage / CGPA / Grade"
                        name="previousPercentage"
                        value={formData.previousPercentage}
                        onChange={handleChange}
                        placeholder="e.g. 92.4% or 9.4 CGPA"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Program, Course & Batch Selection */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-b border-[#E5E1D7] pb-3">
                      <h3 className="text-lg font-bold text-[#164A35]">
                        Step 4: Academic Program & Target Batch
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        Choose your academic stream and link directly to active published batches.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Course Selection from backend */}
                      <Select
                        label="Academic Program / Course"
                        name="selectedCourseId"
                        value={formData.selectedCourseId}
                        onChange={handleChange}
                        options={[
                          { label: '-- Select Academic Course (Optional) --', value: '' },
                          ...publishedCourses.map((c) => ({
                            label: `${c.title} (${c.category})`,
                            value: c._id,
                          })),
                        ]}
                      />

                      {/* Batch Selection filtered for course */}
                      <Select
                        label="Target Batch (Optional)"
                        name="selectedBatchId"
                        value={formData.selectedBatchId}
                        onChange={handleChange}
                        options={[
                          { label: '-- Select Specific Target Batch --', value: '' },
                          ...availableBatchesForCourse.map((b) => ({
                            label: `${b.name} (${b.class || b.category})`,
                            value: b._id,
                          })),
                        ]}
                      />

                      <Select
                        label="Applying for Class *"
                        name="appliedClass"
                        value={formData.appliedClass}
                        onChange={handleChange}
                        options={[
                          'Nursery to 5th',
                          '6th',
                          '7th',
                          '8th',
                          '9th',
                          '10th',
                          '11th',
                          '11th PCM',
                          '11th PCB',
                          '11th Commerce',
                          '12th',
                          '12th PCM',
                          '12th PCB',
                          '12th Pass (Dropper)',
                        ]}
                        required
                      />

                      <Select
                        label="Program Type"
                        name="appliedFor"
                        value={formData.appliedFor}
                        onChange={handleChange}
                        options={[
                          'School + Coaching Integrated',
                          'CBSE Schooling Only',
                          'TIMES DIGITAL Coaching Only',
                          'Junior Foundation Program',
                          'Dropper / Repeater Batch',
                        ]}
                      />
                    </div>

                    {selectedBatchObj && (
                      <div className="p-3.5 rounded-[12px] bg-[#FAF8F2] border border-[#E5E1D7] text-xs text-[#17231D] space-y-1">
                        <span className="font-bold text-[#164A35]">
                          Selected Batch: {selectedBatchObj.name}
                        </span>
                        <p className="text-[#68736D]">
                          Timings: {selectedBatchObj.timings || 'Standard'} • Hostel Available:{' '}
                          <strong className={selectedBatchObj.hostelAvailable ? 'text-[#2F7D57]' : 'text-[#C94A4A]'}>
                            {selectedBatchObj.hostelAvailable ? 'Yes' : 'No'}
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5: Hostel & Transport Amenities */}
                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-b border-[#E5E1D7] pb-3">
                      <h3 className="text-lg font-bold text-[#164A35]">
                        Step 5: Campus Amenities & Hostel
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        Opt-in for available residential hostel or school transport services.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* DYNAMIC HOSTEL AVAILABILITY */}
                      {isHostelAvailable ? (
                        <label className="flex items-start gap-3 p-4 rounded-[14px] bg-[#FAF8F2] border border-[#E5E1D7] cursor-pointer hover:bg-[#F3F0E7] transition-colors">
                          <input
                            type="checkbox"
                            name="hostelRequired"
                            checked={formData.hostelRequired}
                            onChange={handleChange}
                            className="w-5 h-5 rounded text-[#164A35] mt-0.5 focus:ring-[#164A35]"
                          />
                          <div>
                            <span className="text-sm font-bold text-[#17231D] block">
                              Residential Hostel Facility Required
                            </span>
                            <span className="text-xs text-[#68736D]">
                              Safe accommodation with disciplined study hours, nutritious meals, and 24x7 security for outstation students.
                            </span>
                          </div>
                        </label>
                      ) : (
                        <div className="p-3.5 rounded-[12px] bg-[#FAF8F2] border border-[#E5E1D7] text-xs text-[#68736D]">
                          <span className="font-bold text-[#17231D] block">Hostel Facility:</span>
                          <span>
                            Hostel facility is currently not applicable for the selected batch or configuration.
                          </span>
                        </div>
                      )}

                      {/* Transport Option */}
                      <label className="flex items-start gap-3 p-4 rounded-[14px] bg-[#FAF8F2] border border-[#E5E1D7] cursor-pointer hover:bg-[#F3F0E7] transition-colors">
                        <input
                          type="checkbox"
                          name="transportRequired"
                          checked={formData.transportRequired}
                          onChange={handleChange}
                          className="w-5 h-5 rounded text-[#164A35] mt-0.5 focus:ring-[#164A35]"
                        />
                        <div>
                          <span className="text-sm font-bold text-[#17231D] block">
                            School Bus / Transport Route Required
                          </span>
                          <span className="text-xs text-[#68736D]">
                            GPS-enabled safe transportation covering major routes in and around Shahdol.
                          </span>
                        </div>
                      </label>
                    </div>

                    <Textarea
                      label="Additional Notes / Remarks (Optional)"
                      name="remarks"
                      rows={3}
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Any specific medical note, scholarship requirement, or sibling concession query..."
                    />
                  </div>
                )}

                {/* STEP 6: Review, Attachments & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="border-b border-[#E5E1D7] pb-3">
                      <h3 className="text-lg font-bold text-[#164A35]">
                        Step 6: Review & Final Submission
                      </h3>
                      <p className="text-xs text-[#68736D]">
                        Please double check all submitted details before sending the application to the admissions desk.
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#FAF8F2] p-5 rounded-[16px] border border-[#E5E1D7] space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-[#68736D] block">Student Name:</span>
                          <span className="font-bold text-[#164A35] text-sm">
                            {formData.studentName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#68736D] block">Applying for Class:</span>
                          <span className="font-bold text-sm">
                            Class {formData.appliedClass}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#68736D] block">Primary Mobile:</span>
                          <span className="font-bold">{formData.parentPhone}</span>
                        </div>
                        <div>
                          <span className="text-[#68736D] block">Parent Name:</span>
                          <span className="font-bold">{formData.fatherName || formData.motherName || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[#68736D] block">Hostel Required:</span>
                          <span className="font-bold">
                            {isHostelAvailable && formData.hostelRequired ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#68736D] block">Transport Required:</span>
                          <span className="font-bold">{formData.transportRequired ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#17231D] block">
                        Attach Marksheet / Previous Report Card (Optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setStudentDocumentFile(e.target.files[0] || null)}
                        className="block w-full text-xs text-[#68736D] file:mr-3 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-xs file:font-semibold file:bg-[#164A35] file:text-white hover:file:bg-[#103728] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Form Stepper Action Buttons */}
                <div className="pt-4 border-t border-[#E5E1D7] flex items-center justify-between gap-3">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={handlePrev}
                      icon={ArrowLeft}
                    >
                      Previous
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => handleNext(STEPS.length)}
                      icon={ArrowRight}
                      iconPosition="right"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      isLoading={isSubmitting}
                      icon={Send}
                      iconPosition="right"
                      className="text-[#103728]"
                    >
                      Confirm & Submit Application
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AdmissionsPage;
