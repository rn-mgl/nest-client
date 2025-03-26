import { LeaveInterface } from "@/src/interface/LeaveInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import React from "react";
import {
  IoEllipsisVertical,
  IoPencil,
  IoPersonAdd,
  IoTrash,
} from "react-icons/io5";

const LeaveCard: React.FC<{
  leave: LeaveInterface & UserInterface;
  createdBy: boolean;
  activeMenu: boolean;
  handleActiveLeaveMenu: (id: number) => void;
  handleCanEditLeave: () => void;
  handleCanAssignLeave: () => void;
  handleCanDeleteLeave: () => void;
}> = (props) => {
  return (
    <div className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col items-start justify-start">
          <p className="font-bold truncate">{props.leave.type}</p>
          <p className="text-xs">
            created by {props.createdBy ? "you" : `${props.leave.first_name}`}
          </p>
        </div>

        <button
          onClick={() =>
            props.leave.leave_id &&
            props.handleActiveLeaveMenu(props.leave.leave_id)
          }
          className="p-2 rounded-full bg-neutral-100 transition-all"
        >
          <IoEllipsisVertical
            className={`${
              props.activeMenu ? "text-accent-blue" : "text-neutral-900"
            }`}
          />
        </button>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2 bg-neutral-200 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.leave.description}
        </p>
      </div>

      {props.activeMenu ? (
        <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
          <button
            onClick={props.handleCanEditLeave}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoPencil className="text-accent-blue" />
            Edit
          </button>

          <button
            onClick={props.handleCanAssignLeave}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoPersonAdd className="text-accent-blue" />
            Assign
          </button>

          {props.createdBy ? (
            <button
              onClick={props.handleCanDeleteLeave}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoTrash className="text-red-600" />
              Delete
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default LeaveCard;
