import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import Loading from '../components/Loading';
import { adminUsers } from '../services/complaintService';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="text-sm text-ink-500 mt-1">{users.length} registered citizens and admins.</p>

      <div className="card mt-6">
        {loading ? (
          <Loading label="Loading users..." />
        ) : (
          <DataTable
            rowKey="id"
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'email', header: 'Email' },
              { key: 'phone', header: 'Phone' },
              { key: 'role', header: 'Role', render: (r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.role === 'admin' ? 'bg-navy-50 text-navy-700' : 'bg-teal-50 text-teal-700'}`}>
                  {r.role}
                </span>
              ) },
              { key: 'created_at', header: 'Joined', render: (r) => new Date(r.created_at).toLocaleDateString('en-IN') },
            ]}
            rows={users}
          />
        )}
      </div>
    </AdminLayout>
  );
}
