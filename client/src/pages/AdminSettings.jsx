import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../hooks/useAuth';

export default function AdminSettings() {
  const { user } = useAuth();
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-ink-500 mt-1">Manage your admin account preferences.</p>

      <div className="card p-6 mt-6 max-w-lg">
        <h3 className="font-semibold text-navy-800 mb-4">Account</h3>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-ink-400">Name</span>
            <span className="font-medium text-navy-800">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-ink-400">Email</span>
            <span className="font-medium text-navy-800">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-400">Role</span>
            <span className="font-medium text-navy-800 capitalize">{user?.role}</span>
          </div>
        </div>
        <p className="text-xs text-ink-400 mt-6">
          Community priority thresholds and email notification settings are configured by the
          platform administrator in the backend environment configuration.
        </p>
      </div>
    </AdminLayout>
  );
}
