
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M20 5L33 12.5V27.5L20 35L7 27.5V12.5L20 5Z" 
        stroke="url(#logo-gradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 25V15L20 20L28 15V25" 
        stroke="url(#logo-gradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="3" fill="url(#logo-gradient)" />
      <defs>
        <linearGradient id="logo-gradient" x1="7" y1="5" x2="33" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
