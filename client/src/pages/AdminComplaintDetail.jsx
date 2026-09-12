import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Mail, Phone } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import Loading from '../components/Loading';
import ConfirmDialog from '../components/ConfirmDialog';
import { adminGetComplaint, adminUpdateStatus } from '../services/complaintService';
import { useToast } from '../hooks/useToast';

const STATUSES = ['SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'];

export default function AdminComplaintDetail() {
  const { complaintId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [remark, setRemark] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    adminGetComplaint(complaintId)
      .then((d) => {
        setData(d);
        setStatus(d.complaint.status);
        setRemark(d.complaint.adminRemark || '');
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, [complaintId]);

  const handleUpdate = async (force = false) => {
    setSaving(true);
    try {
      await adminUpdateStatus(complaintId, { status, remark, confirmSkip: force });
      toast.success('Complaint status updated.');
      setConfirmSkip(false);
      load();
    } catch (err) {
      if (err.response?.status === 409 && err.response.data.requiresConfirmation) {
        setConfirmSkip(true);
      } else {
        toast.error(err.response?.data?.message || 'Unable to update status.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) return <AdminLayout><Loading label="Loading complaint..." /></AdminLayout>;

  const { complaint, history, supporters, feedbackStats } = data;

  return (
    <AdminLayout>
      <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 mb-2">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-ink-400">{complaint.complaintId}</p>
                <h1 className="text-xl font-semibold text-navy-800 mt-0.5">{complaint.title}</h1>
                <span className="inline-block text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded-md font-medium mt-2">
                  {complaint.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <p className="text-sm text-ink-700 mt-4 leading-relaxed">{complaint.description}</p>

            <div className="grid sm:grid-cols-3 gap-4 mt-5 text-sm">
              <InfoRow icon={MapPin} label="Location" value={complaint.location} />
              <InfoRow
                icon={Calendar}
                label="Reported"
                value={new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              />
              <InfoRow icon={Users} label="Community Count" value={`${complaint.communityCount} citizens`} />
            </div>

            {complaint.imagePath && (
              <img src={complaint.imagePath} alt="Reported issue" className="w-full h-64 object-cover rounded-lg mt-5 border border-line" />
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-navy-800 mb-4">Reported By</h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <span className="flex items-center gap-2 text-ink-700"><Users size={15} className="text-ink-400" /> {complaint.reporter?.name}</span>
              <span className="flex items-center gap-2 text-ink-700"><Mail size={15} className="text-ink-400" /> {complaint.reporter?.email}</span>
              <span className="flex items-center gap-2 text-ink-700"><Phone size={15} className="text-ink-400" /> {complaint.reporter?.phone}</span>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-navy-800 mb-4">Supporting Citizens ({supporters.length})</h3>
            <div className="flex flex-col gap-2 max-h-52 overflow-y-auto">
              {supporters.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm py-1.5 border-b border-line last:border-0">
                  <span className="text-navy-800">{s.name}</span>
                  <span className="text-ink-400">{s.email}</span>
                </div>
              ))}
            </div>
            {complaint.status === 'RESOLVED' && (
              <div className="mt-4 pt-4 border-t border-line flex gap-4 text-sm">
                <span className="text-teal-700">👍 {feedbackStats.YES || 0} confirmed resolved</span>
                <span className="text-red-600">👎 {feedbackStats.NO || 0} said not resolved</span>
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-navy-800 mb-4">Status History</h3>
            <div className="flex flex-col gap-3">
              {history.map((h) => (
                <div key={h.id} className="text-sm flex flex-wrap items-center gap-2 border-b border-line pb-3 last:border-0">
                  <StatusBadge status={h.new_status} />
                  <span className="text-ink-400">by {h.changed_by_name}</span>
                  <span className="text-ink-400">&middot; {new Date(h.created_at).toLocaleString('en-IN')}</span>
                  {h.remark && <p className="w-full text-ink-700 mt-1">{h.remark}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-navy-800 mb-4">Update Status</h3>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-navy-800 mb-1.5">Status</span>
              <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-navy-800 mb-1.5">Admin Remark</span>
              <textarea
                className="input-field min-h-[90px] resize-y"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Optional note visible to the citizen"
              />
            </label>
            <button className="btn-primary w-full" onClick={() => handleUpdate(false)} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <div className="mt-6 pt-6 border-t border-line">
              <h4 className="text-sm font-semibold text-navy-800 mb-3">Progress</h4>
              <ComplaintTimeline status={complaint.status} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmSkip}
        onClose={() => setConfirmSkip(false)}
        onConfirm={() => handleUpdate(true)}
        loading={saving}
        title="Confirm status change"
        message={`This will skip from "${complaint.status}" directly to "${status}". Are you sure you want to proceed?`}
        confirmLabel="Yes, update status"
      />
    </AdminLayout>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={16} className="text-ink-400 mt-0.5" />
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-navy-800 font-medium">{value}</p>
      </div>
    </div>
  );
}
