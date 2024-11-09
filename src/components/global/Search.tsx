import {
  Filter as FilterInterface,
  Search as SearchInterface,
} from "@/interface/FilterInterface";
import React from "react";
import { IoFilter, IoSearch } from "react-icons/io5";

const Search: React.FC<SearchInterface & FilterInterface> = (props) => {
  const mappedSearch = props.searchKeyLabelPairs.map((search, index) => {
    return (
      <button
        key={index}
        onClick={() => props.selectSearch(search.key, search.label)}
        className="p-2 w-full transition-all bg-neutral-200 rounded-sm"
      >
        {search.label}
      </button>
    );
  });

  return (
    <div
      className={`t:w-6/12 l-l:w-4/12 flex flex-row items-center justify-center gap-2 relative ${
        props.showFilters ? "w-fit t:w-full" : "w-full"
      } relative`}
    >
      <input
        type="text"
        name={props.searchKey}
        id={props.searchKey}
        placeholder={`Search ${props.searchLabel}`}
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
        <button
          onClick={props.toggleShowSearch}
          className="bg-white border-2 p-3 text-neutral-900 rounded-md flex flex-col items-center justify-center"
        >
          <IoFilter />
        </button>
      )}

      {props.canShowSearch ? (
        <div
          className="w-full absolute top-0 left-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md animate-fade bg-neutral-100 shadow-md p-2 gap-2"
        >
          {mappedSearch}
        </div>
      ) : null}
    </div>
  );
};

export default Search;
