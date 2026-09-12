import { Check } from 'lucide-react';

const STEPS = ['SUBMITTED', 'UNDER REVIEW', 'ASSIGNED', 'IN PROGRESS', 'RESOLVED'];

export default function ComplaintTimeline({ status }) {
  const currentIdx = STEPS.indexOf(status);

  return (
    <div className="flex flex-col">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const isLast = idx === STEPS.length - 1;
        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  done || active
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : 'bg-white border-line text-transparent'
                }`}
              >
                {(done || active) && <Check size={14} />}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[28px] ${done ? 'bg-teal-500' : 'bg-line'}`} />
              )}
            </div>
            <div className={`pb-7 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-semibold ${active ? 'text-navy-800' : done ? 'text-ink-700' : 'text-ink-400'}`}>
                {step}
              </p>
              {active && <p className="text-xs text-teal-600 mt-0.5">Current status</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
