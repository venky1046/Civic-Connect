import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="container-page py-24 text-center">
        <p className="text-teal-600 font-semibold text-sm">404</p>
        <h1 className="text-3xl font-semibold mt-2">Page not found</h1>
        <p className="text-ink-500 mt-2">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to Home
        </Link>
      </div>
    </PublicLayout>
  );
}
