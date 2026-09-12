import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Megaphone, Users2, ClipboardCheck, CircleCheckBig } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import { getCategories, getPublicStats } from '../services/complaintService';
import { getCategoryIcon } from '../utils/categoryIcons';

const HOW_IT_WORKS = [
  { icon: Megaphone, title: 'Report an Issue', text: 'Snap a photo, share the location, and describe the civic problem in your area.' },
  { icon: Users2, title: 'Community Identifies Priority', text: 'When others report the same issue, its community priority rises automatically.' },
  { icon: ClipboardCheck, title: 'Admin Takes Action', text: 'City administrators review, assign, and act on issues based on priority.' },
  { icon: CircleCheckBig, title: 'Issue Gets Resolved', text: 'You get notified the moment your reported issue is marked resolved.' },
];

export default function Landing() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ totalReports: 0, resolved: 0, active: 0, citizens: 0 });

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getPublicStats().then(setStats).catch(() => {});
  }, []);

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="bg-navy-800 relative overflow-hidden">
        <div className="container-page py-20 sm:py-28 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="text-teal-300 text-sm font-semibold tracking-wide mb-4">
              Your Voice. Your City. Our Responsibility.
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-semibold text-white leading-[1.1]">
              Make your community better, one report at a time.
            </h1>
            <p className="text-navy-100 mt-5 text-base sm:text-lg max-w-lg">
              Report civic problems, track progress, and help your community prioritize what matters most.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/report" className="btn-primary text-base px-6 py-3.5">
                Report an Issue <ArrowRight size={18} />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 text-white font-semibold px-6 py-3.5 text-base hover:bg-white/10 transition-colors"
              >
                <Search size={18} /> Track Complaint
              </Link>
            </div>
          </div>
          <CityIllustration />
        </div>
      </section>

      {/* STATS */}
      <section className="container-page -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Reports" value={stats.totalReports} />
          <StatCard label="Issues Resolved" value={stats.resolved} />
          <StatCard label="Active Issues" value={stats.active} />
          <StatCard label="Citizens Participating" value={stats.citizens} />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-20">
        <div className="max-w-xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">What can you report?</h2>
          <p className="text-ink-500 mt-2">
            Civic Connect covers the everyday problems that affect your neighborhood most.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <div key={cat.key} className="card p-5 flex flex-col gap-3 hover:shadow-raised transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Icon size={19} />
                </div>
                <p className="text-sm font-medium text-navy-800 leading-snug">{cat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-line py-20">
        <div className="container-page">
          <div className="max-w-xl mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold">How Civic Connect works</h2>
            <p className="text-ink-500 mt-2">From a single report to a resolved issue — here's the journey.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.title} className="relative">
                <div className="w-11 h-11 rounded-lg bg-navy-800 text-white flex items-center justify-center mb-4">
                  <step.icon size={20} />
                </div>
                <h3 className="text-base font-semibold text-navy-800">{step.title}</h3>
                <p className="text-sm text-ink-500 mt-1.5">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-page py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold">See a problem? Speak up.</h2>
        <p className="text-ink-500 mt-2 max-w-md mx-auto">
          It takes less than two minutes to report an issue and start making a difference.
        </p>
        <Link to="/report" className="btn-primary text-base px-7 py-3.5 mt-6 inline-flex">
          Report an Issue <ArrowRight size={18} />
        </Link>
      </section>
    </PublicLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-2xl sm:text-3xl font-display font-semibold text-navy-800">{value}</p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  );
}

function CityIllustration() {
  return (
    <svg viewBox="0 0 420 320" className="w-full max-w-md mx-auto hidden md:block" aria-hidden="true">
      <defs>
        <linearGradient id="skyline" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12967A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#12967A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="420" height="320" fill="url(#skyline)" rx="24" />
      {[
        [30, 170, 40, 120],
        [80, 130, 50, 160],
        [140, 190, 36, 100],
        [186, 100, 56, 190],
        [252, 150, 42, 140],
        [304, 120, 48, 170],
        [362, 175, 38, 115],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#0F2D50" opacity={0.85 - i * 0.03} />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <rect
          key={`w-${i}`}
          x={40 + (i % 6) * 55}
          y={140 + Math.floor(i / 6) * 30}
          width="8"
          height="10"
          fill="#1FB894"
          opacity="0.8"
        />
      ))}
      <circle cx="350" cy="60" r="26" fill="#1FB894" opacity="0.35" />
      <path d="M0 290 Q210 260 420 290 V320 H0 Z" fill="#0B2545" />
    </svg>
  );
}
