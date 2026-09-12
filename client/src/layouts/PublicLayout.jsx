import Navbar from '../components/Navbar';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-navy-900 text-navy-100 py-10 mt-10">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Civic Connect. Built for citizens, by citizens.</p>
          <p className="text-xs text-navy-400">Your Voice. Your City. Our Responsibility.</p>
        </div>
      </footer>
    </div>
  );
}
