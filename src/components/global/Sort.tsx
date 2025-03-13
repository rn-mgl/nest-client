import { FilterInterface, SortInterface } from "@/interface/FilterInterface";
import React from "react";
import { GoSortAsc, GoSortDesc } from "react-icons/go";
const Sort: React.FC<SortInterface & FilterInterface> = (props) => {
  const mappedSorting = props.sortKeyLabelPairs.map((sort, index) => {
    return (
      <button
        key={index}
        onClick={() => props.selectSort(sort.key, sort.label)}
        className="p-2 w-full transition-all bg-neutral-200 rounded-sm"
      >
        {sort.label}
      </button>
    );
  });

  return (
    <div
      className={`${
        props.showFilters ? "flex" : "hidden t:flex"
      } w-full t:w-44 t:max-w-44 t:min-w-44 gap-2 relative`}
    >
      <button
        onClick={props.toggleShowSort}
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
          <GoSortDesc className="text-xl" />
        ) : (
          <GoSortAsc className="text-xl" />
        )}
      </button>

      {props.canShowSort ? (
        <div
          className="w-full absolute top-0 left-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md gap-2 animate-fade bg-neutral-100 p-2 shadow-md"
        >
          {mappedSorting}
        </div>
      ) : null}
    </div>
  );
};

export default Sort;
