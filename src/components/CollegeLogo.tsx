import React from 'react';

interface CollegeLogoProps {
  className?: string;
  size?: number;
}

export const COLLEGE_LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="50%" stop-color="#78350f" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="18" fill="url(#emblemGrad)" />
  <rect x="2" y="2" width="96" height="96" rx="16" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-opacity="0.6" />
  <circle cx="50" cy="50" r="44" stroke="#fef08a" stroke-width="2" stroke-dasharray="3 2" fill="none" />
  <circle cx="50" cy="50" r="39" stroke="#fef08a" stroke-width="1.2" fill="none" />
  <path d="M50 14L45 22H55L50 14Z" fill="#fef08a" />
  <rect x="44" y="22" width="12" height="6" fill="#fef08a" rx="1" />
  <rect x="41" y="29" width="18" height="7" fill="#fef08a" rx="1" />
  <rect x="38" y="37" width="24" height="8" fill="#fef08a" rx="1" />
  <rect x="35" y="46" width="30" height="9" fill="#fef08a" rx="1" />
  <path d="M26 62C34 60 42 62 50 66C58 62 66 60 74 62V78C66 76 58 78 50 82C42 78 34 76 26 78V62Z" fill="#fffbeb" stroke="#78350f" stroke-width="1.5" />
  <line x1="50" y1="66" x2="50" y2="82" stroke="#78350f" stroke-width="1.5" />
  <circle cx="50" cy="20" r="2.5" fill="#fef08a" />
</svg>
`)}`;

export const CollegeLogo: React.FC<CollegeLogoProps> = ({ className = '', size = 56 }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-2 text-white shadow-md ${className}`}
      style={{ width: size, height: size }}
      title="Sengunthar Engineering College Emblem"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-amber-100"
      >
        {/* Outer Circular Laurel / Gear border */}
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1.5" />

        {/* Traditional Temple Tower / Gopuram Crest Silhouette */}
        <path
          d="M50 14L45 22H55L50 14Z"
          fill="currentColor"
        />
        <rect x="44" y="22" width="12" height="6" fill="currentColor" rx="1" />
        <rect x="41" y="29" width="18" height="7" fill="currentColor" rx="1" />
        <rect x="38" y="37" width="24" height="8" fill="currentColor" rx="1" />
        <rect x="35" y="46" width="30" height="9" fill="currentColor" rx="1" />

        {/* Open Book of Knowledge at Base */}
        <path
          d="M26 62C34 60 42 62 50 66C58 62 66 60 74 62V78C66 76 58 78 50 82C42 78 34 76 26 78V62Z"
          fill="#FFFBEB"
          stroke="#78350F"
          strokeWidth="1.5"
        />
        <line x1="50" y1="66" x2="50" y2="82" stroke="#78350F" strokeWidth="1.5" />

        {/* Small Flame / Star of Wisdom */}
        <circle cx="50" cy="20" r="2.5" fill="#FEF08A" />
      </svg>
    </div>
  );
};

export const SymposiumLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-900 via-blue-900 to-indigo-800 p-2 text-white shadow-md ${className}`}
      style={{ width: size, height: size }}
      title="TechSym SaRaYu-26 Logo"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-blue-200"
      >
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="#60A5FA" strokeWidth="3" />
        <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" stroke="#93C5FD" strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M35 38L50 28L65 38V62L50 72L35 62V38Z" fill="#2563EB" fillOpacity="0.5" stroke="#38BDF8" strokeWidth="2" />
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="20"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          TS
        </text>
      </svg>
    </div>
  );
};
