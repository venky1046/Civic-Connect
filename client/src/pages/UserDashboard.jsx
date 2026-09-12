import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, Activity, CheckCircle2, FilePlus2, Search, Inbox } from 'lucide-react';
import UserLayout from '../layouts/UserLayout';
import DashboardCard from '../components/DashboardCard';
import ComplaintCard from '../components/ComplaintCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getMyComplaints } from '../services/complaintService';
import { useAuth } from '../hooks/useAuth';

export default function UserDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyComplaints()
      .then(setComplaints)
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER REVIEW').length,
    inProgress: complaints.filter((c) => c.status === 'ASSIGNED' || c.status === 'IN PROGRESS').length,
    resolved: complaints.filter((c) => c.status === 'RESOLVED').length,
  };

  return (
    <UserLayout>
      <h1 className="text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-sm text-ink-500 mt-1">Here's a snapshot of your civic activity.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <DashboardCard label="My Total Complaints" value={counts.total} icon={ClipboardList} accent="navy" />
        <DashboardCard label="Pending" value={counts.pending} icon={Clock} accent="amber" />
        <DashboardCard label="In Progress" value={counts.inProgress} icon={Activity} accent="teal" />
        <DashboardCard label="Resolved" value={counts.resolved} icon={CheckCircle2} accent="teal" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <Link to="/report" className="card p-5 flex items-center gap-4 hover:shadow-raised transition-shadow">
          <div className="w-11 h-11 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <FilePlus2 size={20} />
          </div>
          <div>
            <p className="font-semibold text-navy-800 text-sm">Quick Report</p>
            <p className="text-xs text-ink-500">Report a new civic issue in your area.</p>
          </div>
        </Link>
        <Link to="/track" className="card p-5 flex items-center gap-4 hover:shadow-raised transition-shadow">
          <div className="w-11 h-11 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
            <Search size={20} />
          </div>
          <div>
            <p className="font-semibold text-navy-800 text-sm">Track Complaint</p>
            <p className="text-xs text-ink-500">Check the latest status of any complaint.</p>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-800">Recent Complaints</h2>
          <Link to="/my-complaints" className="text-sm text-teal-600 font-medium hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <Loading label="Loading your complaints..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No complaints yet"
            description="You haven't reported any civic issues so far."
            action={
              <Link to="/report" className="btn-primary">
                Report an Issue
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {complaints.slice(0, 6).map((c) => (
              <ComplaintCard key={c.complaintId} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
