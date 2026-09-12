import {
  Construction,
  TriangleAlert,
  Lightbulb,
  Trash2,
  Droplet,
  Waves,
  ShowerHead,
  TreePine,
  TrafficCone,
  Dog,
  Zap,
  Trees,
  Ban,
  Sparkles,
  MapPin,
} from 'lucide-react';

const ICON_MAP = {
  road: Construction,
  'alert-triangle': TriangleAlert,
  lightbulb: Lightbulb,
  'trash-2': Trash2,
  droplet: Droplet,
  waves: Waves,
  bath: ShowerHead,
  'tree-pine': TreePine,
  'traffic-cone': TrafficCone,
  dog: Dog,
  zap: Zap,
  trees: Trees,
  ban: Ban,
  sparkles: Sparkles,
};

export function getCategoryIcon(iconKey) {
  return ICON_MAP[iconKey] || MapPin;
}
