import { CardInterface } from "@/src/interface/CardInterface";
import {
  LeaveTypeInterface,
  LeaveRequestInterface,
} from "@/src/interface/LeaveInterface";
import React from "react";
import { IoEllipsisVertical, IoPencil, IoTrash } from "react-icons/io5";

const LeaveRequestCard: React.FC<
  CardInterface & LeaveTypeInterface & LeaveRequestInterface
> = (props) => {
  return (
    <div className="w-full h-full bg-neutral-100 rounded-md flex flex-col items-center justify-start gap-4 p-4 max-h-80 relative overflow-hidden">
      <div className="flex flex-row items-start justify-start w-full">
        <div className="flex flex-col items-start justify-center w-full">
          <p className="font-bold">{props.type}</p>
          <p className="text-xs">{props.requested_at}</p>
        </div>

        {props.createdBy ? (
          <button
            onClick={props.handleActiveMenu}
            className="p-2 rounded-full bg-neutral-100 transition-all"
          >
            <IoEllipsisVertical
              className={`${
                props.activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>
        ) : null}
      </div>

      {props.activeMenu ? (
        <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
          <button
            onClick={props.handleCanEdit}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoPencil className="text-accent-blue" />
            Edit
          </button>

          {props.createdBy ? (
            <button
              onClick={props.handleCanDelete}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoTrash className="text-red-600" />
              Delete
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col items-center justify-start gap-2 w-full h-full overflow-hidden">
        <div className="w-full flex flex-col items-center justify-start gap-2 text-sm bg-neutral-200 p-2 rounded-sm">
          <p className="text-sm w-full">{props.status}</p>
        </div>

        <div className="w-full flex flex-col items-center justify-start gap-2 text-sm bg-neutral-200 p-2 rounded-sm">
          <p className="text-sm w-full">{props.start_date}</p>
        </div>

        <div className="w-full flex flex-col items-center justify-start gap-2 text-sm bg-neutral-200 p-2 rounded-sm">
          <p className="text-sm w-full">{props.end_date}</p>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-start gap-2 text-sm bg-neutral-200 p-2 rounded-sm overflow-y-auto">
          <p className="text-sm w-full">{props.reason}</p>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestCard;
