import {
  Filter as FilterInterface,
  Sort as SortInterface,
} from "@/interface/FilterInterface";
import React from "react";
import { IoArrowUp } from "react-icons/io5";

const Sort: React.FC<SortInterface & FilterInterface> = (props) => {
  const mappedSorting = props.sortKeyLabelPairs.map((sort, index) => {
    return (
      <button
        key={index}
        onClick={() => props.selectSort(props.sortKey)}
        className="p-2 w-full hover:brightness-90 transition-all bg-neutral-200 rounded-sm shadow-md"
      >
        {sort.label}
      </button>
    );
  });

  return (
    <div
      className={`${
        props.showFilters ? "flex" : "hidden t:flex"
      } w-full t:max-w-44 t:min-w-44 gap-2 relative`}
    >
      <button
        onClick={props.toggleShowSort}
        className="p-2 rounded-md border-2 w-full"
      >
        Sort
      </button>

      <button
        onClick={() => props.toggleAsc()}
        className="p-2 rounded-md border-2 w-14 flex flex-col items-center justify-center"
      >
        <IoArrowUp
          className={`${
            props.isAsc ? "rotate-0" : "rotate-180"
          } transition-all`}
        />
      </button>

      {props.canShowSort ? (
        <div
          className="w-full absolute top-0 left-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md gap-4 animate-fade"
        >
          {mappedSorting}
        </div>
      ) : null}
    </div>
  );
};

export default Sort;
