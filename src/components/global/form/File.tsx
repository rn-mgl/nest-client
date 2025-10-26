import { FileInterface } from "@/src/interface/FormInterface";
import Image from "next/image";
import React from "react";
import { IoAdd, IoAttach, IoClose, IoFilm } from "react-icons/io5";

const File: React.FC<FileInterface & { ref: React.Ref<HTMLInputElement> }> = (
  props
) => {
  const SELECTED_FILE_RENDER = {
    application: (
      <div className="w-full p-2 flex flex-col items-center justify-center rounded-md border-2 bg-white relative">
        <div className="w-full flex flex-row items-center justify-start gap-2">
          <div className="p-2.5 rounded-sm bg-accent-blue/50 text-neutral-100">
            <IoAttach className="text-2xl" />
          </div>
          <p className="truncate text-sm">
            {props.file && typeof props.file === "object"
              ? props.file.name
              : "File"}
          </p>
        </div>
      </div>
    ),
    image: props.url ? (
      <Image
        src={props.url}
        alt="file"
        width={100}
        height={100}
        className="rounded-md w-full"
      />
    ) : (
      <div className="p-2.5 rounded-sm bg-accent-blue/50 text-neutral-100">
        <IoAttach className="text-2xl" />
      </div>
    ),
    video: props.url ? (
      <video src={props.url} controls className="rounded-md w-full" />
    ) : (
      <div className="p-2.5 rounded-sm bg-accent-blue/50 text-neutral-100">
        <IoFilm className="text-2xl" />
      </div>
    ),
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative gap-2">
      {props.file ? (
        <div className="w-full p-2 flex flex-col items-center justify-center rounded-md border-2 bg-white">
          {SELECTED_FILE_RENDER[props.type as keyof object]}

          <button
            onClick={props.removeSelectedFile}
            type="button"
            className="absolute top-1 right-1 p-1 bg-red-600 text-neutral-100 rounded-full z-50"
          >
            <IoClose />
          </button>
        </div>
      ) : null}

      <label
        htmlFor={props.id}
        className={`w-full p-4 flex-row items-center justify-center text-accent-purple gap-1 cursor-pointer rounded-md bg-white border-2 ${
          props.file ? "hidden" : "flex"
        }`}
      >
        <input
          type="file"
          accept={props.accept}
          id={props.id}
          name={props.name}
          onChange={props.file ? () => {} : props.onChange}
          ref={props.ref}
          className="hidden"
        />
        <p className="text-sm">Attach {props.label ?? "File"}</p>
        <IoAdd />
      </label>
    </div>
  );
};

export default File;
