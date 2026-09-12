export default function DashboardCard({ label, value, icon: Icon, accent = 'navy' }) {
  const accents = {
    navy: 'bg-navy-50 text-navy-700',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${accents[accent]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-display font-semibold text-navy-800 leading-none">{value}</p>
        <p className="text-xs text-ink-500 mt-1.5">{label}</p>
      </div>
    </div>
  );
}
