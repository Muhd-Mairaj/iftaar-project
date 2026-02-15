'use client';

import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95',
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Crescent (Professional curve) */}
        <path
          d="M30 25C15 40 15 60 30 75C45 90 70 85 85 70C70 85 45 80 30 65C15 50 15 35 30 20C28 22 29 23 30 25Z"
          className="fill-primary"
        />

        {/* Minimalist Lantern */}
        <rect
          x="48"
          y="35"
          width="4"
          height="10"
          rx="2"
          className="fill-lantern"
        />
        <path d="M42 45H58L55 55H45L42 45Z" className="fill-lantern" />
        <path d="M45 35H55L50 28L45 35Z" className="fill-lantern" />

        {/* Glow */}
        <circle
          cx="50"
          cy="48"
          r="12"
          className="fill-lantern/20 blur-[6px] animate-pulse"
        />
      </svg>

      {/* Decorative Outer Ring (Optional, very faint) */}
      <div className="absolute inset-[-4px] border border-primary/5 rounded-full pointer-events-none" />
    </div>
  );
}
