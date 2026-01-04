import { SelectInterface } from "@/src/interface/FormInterface";
import React from "react";

const Select: React.FC<SelectInterface> = (props) => {
  const [activeSelect, setActiveSelect] = React.useState(false);

  const handleActiveSelect = () => {
    setActiveSelect((prev) => !prev);
  };

  const mappedOptions = props.options.map((option) => {
    return (
      <button
        key={option.value}
        disabled={props.value === option.value}
        onClick={() => {
          props.onChange(option.value, option.label);
          handleActiveSelect();
        }}
        className="p-2 w-full transition-all bg-neutral-200 rounded-xs disabled:bg-accent-blue/20"
      >
        {option.label}
      </button>
    );
  });

  return (
    <div className="w-full gap-2 relative flex flex-col items-start justify-center">
      {props.label ? (
        <label htmlFor={props.id} className="text-xs">
          {props.placeholder}
        </label>
      ) : null}

      <button
        type="button"
        onClick={handleActiveSelect}
        className="w-full flex flex-col items-start justify-center p-2 rounded-md border-2 relative bg-white"
      >
        {props.options.find((option) => option.value === props.value)?.label}

        {props.icon ? (
          <div className="bg-inherit absolute right-1 p-1.5 rounded-md flex flex-col items-center justify-center hover:bg-white">
            {props.icon}
          </div>
        ) : null}
      </button>

      {activeSelect ? (
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
