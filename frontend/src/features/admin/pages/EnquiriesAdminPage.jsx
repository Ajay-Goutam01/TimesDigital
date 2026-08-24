import React, { useState } from 'react';
import {
  UserCheck,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { AdminTable } from '../components/AdminTable';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import {
  useGetEnquiriesQuery,
  useUpdateEnquiryStatusMutation,
} from '../../enquiries/services/enquiryApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const EnquiriesAdminPage = () => {
  useDocumentTitle('Enquiries & CRM Leads');
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Status update
  const [newStatus, setNewStatus] = useState('new');
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading, refetch } = useGetEnquiriesQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });

  const enquiries = data?.data?.enquiries || data?.data || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: enquiries.length };

  const [updateStatus, { isLoading: isUpdating }] = useUpdateEnquiryStatusMutation();

  const handleOpenView = (enq) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status || 'new');
    setAdminNotes(enq.adminNotes || enq.notes || '');
    setViewModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      await updateStatus({
        id: selectedEnquiry._id,
        status: newStatus,
        note: adminNotes,
      }).unwrap();

      showToast(`Lead for '${selectedEnquiry.name}' updated.`, 'success');
      setViewModalOpen(false);
      refetch();
    } catch (err) {
      showToast(err?.data?.message || 'Failed to update lead status.', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'contacted':
        return <Badge variant="gold" size="sm">Contacted</Badge>;
      case 'resolved':
      case 'enrolled':
        return <Badge variant="success" size="sm">Resolved / Enrolled</Badge>;
      case 'closed':
        return <Badge variant="cream" size="sm">Closed</Badge>;
      default:
        return <Badge variant="dark" size="sm">New Lead</Badge>;
    }
  };

  const columns = [
    {
      header: 'Prospect Name & Phone',
      render: (row) => (
        <div>
          <p className="font-bold text-[#17231D] text-xs sm:text-sm">{row.name}</p>
          <a
            href={`tel:${row.phone}`}
            className="text-[11px] font-bold text-[#164A35] hover:underline block"
          >
            {row.phone}
          </a>
        </div>
      ),
    },
    {
      header: 'Target Stream / Course',
      render: (row) => (
        <div>
          <span className="font-bold text-xs text-[#164A35] block">
            {row.course || row.program || 'General Inquiry'}
          </span>
          {row.class && (
            <span className="text-[11px] text-[#68736D]">
              Class {row.class}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Source / Page',
      render: (row) => (
        <span className="text-xs text-[#68736D] font-mono">
          {row.source || 'Website Form'}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Date',
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
            className="p-1.5 rounded-[6px] hover:bg-[#FAF8F2] text-[#164A35] hover:text-[#103728] transition-colors flex items-center gap-1 text-xs font-bold"
            title="Review Lead"
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
          <h2 className="text-xl font-bold text-[#164A35]">Enquiries & CRM Leads</h2>
          <p className="text-xs text-[#68736D]">
            Track student inquiries, call notes, admission conversions, and follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'new', 'contacted', 'resolved', 'closed'].map((st) => (
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
        data={enquiries}
        isLoading={isLoading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search enquiries by name or phone..."
        pagination={pagination}
        onPageChange={setPage}
      />

      {/* Review Enquiry Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Inquiry from ${selectedEnquiry.name}`}
          subtitle={`Received on ${new Date(selectedEnquiry.createdAt || Date.now()).toLocaleString('en-IN')}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 text-xs text-[#17231D]">
            {/* Prospect Information */}
            <div className="bg-[#FAF8F2] p-4 rounded-[16px] border border-[#E5E1D7] space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[#68736D] block">Phone Number:</span>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="font-bold text-[#164A35] text-sm hover:underline"
                  >
                    {selectedEnquiry.phone}
                  </a>
                </div>
                {selectedEnquiry.email && (
                  <div>
                    <span className="text-[#68736D] block">Email:</span>
                    <span className="font-bold">{selectedEnquiry.email}</span>
                  </div>
                )}
                <div>
                  <span className="text-[#68736D] block">Interested Course:</span>
                  <span className="font-bold text-[#164A35]">
                    {selectedEnquiry.course || selectedEnquiry.program || 'General Inquiry'}
                  </span>
                </div>
                {selectedEnquiry.class && (
                  <div>
                    <span className="text-[#68736D] block">Class Level:</span>
                    <span className="font-bold">Class {selectedEnquiry.class}</span>
                  </div>
                )}
              </div>

              {selectedEnquiry.message && (
                <div className="pt-2 border-t border-[#E5E1D7]">
                  <span className="text-[#68736D] block">Prospect Message:</span>
                  <p className="font-semibold text-[#17231D] italic pt-0.5">
                    "{selectedEnquiry.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Follow-up Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <Select
                label="Lead Follow-up Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { label: 'New Lead', value: 'new' },
                  { label: 'Contacted / Call Completed', value: 'contacted' },
                  { label: 'Resolved / Enrolled in Course', value: 'resolved' },
                  { label: 'Closed / Not Interested', value: 'closed' },
                ]}
              />

              <Textarea
                label="Staff Internal Notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Student interested in JEE Dropper batch. Sent fee brochure via WhatsApp..."
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
                  Update Lead
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EnquiriesAdminPage;
