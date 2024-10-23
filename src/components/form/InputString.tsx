import React from "react";
import { InputString as InputStringInterface } from "@/src/interface/FormInterface";

const InputString: React.FC<InputStringInterface> = (props) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-1">
      <label htmlFor={props.id} className="text-xs">
        {props.placeholder}
      </label>
      <div className="w-full flex flex-col items-center justify-center relative">
        <input
          type={props.type}
          name={props.id}
          id={props.id}
          placeholder={props.placeholder}
          required={props.required}
          onChange={(e) => props.onChange(e)}
          className="w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all"
        />

        {props.icon ? (
          <div className="bg-white absolute right-1 p-1.5 rounded-md flex flex-col items-center justify-center">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InputString;
