import React, { useState, useEffect } from 'react';
import Logo from './Logo';

export default function OpeningAnimation({ onComplete }) {
  const [stage, setStage] = useState(0); 
  // stage 0: 0.0 - 0.7s (dots/stars appear)
  // stage 1: 0.7 - 1.5s (logo forms smoothly)
  // stage 2: 1.5 - 2.4s ("IdeaPeerCircle" appears)
  // stage 3: 2.4 - 3.1s ("Build. Share. Learn. Improve." fades/slides in)
  // stage 4: 3.1 - 3.5s (subtle glitter sweep passes through the logo)
  // stage 5: 3.5s+ (smooth exit transition)

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1500);
    const t3 = setTimeout(() => setStage(3), 2400);
    const t4 = setTimeout(() => setStage(4), 3100);
    const t5 = setTimeout(() => {
      setStage(5);
      setTimeout(() => {
        onComplete();
      }, 400);
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F5EFC6] overflow-hidden select-none transition-opacity duration-500 ${
        stage === 5 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="IdeaPeerCircle opening animation"
    >
      {/* Hand-drawn whimsical background stars and dots (0.0 - 0.7s) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          stage >= 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Floating Stars */}
        <svg className="absolute top-[18%] left-[22%] w-6 h-6 text-sceptre animate-pulse" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
        <svg className="absolute top-[28%] right-[20%] w-7 h-7 text-cerulean animate-bounce" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
        <svg className="absolute bottom-[24%] left-[25%] w-5 h-5 text-softBlue" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
        <svg className="absolute bottom-[20%] right-[24%] w-6 h-6 text-sceptre" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>

        {/* Playful Dotted Orbit Ring in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border-2 border-dashed border-cerulean/40 animate-spin" style={{ animationDuration: '40s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-dotted border-soil/20" />
      </div>

      {/* Center Branding Stage */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Stage 1: Logo forms smoothly */}
        <div
          className={`relative transition-all duration-700 transform ${
            stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          } ${stage === 4 ? 'glitter-sweep' : ''}`}
        >
          <div className="p-4 rounded-3xl bg-[#F5EFC6]/80 backdrop-blur-sm shadow-warm border border-sceptre/10">
            <Logo size="xl" showText={false} />
          </div>

          {/* Glitter sparkle trail during Stage 4 */}
          {stage >= 4 && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="absolute -top-3 -right-3 text-2xl animate-spin">✨</span>
              <span className="absolute -bottom-2 -left-2 text-xl animate-pulse">🌟</span>
            </div>
          )}
        </div>

        {/* Stage 2: "IdeaPeerCircle" appears (1.5 - 2.4s) */}
        <div
          className={`mt-6 transition-all duration-700 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-sceptre tracking-tight">
            IdeaPeer<span className="text-soil">Circle</span>
          </h1>
        </div>

        {/* Stage 3: Tagline fades/slides in (2.4 - 3.1s) */}
        <div
          className={`mt-3 transition-all duration-700 transform ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cerulean/30 border border-cerulean/50">
            <span className="text-sm md:text-base font-semibold tracking-wide text-soil font-heading">
              Build. Share. Learn. Improve.
            </span>
          </div>
        </div>
      </div>

      {/* Discreet Skip Button */}
      <button
        onClick={onComplete}
        className="absolute bottom-6 right-6 px-3 py-1.5 rounded-lg text-xs font-medium text-soil/70 hover:text-sceptre hover:bg-white/40 transition-colors"
      >
        Skip intro &rarr;
      </button>
    </div>
  );
}
