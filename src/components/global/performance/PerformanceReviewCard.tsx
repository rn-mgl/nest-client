import { PerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { isUserSummary } from "@/src/utils/utils";
import React from "react";

const PerformanceReviewCard: React.FC<{
  performance: PerformanceReviewInterface;
  children: React.ReactNode;
}> = ({ children, ...props }) => {
  const createdBy = isUserSummary(props.performance.created_by)
    ? props.performance.created_by
    : null;
  return (
    <div
      className="w-full min-h-[17rem] p-4 rounded-md bg-neutral-100 flex 
                         flex-col items-center justify-start gap-4 relative max-w-full transition-all"
    >
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col items-start justify-start">
          <p className="font-bold truncate">{props.performance.title}</p>
          {createdBy ? (
            <p className="text-xs">created by {createdBy.first_name}</p>
          ) : null}
        </div>
      </div>

      <div className="w-full h-40 max-h-40 min-h-40 flex flex-col items-center justify-start overflow-y-auto bg-neutral-200 p-2 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.performance.description}
        </p>
      </div>

      {children}
    </div>
  );
};

export default PerformanceReviewCard;
