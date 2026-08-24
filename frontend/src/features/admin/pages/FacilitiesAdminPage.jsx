import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Building2 } from 'lucide-react';
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
  useGetAdminFacilitiesQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useTogglePublishFacilityMutation,
  useDeleteFacilityMutation,
} from '../../facilities/services/facilityApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const FacilitiesAdminPage = () => {
  useDocumentTitle('Campus Facilities Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [facilityToDelete, setFacilityToDelete] = useState(null);
  const [editingFacility, setEditingFacility] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    description: '',
    features: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminFacilitiesQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const facilities = data?.data?.facilities || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: facilities.length };

  const [createFacility, { isLoading: isCreating }] = useCreateFacilityMutation();
  const [updateFacility, { isLoading: isUpdating }] = useUpdateFacilityMutation();
  const [togglePublish] = useTogglePublishFacilityMutation();
  const [deleteFacility, { isLoading: isDeleting }] = useDeleteFacilityMutation();

  const handleOpenCreate = () => {
    setEditingFacility(null);
    setFormData({
      title: '',
      category: 'Academic',
      description: '',
      features: 'Interactive Smart Panels\nAir-Conditioned & Ergonomic Seating\nHigh-Speed Digital Connectivity',
    });
    setImageFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setEditingFacility(fac);
    setFormData({
      title: fac.title || '',
      category: fac.category || 'Academic',
      description: fac.description || '',
      features: Array.isArray(fac.features) ? fac.features.join('\n') : fac.features || '',
    });
    setImageFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Facility title and description are required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('category', formData.category);
    payload.append('description', formData.description);

    const feats = formData.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    feats.forEach((f) => payload.append('features', f));

    if (imageFile) payload.append('images', imageFile);

    try {
      if (editingFacility) {
        await updateFacility({ id: editingFacility._id, formData: payload }).unwrap();
        showToast('Facility details updated successfully!', 'success');
      } else {
        await createFacility(payload).unwrap();
        showToast('Campus facility added successfully!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save facility.');
      showToast(err?.data?.message || 'Failed to save facility.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!facilityToDelete) return;
    try {
      await deleteFacility({ id: facilityToDelete._id }).unwrap();
      showToast(`'${facilityToDelete.title}' deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setFacilityToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete facility.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Facility ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const columns = [
    {
      header: 'Facility Name & Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0]?.url && (
            <img
              src={row.images[0].url}
              alt=""
              className="w-10 h-10 object-cover rounded-[8px] border border-[#E5E1D7]"
            />
          )}
          <div>
            <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.title}</p>
            <span className="text-[11px] text-[#68736D] block">
              {row.category}
            </span>
          </div>
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
            title="Edit Facility"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setFacilityToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Facility"
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
          <h2 className="text-xl font-bold text-[#164A35]">Campus Facilities Management</h2>
          <p className="text-xs text-[#68736D]">
            Manage classrooms, science labs, libraries, hostel wings, and student amenities.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Facility
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={facilities}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search facilities..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFacility ? 'Edit Facility Details' : 'Add Campus Facility'}
        subtitle="Manage facility infrastructure highlights, specifications, and photographs."
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
              label="Facility Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Interactive Smart Classrooms"
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Academic', 'Laboratories', 'Library', 'Sports', 'Hostel', 'Campus']}
            />
          </div>

          <Textarea
            label="Detailed Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="Equipment & Features (One per line)"
            value={formData.features}
            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
            rows={3}
          />

          <AdminFileUpload
            file={imageFile}
            setFile={setImageFile}
            existingUrl={editingFacility?.images?.[0]?.url}
            label="Facility Photograph (4:3 / 16:9 Aspect Ratio)"
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
              {editingFacility ? 'Save Changes' : 'Add Facility'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Facility?"
        message={`Are you sure you want to delete '${facilityToDelete?.title}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FacilitiesAdminPage;
