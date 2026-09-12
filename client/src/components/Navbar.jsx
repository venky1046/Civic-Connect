import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/report', label: 'Report Issue' },
  { to: '/track', label: 'Track Complaint' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-line">
      <div className="container-page flex items-center justify-between h-16">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="btn-ghost">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <button
                className="btn-ghost"
                onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
              >
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white px-5 py-4 flex flex-col gap-1">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="btn-ghost justify-start" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="h-px bg-line my-2" />
          {user ? (
            <>
              <button
                className="btn-ghost justify-start"
                onClick={() => {
                  setOpen(false);
                  navigate(isAdmin ? '/admin' : '/dashboard');
                }}
              >
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </button>
              <button
                className="btn-ghost justify-start"
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
