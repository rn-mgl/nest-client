import { CardInterface } from "@/src/interface/CardInterface";
import {
  EmployeeTrainingInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import React from "react";
import {
  IoArrowForward,
  IoEllipsisVertical,
  IoPencil,
  IoPersonAdd,
  IoTrash,
} from "react-icons/io5";

const TrainingCard: React.FC<
  CardInterface &
    TrainingInterface &
    UserInterface &
    Partial<EmployeeTrainingInterface>
> = (props) => {
  const isHR = props.role === "hr";
  const isEmployee = props.role === "employee";
  return (
    <div
      className="w-full min-h-[17rem] p-4 rounded-md bg-neutral-100 flex 
                        flex-col items-center justify-start gap-4 relative max-w-full transition-all"
    >
      <div className="flex flex-col items-start justify-between w-full gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-start w-full gap-1">
            <p className="font-bold truncate">{props.title}</p>
            {isHR ? (
              <p className="text-xs">
                created by {props.createdBy ? "you" : props.first_name}
              </p>
            ) : null}
          </div>

          {isHR ? (
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
          ) : isEmployee ? (
            <p className="text-sm" title="Status">
              {props.status}
            </p>
          ) : null}
        </div>

        {isEmployee ? (
          <div className="w-full flex flex-row items-start text-sm truncate justify-start font-semibold">
            {props.deadline ?? "No Deadline"}
          </div>
        ) : null}
      </div>

      <div className="w-full h-40 max-h-40 min-h-40 flex flex-col items-center justify-start overflow-y-auto bg-neutral-200 p-2 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.description}
        </p>
      </div>

      <button
        onClick={props.handleActiveSeeMore}
        className="text-xs transition-all flex flex-row items-center justify-center gap-1 p-2 rounded-md bg-accent-blue text-neutral-100 w-full"
      >
        See More <IoArrowForward />
      </button>

      {isHR && props.activeMenu ? (
        <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
          <button
            onClick={props.handleCanEdit}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoPencil className="text-accent-blue" />
            Edit
          </button>

          <button
            onClick={props.handleCanAssign}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoPersonAdd className="text-accent-blue" />
            Assign
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
    </div>
  );
};

export default TrainingCard;
