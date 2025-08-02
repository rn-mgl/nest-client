import {
  LeaveBalanceInterface,
  LeaveTypeInterface,
} from "@/src/interface/LeaveInterface";
import React from "react";

const LeaveBalanceCard: React.FC<
  LeaveTypeInterface &
    LeaveBalanceInterface & { toggleSelectedLeaveRequest?: () => void }
> = (props) => {
  return (
    <div className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative max-w-full max-h-72">
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div className="flex flex-col items-start justify-start w-full overflow-hidden">
          <p className="font-bold truncate w-full">{props.type}</p>
        </div>

        <div className="flex flex-row items-center justify-between text-sm gap-1">
          <span>Balance:</span>
          <span className="font-bold">{props.balance ?? 0}</span>
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2 bg-neutral-200 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.description}
        </p>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <button
          onClick={props.toggleSelectedLeaveRequest}
          className="p-2 bg-accent-blue w-full rounded-md font-bold text-accent-yellow"
        >
          Request Leave
        </button>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
