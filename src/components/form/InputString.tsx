import React from "react";
import { InputString as Interface } from "@/components/interface/FormInterface";

const InputString: React.FC<Interface> = (props) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-1">
      <label htmlFor={props.id} className="text-xs">
        {props.placeholder}
      </label>
      <input
        type={props.type}
        name={props.id}
        id={props.id}
        placeholder={props.placeholder}
        required={props.required}
        className="w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all"
      />
    </div>
  );
};

export default InputString;
