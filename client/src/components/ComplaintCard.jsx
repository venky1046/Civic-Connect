import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function ComplaintCard({ complaint }) {
  const date = new Date(complaint.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      to={`/track?id=${complaint.complaintId}`}
      className="card p-5 flex flex-col gap-3 hover:shadow-raised hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-mono text-ink-400">{complaint.complaintId}</p>
          <h4 className="font-semibold text-navy-800 mt-0.5">{complaint.title}</h4>
        </div>
        <ChevronRight size={18} className="text-ink-400 shrink-0 mt-1" />
      </div>

      <p className="text-xs text-teal-700 bg-teal-50 inline-flex w-fit px-2 py-1 rounded-md font-medium">
        {complaint.category}
      </p>

      <div className="flex items-center gap-4 text-xs text-ink-500">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {complaint.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={13} /> {date}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line">
        <span className="flex items-center gap-1 text-xs text-ink-500">
          <Users size={13} /> {complaint.communityCount} citizen{complaint.communityCount === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>
    </Link>
  );
}
