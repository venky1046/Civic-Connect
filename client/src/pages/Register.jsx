import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const initialForm = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password))
      errs.password = 'At least 8 characters, with a letter and a number.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await register(form);
      toast.success('Welcome to Civic Connect!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to register. Please try again.';
      toast.error(msg);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="container-page py-14 sm:py-20 flex justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="justify-center mb-4" />
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-sm text-ink-500 mt-1">Join your community and start reporting issues.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 sm:p-8 flex flex-col gap-4" noValidate>
            <Field label="Full Name" error={errors.name}>
              <input className="input-field" value={form.name} onChange={update('name')} placeholder="Jordan Rivera" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" className="input-field" value={form.email} onChange={update('email')} placeholder="you@example.com" />
            </Field>
            <Field label="Phone Number" error={errors.phone}>
              <input className="input-field" value={form.phone} onChange={update('phone')} placeholder="98765 43210" />
            </Field>
            <Field label="Password" error={errors.password}>
              <input type="password" className="input-field" value={form.password} onChange={update('password')} placeholder="At least 8 characters" />
            </Field>
            <Field label="Confirm Password" error={errors.confirmPassword}>
              <input type="password" className="input-field" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Re-enter password" />
            </Field>

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              <UserPlus size={17} /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-navy-800 mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}
