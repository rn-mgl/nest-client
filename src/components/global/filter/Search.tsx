import { SearchInterface } from "@/interface/FilterInterface";
import React from "react";
import { IoFilter } from "react-icons/io5";

const Search: React.FC<SearchInterface> = (props) => {
  return (
    <div className="t:w-6/12 l-l:w-4/12 flex flex-row items-center justify-center gap-2 relative w-full min-w-72 mr-auto">
      <input
        type="text"
        name={props.searchKey}
        id={props.searchKey}
        placeholder={`Search ${props.searchLabel}`}
        value={props.searchValue}
        required={true}
        onChange={(e) => props.onChange(e)}
        className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all flex"
      />

      <button
        onClick={props.toggleCanSeeSearchDropDown}
        className="bg-white border-2 p-3 text-neutral-900 rounded-md flex flex-col items-center justify-center"
      >
        <IoFilter />
      </button>
    </div>
  );
};

export default Search;
