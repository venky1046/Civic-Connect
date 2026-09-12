import UserLayout from '../layouts/UserLayout';
import { useAuth } from '../hooks/useAuth';
import { Mail, Phone, User, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <UserLayout>
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-sm text-ink-500 mt-1">Your account details.</p>

      <div className="card p-6 sm:p-8 mt-6 max-w-lg">
        <div className="flex items-center gap-4 pb-6 border-b border-line">
          <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-navy-800 text-lg">{user?.name}</p>
            <p className="text-xs text-ink-500 capitalize">{user?.role} account</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <Row icon={User} label="Full Name" value={user?.name} />
          <Row icon={Mail} label="Email" value={user?.email} />
          <Row icon={Phone} label="Phone" value={user?.phone} />
          <Row icon={ShieldCheck} label="Role" value={user?.role} />
        </div>
      </div>
    </UserLayout>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-medium text-navy-800 capitalize">{value}</p>
      </div>
    </div>
  );
}
