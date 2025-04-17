import { SortInterface } from "@/interface/FilterInterface";
import React from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
const Sort: React.FC<SortInterface> = (props) => {
  return (
    <div className="flex min-w-72 t:w-44 t:max-w-44 t:min-w-44 gap-2 relative">
      <button
        onClick={props.toggleCanSeeSortDropDown}
        className="p-2 rounded-md border-2 w-full truncate"
        title={`Sort: ${props.sortLabel}`}
      >
        {props.sortLabel}
      </button>

      <button
        onClick={() => props.toggleAsc()}
        className="p-2 rounded-md border-2 w-14 flex flex-col items-center justify-center"
      >
        {props.isAsc ? (
          <GoSortAsc className="text-xl" />
        ) : (
          <GoSortDesc className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default Sort;
