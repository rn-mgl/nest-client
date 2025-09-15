import { CardInterface } from "@/src/interface/CardInterface";
import { DocumentInterface } from "@/src/interface/DocumentInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import React from "react";
import {
  IoArrowForward,
  IoEllipsisVertical,
  IoPencil,
  IoTrash,
} from "react-icons/io5";

const DocumentCard: React.FC<
  CardInterface & DocumentInterface & UserInterface
> = (props) => {
  const isHR = props.role === "hr";

  return (
    <div className="w-full h-full p-4 rounded-md bg-neutral-100 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col items-start justify-start">
          <p className="font-bold truncate">{props.name}</p>
          <p className="text-xs">
            created by {props.createdBy ? "you" : `${props.first_name}`}
          </p>
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
        ) : null}
      </div>

      <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2 bg-neutral-200 rounded-xs">
        <p className="text-sm w-full text-wrap break-words">
          {props.description}
        </p>
      </div>

      {props.activeMenu ? (
        <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
          <button
            onClick={props.handleActiveEdit}
            className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
          >
            <IoPencil className="text-accent-blue" />
            Edit
          </button>

          {props.createdBy ? (
            <button
              onClick={props.handleActiveDelete}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoTrash className="text-red-600" />
              Delete
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center ">
        <button
          onClick={props.handleActiveSeeMore}
          className="text-xs flex flex-row items-center justify-center gap-1 w-full p-2 rounded-md bg-accent-blue text-neutral-100"
        >
          See More <IoArrowForward />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
