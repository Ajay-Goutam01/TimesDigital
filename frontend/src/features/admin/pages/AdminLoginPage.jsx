import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { useLoginMutation } from '../../auth/services/authApi';
import { useAuth } from '../../auth/hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AdminLoginPage = () => {
  useDocumentTitle('Admin Portal Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { isAuthenticated, mustChangePassword } = useAuth();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      if (mustChangePassword) {
        navigate('/admin/change-password', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, mustChangePassword, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your administrative email and password.');
      return;
    }

    try {
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      const admin = res?.data?.admin || res?.data;
      showToast(`Welcome back, ${admin?.name || 'Admin'}!`, 'success');

      if (admin?.mustChangePassword) {
        navigate('/admin/change-password', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err?.data?.message || 'Invalid email or administrative password.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-[24px] border border-[#E5E1D7] shadow-lg p-8 sm:p-10 space-y-6 text-center">
        {/* Brand Logo Header */}
        <div className="flex justify-center pb-2">
          <BrandLogo />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#164A35]">
            Administrative Portal
          </h2>
          <p className="text-xs text-[#68736D]">
            Sign in to manage website CMS, admissions, and CRM leads.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-[12px] bg-[#C94A4A]/10 border border-[#C94A4A]/30 text-xs text-[#C94A4A] flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            label="Admin Email Address"
            type="email"
            placeholder="admin@timesdigital.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full mt-2"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-[#E5E1D7] text-xs text-[#68736D]">
          <p>Protected administrative console. Authorized staff access only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
