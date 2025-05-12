import { RadioInterface } from "@/src/interface/FormInterface";
import React from "react";

const Radio: React.FC<RadioInterface> = (props) => {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        className="hidden peer"
        name={props.name}
        onChange={(e) => props.onChange(e)}
        value={props.value}
        checked={props.isChecked}
      />
      <div className="p-1 rounded-md border-2 bg-white peer-checked:*:bg-accent-green">
        <div className="p-4 rounded-sm "></div>
      </div>
    </label>
  );
};

export default Radio;
