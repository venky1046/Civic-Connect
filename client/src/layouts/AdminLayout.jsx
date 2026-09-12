import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  LayoutDashboard,
  ListChecks,
  AlertOctagon,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/complaints', label: 'All Complaints', icon: ListChecks },
  { to: '/admin/complaints?priority=CRITICAL', label: 'Critical Issues', icon: AlertOctagon },
  { to: '/admin/complaints?priority=HIGH', label: 'High Priority', icon: ArrowUpCircle },
  { to: '/admin/complaints?priority=MEDIUM', label: 'Medium Priority', icon: ArrowRightCircle },
  { to: '/admin/complaints?priority=LOW', label: 'Low Priority', icon: ArrowDownCircle },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar items={ITEMS} open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-5 sticky top-0 z-30">
          <button className="md:hidden p-2 -ml-2" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <p className="hidden md:block text-sm text-ink-500">Admin Console</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-navy-800 text-white flex items-center justify-center font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium text-navy-800 hidden sm:block">{user?.name}</span>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
