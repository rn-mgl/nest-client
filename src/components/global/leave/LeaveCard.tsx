import { LeaveTypeInterface } from "@/src/interface/LeaveInterface";
import { isUserSummary } from "@/src/utils/utils";
import React from "react";

const LeaveCard: React.FC<
  { leave: LeaveTypeInterface } & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const createdBy = isUserSummary(props.leave.created_by)
    ? props.leave.created_by
    : null;

  return (
    <div className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative max-w-full">
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div className="flex flex-col items-start justify-start w-full overflow-hidden">
          <p className="font-bold truncate w-full">{props.leave.type}</p>

          {createdBy ? (
            <p className="text-xs">created by {createdBy.first_name}</p>
          ) : null}
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2 bg-neutral-200 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.leave.description}
        </p>
      </div>

      {children}
    </div>
  );
};

export default LeaveCard;
