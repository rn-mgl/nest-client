import { LeaveBalanceInterface } from "@/src/interface/LeaveInterface";
import { isUserSummary } from "@/src/utils/utils";
import React from "react";

const LeaveBalanceCard: React.FC<
  LeaveBalanceInterface & { toggleSelectedLeaveRequest: () => void }
> = (props) => {
  const providedBy = isUserSummary(props.provided_by)
    ? props.provided_by
    : null;

  return (
    <div className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative max-w-full max-h-72">
      <div className="flex flex-row items-start justify-between w-full gap-2">
        <div className="flex flex-col items-start justify-start w-full overflow-hidden">
          <h3 className="font-bold truncate w-full">{props.leave.type}</h3>

          {providedBy ? (
            <div className="w-full flex flex-col items-start justify-center">
              <p className="font-light text-xs">
                provided by {providedBy?.first_name}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-row items-center justify-between text-sm gap-1">
          <span>Balance:</span>
          <h3 className="font-bold">{props.balance ?? 0}</h3>
        </div>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2 bg-neutral-200 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.leave.description}
        </p>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <button
          onClick={props.toggleSelectedLeaveRequest}
          className="p-2 bg-accent-blue w-full rounded-md font-medium text-accent-yellow text-sm"
        >
          Request Leave
        </button>
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
