import React from "react";
import {
  CategoryInterface,
  FilterInterface,
  SearchInterface,
  SortInterface,
} from "@/interface/FilterInterface";
import Search from "./Search";
import Sort from "./Sort";
import Category from "./Category";
import { IoOptions } from "react-icons/io5";

const Filter: React.FC<
  FilterInterface & SearchInterface & CategoryInterface & SortInterface
> = (props) => {
  return (
    <div className="w-full flex flex-row items-start justify-between gap-2 t:gap-4">
      {props.showSearch ? (
        <Search
          searchLabel={props.searchLabel}
          showFilters={props.showFilters}
          searchKey={props.searchKey}
          searchValue={props.searchValue}
          searchKeyLabelPairs={props.searchKeyLabelPairs}
          canShowSearch={props.canShowSearch}
          selectSearch={props.selectSearch}
          toggleShowSearch={props.toggleShowSearch}
          onChange={props.onChange}
          toggleShowFilters={props.toggleShowFilters}
        />
      ) : null}

      <div
        className={`flex flex-row items-center justify-end gap-2 t:gap-4 flex-wrap ml-auto ${
          props.showFilters ? "w-full" : "w-auto"
        }`}
      >
        {props.showSort ? (
          <Sort
            sortKey={props.sortKey}
            isAsc={props.isAsc}
            showFilters={props.showFilters}
            sortLabel={props.sortLabel}
            toggleShowFilters={props.toggleShowFilters}
            toggleShowSort={props.toggleShowSort}
            toggleAsc={props.toggleAsc}
            canShowSort={props.canShowSort}
            sortKeyLabelPairs={props.sortKeyLabelPairs}
            selectSort={props.selectSort}
          />
        ) : null}

        {props.showCategory ? (
          <Category
            categoryLabel={props.categoryLabel}
            showFilters={props.showFilters}
            toggleShowFilters={props.toggleShowFilters}
            categoryKeyValuePairs={props.categoryKeyValuePairs}
            toggleShowCategories={props.toggleShowCategories}
            selectCategory={props.selectCategory}
            canShowCategories={props.canShowCategories}
          />
        ) : null}

        <button
          onClick={props.toggleShowFilters}
          className={`p-3 rounded-md border-2 ${
            props.showFilters ? "hidden" : "flex t:hidden"
          }`}
        >
          <IoOptions className="text-neutral-900" />
        </button>
      </div>
    </div>
  );
};

export default Filter;
