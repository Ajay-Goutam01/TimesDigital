import React, { useState } from 'react';
import { Plus, Trash2, KeyRound, ShieldCheck, UserCog, AlertCircle } from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
} from '../services/adminDashboardApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AdminUsersPage = () => {
  useDocumentTitle('Admin Users & Security');
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });
  const [formError, setFormError] = useState('');

  const { data, isLoading, refetch } = useGetAdminUsersQuery();
  const users = data?.data?.users || data?.data || [];

  const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setFormError('Name, email, and temporary password are required.');
      return;
    }

    try {
      await createUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      }).unwrap();

      showToast(`Admin staff account created for '${formData.name}'!`, 'success');
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to create admin user.');
      showToast(err?.data?.message || 'Failed to create admin user.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete._id).unwrap();
      showToast(`Account for '${userToDelete.name}' revoked.`, 'success');
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to revoke user access.', 'error');
    }
  };

  const columns = [
    {
      header: 'Admin Name & Email',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#164A35] text-[#C5A55A] flex items-center justify-center font-bold text-xs">
            {row.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.name}</p>
            <span className="text-[11px] text-[#68736D] block font-mono">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      render: (row) => (
        <Badge variant={row.role === 'superadmin' ? 'gold' : 'dark'} size="sm">
          {row.role === 'superadmin' ? 'Super Administrator' : 'Staff Admin'}
        </Badge>
      ),
    },
    {
      header: 'Password Status',
      render: (row) => (
        <span className="text-xs text-[#68736D]">
          {row.mustChangePassword ? 'Temporary (Must Change)' : 'Active Password'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.role !== 'superadmin' && (
            <button
              type="button"
              onClick={() => {
                setUserToDelete(row);
                setDeleteConfirmOpen(true);
              }}
              className="p-1.5 rounded-[6px] hover:bg-[#C94A4A]/10 text-[#C94A4A] transition-colors"
              title="Revoke Admin Access"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#164A35]">Admin User Accounts</h2>
          <p className="text-xs text-[#68736D]">
            Manage staff credentials, grant administrative privileges, and revoke console access.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenCreate}>
          Add Admin User
        </Button>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        isLoading={isLoading}
      />

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Admin Staff Account"
        subtitle="Provide employee name, official email, and temporary initial password."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <p className="text-xs text-[#C94A4A] font-semibold bg-[#C94A4A]/10 p-2.5 rounded-[8px]">
              {formError}
            </p>
          )}

          <Input
            label="Staff Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            required
          />

          <Input
            label="Official Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. rahul@timesdigital.in"
            required
          />

          <Input
            label="Temporary Initial Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Minimum 8 characters"
            required
          />

          <Select
            label="Role Privileges"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { label: 'Staff Admin', value: 'admin' },
              { label: 'Super Administrator', value: 'superadmin' },
            ]}
          />

          <div className="pt-3 border-t border-[#E5E1D7] flex items-center justify-end gap-3">
            <Button variant="ghost" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isCreating}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Revoke Admin Access?"
        message={`Are you sure you want to revoke administrative access for '${userToDelete?.name}'?`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminUsersPage;
