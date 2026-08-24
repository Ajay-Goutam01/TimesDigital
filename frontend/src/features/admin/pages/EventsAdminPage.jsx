import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Calendar, Clock, MapPin } from 'lucide-react';
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
  useGetAdminEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useTogglePublishEventMutation,
  useToggleFeatureEventMutation,
  useDeleteEventMutation,
} from '../../events/services/eventApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const EventsAdminPage = () => {
  useDocumentTitle('Events Calendar Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    startDate: '',
    time: '10:00 AM - 01:00 PM',
    venue: 'Main Campus Auditorium, Shahdol',
    shortDescription: '',
    description: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminEventsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const events = data?.data?.events || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: events.length };

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [togglePublish] = useTogglePublishEventMutation();
  const [toggleFeature] = useToggleFeatureEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      category: 'Academic',
      startDate: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 01:00 PM',
      venue: 'Main Campus Auditorium, Shahdol',
      shortDescription: '',
      description: '',
    });
    setCoverFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || '',
      category: evt.category || 'Academic',
      startDate: evt.startDate ? new Date(evt.startDate).toISOString().split('T')[0] : '',
      time: evt.time || '',
      venue: evt.venue || '',
      shortDescription: evt.shortDescription || '',
      description: evt.description || '',
    });
    setCoverFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Event title and description are required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('category', formData.category);
    if (formData.startDate) payload.append('startDate', formData.startDate);
    if (formData.time) payload.append('time', formData.time);
    if (formData.venue) payload.append('venue', formData.venue);
    if (formData.shortDescription) payload.append('shortDescription', formData.shortDescription);
    payload.append('description', formData.description);

    if (coverFile) payload.append('coverImage', coverFile);

    try {
      if (editingEvent) {
        await updateEvent({ id: editingEvent._id, formData: payload }).unwrap();
        showToast('Event details updated successfully!', 'success');
      } else {
        await createEvent(payload).unwrap();
        showToast('New event scheduled live on calendar!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save event.');
      showToast(err?.data?.message || 'Failed to save event.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent({ id: eventToDelete._id }).unwrap();
      showToast(`'${eventToDelete.title}' deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete event.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Event ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleFeature(id).unwrap();
      showToast(`Event ${currentStatus ? 'unfeatured' : 'featured on homepage'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle featured.', 'error');
    }
  };

  const columns = [
    {
      header: 'Event Title & Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage?.url && (
            <img
              src={row.coverImage.url}
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
      header: 'Schedule & Venue',
      render: (row) => (
        <div>
          <span className="font-bold text-[#164A35] text-xs block">
            {row.startDate
              ? new Date(row.startDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </span>
          <span className="text-[11px] text-[#68736D] truncate block max-w-xs">
            {row.venue || 'Campus Auditorium'}
          </span>
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
            title={row.isPublished ? 'Unpublish' : 'Publish'}
          >
            {row.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleToggleFeature(row._id, row.isFeatured)}
            className={`p-1.5 rounded-[6px] hover:bg-[#FAF8F2] transition-colors ${
              row.isFeatured ? 'text-[#C5A55A]' : 'text-[#68736D]'
            }`}
            title={row.isFeatured ? 'Unfeature' : 'Feature'}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#164A35] hover:text-[#103728] transition-colors"
            title="Edit Event"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setEventToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Event"
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
          <h2 className="text-xl font-bold text-[#164A35]">School Events Calendar</h2>
          <p className="text-xs text-[#68736D]">
            Schedule academic seminars, scholarship exams, parent orientations, and science fests.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Schedule Event
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={events}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Schedule New Event'}
        subtitle="Manage event schedule, timing, auditorium venue, and cover photo."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <p className="text-xs text-[#C94A4A] font-semibold bg-[#C94A4A]/10 p-2.5 rounded-[8px]">
              {formError}
            </p>
          )}

          <Input
            label="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Times Talent Scholarship Exam (TTSE)"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Academic', 'Scholarship', 'Competition', 'Celebration', 'Sports']}
            />

            <Input
              label="Event Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Timings"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="10:00 AM - 01:00 PM"
            />

            <Input
              label="Venue / Location"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Main Campus Auditorium, Shahdol"
            />
          </div>

          <Input
            label="Short Summary"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Brief tagline for event cards..."
          />

          <Textarea
            label="Full Event Description & Schedule"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <AdminFileUpload
            file={coverFile}
            setFile={setCoverFile}
            existingUrl={editingEvent?.coverImage?.url}
            label="Event Cover Image (16:9 / 4:3 Recommended)"
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
              {editingEvent ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event?"
        message={`Are you sure you want to delete '${eventToDelete?.title}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EventsAdminPage;
