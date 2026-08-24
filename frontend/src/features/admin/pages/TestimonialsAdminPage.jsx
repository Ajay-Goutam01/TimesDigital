import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, MessageSquareQuote } from 'lucide-react';
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
  useGetAdminTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useTogglePublishTestimonialMutation,
  useDeleteTestimonialMutation,
} from '../../testimonials/services/testimonialApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const TestimonialsAdminPage = () => {
  useDocumentTitle('Testimonials Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'Student',
    studentOrParent: 'Student',
    classOrCourse: 'JEE Advanced Integrated (12th Pass)',
    rating: 5,
    message: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminTestimonialsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const testimonials = data?.data?.testimonials || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: testimonials.length };

  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [togglePublish] = useTogglePublishTestimonialMutation();
  const [deleteTestimonial, { isLoading: isDeleting }] = useDeleteTestimonialMutation();

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: 'Student',
      studentOrParent: 'Student',
      classOrCourse: 'JEE Advanced Integrated',
      rating: 5,
      message: '',
    });
    setPhotoFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      role: item.role || 'Student',
      studentOrParent: item.studentOrParent || 'Student',
      classOrCourse: item.classOrCourse || '',
      rating: item.rating || 5,
      message: item.message || '',
    });
    setPhotoFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.message.trim()) {
      setFormError('Author name and testimonial quote are required.');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('role', formData.role);
    payload.append('studentOrParent', formData.studentOrParent);
    payload.append('classOrCourse', formData.classOrCourse);
    payload.append('rating', formData.rating);
    payload.append('message', formData.message.trim());

    if (photoFile) payload.append('photo', photoFile);

    try {
      if (editingItem) {
        await updateTestimonial({ id: editingItem._id, formData: payload }).unwrap();
        showToast('Testimonial review updated successfully!', 'success');
      } else {
        await createTestimonial(payload).unwrap();
        showToast('Testimonial review published live!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save testimonial.');
      showToast(err?.data?.message || 'Failed to save testimonial.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteTestimonial({ id: itemToDelete._id }).unwrap();
      showToast(`'${itemToDelete.name}' review deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete testimonial.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Testimonial ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const columns = [
    {
      header: 'Author & Review',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo?.url && (
            <img
              src={row.photo.url}
              alt=""
              className="w-10 h-10 object-cover rounded-full border border-[#E5E1D7]"
            />
          )}
          <div>
            <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.name}</p>
            <span className="text-[11px] text-[#68736D] block">
              {row.role || row.studentOrParent} • {row.classOrCourse}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1 text-[#C5A55A]">
          {Array.from({ length: row.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current" />
          ))}
        </div>
      ),
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
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleTogglePublish(row._id, row.isPublished)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#68736D] hover:text-[#164A35] transition-colors"
            title={row.isPublished ? 'Unpublish' : 'Publish'}
          >
            {row.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#164A35] hover:text-[#103728] transition-colors"
            title="Edit Review"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setItemToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Review"
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
          <h2 className="text-xl font-bold text-[#164A35]">Testimonials & Parent Reviews</h2>
          <p className="text-xs text-[#68736D]">
            Manage student feedback, parent appreciation quotes, and star ratings.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Review
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={testimonials}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reviews..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Testimonial' : 'Add New Review'}
        subtitle="Manage author identity, course/class background, star rating, and quote."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <p className="text-xs text-[#C94A4A] font-semibold bg-[#C94A4A]/10 p-2.5 rounded-[8px]">
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Author Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Rajesh Sharma (Parent)"
              required
            />

            <Select
              label="Author Identity"
              value={formData.studentOrParent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  studentOrParent: e.target.value,
                  role: e.target.value,
                })
              }
              options={['Student', 'Parent', 'Alumnus']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Course / Class Association"
              value={formData.classOrCourse}
              onChange={(e) => setFormData({ ...formData, classOrCourse: e.target.value })}
              placeholder="e.g. JEE Advanced 2024 Ranker"
            />

            <Select
              label="Rating (Stars)"
              value={formData.rating.toString()}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              options={[
                { label: '5 Stars (Excellent)', value: '5' },
                { label: '4 Stars (Very Good)', value: '4' },
                { label: '3 Stars (Good)', value: '3' },
              ]}
            />
          </div>

          <Textarea
            label="Testimonial Quote / Feedback"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            placeholder="Write the candid experience and appreciation quote..."
            required
          />

          <AdminFileUpload
            file={photoFile}
            setFile={setPhotoFile}
            existingUrl={editingItem?.photo?.url}
            label="Author Photo (Square / 1:1 Recommended)"
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
              {editingItem ? 'Save Changes' : 'Publish Review'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Testimonial?"
        message={`Are you sure you want to delete '${itemToDelete?.name}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default TestimonialsAdminPage;
