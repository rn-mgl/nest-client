import React from "react";

const PageSkeletonLoader = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start overflow-hidden">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
              t:items-start t:p-4 gap-4 t:gap-8 overflow-hidden"
      >
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade t:h-60" />
        </div>
      </div>
    </div>
  );
};

export default PageSkeletonLoader;
