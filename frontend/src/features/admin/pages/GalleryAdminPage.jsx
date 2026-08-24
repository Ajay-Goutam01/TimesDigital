import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Images, ImagePlus, X } from 'lucide-react';
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
  useGetAdminGalleryAlbumsQuery,
  useCreateGalleryAlbumMutation,
  useUpdateGalleryAlbumMutation,
  useTogglePublishGalleryAlbumMutation,
  useToggleFeatureGalleryAlbumMutation,
  useDeleteGalleryAlbumMutation,
} from '../../gallery/services/galleryApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const GalleryAdminPage = () => {
  useDocumentTitle('Gallery Albums Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Events',
    description: '',
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [albumImageFiles, setAlbumImageFiles] = useState([]);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminGalleryAlbumsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const albums = data?.data?.albums || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: albums.length };

  const [createAlbum, { isLoading: isCreating }] = useCreateGalleryAlbumMutation();
  const [updateAlbum, { isLoading: isUpdating }] = useUpdateGalleryAlbumMutation();
  const [togglePublish] = useTogglePublishGalleryAlbumMutation();
  const [toggleFeature] = useToggleFeatureGalleryAlbumMutation();
  const [deleteAlbum, { isLoading: isDeleting }] = useDeleteGalleryAlbumMutation();

  const handleOpenCreate = () => {
    setEditingAlbum(null);
    setFormData({
      title: '',
      category: 'Events',
      description: '',
    });
    setCoverImageFile(null);
    setAlbumImageFiles([]);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (album) => {
    setEditingAlbum(album);
    setFormData({
      title: album.title || '',
      category: album.category || 'Events',
      description: album.description || '',
    });
    setCoverImageFile(null);
    setAlbumImageFiles([]);
    setFormError('');
    setModalOpen(true);
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + albumImageFiles.length > 20) {
      setFormError('You can upload a maximum of 20 images per album.');
      return;
    }
    setAlbumImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImageFile = (index) => {
    setAlbumImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Album title is required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('category', formData.category);
    if (formData.description) payload.append('description', formData.description);

    if (coverImageFile) payload.append('coverImage', coverImageFile);

    albumImageFiles.forEach((file) => {
      payload.append('images', file);
    });

    try {
      if (editingAlbum) {
        await updateAlbum({ id: editingAlbum._id, formData: payload }).unwrap();
        showToast('Gallery album updated successfully!', 'success');
      } else {
        await createAlbum(payload).unwrap();
        showToast('New photo album created successfully!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save album.');
      showToast(err?.data?.message || 'Failed to save album.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!albumToDelete) return;
    try {
      await deleteAlbum({ id: albumToDelete._id }).unwrap();
      showToast(`'${albumToDelete.title}' album deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setAlbumToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete album.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Album ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleFeature(id).unwrap();
      showToast(`Album ${currentStatus ? 'unfeatured' : 'featured on homepage'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle featured.', 'error');
    }
  };

  const columns = [
    {
      header: 'Album Title & Category',
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
              {row.category} • {row.images?.length || 0} Photos
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Photos',
      render: (row) => (
        <span className="text-xs font-semibold text-[#164A35]">
          {row.images?.length || 0} Images
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
            title="Edit Album"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setAlbumToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Album"
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
          <h2 className="text-xl font-bold text-[#164A35]">Gallery Albums Management</h2>
          <p className="text-xs text-[#68736D]">
            Create photo albums, upload event photographs, and curate campus media moments.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Create Album
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={albums}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search albums..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAlbum ? 'Edit Photo Album' : 'Create New Photo Album'}
        subtitle="Manage album cover photo, event description, and batch image uploads."
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
              label="Album Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Annual Sports Extravaganza 2024"
              required
            />

            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Events', 'Campus', 'Academics', 'Sports', 'Celebrations']}
            />
          </div>

          <Textarea
            label="Album Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            placeholder="Brief story or highlights of the photographs..."
          />

          <AdminFileUpload
            file={coverImageFile}
            setFile={setCoverImageFile}
            existingUrl={editingAlbum?.coverImage?.url}
            label="Album Cover Photo (16:9 / 4:3 Recommended)"
          />

          {/* Multiple Images Upload Box */}
          <div className="space-y-2 pt-2 border-t border-[#E5E1D7]">
            <label className="block text-xs font-bold text-[#17231D]">
              Add Album Photographs (Up to 20 Images)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleMultipleFiles}
              className="w-full text-xs text-[#68736D] file:mr-3 file:py-2 file:px-3.5 file:rounded-[9px] file:border-0 file:text-xs file:font-semibold file:bg-[#164A35]/10 file:text-[#164A35] hover:file:bg-[#164A35]/20 cursor-pointer"
            />

            {albumImageFiles.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                {albumImageFiles.map((file, idx) => (
                  <div key={idx} className="relative rounded-[8px] overflow-hidden border border-[#E5E1D7] group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-16 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImageFile(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
              {editingAlbum ? 'Save Changes' : 'Create Album'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Photo Album?"
        message={`Are you sure you want to delete '${albumToDelete?.title}'? All contained images will be removed.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default GalleryAdminPage;
