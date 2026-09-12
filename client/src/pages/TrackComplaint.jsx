import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ThumbsUp, ThumbsDown } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import ComplaintTimeline from '../components/ComplaintTimeline';
import PriorityBadge from '../components/PriorityBadge';
import Loading from '../components/Loading';
import { getComplaint, submitFeedback } from '../services/complaintService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function TrackComplaint() {
  const [params, setParams] = useSearchParams();
  const [inputId, setInputId] = useState(params.get('id') || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const search = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const result = await getComplaint(id.trim().toUpperCase());
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid complaint ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('id')) search(params.get('id'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setParams({ id: inputId });
    search(inputId);
  };

  const handleFeedback = async (feedback) => {
    if (!user) {
      toast.info('Please log in to leave feedback.');
      navigate('/login');
      return;
    }
    try {
      const res = await submitFeedback(data.complaint.complaintId, feedback);
      setData((d) => ({ ...d, feedbackStats: res.feedbackStats }));
      toast.success('Thank you for your feedback.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to submit feedback.');
    }
  };

  return (
    <PublicLayout>
      <section className="container-page py-14 sm:py-20 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">Track Your Complaint</h1>
        <p className="text-sm text-ink-500 text-center mt-2">
          Enter your complaint ID to see its latest status.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mt-6">
          <input
            className="input-field"
            placeholder="e.g. CC-2026-00001"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
          />
          <button className="btn-primary shrink-0" disabled={loading}>
            <Search size={16} /> Track
          </button>
        </form>

        {loading && <Loading label="Fetching complaint details..." />}
        {error && (
          <div className="mt-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {data && (
          <div className="card p-6 sm:p-8 mt-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-mono text-ink-400">{data.complaint.complaintId}</p>
                <h2 className="text-xl font-semibold text-navy-800 mt-0.5">{data.complaint.title}</h2>
                <span className="inline-block text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded-md font-medium mt-2">
                  {data.complaint.category}
                </span>
              </div>
              <PriorityBadge priority={data.complaint.priority} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
              <InfoRow icon={MapPin} label="Location" value={data.complaint.location} />
              <InfoRow
                icon={Calendar}
                label="Reported Date"
                value={new Date(data.complaint.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              />
              <InfoRow icon={Users} label="Citizens Reporting" value={`${data.complaint.communityCount} citizens`} />
            </div>

            {data.complaint.imagePath && (
              <img
                src={data.complaint.imagePath}
                alt="Reported issue"
                className="w-full h-56 object-cover rounded-lg mt-6 border border-line"
              />
            )}

            {data.complaint.adminRemark && (
              <div className="mt-6 rounded-lg bg-navy-50 p-4">
                <p className="text-xs font-semibold text-navy-700 uppercase tracking-wide">Admin Remarks</p>
                <p className="text-sm text-ink-700 mt-1">{data.complaint.adminRemark}</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-line">
              <h3 className="text-sm font-semibold text-navy-800 mb-4">Status Timeline</h3>
              <ComplaintTimeline status={data.complaint.status} />
            </div>

            {data.complaint.status === 'RESOLVED' && (
              <div className="mt-6 pt-6 border-t border-line text-center">
                <p className="text-sm font-medium text-navy-800 mb-3">Was this issue actually resolved?</p>
                <div className="flex justify-center gap-3">
                  <button className="btn-secondary" onClick={() => handleFeedback('YES')}>
                    <ThumbsUp size={16} /> Yes
                  </button>
                  <button className="btn-secondary" onClick={() => handleFeedback('NO')}>
                    <ThumbsDown size={16} /> No
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </PublicLayout>
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
