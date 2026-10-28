import React from 'react';

export function CardSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 p-5 shadow-xs animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-base-300"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-base-300 rounded w-1/3"></div>
          <div className="h-3 bg-base-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-8 bg-base-300 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-base-300 rounded w-full"></div>
    </div>
  );
}

export function TaskListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-base-200 bg-base-100 flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 rounded bg-base-300"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-base-300 rounded w-3/5"></div>
              <div className="h-3 bg-base-300 rounded w-1/4"></div>
            </div>
          </div>
          <div className="w-16 h-6 rounded bg-base-300"></div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-200 p-6 shadow-xs animate-pulse">
      <div className="h-5 bg-base-300 rounded w-1/4 mb-6"></div>
      <div className="h-64 bg-base-200 rounded-lg flex items-end justify-between p-4 gap-2">
        <div className="w-10 h-24 bg-base-300 rounded"></div>
        <div className="w-10 h-40 bg-base-300 rounded"></div>
        <div className="w-10 h-32 bg-base-300 rounded"></div>
        <div className="w-10 h-48 bg-base-300 rounded"></div>
        <div className="w-10 h-20 bg-base-300 rounded"></div>
        <div className="w-10 h-56 bg-base-300 rounded"></div>
        <div className="w-10 h-36 bg-base-300 rounded"></div>
      </div>
    </div>
  );
}
