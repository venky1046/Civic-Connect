import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, Activity, CheckCircle2, AlertOctagon, Users } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import DashboardCard from '../components/DashboardCard';
import Loading from '../components/Loading';
import { adminDashboard, adminListComplaints } from '../services/complaintService';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([adminDashboard(), adminListComplaints()])
      .then(([s, list]) => {
        setStats(s);
        setRecent(list.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <AdminLayout><Loading label="Loading admin dashboard..." /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-sm text-ink-500 mt-1">City-wide overview of all civic complaints.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
        <DashboardCard label="Total Complaints" value={stats.total} icon={ClipboardList} accent="navy" />
        <DashboardCard label="Pending" value={stats.pending} icon={Clock} accent="amber" />
        <DashboardCard label="In Progress" value={stats.inProgress} icon={Activity} accent="teal" />
        <DashboardCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accent="teal" />
        <DashboardCard label="Critical Issues" value={stats.critical} icon={AlertOctagon} accent="red" />
        <DashboardCard label="Total Citizens" value={stats.citizens} icon={Users} accent="navy" />
      </div>

      <div className="card mt-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-semibold text-navy-800">Recent Complaints</h2>
          <Link to="/admin/complaints" className="text-sm text-teal-600 font-medium hover:underline">
            View all
          </Link>
        </div>
        <DataTable
          rowKey="complaintId"
          onRowClick={(row) => navigate(`/admin/complaints/${row.complaintId}`)}
          columns={[
            { key: 'complaintId', header: 'ID' },
            { key: 'category', header: 'Category' },
            { key: 'location', header: 'Location' },
            { key: 'communityCount', header: 'Citizens' },
            { key: 'priority', header: 'Priority', render: (r) => <PriorityBadge priority={r.priority} /> },
            { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          rows={recent}
        />
      </div>
    </AdminLayout>
  );
}
