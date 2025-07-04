import React from "react";
import { InputInterface } from "@/src/interface/FormInterface";

const Input: React.FC<InputInterface> = (props) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-1">
      {props.label ? (
        <label htmlFor={props.id} className="text-xs">
          {props.placeholder}
        </label>
      ) : null}

      <div className="w-full flex flex-col items-center justify-center relative">
        <input
          type={props.type}
          name={props.name}
          id={props.id}
          placeholder={props.placeholder}
          required={props.required}
          value={props.value}
          onChange={(e) => props.onChange(e)}
          min={props.min}
          className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all bg-white"
        />

        {props.icon ? (
          <div className="bg-inherit absolute right-1 p-1.5 rounded-md flex flex-col items-center justify-center">
            {props.icon}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
