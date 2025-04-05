import { FileInterface } from "@/src/interface/FormInterface";
import React from "react";
import { IoAdd, IoAttach, IoClose } from "react-icons/io5";

const File: React.FC<FileInterface> = (props) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {props.file ? (
        <div className="w-full p-2 flex flex-col items-center justify-center rounded-md border-2 bg-white relative">
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <div className="p-2.5 rounded-sm bg-accent-blue/50 text-neutral-100">
              <IoAttach className="text-2xl" />
            </div>
            <p className="truncate text-sm">{props.file.name}</p>
          </div>

          <button
            onClick={props.removeSelectedFile}
            type="button"
            className="absolute -top-1 -right-1 p-1 bg-red-600 text-neutral-100 rounded-full"
          >
            <IoClose />
          </button>
        </div>
      ) : (
        <label
          htmlFor={props.id}
          className="w-full p-4 flex flex-row items-center justify-center text-accent-purple gap-1 cursor-pointer rounded-md bg-white border-2"
        >
          <input
            type="file"
            accept={props.accept}
            id={props.id}
            name={props.id}
            onChange={props.onChange}
            ref={props.ref}
            className="hidden"
          />
          <p className="text-sm">Attach {props.label ?? "File"}</p>
          <IoAdd />
        </label>
      )}
    </div>
  );
};

export default File;
