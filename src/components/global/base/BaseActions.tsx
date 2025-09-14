import { BaseActionsInterface } from "@/src/interface/CardInterface";
import React from "react";
import { IoArrowForward } from "react-icons/io5";

const BaseActions: React.FC<BaseActionsInterface & BaseActionsInterface> = (
  props
) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2 w-full">
      <button
        onClick={props.handleActiveSeeMore}
        title="See More"
        className="w-full flex flex-row items-center justify-center gap-2 p-2 rounded-sm font-medium text-xs bg-accent-blue text-neutral-100"
      >
        See More <IoArrowForward />
      </button>
    </div>
  );
};

export default BaseActions;
