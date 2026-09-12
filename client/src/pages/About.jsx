import { ShieldCheck, Users, Gauge } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';

export default function About() {
  return (
    <PublicLayout>
      <section className="container-page py-16 sm:py-24 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-semibold">About Civic Connect</h1>
        <p className="text-ink-500 mt-4 text-base leading-relaxed">
          Civic Connect gives citizens a direct channel to report everyday problems in their
          neighborhood — potholes, broken street lights, overflowing garbage, water leakage, and
          more — and gives local administrators the tools to review, prioritize, and resolve them
          efficiently.
        </p>
        <p className="text-ink-500 mt-4 text-base leading-relaxed">
          Instead of the same issue being reported over and over as separate complaints, Civic
          Connect recognizes when multiple citizens are reporting the same problem and combines
          them, so administrators can see exactly how many people are affected and act on what
          matters most first.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          <Value icon={ShieldCheck} title="Transparent" text="Every complaint has a public status you can track from submission to resolution." />
          <Value icon={Users} title="Community-driven" text="Priority is calculated from real citizen participation, not guesswork." />
          <Value icon={Gauge} title="Accountable" text="Admins record every status change with a timestamp and remark." />
        </div>
      </section>
    </PublicLayout>
  );
}

function Value({ icon: Icon, title, text }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
        <Icon size={18} />
      </div>
      <h3 className="font-semibold text-navy-800 text-sm">{title}</h3>
      <p className="text-sm text-ink-500 mt-1">{text}</p>
    </div>
  );
}
