const PRIORITY_STYLES = {
  LOW: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
  MEDIUM: { cls: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
  HIGH: { cls: 'bg-orange-50 text-orange-700 border-orange-100', dot: 'bg-orange-500' },
  CRITICAL: { cls: 'bg-red-50 text-red-700 border-red-100', dot: 'bg-red-500' },
};

export default function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.LOW;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  );
}
