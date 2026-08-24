import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Play, Video as VideoIcon } from 'lucide-react';
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
  useGetAdminVideosQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useTogglePublishVideoMutation,
  useToggleFeatureVideoMutation,
  useDeleteVideoMutation,
} from '../../videos/services/videoApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const VideosAdminPage = () => {
  useDocumentTitle('Videos Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Masterclass',
    videoUrl: '',
    youtubeId: '',
    description: '',
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminVideosQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const videos = data?.data?.videos || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: videos.length };

  const [createVideo, { isLoading: isCreating }] = useCreateVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();
  const [togglePublish] = useTogglePublishVideoMutation();
  const [toggleFeature] = useToggleFeatureVideoMutation();
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMutation();

  const handleOpenCreate = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      category: 'Masterclass',
      videoUrl: '',
      youtubeId: '',
      description: '',
    });
    setThumbnailFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (vid) => {
    setEditingVideo(vid);
    setFormData({
      title: vid.title || '',
      category: vid.category || 'Masterclass',
      videoUrl: vid.videoUrl || '',
      youtubeId: vid.youtubeId || '',
      description: vid.description || '',
    });
    setThumbnailFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || (!formData.videoUrl.trim() && !formData.youtubeId.trim())) {
      setFormError('Video title and URL/YouTube ID are required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('category', formData.category);
    if (formData.videoUrl) payload.append('videoUrl', formData.videoUrl.trim());
    if (formData.youtubeId) payload.append('youtubeId', formData.youtubeId.trim());
    if (formData.description) payload.append('description', formData.description);

    if (thumbnailFile) payload.append('thumbnail', thumbnailFile);

    try {
      if (editingVideo) {
        await updateVideo({ id: editingVideo._id, formData: payload }).unwrap();
        showToast('Video details updated successfully!', 'success');
      } else {
        await createVideo(payload).unwrap();
        showToast('New video added to library!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save video.');
      showToast(err?.data?.message || 'Failed to save video.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;
    try {
      await deleteVideo({ id: videoToDelete._id }).unwrap();
      showToast(`'${videoToDelete.title}' deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setVideoToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete video.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Video ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleFeature(id).unwrap();
      showToast(`Video ${currentStatus ? 'unfeatured' : 'featured on homepage'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle featured.', 'error');
    }
  };

  const columns = [
    {
      header: 'Video Title & Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail?.url && (
            <img
              src={row.thumbnail.url}
              alt=""
              className="w-12 h-8 object-cover rounded-[6px] border border-[#E5E1D7]"
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
      header: 'Source',
      render: (row) => (
        <span className="text-xs font-mono text-[#164A35]">
          {row.youtubeId ? `YouTube (${row.youtubeId})` : 'Direct URL'}
        </span>
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
            title="Edit Video"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setVideoToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Video"
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
          <h2 className="text-xl font-bold text-[#164A35]">Videos Library Management</h2>
          <p className="text-xs text-[#68736D]">
            Manage YouTube masterclasses, campus walkthroughs, and topper reaction clips.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Video
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={videos}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search videos..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVideo ? 'Edit Video Details' : 'Add New Video Clip'}
        subtitle="Provide YouTube link or direct video URL and custom thumbnail image."
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
              label="Video Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Physics Masterclass: Electrodynamics"
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Masterclass', 'Campus Tour', 'Toppers', 'Events', 'Counseling']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="YouTube Video Link / URL"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />

            <Input
              label="Or YouTube Video ID"
              value={formData.youtubeId}
              onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
              placeholder="e.g. dQw4w9WgXcQ"
            />
          </div>

          <Textarea
            label="Video Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />

          <AdminFileUpload
            file={thumbnailFile}
            setFile={setThumbnailFile}
            existingUrl={editingVideo?.thumbnail?.url}
            label="Custom Video Thumbnail (16:9 Aspect Ratio Recommended)"
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
              {editingVideo ? 'Save Changes' : 'Add Video'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Video?"
        message={`Are you sure you want to delete '${videoToDelete?.title}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default VideosAdminPage;
