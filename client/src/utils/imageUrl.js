import { BACKEND_ORIGIN } from "../services/api";
export function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_ORIGIN}${path}`;
}
