import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, ArrowUpDown } from 'lucide-react';
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
  useGetAdminCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useTogglePublishCourseMutation,
  useToggleFeatureCourseMutation,
  useDeleteCourseMutation,
} from '../../courses/services/courseApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const CoursesAdminPage = () => {
  useDocumentTitle('Courses Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Coaching',
    class: '11th',
    duration: '2 Years',
    eligibility: 'Class 10th Passed / Appearing',
    shortDescription: '',
    description: '',
    features: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminCoursesQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const courses = data?.data?.courses || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: courses.length };

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [togglePublish] = useTogglePublishCourseMutation();
  const [toggleFeature] = useToggleFeatureCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      category: 'Coaching',
      class: '11th',
      duration: '2 Years',
      eligibility: 'Class 10th Passed / Appearing',
      shortDescription: '',
      description: '',
      features: 'Kota Master Faculty\nDaily Practice Problem (DPP) Sheets\nAll-India Test Series (AITS)',
    });
    setImageFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      category: course.category || 'Coaching',
      class: course.class || '11th',
      duration: course.duration || '',
      eligibility: course.eligibility || '',
      shortDescription: course.shortDescription || '',
      description: course.description || '',
      features: Array.isArray(course.features) ? course.features.join('\n') : course.features || '',
    });
    setImageFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('category', formData.category);
    payload.append('class', formData.class);
    payload.append('classes', formData.class);
    if (formData.duration) payload.append('duration', formData.duration);
    if (formData.eligibility) payload.append('eligibility', formData.eligibility);
    if (formData.shortDescription) payload.append('shortDescription', formData.shortDescription);
    payload.append('description', formData.description);

    // Features as array or newline delimited
    const feats = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    feats.forEach((f) => payload.append('features', f));

    if (imageFile) payload.append('image', imageFile);

    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse._id, formData: payload }).unwrap();
        showToast('Course details updated successfully!', 'success');
      } else {
        await createCourse(payload).unwrap();
        showToast('New course created successfully!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save course.');
      showToast(err?.data?.message || 'Failed to save course.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse({ id: courseToDelete._id }).unwrap();
      showToast(`'${courseToDelete.title}' deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete course.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Course ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleFeature(id).unwrap();
      showToast(`Course ${currentStatus ? 'removed from featured' : 'marked featured'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle featured.', 'error');
    }
  };

  const columns = [
    {
      header: 'Course Title & Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image?.url && (
            <img
              src={row.image.url}
              alt=""
              className="w-10 h-10 object-cover rounded-[8px] border border-[#E5E1D7]"
            />
          )}
          <div>
            <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.title}</p>
            <span className="text-[11px] text-[#68736D] block">
              {row.category} • Class {row.class || 'All'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Duration',
      render: (row) => <span className="text-xs">{row.duration || '—'}</span>,
    },
    {
      header: 'Visibility',
      render: (row) => (
        <Badge variant={row.isPublished ? 'success' : 'cream'} size="sm">
          {row.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      header: 'Featured',
      render: (row) =>
        row.isFeatured ? (
          <Badge variant="gold" size="sm">
            Featured
          </Badge>
        ) : (
          <span className="text-xs text-[#68736D]">Standard</span>
        ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleTogglePublish(row._id, row.isPublished)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#68736D] hover:text-[#164A35] transition-colors"
            title={row.isPublished ? 'Unpublish Course' : 'Publish Live'}
          >
            {row.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleToggleFeature(row._id, row.isFeatured)}
            className={`p-1.5 rounded-[6px] hover:bg-[#FAF8F2] transition-colors ${
              row.isFeatured ? 'text-[#C5A55A]' : 'text-[#68736D]'
            }`}
            title={row.isFeatured ? 'Unfeature' : 'Feature on Homepage'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#164A35] hover:text-[#103728] transition-colors"
            title="Edit Course"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setCourseToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Course"
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
          <h2 className="text-xl font-bold text-[#164A35]">Courses Management</h2>
          <p className="text-xs text-[#68736D]">
            Manage academic programs, streams, duration, and curriculum highlights.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Course
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={courses}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search courses..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Edit Course Details' : 'Add New Academic Course'}
        subtitle="Manage program name, target class, duration, and key curriculum inclusions."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <p className="text-xs text-[#C94A4A] font-semibold bg-[#C94A4A]/10 p-2.5 rounded-[8px]">
              {formError}
            </p>
          )}

          <Input
            label="Course / Program Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. JEE Main & Advanced Integrated Program"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Coaching', 'School', 'Integrated', 'Foundation']}
            />

            <Select
              label="Target Class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              options={['Primary (Nursery-5th)', '6th-8th', '9th-10th', '11th', '12th', '12th Pass']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 2 Academic Years"
            />

            <Input
              label="Eligibility"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              placeholder="e.g. Class 10th Passed"
            />
          </div>

          <Input
            label="Short Summary"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Brief tagline for course cards..."
          />

          <Textarea
            label="Comprehensive Description & Syllabus"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="Key Features (One feature per line)"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={3}
          />

          <AdminFileUpload
            file={imageFile}
            setFile={setImageFile}
            existingUrl={editingCourse?.image?.url}
            label="Course Cover Image"
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
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Course?"
        message={`Are you sure you want to delete '${courseToDelete?.title}'? This will remove the course from the catalog.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CoursesAdminPage;
