import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useChangePasswordMutation } from '../../auth/services/authApi';
import { useToast } from '../../../components/ui/Toast';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AdminChangePasswordPage = () => {
  useDocumentTitle('Account Security & Password');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      showToast('Password updated successfully! Welcome to dashboard.', 'success');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.data?.message || 'Failed to update password. Verify current password.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-8 sm:p-10 rounded-[24px] border border-[#E5E1D7] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E5E1D7] pb-4">
          <div className="w-10 h-10 rounded-[12px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#C5A55A]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#164A35]">
              Change Account Password
            </h2>
            <p className="text-xs text-[#68736D]">
              Update your administrative credentials for secure dashboard access.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-[12px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs text-[#C94A4A] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current / Temporary Password"
            type="password"
            placeholder="••••••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Secure Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={ShieldCheck}
              className="w-full"
            >
              Update Password & Access Dashboard
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePasswordPage;
