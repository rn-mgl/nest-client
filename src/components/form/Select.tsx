import { SelectInterface } from "@/src/interface/FormInterface";
import React from "react";

const Select: React.FC<SelectInterface> = (props) => {
  const mappedOptions = props.options.map((option, index) => {
    return (
      <button
        key={index}
        disabled={props.value === option.value}
        onClick={() => {
          props.onChange(option.value, option.label);
          props.toggleSelect();
        }}
        className="p-2 w-full transition-all bg-neutral-200 rounded-sm disabled:bg-accent-blue/20"
      >
        {option.label}
      </button>
    );
  });

  return (
    <div className="w-full gap-2 relative ">
      <button
        type="button"
        onClick={props.toggleSelect}
        className="w-full flex flex-col items-start justify-center p-2 rounded-md border-2 relative bg-white"
      >
        {props.label}

        {props.icon ? (
          <div className="bg-white absolute right-1 p-1.5 rounded-md flex flex-col items-center justify-center hover:bg-white">
            {props.icon}
          </div>
        ) : null}
      </button>

      {props.activeSelect ? (
        <div
          className="w-full absolute top-0 left-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md gap-2 animate-fade bg-neutral-100 p-2 shadow-md overflow-y-auto max-h-48"
        >
          {mappedOptions}
        </div>
      ) : null}
    </div>
  );
};

export default Select;
