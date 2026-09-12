import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="container-page py-14 sm:py-24 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="justify-center mb-4" />
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-ink-500 mt-1">Log in to report and track civic issues.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 sm:p-8 flex flex-col gap-4" noValidate>
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-medium text-navy-800 mb-1.5">Email</span>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-navy-800 mb-1.5">Password</span>
              <input
                type="password"
                className="input-field"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Your password"
                required
              />
            </label>
            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              <LogIn size={17} /> {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            New to Civic Connect?{' '}
            <Link to="/register" className="text-teal-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
