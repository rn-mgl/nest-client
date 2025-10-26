import { ResourceActionsInterface } from "@/src/interface/CardInterface";
import React from "react";
import { IoPencil, IoPersonAdd, IoTrash } from "react-icons/io5";

const ResourceActions: React.FC<ResourceActionsInterface> = (props) => {
  return (
    <div className="flex flex-row items-center justify-between gap-2 w-full">
      {props.handleActiveEdit ? (
        <button
          onClick={props.handleActiveEdit}
          title="Edit"
          className="w-full flex flex-col items-center p-1 rounded-sm font-semibold text-xs bg-accent-yellow text-accent-blue"
        >
          <IoPencil />
        </button>
      ) : null}

      {props.handleActiveAssign ? (
        <button
          onClick={props.handleActiveAssign}
          title="Assign"
          className="w-full flex flex-col items-center p-1 rounded-sm font-semibold text-xs bg-accent-purple text-neutral-100"
        >
          <IoPersonAdd />
        </button>
      ) : null}

      {props.handleActiveDelete ? (
        <button
          onClick={props.handleActiveDelete}
          title="Delete"
          className="w-full flex flex-col items-center p-1 rounded-sm font-semibold text-xs bg-red-600 text-white"
        >
          <IoTrash />
        </button>
      ) : null}
    </div>
  );
};

export default ResourceActions;
