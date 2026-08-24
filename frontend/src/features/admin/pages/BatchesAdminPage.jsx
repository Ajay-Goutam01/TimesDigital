import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Calendar, Clock, Home, Award } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AdminFileUpload } from '../components/AdminFileUpload';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetAdminBatchesQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useTogglePublishBatchMutation,
  useToggleFeatureBatchMutation,
  useDeleteBatchMutation,
} from '../../batches/services/batchApi';
import { useGetAdminCoursesQuery } from '../../courses/services/courseApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const BatchesAdminPage = () => {
  useDocumentTitle('Batches Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);

  const { data: coursesData } = useGetAdminCoursesQuery({ limit: 100 });
  const coursesList = coursesData?.data?.courses || coursesData?.data || [];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    category: 'JEE',
    class: 'Class 11',
    program: 'Target Batch',
    startDate: '',
    timings: '08:00 AM - 01:30 PM (School) | 02:30 PM - 06:30 PM (Coaching)',
    duration: '1 Year',
    shortDescription: '',
    description: '',
    features: '',
    scholarshipInfo: '',
    scholarshipUpto: 'Up to 100%',
    status: 'admissions-open',
    hostelAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminBatchesQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const batches = data?.data?.batches || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: batches.length };

  const [createBatch, { isLoading: isCreating }] = useCreateBatchMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();
  const [togglePublish] = useTogglePublishBatchMutation();
  const [toggleFeature] = useToggleFeatureBatchMutation();
  const [deleteBatch, { isLoading: isDeleting }] = useDeleteBatchMutation();

  const handleOpenCreate = () => {
    setEditingBatch(null);
    setFormData({
      name: '',
      course: coursesList[0]?._id || '',
      category: 'JEE',
      class: 'Class 11',
      program: 'Target Batch',
      startDate: new Date().toISOString().split('T')[0],
      timings: '08:00 AM - 01:30 PM (School) | 02:30 PM - 06:30 PM (Coaching)',
      duration: '1 Year',
      shortDescription: '',
      description: '',
      features: 'Kota Master Mentors\nDaily Practice Problem (DPP) Sessions\nBi-weekly NTA Pattern Test Series\nPersonalized Doubts Desk',
      scholarshipInfo: 'Scholarships available based on TTSE (Times Talent Scholarship Exam) & Board marks.',
      scholarshipUpto: 'Up to 100%',
      status: 'admissions-open',
      hostelAvailable: true,
    });
    setImageFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (batch) => {
    setEditingBatch(batch);
    const courseId = typeof batch.course === 'object' ? batch.course?._id : batch.course;
    setFormData({
      name: batch.name || '',
      course: courseId || coursesList[0]?._id || '',
      category: batch.category || 'JEE',
      class: batch.class || 'Class 11',
      program: batch.program || '',
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
      timings: batch.timings || '',
      duration: batch.duration || '1 Year',
      shortDescription: batch.shortDescription || '',
      description: batch.description || '',
      features: Array.isArray(batch.features) ? batch.features.join('\n') : batch.features || '',
      scholarshipInfo: batch.scholarshipInfo || '',
      scholarshipUpto: batch.feeStructure?.scholarshipUpto || 'Up to 100%',
      status: batch.status || 'admissions-open',
      hostelAvailable: batch.hostelAvailable !== false,
    });
    setImageFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError('Batch name and description are required.');
      return;
    }

    if (!formData.course) {
      setFormError('Please select a valid academic course.');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('course', formData.course);
    payload.append('category', formData.category);
    payload.append('class', formData.class);
    if (formData.program) payload.append('program', formData.program);
    if (formData.startDate) payload.append('startDate', formData.startDate);
    if (formData.timings) payload.append('timings', formData.timings);
    if (formData.duration) payload.append('duration', formData.duration);
    if (formData.shortDescription) payload.append('shortDescription', formData.shortDescription);
    payload.append('description', formData.description);
    payload.append('hostelAvailable', String(formData.hostelAvailable));
    payload.append('status', formData.status);
    if (formData.scholarshipInfo) payload.append('scholarshipInfo', formData.scholarshipInfo);

    // Fee structure with scholarship
    const feeObj = {
      scholarshipUpto: formData.scholarshipUpto || 'Up to 100%',
    };
    payload.append('feeStructure', JSON.stringify(feeObj));

    const feats = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    feats.forEach((f) => payload.append('features', f));

    if (imageFile) payload.append('batchImage', imageFile);

    try {
      if (editingBatch) {
        await updateBatch({ id: editingBatch._id, formData: payload }).unwrap();
        showToast('Batch details updated successfully!', 'success');
      } else {
        await createBatch(payload).unwrap();
        showToast('New academic batch created successfully!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save batch.');
      showToast(err?.data?.message || 'Failed to save batch.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!batchToDelete) return;
    try {
      await deleteBatch({ id: batchToDelete._id }).unwrap();
      showToast(`'${batchToDelete.name}' deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setBatchToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete batch.', 'error');
    }
  };

  const columns = [
    {
      header: 'Batch & Program',
      render: (row) => (
        <div>
          <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.name}</p>
          <span className="text-[11px] text-[#68736D]">
            {row.category} • Class {row.class} • {typeof row.course === 'object' ? row.course?.title : 'Course'}
          </span>
        </div>
      ),
    },
    {
      header: 'Schedule & Timings',
      render: (row) => (
        <div className="text-xs text-[#17231D]">
          <span className="block font-semibold">
            {row.startDate ? new Date(row.startDate).toLocaleDateString('en-IN') : 'Upcoming'}
          </span>
          <span className="text-[11px] text-[#68736D] truncate max-w-xs block">
            {row.timings || 'Regular schedule'}
          </span>
        </div>
      ),
    },
    {
      header: 'Hostel',
      render: (row) => (
        <Badge variant={row.hostelAvailable ? 'success' : 'cream'} size="sm">
          {row.hostelAvailable ? 'Available' : 'No'}
        </Badge>
      ),
    },
    {
      header: 'Status',
      render: (row) => {
        switch (row.status) {
          case 'seats-full':
            return <Badge variant="danger" size="sm">Seats Full</Badge>;
          case 'upcoming':
            return <Badge variant="dark" size="sm">Upcoming</Badge>;
          default:
            return <Badge variant="gold" size="sm">Admissions Open</Badge>;
        }
      },
    },
    {
      header: 'Visibility',
      render: (row) => (
        <button
          type="button"
          onClick={async () => {
            await togglePublish(row._id);
            refetch();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#164A35] hover:text-[#103728] cursor-pointer"
        >
          {row.isPublished ? (
            <>
              <Eye className="w-4 h-4 text-[#2F7D57]" />
              <span className="text-[#2F7D57]">Published</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-[#C94A4A]" />
              <span className="text-[#C94A4A]">Unpublished</span>
            </>
          )}
        </button>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={async () => {
              await toggleFeature(row._id);
              refetch();
            }}
            className={`p-1.5 rounded-[6px] hover:bg-[#FAF8F2] transition-colors cursor-pointer ${
              row.isFeatured ? 'text-[#C5A55A]' : 'text-[#68736D]'
            }`}
            title="Toggle Featured"
          >
            <Star className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#164A35] transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setBatchToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#164A35]">Batches Management</h2>
          <p className="text-xs text-[#68736D]">
            Schedule and configure target batches, hostel availability, and timings for IIT-JEE, NEET, and CBSE Schooling.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Create Batch
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={batches}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search batches by name, class level, or stream..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Batch Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBatch ? 'Edit Batch Configuration' : 'Schedule Academic Batch'}
        subtitle="Manage batch metadata, timetable, curriculum, and hostel availability."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4 text-left">
          {formError && (
            <div className="p-3.5 rounded-[12px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs text-[#C94A4A]">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Batch Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. TPS JEE Target 2027 (Kota Integrated)"
                required
              />
            </div>

            <Select
              label="Associated Academic Course *"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              options={[
                { label: '-- Select Course Reference --', value: '' },
                ...coursesList.map((c) => ({
                  label: `${c.title} (${c.category})`,
                  value: c._id,
                })),
              ]}
              required
            />

            <Select
              label="Batch Category *"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['JEE', 'NEET', 'Foundation', 'School Integrated', 'Commerce', 'Other']}
              required
            />

            <Select
              label="Class Level *"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              options={[
                'Class 6',
                'Class 7',
                'Class 8',
                'Class 9',
                'Class 10',
                'Class 11',
                'Class 12',
                '12th Pass / Dropper',
                'Nursery to 5th',
              ]}
              required
            />

            <Select
              label="Batch Admission Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { label: 'Admissions Open', value: 'admissions-open' },
                { label: 'Upcoming (Pre-Booking)', value: 'upcoming' },
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Seats Full (Closed)', value: 'seats-full' },
                { label: 'Completed', value: 'completed' },
              ]}
            />

            <Input
              label="Commencement Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <Input
              label="Daily Timetable / Timings"
              value={formData.timings}
              onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
              placeholder="e.g. 08:00 AM - 01:30 PM (School) | 02:30 PM - 06:30 PM"
            />
          </div>

          <Textarea
            label="Curriculum Overview & Batch Structure *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="Key Features & Highlights (One per line)"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={3}
          />

          {/* Conditional Amenities Controls */}
          <div className="p-4 rounded-[14px] bg-[#FAF8F2] border border-[#E5E1D7] space-y-3">
            <span className="text-xs font-bold text-[#164A35] uppercase tracking-wider block">
              Batch Inclusions & Facilities
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 text-xs font-bold text-[#17231D] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hostelAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, hostelAvailable: e.target.checked })
                  }
                  className="w-4 h-4 text-[#164A35] rounded"
                />
                <span>Hostel Facility Available for this Batch</span>
              </label>

              <Input
                label="Scholarship Maximum Upto"
                value={formData.scholarshipUpto}
                onChange={(e) => setFormData({ ...formData, scholarshipUpto: e.target.value })}
                placeholder="e.g. Up to 100%"
              />
            </div>

            <Input
              label="Scholarship Note / Criteria"
              value={formData.scholarshipInfo}
              onChange={(e) => setFormData({ ...formData, scholarshipInfo: e.target.value })}
              placeholder="e.g. Based on TTSE score and 10th board percentage."
            />
          </div>

          <AdminFileUpload
            file={imageFile}
            setFile={setImageFile}
            existingUrl={editingBatch?.batchImage?.url}
            label="Batch Schedule Banner"
          />

          <div className="pt-3 border-t border-[#E5E1D7] flex items-center justify-end gap-3">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isCreating || isUpdating}
            >
              {editingBatch ? 'Save Changes' : 'Schedule Batch'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Batch?"
        message={`Are you sure you want to delete '${batchToDelete?.name}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BatchesAdminPage;
