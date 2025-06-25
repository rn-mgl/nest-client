import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-start overflow-hidden">
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
              t:items-start t:p-4 gap-4 t:gap-8 overflow-hidden"
      >
        <div className="w-full flex flex-row items-start gap-2">
          <div className="w-full min-w-72 flex flex-row items-center justify-between gap-2 t:w-6/12 l-l:w-4/12 mr-auto">
            <div className="p-2 rounded-md bg-neutral-200 w-full min-h-14 h-14 animate-skeleton-fade" />
            <div className="p-2 rounded-md bg-neutral-200 min-h-14 h-14 min-w-14 w-14 animate-skeleton-fade" />
          </div>

          <div className="w-full flex-row items-center justify-between gap-2 t:w-44 t:min-w-44 t:max-w-44 hidden t:flex">
            <div className="p-2 rounded-md bg-neutral-200 w-full min-h-14 h-14 animate-skeleton-fade" />
            <div className="p-2 rounded-md bg-neutral-200 min-h-14 h-14 min-w-14 w-14 animate-skeleton-fade" />
          </div>

          <div className="w-full flex-row items-center justify-between gap-2 t:w-44 t:min-w-44 t:max-w-44 hidden t:flex">
            <div className="p-2 rounded-md bg-neutral-200 w-full min-h-14 h-14 animate-skeleton-fade" />
            <div className="p-2 rounded-md bg-neutral-200 min-h-14 h-14 min-w-14 w-14 animate-skeleton-fade" />
          </div>
        </div>

        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade" />
          <div className="p-2 rounded-md bg-neutral-200 w-full min-h-36 h-36 animate-skeleton-fade" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
