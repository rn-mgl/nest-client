import { CardInterface } from "@/src/interface/CardInterface";
import { FolderInterface } from "@/src/interface/DocumentInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import Link from "next/link";
import React from "react";
import { IoEllipsisVertical, IoPencil, IoTrash } from "react-icons/io5";

const FolderCard: React.FC<CardInterface & FolderInterface & UserInterface> = (
  props
) => {
  const role = props.role;
  const isHR = role === "hr";

  return (
    <div className="w-full h-full p-4 rounded-md bg-linear-to-br from-accent-yellow/30 to-accent-blue/30 flex flex-col items-start justify-start gap-4 relative  max-h-56 max-w-full">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col items-start justify-start">
          <Link
            href={`/nest/${role}/document/${props.id}`}
            className="font-bold truncate hover:underline"
          >
            {props.name}
          </Link>
          <p className="text-xs">
            created by{" "}
            {props.createdByCurrentUser ? "you" : `${props.first_name}`}
          </p>
        </div>

        {isHR ? (
          <button
            onClick={props.handleActiveMenu}
            className="p-2 rounded-full hover:bg-white transition-all"
          >
            <IoEllipsisVertical
              className={`${
                props.activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>
        ) : null}

        {props.activeMenu ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={props.handleCanEdit}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {props.createdByCurrentUser ? (
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
    </div>
  );
};

export default FolderCard;
