import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Trophy, Award } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AdminFileUpload } from '../components/AdminFileUpload';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetAdminResultsQuery,
  useCreateResultMutation,
  useUpdateResultMutation,
  useTogglePublishResultMutation,
  useToggleFeatureResultMutation,
  useDeleteResultMutation,
} from '../../results/services/resultApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const ResultsAdminPage = () => {
  useDocumentTitle('Results & Rankers Management');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);
  const [editingResult, setEditingResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    exam: 'JEE Advanced',
    year: '2024',
    rank: 'AIR 142',
    percentile: '99.85',
    score: '310/360',
    collegeAllotted: 'IIT Bombay (Computer Science)',
    achievementTitle: 'Top District Ranker in JEE Advanced',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminResultsQuery({
    page,
    limit: 10,
    search: search || undefined,
  });

  const results = data?.data?.results || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: results.length };

  const [createResult, { isLoading: isCreating }] = useCreateResultMutation();
  const [updateResult, { isLoading: isUpdating }] = useUpdateResultMutation();
  const [togglePublish] = useTogglePublishResultMutation();
  const [toggleFeature] = useToggleFeatureResultMutation();
  const [deleteResult, { isLoading: isDeleting }] = useDeleteResultMutation();

  const handleOpenCreate = () => {
    setEditingResult(null);
    setFormData({
      studentName: '',
      exam: 'JEE Advanced',
      year: new Date().getFullYear().toString(),
      rank: 'AIR ',
      percentile: '',
      score: '',
      collegeAllotted: '',
      achievementTitle: '',
    });
    setPhotoFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditingResult(res);
    setFormData({
      studentName: res.studentName || '',
      exam: res.exam || 'JEE Advanced',
      year: res.year?.toString() || new Date().getFullYear().toString(),
      rank: res.rank || '',
      percentile: res.percentile || '',
      score: res.score || '',
      collegeAllotted: res.collegeAllotted || '',
      achievementTitle: res.achievementTitle || '',
    });
    setPhotoFile(null);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.studentName.trim() || !formData.exam.trim()) {
      setFormError('Student name and exam category are required.');
      return;
    }

    const payload = new FormData();
    payload.append('studentName', formData.studentName.trim());
    payload.append('exam', formData.exam);
    payload.append('year', formData.year);
    if (formData.rank) payload.append('rank', formData.rank);
    if (formData.percentile) payload.append('percentile', formData.percentile);
    if (formData.score) payload.append('score', formData.score);
    if (formData.collegeAllotted) payload.append('collegeAllotted', formData.collegeAllotted);
    if (formData.achievementTitle) payload.append('achievementTitle', formData.achievementTitle);

    if (photoFile) payload.append('studentPhoto', photoFile);

    try {
      if (editingResult) {
        await updateResult({ id: editingResult._id, formData: payload }).unwrap();
        showToast('Ranker details updated successfully!', 'success');
      } else {
        await createResult(payload).unwrap();
        showToast('Hall of fame ranker added successfully!', 'success');
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save result.');
      showToast(err?.data?.message || 'Failed to save result.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!resultToDelete) return;
    try {
      await deleteResult({ id: resultToDelete._id }).unwrap();
      showToast(`'${resultToDelete.studentName}' record deleted.`, 'success');
      setDeleteConfirmOpen(false);
      setResultToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to delete result.', 'error');
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await togglePublish(id).unwrap();
      showToast(`Record ${currentStatus ? 'unpublished' : 'published live'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  const handleToggleFeature = async (id, currentStatus) => {
    try {
      await toggleFeature(id).unwrap();
      showToast(`Ranker ${currentStatus ? 'unfeatured' : 'featured on homepage'}.`, 'success');
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to toggle featured.', 'error');
    }
  };

  const columns = [
    {
      header: 'Student & Exam',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.studentPhoto?.url && (
            <img
              src={row.studentPhoto.url}
              alt=""
              className="w-10 h-10 object-cover rounded-full border border-[#E5E1D7]"
            />
          )}
          <div>
            <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.studentName}</p>
            <span className="text-[11px] text-[#68736D] block">
              {row.exam} {row.year}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rank / Score',
      render: (row) => (
        <div>
          <span className="font-bold text-[#164A35] text-xs block">
            {row.rank || row.percentile ? `${row.percentile}%ile` : '—'}
          </span>
          {row.collegeAllotted && (
            <span className="text-[11px] text-[#68736D] truncate block max-w-xs">
              {row.collegeAllotted}
            </span>
          )}
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
            title="Edit Result"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setResultToDelete(row);
              setDeleteConfirmOpen(true);
            }}
            className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
            title="Delete Result"
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
          <h2 className="text-xl font-bold text-[#164A35]">Hall of Fame & Rankers</h2>
          <p className="text-xs text-[#68736D]">
            Manage student rankers, exam percentiles, colleges allotted, and student photos.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Ranker
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={results}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search rankers..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingResult ? 'Edit Ranker Record' : 'Add New Hall of Fame Ranker'}
        subtitle="Manage exam scores, national rank, college allotted, and passport photo."
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
              label="Student Name"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              required
            />

            <Select
              label="Exam Stream"
              value={formData.exam}
              onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
              options={['JEE Advanced', 'JEE Main', 'NEET-UG', 'CBSE Class 12th', 'CBSE Class 10th', 'Olympiad']}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Exam Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2024"
            />

            <Input
              label="Rank Secured"
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              placeholder="e.g. AIR 142"
            />

            <Input
              label="Score / Percentile"
              value={formData.percentile}
              onChange={(e) => setFormData({ ...formData, percentile: e.target.value })}
              placeholder="e.g. 99.85 %ile"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="College Allotted"
              value={formData.collegeAllotted}
              onChange={(e) => setFormData({ ...formData, collegeAllotted: e.target.value })}
              placeholder="e.g. IIT Bombay (CSE) or AIIMS Bhopal"
            />

            <Input
              label="Achievement Headline"
              value={formData.achievementTitle}
              onChange={(e) => setFormData({ ...formData, achievementTitle: e.target.value })}
              placeholder="e.g. District Rank 1 in Shahdol"
            />
          </div>

          <AdminFileUpload
            file={photoFile}
            setFile={setPhotoFile}
            existingUrl={editingResult?.studentPhoto?.url}
            label="Student Passport Photo (Square / 1:1 Recommended)"
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
              {editingResult ? 'Save Changes' : 'Publish Ranker'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Ranker Record?"
        message={`Are you sure you want to delete '${resultToDelete?.studentName}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ResultsAdminPage;
