import React from "react";
import { TextArea as TextAreaInterface } from "@/src/interface/FormInterface";

const TextArea: React.FC<TextAreaInterface> = (props) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-1">
      {props.label ? (
        <label htmlFor={props.id} className="text-xs">
          {props.placeholder}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative">
        <textarea
          name={props.id}
          id={props.id}
          placeholder={props.placeholder}
          required={props.required}
          value={props.value}
          onChange={(e) => props.onChange(e)}
          rows={props.rows ?? 5}
          className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
        />

        {props.icon ? (
          <div className="bg-white absolute right-1 p-1.5 top-1.5 rounded-md flex flex-col items-center justify-center">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TextArea;
