import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Award, GraduationCap } from 'lucide-react';
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
  useGetAdminFacultyQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useTogglePublishFacultyMutation,
  useToggleFeatureFacultyMutation,
  useDeleteFacultyMutation,
} from '../../faculty/services/facultyApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const FacultyAdminPage = () => {
  useDocumentTitle('Faculty Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    designation: 'Senior Faculty & HOD',
    subject: 'Physics',
    category: 'Coaching',
    experienceYears: '12',
    qualification: 'B.Tech / M.Sc',
    specialization: 'Mechanics & Electrodynamics for JEE Advanced',
    bio: '',
    isExKota: true,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminFacultyQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const facultyList = data?.data?.faculty || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: facultyList.length };

  const [createFaculty, { isLoading: isCreating }] = useCreateFacultyMutation();
  const [updateFaculty, { isLoading: isUpdating }] = useUpdateFacultyMutation();
  const [togglePublish] = useTogglePublishFacultyMutation();
  const [toggleFeature] = useToggleFeatureFacultyMutation();
  const [deleteFaculty, { isLoading: isDeleting }] = useDeleteFacultyMutation();

  const handleOpenCreate = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      designation: 'Senior Faculty & HOD',
      subject: 'Physics',
      category: 'Coaching',
      experienceYears: '12',
      qualification: 'B.Tech (IIT/NIT) / M.Sc',
      specialization: 'Advanced Problem Solving & National Exam Pedagogy',
      bio: 'Brings over a decade of experience training top rankers for IIT-JEE and NEET with exceptional conceptual depth.',
      isExKota: true,
    });
    setPhotoFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name || '',
      designation: faculty.designation || '',
      subject: faculty.subject || 'Physics',
      category: faculty.category || 'Coaching',
      experienceYears: faculty.experienceYears?.toString() || '',
      qualification: faculty.qualification || '',
      specialization: faculty.specialization || '',
      bio: faculty.bio || '',
      isExKota: !!faculty.isExKota,
    });
    setPhotoFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.subject.trim()) {
      setFormError('Mentor name and subject are required.');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('designation', formData.designation);
    payload.append('subject', formData.subject);
    payload.append('category', formData.category);
    if (formData.experienceYears) {
      payload.append('experienceYears', formData.experienceYears);
    }
    if (formData.qualification) payload.append('qualification', formData.qualification);
    if (formData.specialization) payload.append('specialization', formData.specialization);
    if (formData.bio) payload.append('bio', formData.bio);
    payload.append('isExKota', formData.isExKota);

    if (photoFile) payload.append('profilePhoto', photoFile);

    try {
      if (editingFaculty) {
        await updateFaculty({ id: editingFaculty._id, formData: payload }).unwrap();
        showToast('Faculty profile updated successfully!', 'success');
      } else {
        await createFaculty(payload).unwrap();
        showToast('New faculty mentor added successfully!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save faculty.');
      showToast(err?.data?.message || 'Failed to save faculty.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!facultyToDelete) return;
    try {
      await deleteFaculty({ id: facultyToDelete._id }).unwrap();
      showToast(`'${facultyToDelete.name}' profile deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setFacultyToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete faculty.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Profile ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleFeature(id).unwrap();
      showToast(`Faculty ${currentStatus ? 'unfeatured' : 'featured on homepage'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle featured.', 'error');
    }
  };

  const columns = [
    {
      header: 'Faculty Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.profilePhoto?.url && (
            <img
              src={row.profilePhoto.url}
              alt=""
              className="w-10 h-10 object-cover rounded-full border border-[#E5E1D7]"
            />
          )}
          <div>
            <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.name}</p>
            <span className="text-[11px] text-[#68736D] block">
              {row.designation} • {row.subject}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Experience',
      render: (row) => (
        <span className="text-xs font-semibold">
          {row.experienceYears ? `${row.experienceYears}+ Yrs` : '—'}
        </span>
      ),
    },
    {
      header: 'Ex-Kota',
      render: (row) =>
        row.isExKota ? (
          <Badge variant="gold" size="sm">
            Ex-Kota
          </Badge>
        ) : (
          <span className="text-xs text-[#68736D]">Standard</span>
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
            title="Edit Faculty"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setFacultyToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Faculty"
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
          <h2 className="text-xl font-bold text-[#164A35]">Faculty Profiles Management</h2>
          <p className="text-xs text-[#68736D]">
            Manage teacher profiles, subject expertise, Kota credentials, and biographies.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Faculty
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={facultyList}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search faculty..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty Profile' : 'Add New Faculty Member'}
        subtitle="Manage subject specialization, educational background, and portrait photo."
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
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Arjun Sharma"
              required
            />

            <Input
              label="Designation / Role"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Senior Faculty & HOD"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Primary Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              options={['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Social Science', 'Computer Science']}
            />

            <Select
              label="Division Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={['Coaching', 'School', 'Foundation']}
            />

            <Input
              label="Experience (Years)"
              type="number"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
              placeholder="10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Educational Qualifications"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. B.Tech (IIT Bombay) / M.Sc"
            />

            <Input
              label="Specialization Topic"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              placeholder="e.g. Organic Chemistry for JEE Advanced"
            />
          </div>

          <Textarea
            label="Biography & Pedagogical Track Record"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
          />

          <label className="flex items-center gap-2 text-xs font-bold text-[#17231D] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isExKota}
              onChange={(e) => setFormData({ ...formData, isExKota: e.target.checked })}
              className="w-4 h-4 text-[#164A35] rounded"
            />
            <span>Highlight as Ex-Kota Faculty Mentor</span>
          </label>

          <AdminFileUpload
            file={photoFile}
            setFile={setPhotoFile}
            existingUrl={editingFaculty?.profilePhoto?.url}
            label="Faculty Portrait Photo (4:5 Ratio Recommended)"
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
              {editingFaculty ? 'Save Changes' : 'Add Faculty'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Faculty Profile?"
        message={`Are you sure you want to delete '${facultyToDelete?.name}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default FacultyAdminPage;
