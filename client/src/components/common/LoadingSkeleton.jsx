import React from 'react';

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-3xl bg-[#FDFAF0] border border-soil/15 p-5 shadow-soft animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full h-44 rounded-2xl bg-soil/10 mb-4" />
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-soil/15" />
          <div className="w-24 h-4 bg-soil/10 rounded" />
        </div>
        <div className="w-3/4 h-6 bg-soil/15 rounded mb-2" />
        <div className="w-full h-12 bg-soil/10 rounded mb-4" />
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-soil/10 rounded-full" />
          <div className="w-16 h-6 bg-soil/10 rounded-full" />
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-soil/10 flex justify-between items-center">
        <div className="w-20 h-5 bg-soil/15 rounded" />
        <div className="w-24 h-9 bg-sceptre/20 rounded-xl" />
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse p-4">
      <div className="w-full h-64 sm:h-96 rounded-3xl bg-soil/10" />
      <div className="w-2/3 h-10 bg-soil/20 rounded" />
      <div className="w-full h-24 bg-soil/10 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 rounded-2xl bg-soil/10" />
        <div className="h-48 rounded-2xl bg-soil/10" />
        <div className="h-48 rounded-2xl bg-soil/10" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
