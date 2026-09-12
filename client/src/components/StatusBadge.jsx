const STATUS_STYLES = {
  SUBMITTED: 'bg-navy-50 text-navy-700 border-navy-100',
  'UNDER REVIEW': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  ASSIGNED: 'bg-sky-50 text-sky-700 border-sky-100',
  'IN PROGRESS': 'bg-amber-50 text-amber-700 border-amber-100',
  RESOLVED: 'bg-teal-50 text-teal-700 border-teal-100',
};

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || 'bg-gray-50 text-gray-700 border-gray-100';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}
