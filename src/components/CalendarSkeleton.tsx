import React, { useEffect } from 'react';

interface CalendarSkeletonProps {
  onComplete: () => void;
}

export const CalendarSkeleton: React.FC<CalendarSkeletonProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 500); // 0.5 Seconds Skeleton Loading

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="max-w-[1788px] mx-auto px-4 lg:px-10 pt-8 space-y-8 animate-pulse font-tajawal">
      
      {/* Hero Banner Skeleton */}
      <div className="h-44 rounded-[28px] bg-slate-200/80 border border-slate-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-[22px] bg-slate-200/70 border border-slate-300 p-5 flex flex-col justify-between">
            <div className="h-4 w-24 bg-slate-300 rounded-md" />
            <div className="h-9 w-32 bg-slate-300 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="card-elevation p-6 lg:p-8 bg-white border border-[#E2E8F0] my-6 rounded-[24px]">
        {/* Day Header Skeleton */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 bg-slate-200 rounded-[12px]" />
          ))}
        </div>

        {/* 35 Calendar Cells Skeleton */}
        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[18px] bg-slate-100 border border-slate-200 p-3 flex flex-col justify-between">
              <div className="h-6 w-6 rounded-full bg-slate-200" />
              <div className="h-4 w-full bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CalendarSkeleton;
