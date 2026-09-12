// The exact 14 civic issue categories. Kept server-side so the API is the
// single source of truth and the client always renders a matching list.
const CATEGORIES = [
  { key: 'road_damage', label: 'Road Damage', icon: 'road' },
  { key: 'pothole', label: 'Pothole', icon: 'alert-triangle' },
  { key: 'street_light', label: 'Street Light Not Working', icon: 'lightbulb' },
  { key: 'garbage_overflow', label: 'Garbage Overflow', icon: 'trash-2' },
  { key: 'water_leakage', label: 'Water Leakage', icon: 'droplet' },
  { key: 'drainage_sewage', label: 'Drainage / Sewage Blockage', icon: 'waves' },
  { key: 'public_toilet', label: 'Public Toilet Problem', icon: 'bath' },
  { key: 'tree_public_area', label: 'Tree / Public Area Issue', icon: 'tree-pine' },
  { key: 'traffic_signal', label: 'Traffic Signal Problem', icon: 'traffic-cone' },
  { key: 'stray_animal', label: 'Stray Animal Issue', icon: 'dog' },
  { key: 'electricity_public', label: 'Electricity-related Public Issue', icon: 'zap' },
  { key: 'park_playground', label: 'Public Park / Playground Issue', icon: 'trees' },
  { key: 'illegal_dumping', label: 'Illegal Dumping', icon: 'ban' },
  { key: 'area_cleanliness', label: 'Road / Area Cleanliness', icon: 'sparkles' },
];

const CATEGORY_LABELS = CATEGORIES.map((c) => c.label);

module.exports = { CATEGORIES, CATEGORY_LABELS };
