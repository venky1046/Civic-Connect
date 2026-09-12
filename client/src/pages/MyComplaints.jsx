import { useEffect, useMemo, useState } from 'react';
import { Search, Inbox } from 'lucide-react';
import UserLayout from '../layouts/UserLayout';
import ComplaintCard from '../components/ComplaintCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getMyComplaints } from '../services/complaintService';

const FILTERS = ['All', 'SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'];

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getMyComplaints()
      .then(setComplaints)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesFilter = filter === 'All' || c.status === filter;
      const matchesQuery =
        !query ||
        c.complaintId.toLowerCase().includes(query.toLowerCase()) ||
        c.title.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [complaints, filter, query]);

  return (
    <UserLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Complaints</h1>
          <p className="text-sm text-ink-500 mt-1">Every issue you've reported, in one place.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input-field pl-9 w-64"
            placeholder="Search by ID or title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === f
                ? 'bg-navy-800 text-white border-navy-800'
                : 'bg-white text-ink-500 border-line hover:border-navy-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <Loading label="Loading your complaints..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No complaints found"
            description="Nothing matches this filter yet. Try a different status or report a new issue."
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <ComplaintCard key={c.complaintId} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
