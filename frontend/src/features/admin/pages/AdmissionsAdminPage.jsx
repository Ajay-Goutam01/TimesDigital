import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  GraduationCap,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetAdmissionsQuery,
  useUpdateAdmissionStatusMutation,
} from '../../admissions/services/admissionApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AdmissionsAdminPage = () => {
  useDocumentTitle('Online Admissions Desk');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Status update
  const [newStatus, setNewStatus] = useState('new');
  const [counselorRemarks, setCounselorRemarks] = useState('');

  const { data, isLoading, refetch } = useGetAdmissionsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });

  const admissions = data?.data?.admissions || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: admissions.length };

  const [updateStatus, { isLoading: isUpdating }] = useUpdateAdmissionStatusMutation();

  const handleOpenView = (adm) => {
    setSelectedAdmission(adm);
    setNewStatus(adm.status || 'new');
    setCounselorRemarks('');
    setViewModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedAdmission) return;

    try {
      await updateStatus({
        id: selectedAdmission._id,
        status: newStatus,
        note: counselorRemarks,
      }).unwrap();

      showToast(`Application #${selectedAdmission.applicationNumber || 'REC'} status updated to '${newStatus}'.`, 'success');
      setViewModalOpen(false);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update admission status.', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'converted':
        return <Badge variant="success" size="sm">{status}</Badge>;
      case 'rejected':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      case 'processing':
      case 'contacted':
        return <Badge variant="gold" size="sm">{status}</Badge>;
      default:
        return <Badge variant="dark" size="sm">New</Badge>;
    }
  };

  const columns = [
    {
      header: 'App Number & Student',
      render: (row) => (
        <div>
          <span className="font-mono text-[11px] font-extrabold text-[#164A35] block">
            {row.applicationNumber || 'TPS-REG'}
          </span>
          <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.studentName}</p>
          <span className="text-[11px] text-[#68736D]">
            DOB: {row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString('en-IN') : '—'} • {row.gender || ''}
          </span>
        </div>
      ),
    },
    {
      header: 'Program & Class',
      render: (row) => (
        <div>
          <span className="font-bold text-xs text-[#164A35] block">
            {row.program || row.appliedFor || 'School & Coaching'}
          </span>
          <span className="text-[11px] text-[#68736D]">
            Class {row.applyingForClass || row.appliedClass || '11th'}
          </span>
        </div>
      ),
    },
    {
      header: 'Contact Mobile',
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-[#17231D]">
            {row.fatherName || row.motherName || 'Parent'}
          </p>
          <a
            href={`tel:${row.mobile || row.parentPhone}`}
            className="text-[11px] font-bold text-[#164A35] hover:underline block"
          >
            {row.mobile || row.parentPhone}
          </a>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Submitted On',
      render: (row) => (
        <span className="text-xs text-[#68736D]">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenView(row)}
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#164A35] hover:text-[#103728] transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Review Application"
          >
            <Eye className="w-4 h-4 text-[#C5A55A]" />
            <span>Review</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#164A35]">Online Admissions Desk</h2>
          <p className="text-xs text-[#68736D]">
            Review incoming student registration applications, update status, and manage counseling records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['All', 'new', 'contacted', 'processing', 'approved', 'rejected', 'converted'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#164A35] text-white shadow-xs'
                  : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={admissions}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student name, application number, or mobile..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Review Admission Modal */}
      {selectedAdmission && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Application #${selectedAdmission.applicationNumber || 'REC'}`}
          subtitle={`Student: ${selectedAdmission.studentName}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-xs text-[#17231D]">
            {/* Student & Academic Info */}
            <div className="bg-[#FAF8F2] p-4 rounded-[16px] border border-[#E5E1D7] space-y-3">
              <h4 className="font-bold text-[#164A35] text-sm uppercase tracking-wider">
                1. Student Profile & Program
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#68736D] block">Full Name:</span>
                  <span className="font-bold">{selectedAdmission.studentName}</span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Date of Birth:</span>
                  <span className="font-bold">
                    {selectedAdmission.dateOfBirth
                      ? new Date(selectedAdmission.dateOfBirth).toLocaleDateString('en-IN')
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Gender:</span>
                  <span className="font-bold">{selectedAdmission.gender || 'Male'}</span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Applied Program:</span>
                  <span className="font-bold text-[#164A35]">
                    {selectedAdmission.program || selectedAdmission.appliedFor}
                  </span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Applying for Class:</span>
                  <span className="font-bold">
                    Class {selectedAdmission.applyingForClass || selectedAdmission.appliedClass}
                  </span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Hostel / Transport:</span>
                  <span className="font-bold">
                    Hostel: {selectedAdmission.hostelRequired ? 'Yes' : 'No'} | Bus: {selectedAdmission.transportRequired ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Parent & Address Info */}
            <div className="bg-[#FAF8F2] p-4 rounded-[16px] border border-[#E5E1D7] space-y-3">
              <h4 className="font-bold text-[#164A35] text-sm uppercase tracking-wider">
                2. Parent / Guardian & Address
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#68736D] block">Father's Name:</span>
                  <span className="font-bold">{selectedAdmission.fatherName || '—'}</span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Mother's Name:</span>
                  <span className="font-bold">{selectedAdmission.motherName || '—'}</span>
                </div>
                <div>
                  <span className="text-[#68736D] block">Contact Mobile:</span>
                  <span className="font-bold text-[#164A35]">
                    {selectedAdmission.mobile || selectedAdmission.parentPhone}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-[#68736D] block">Residential Address:</span>
                  <span className="font-bold">
                    {(() => {
                      const addr = selectedAdmission.address;
                      if (!addr) return '—';
                      if (typeof addr === 'string') return addr;
                      const parts = [addr.street, addr.city, addr.state, addr.pincode ? `- ${addr.pincode}` : ''].filter(Boolean);
                      return parts.join(', ') || '—';
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Attachments */}
            {selectedAdmission.documents && selectedAdmission.documents.length > 0 && (
              <div className="bg-[#FAF8F2] p-4 rounded-[16px] border border-[#E5E1D7] space-y-2">
                <h4 className="font-bold text-[#164A35] text-sm uppercase tracking-wider">
                  Attached Documents
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAdmission.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-[8px] bg-white border border-[#E5E1D7] text-xs font-bold text-[#164A35] hover:underline flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C5A55A]" />
                      <span>{doc.title || `Document ${idx + 1}`}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-[#E5E1D7]">
              <h4 className="font-bold text-[#164A35] text-sm uppercase tracking-wider">
                3. Update Application Status & Counseling Notes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Admission Status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={[
                    { label: 'New Application', value: 'new' },
                    { label: 'Parent Contacted', value: 'contacted' },
                    { label: 'Processing (Document Verification)', value: 'processing' },
                    { label: 'Approved (Admission Offered)', value: 'approved' },
                    { label: 'Rejected', value: 'rejected' },
                    { label: 'Converted (Enrolled)', value: 'converted' },
                  ]}
                />
              </div>

              <Textarea
                label="Counselor Internal Remarks / Notes"
                value={counselorRemarks}
                onChange={(e) => setCounselorRemarks(e.target.value)}
                rows={3}
                placeholder="e.g. Called parent on 23 Aug, scheduled document verification for Saturday..."
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="ghost" size="md" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdating}
                >
                  Save Status
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdmissionsAdminPage;
