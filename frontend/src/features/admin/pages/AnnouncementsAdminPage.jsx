import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Bell, FileText, Calendar } from 'lucide-react';
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
  useGetAdminAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useTogglePublishAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from '../../announcements/services/announcementApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AnnouncementsAdminPage = () => {
  useDocumentTitle('Announcements Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    priority: 'normal',
    publishDate: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminAnnouncementsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const announcements = data?.data?.announcements || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: announcements.length };

  const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();
  const [togglePublish] = useTogglePublishAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setFormData({
      title: '',
      priority: 'normal',
      publishDate: new Date().toISOString().split('T')[0],
      description: '',
    });
    setAttachmentFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingAnnouncement(item);
    setFormData({
      title: item.title || '',
      priority: item.priority || 'normal',
      publishDate: item.publishDate ? new Date(item.publishDate).toISOString().split('T')[0] : '',
      description: item.description || '',
    });
    setAttachmentFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Circular headline and description are required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('priority', formData.priority);
    if (formData.publishDate) payload.append('publishDate', formData.publishDate);
    payload.append('description', formData.description.trim());

    if (attachmentFile) payload.append('attachment', attachmentFile);

    try {
      if (editingAnnouncement) {
        await updateAnnouncement({ id: editingAnnouncement._id, formData: payload }).unwrap();
        showToast('Circular notice updated successfully!', 'success');
      } else {
        await createAnnouncement(payload).unwrap();
        showToast('New announcement published live!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save announcement.');
      showToast(err?.data?.message || 'Failed to save announcement.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;
    try {
      await deleteAnnouncement({ id: announcementToDelete._id }).unwrap();
      showToast(`'${announcementToDelete.title}' deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setAnnouncementToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete announcement.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Notice ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const columns = [
    {
      header: 'Notice Title',
      render: (row) => (
        <div className="space-y-0.5">
          <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.title}</p>
          <span className="text-[11px] text-[#68736D] line-clamp-1">
            {row.description}
          </span>
        </div>
      ),
    },
    {
      header: 'Priority',
      render: (row) => (
        <Badge variant={row.priority === 'urgent' ? 'danger' : 'green'} size="sm">
          {row.priority === 'urgent' ? 'Urgent' : 'Normal'}
        </Badge>
      ),
    },
    {
      header: 'Publish Date',
      render: (row) => (
        <span className="text-xs">
          {row.publishDate
            ? new Date(row.publishDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      header: 'Attachment',
      render: (row) =>
        row.attachment?.url ? (
          <a
            href={row.attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#164A35] hover:underline flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-[#C5A55A]" />
            <span>PDF File</span>
          </a>
        ) : (
          <span className="text-xs text-[#68736D]">—</span>
        ),
    },
    {
      header: 'Visibility',
      render: (row) => (
        <Badge variant={row.isPublished ? 'success' : 'cream'} size="sm">
          {row.isPublished ? 'Live' : 'Draft'}
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
            title="Edit Notice"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setAnnouncementToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Notice"
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
          <h2 className="text-xl font-bold text-[#164A35]">Circulars & Announcements</h2>
          <p className="text-xs text-[#68736D]">
            Publish official notices, examination schedules, and downloadable circular PDFs.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          New Circular
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={announcements}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notices..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAnnouncement ? 'Edit Circular Notice' : 'Publish New Circular'}
        subtitle="Manage announcement title, priority ticker alert, and optional PDF document."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <p className="text-xs text-[#C94A4A] font-semibold bg-[#C94A4A]/10 p-2.5 rounded-[8px]">
              {formError}
            </p>
          )}

          <Input
            label="Notice Headline"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Admissions Open for Session 2025–26"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Priority Ticker Level"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { label: 'Normal Circular', value: 'normal' },
                { label: 'Urgent Red Banner', value: 'urgent' },
              ]}
            />

            <Input
              label="Publish Date"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
            />
          </div>

          <Textarea
            label="Notice Description / Body"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <AdminFileUpload
            file={attachmentFile}
            setFile={setAttachmentFile}
            existingUrl={editingAnnouncement?.attachment?.url}
            label="Upload Circular PDF Attachment (Optional)"
            accept="application/pdf,image/*"
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
              {editingAnnouncement ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Announcement?"
        message={`Are you sure you want to delete '${announcementToDelete?.title}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AnnouncementsAdminPage;
