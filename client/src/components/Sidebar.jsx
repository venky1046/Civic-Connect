import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar({ items, open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-navy-900/40 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-navy-800 text-white flex flex-col z-50 transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Logo dark />
          <button className="md:hidden" onClick={onClose} aria-label="Close menu">
            <X size={20} className="text-white" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : 'text-navy-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-navy-100 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
