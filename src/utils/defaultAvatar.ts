/**
 * Generates an SVG Data URL for a professional default student portrait badge.
 */
export function generateDefaultAvatar(name: string, deptCode = 'SEC'): string {
  const initial = (name.trim().charAt(0) || 'S').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b" />
        <stop offset="50%" stop-color="#312e81" />
        <stop offset="100%" stop-color="#4338ca" />
      </linearGradient>
      <linearGradient id="badge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
    </defs>
    <rect width="300" height="360" fill="url(#bg)" />
    <!-- Student silhouette -->
    <circle cx="150" cy="120" r="55" fill="#e0e7ff" opacity="0.9" />
    <path d="M70 290 C70 200, 230 200, 230 290 Z" fill="#c7d2fe" opacity="0.9" />
    <!-- Center Initial -->
    <circle cx="150" cy="120" r="38" fill="url(#badge)" />
    <text x="150" y="134" font-family="system-ui, sans-serif" font-size="40" font-weight="900" fill="#ffffff" text-anchor="middle">${initial}</text>
    <!-- Department tag at bottom -->
    <rect x="50" y="305" width="200" height="32" rx="16" fill="#0f172a" opacity="0.8" />
    <text x="150" y="326" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#fbbf24" text-anchor="middle" letter-spacing="1">STUDENT • ${deptCode}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
