import { CheckBoxInterface } from "@/src/interface/FormInterface";
import React from "react";
import { IoCheckmark } from "react-icons/io5";

const CheckBox: React.FC<CheckBoxInterface> = (props) => {
  return (
    <button
      onClick={() => props.onChange(props.value)}
      type="button"
      className={`border-2 rounded-sm p-1 
                    ${
                      props.isChecked
                        ? "bg-accent-green border-accent-yellow text-neutral-100 p-1"
                        : "bg-neutral-200 p-3"
                    }`}
    >
      {props.isChecked ? <IoCheckmark /> : null}
    </button>
  );
};

export default CheckBox;
