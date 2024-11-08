import {
  Filter as FilterInterface,
  Search as SearchInterface,
} from "@/src/interface/NavInterface";
import React from "react";
import { IoFilter, IoSearch } from "react-icons/io5";

const Search: React.FC<SearchInterface & FilterInterface> = (props) => {
  return (
    <div
      className={`h-full w-full t:w-6/12 l-l:w-4/12 flex flex-row items-center justify-center gap-2 relative ${
        props.showFilters ? "w-fit t:w-full" : "w-full"
      }`}
    >
      <input
        type="text"
        name={props.searchKey}
        id={props.searchKey}
        placeholder={`Search ${props.searchKey}`}
        value={props.searchValue}
        required={true}
        onChange={(e) => props.onChange(e)}
        className={` w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all ${
          props.showFilters ? "hidden t:flex" : "flex"
        }`}
      />

      {props.showFilters ? (
        <button
          onClick={props.toggleShowFilters}
          className="bg-white border-2 p-3 text-neutral-900 rounded-md flex flex-col items-center justify-center"
        >
          <IoSearch />
        </button>
      ) : (
        <button className="bg-white border-2 p-3 text-neutral-900 rounded-md flex flex-col items-center justify-center">
          <IoFilter />
        </button>
      )}
    </div>
  );
};

export default Search;
