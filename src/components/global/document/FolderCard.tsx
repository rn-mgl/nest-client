import { FolderCardInterface } from "@/src/interface/CardInterface";
import Link from "next/link";
import React from "react";

const FolderCard: React.FC<FolderCardInterface> = ({ children, ...props }) => {
  return (
    <div className="w-full h-fit p-4 rounded-md bg-linear-to-br from-accent-yellow/30 to-accent-blue/30 flex flex-col items-center justify-between gap-4 relative max-w-full">
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col items-start justify-start">
          <Link
            href={String(props.folder.id) ?? "0"}
            className="font-bold truncate hover:underline"
          >
            {props.folder.title}
          </Link>
          <p className="text-xs">created by {props.createdBy}</p>
        </div>
      </div>

      {children ? children : null}
    </div>
  );
};

export default FolderCard;
