const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Normalizes an image URL to ensure it loads properly whether in dev (with proxy)
 * or production (with full API base URL or relative static path).
 *
 * @param {string|null|undefined} path - The image URL or relative path from backend
 * @returns {string|null} - Resolved full URL or null
 */
export function getImageUrl(path) {
  if (!path) return null;

  // If already absolute URL, data URL, or blob preview URL
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Ensure path starts with leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // If VITE_API_URL is defined and cleanPath starts with /uploads
  if (API_BASE_URL && cleanPath.startsWith('/uploads')) {
    return `${API_BASE_URL.replace(/\/+$/, '')}${cleanPath}`;
  }

  return cleanPath;
}

export default getImageUrl;
