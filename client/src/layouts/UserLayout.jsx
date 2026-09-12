import { useState } from 'react';
import { Menu } from 'lucide-react';
import { LayoutDashboard, FilePlus2, ListChecks, Search, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/report', label: 'Report Issue', icon: FilePlus2 },
  { to: '/my-complaints', label: 'My Complaints', icon: ListChecks },
  { to: '/track', label: 'Track Complaint', icon: Search },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function UserLayout({ children }) {
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
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-navy-800 hidden sm:block">{user?.name}</span>
          </div>
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
