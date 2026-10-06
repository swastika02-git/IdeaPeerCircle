import React from 'react';

export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', subtext: 'text-[9px]' },
    md: { icon: 40, text: 'text-2xl', subtext: 'text-xs' },
    lg: { icon: 56, text: 'text-3xl', subtext: 'text-sm' },
    xl: { icon: 84, text: 'text-5xl', subtext: 'text-base' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon Emblem */}
      <div className="relative flex items-center justify-center transition-transform duration-300 hover:rotate-6">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          {/* Outer circle halo */}
          <circle cx="32" cy="32" r="30" fill="#F5EFC6" stroke="#4D0E12" strokeWidth="2.5" />
          
          {/* Orbital connection circle */}
          <circle cx="32" cy="32" r="20" stroke="#A5BCD6" strokeWidth="2" strokeDasharray="3 3" />

          {/* Central Idea Core / Lightbulb with warm glow */}
          <circle cx="32" cy="27" r="10" fill="#F5EFC6" />
          <path
            d="M32 17C27.58 17 24 20.58 24 25C24 27.8 25.4 30.2 27.5 31.6V35C27.5 35.6 27.9 36 28.5 36H35.5C36.1 36 36.5 35.6 36.5 35V31.6C38.6 30.2 40 27.8 40 25C40 20.58 36.42 17 32 17Z"
            fill="#4D0E12"
          />
          <rect x="29" y="37" width="6" height="2.5" rx="1.25" fill="#4D0E12" />
          <line x1="30" y1="41" x2="34" y2="41" stroke="#4D0E12" strokeWidth="1.5" strokeLinecap="round" />

          {/* Spark Star in bulb */}
          <path
            d="M32 21L33 24L36 25L33 26L32 29L31 26L28 25L31 24L32 21Z"
            fill="#F5EFC6"
          />

          {/* Connecting Student Nodes along the Circle */}
          {/* Top Left node */}
          <circle cx="15" cy="23" r="5" fill="#A5BCD6" stroke="#4A2E27" strokeWidth="1.5" />
          {/* Top Right node */}
          <circle cx="49" cy="23" r="5" fill="#A0BEDA" stroke="#4A2E27" strokeWidth="1.5" />
          {/* Bottom Left node */}
          <circle cx="20" cy="46" r="5" fill="#4D0E12" stroke="#F5EFC6" strokeWidth="1.5" />
          {/* Bottom Right node */}
          <circle cx="44" cy="46" r="5" fill="#4A2E27" stroke="#F5EFC6" strokeWidth="1.5" />

          {/* Connection vectors between students and central idea */}
          <line x1="19.5" y1="25" x2="25" y2="27" stroke="#4A2E27" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44.5" y1="25" x2="39" y2="27" stroke="#4A2E27" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="23.5" y1="42.5" x2="29" y2="36" stroke="#4A2E27" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="40.5" y1="42.5" x2="35" y2="36" stroke="#4A2E27" strokeWidth="1.5" strokeLinecap="round" />

          {/* Tiny sparkle accent */}
          <circle cx="48" cy="12" r="1.5" fill="#4D0E12" />
          <circle cx="14" cy="38" r="1.5" fill="#A5BCD6" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-heading font-extrabold tracking-tight text-sceptre leading-none ${currentSize.text}`}>
            IdeaPeer<span className="text-soil">Circle</span>
          </span>
          <span className={`font-body font-semibold tracking-wider uppercase text-soil/70 ${currentSize.subtext} mt-0.5`}>
            Build · Share · Learn · Improve
          </span>
        </div>
      )}
    </div>
  );
}
