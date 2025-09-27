import { TextBlockInterface } from "@/src/interface/FieldInterface";
import React from "react";

const TextBlock: React.FC<TextBlockInterface> = (props) => {
  return (
    <div className="flex flex-col items-start justify-center w-full h-full gap-1">
      {props.label ? <p className="text-xs">{props.label}</p> : null}

      <div className="w-full min-h-40 h-full p-2 px-4 rounded-md border-2 relative overflow-x-auto overflow-y-auto bg-white">
        <p>{props.value}</p>
      </div>
    </div>
  );
};

export default TextBlock;
