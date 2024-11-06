import { Search as SearchInterface } from "@/src/interface/NavInterface";
import React from "react";
import { IoFilter } from "react-icons/io5";

const Search: React.FC<SearchInterface> = (props) => {
  return (
    <div className="h-full w-full t:w-6/12 flex flex-row items-center justify-center gap-2 relative">
      <input
        type="text"
        name={props.searchKey}
        id={props.searchKey}
        placeholder={`Search ${props.searchKey}`}
        value={props.searchValue}
        required={true}
        onChange={(e) => props.onChange(e)}
        className="w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all"
      />

      <button className="bg-white border-2 p-3 text-neutral-500 rounded-md flex flex-col items-center justify-center">
        <IoFilter />
      </button>
    </div>
  );
};

export default Search;
