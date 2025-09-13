import {
  BaseActionsInterface,
  HRActionsInterface,
} from "@/src/interface/CardInterface";
import React from "react";
import { IoEye, IoPencil, IoPersonAdd, IoTrash } from "react-icons/io5";

const HRActions: React.FC<BaseActionsInterface & HRActionsInterface> = (
  props
) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2 w-full">
      {props.handleActiveSeeMore ? (
        <button
          onClick={props.handleActiveSeeMore}
          title="See More"
          className="w-full flex flex-col items-center p-2 rounded-sm font-semibold text-sm bg-accent-blue text-neutral-100"
        >
          <IoEye />
        </button>
      ) : null}

      <button
        onClick={props.handleCanEdit}
        title="Edit"
        className="w-full flex flex-col items-center p-2 rounded-sm font-semibold text-sm bg-accent-yellow text-accent-blue"
      >
        <IoPencil />
      </button>
      <button
        onClick={props.handleCanAssign}
        title="Assign"
        className="w-full flex flex-col items-center p-2 rounded-sm font-semibold text-sm bg-accent-purple text-neutral-100"
      >
        <IoPersonAdd />
      </button>
      <button
        onClick={props.handleCanDelete}
        title="Delete"
        className="w-full flex flex-col items-center p-2 rounded-sm font-semibold text-sm bg-red-600 text-white"
      >
        <IoTrash />
      </button>
    </div>
  );
};

export default HRActions;
