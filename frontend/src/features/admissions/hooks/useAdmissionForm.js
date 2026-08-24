import { useState, useEffect, useMemo } from 'react';
import { useGetWebsiteSettingsQuery } from '../../school/services/websiteSettingsApi';
import { useGetHomepageDataQuery } from '../../home/services/homeApi';
import { useGetCoursesQuery } from '../../courses/services/courseApi';
import { useGetBatchesQuery } from '../../batches/services/batchApi';
import { useSubmitAdmissionMutation } from '../services/admissionApi';
import { useToast } from '../../../components/ui/Toast';

export const useAdmissionForm = (initialCourseId = '', initialBatchId = '') => {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitAdmission, { isLoading: isSubmitting }] = useSubmitAdmissionMutation();

  // Backend Dynamic Configurations
  const { data: settingsData, isLoading: isLoadingSettings } = useGetWebsiteSettingsQuery();
  const { data: homeData, isLoading: isLoadingHome } = useGetHomepageDataQuery();
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCoursesQuery();
  const { data: batchesData, isLoading: isLoadingBatches } = useGetBatchesQuery();

  const settings = settingsData?.data || {};
  const homepage = homeData?.data || {};
  const publishedCourses = useMemo(() => coursesData?.data || [], [coursesData]);
  const publishedBatches = useMemo(() => batchesData?.data || [], [batchesData]);

  // Global & Contextual Availability
  const isAdmissionOpen = settings.isAdmissionOpen !== false;
  const admissionNoticeText = settings.admissionNoticeText || 'Admissions for current session are currently closed.';
  const isHostelGloballyEnabled = homepage.hostelSection?.isVisible !== false;

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Student
    studentName: '',
    dob: '',
    gender: 'Male',
    bloodGroup: '',
    category: 'General',
    // Step 2: Parent & Address
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    parentPhone: '',
    altPhone: '',
    parentEmail: '',
    address: '',
    city: 'Shahdol',
    state: 'Madhya Pradesh',
    pincode: '484001',
    // Step 3: Academic History
    previousSchool: '',
    previousClass: '',
    previousPercentage: '',
    // Step 4: Program Selection
    selectedCourseId: initialCourseId,
    selectedBatchId: initialBatchId,
    appliedFor: 'School + Coaching Integrated',
    appliedClass: '11th',
    targetExam: 'JEE (Main & Advanced)',
    // Step 5: Amenities
    hostelRequired: false,
    transportRequired: false,
    remarks: '',
  });

  const [studentDocumentFile, setStudentDocumentFile] = useState(null);
  const [formError, setFormError] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  // Filter available batches for the selected course
  const availableBatchesForCourse = useMemo(() => {
    if (!formData.selectedCourseId) return publishedBatches;
    return publishedBatches.filter((b) => {
      const bCourseId = typeof b.course === 'object' ? b.course?._id : b.course;
      return bCourseId === formData.selectedCourseId;
    });
  }, [publishedBatches, formData.selectedCourseId]);

  // Find currently selected Batch object
  const selectedBatchObj = useMemo(() => {
    if (!formData.selectedBatchId) return null;
    return publishedBatches.find((b) => b._id === formData.selectedBatchId) || null;
  }, [publishedBatches, formData.selectedBatchId]);

  // Calculate if Hostel option is active
  const isHostelAvailable = useMemo(() => {
    if (!isHostelGloballyEnabled) return false;
    if (selectedBatchObj && selectedBatchObj.hostelAvailable === false) return false;
    return true;
  }, [isHostelGloballyEnabled, selectedBatchObj]);

  // Reactive stale data cleanup: if hostel becomes unavailable, reset hostelRequired to false
  useEffect(() => {
    if (!isHostelAvailable && formData.hostelRequired) {
      setFormData((prev) => ({ ...prev, hostelRequired: false }));
    }
  }, [isHostelAvailable, formData.hostelRequired]);

  // If selected course changes and current batch doesn't belong to it, reset batch
  useEffect(() => {
    if (formData.selectedCourseId && formData.selectedBatchId) {
      const isValidBatch = availableBatchesForCourse.some((b) => b._id === formData.selectedBatchId);
      if (!isValidBatch) {
        setFormData((prev) => ({ ...prev, selectedBatchId: '' }));
      }
    }
  }, [formData.selectedCourseId, availableBatchesForCourse, formData.selectedBatchId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep = (step) => {
    setFormError('');
    if (step === 1) {
      if (!formData.studentName.trim()) {
        setFormError('Please enter student full name.');
        return false;
      }
      if (!formData.gender) {
        setFormError('Please select student gender.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.parentPhone.trim()) {
        setFormError('Please enter a valid 10-digit parent mobile number.');
        return false;
      }
      const cleanPhone = formData.parentPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        setFormError('Mobile number must be between 10 and 15 digits.');
        return false;
      }
      if (formData.parentEmail && formData.parentEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.parentEmail.trim())) {
          setFormError('Please enter a valid email address.');
          return false;
        }
      }
    } else if (step === 4) {
      if (!formData.appliedClass) {
        setFormError('Please select the applying class level.');
        return false;
      }
    }
    return true;
  };

  const handleNext = (totalSteps) => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 250, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isAdmissionOpen) {
      setFormError('Admissions are currently closed. Please submit an enquiry to get notified.');
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(4)) {
      showToast('Please check all required fields.', 'error');
      return;
    }

    const payload = new FormData();

    // Required fields matching createAdmissionValidator
    payload.append('studentName', formData.studentName.trim());
    payload.append('mobile', formData.parentPhone.replace(/[^0-9]/g, ''));
    payload.append('applyingForClass', formData.appliedClass || '11th');

    // Optional profile fields
    if (formData.fatherName?.trim()) payload.append('fatherName', formData.fatherName.trim());
    if (formData.motherName?.trim()) payload.append('motherName', formData.motherName.trim());
    if (formData.dob) payload.append('dateOfBirth', formData.dob);
    payload.append('gender', formData.gender || 'Male');
    if (formData.altPhone?.trim()) payload.append('altMobile', formData.altPhone.trim());
    if (formData.parentEmail?.trim()) payload.append('email', formData.parentEmail.trim().toLowerCase());

    // Address fields
    if (formData.address?.trim()) payload.append('street', formData.address.trim());
    if (formData.city?.trim()) payload.append('city', formData.city.trim());
    if (formData.state?.trim()) payload.append('state', formData.state.trim());
    if (formData.pincode?.trim()) payload.append('pincode', formData.pincode.trim());

    // Academic history
    if (formData.previousSchool?.trim()) payload.append('previousSchool', formData.previousSchool.trim());
    if (formData.previousPercentage?.trim()) payload.append('previousScoreOrPercentage', formData.previousPercentage.trim());
    if (formData.previousClass?.trim()) payload.append('currentClass', formData.previousClass.trim());

    // Program, Course & Batch IDs (Strict backend references)
    payload.append('program', formData.appliedFor || 'School + Coaching Integrated');
    if (formData.selectedCourseId) {
      payload.append('course', formData.selectedCourseId);
    }
    if (formData.selectedBatchId) {
      payload.append('batch', formData.selectedBatchId);
    }

    // Amenities (Enforce NO STALE HOSTEL DATA: only true if hostel is currently available and checked)
    const effectiveHostelRequired = Boolean(isHostelAvailable && formData.hostelRequired);
    payload.append('hostelRequired', String(effectiveHostelRequired));
    payload.append('transportRequired', String(Boolean(formData.transportRequired)));

    if (formData.remarks?.trim()) payload.append('message', formData.remarks.trim());

    // Document attachments
    if (studentDocumentFile) {
      payload.append('documents', studentDocumentFile);
    }

    try {
      const res = await submitAdmission(payload).unwrap();
      setSubmissionResult(res.data || res);
      showToast('Admission application submitted successfully!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      let msg = 'Failed to submit application.';
      if (err?.data?.errors && Array.isArray(err.data.errors) && err.data.errors.length > 0) {
        msg = err.data.errors.map((item) => `${item.field}: ${item.message}`).join(' | ');
      } else if (err?.data?.message) {
        msg = err.data.message;
      }
      setFormError(msg);
      showToast(msg, 'error', 6000);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    handleChange,
    handleNext,
    handlePrev,
    handleSubmit,
    validateStep,
    formError,
    setFormError,
    studentDocumentFile,
    setStudentDocumentFile,
    submissionResult,
    setSubmissionResult,
    isSubmitting,
    // Availability & Dynamic options
    isAdmissionOpen,
    admissionNoticeText,
    isHostelAvailable,
    isHostelGloballyEnabled,
    publishedCourses,
    publishedBatches,
    availableBatchesForCourse,
    selectedBatchObj,
    isLoading: isLoadingSettings || isLoadingHome || isLoadingCourses || isLoadingBatches,
  };
};
