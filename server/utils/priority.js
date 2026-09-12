// Community priority is derived purely from the number of unique citizens
// who reported or supported an issue. Rules are fixed and non-overridable
// (per spec) so the platform stays objective and tamper-proof.
function calculatePriority(citizenCount) {
  const n = Number(citizenCount) || 0;
  if (n >= 51) return 'CRITICAL';
  if (n >= 26) return 'HIGH';
  if (n >= 11) return 'MEDIUM';
  return 'LOW';
}

const PRIORITY_META = {
  LOW: { color: '#1B8A5A', bg: '#E6F6EE', emoji: '🟢' },
  MEDIUM: { color: '#A88B00', bg: '#FFF6DB', emoji: '🟡' },
  HIGH: { color: '#C2571B', bg: '#FFEEE0', emoji: '🟠' },
  CRITICAL: { color: '#C22B2B', bg: '#FDE8E8', emoji: '🔴' },
};

module.exports = { calculatePriority, PRIORITY_META };
