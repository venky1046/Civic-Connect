import { Loader2 } from 'lucide-react';

export default function Loading({ label = 'Loading...', full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-ink-500 ${full ? 'min-h-[50vh]' : 'py-14'}`}>
      <Loader2 size={26} className="animate-spin text-teal-500" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
