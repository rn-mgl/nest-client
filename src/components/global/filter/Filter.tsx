import {
  CategoryInterface,
  FilterInterface,
  SearchInterface,
  SortInterface,
} from "@/interface/FilterInterface";
import React from "react";
import Category from "./Category";
import Search from "./Search";
import Sort from "./Sort";

const Filter: React.FC<
  FilterInterface & Partial<SearchInterface & CategoryInterface & SortInterface>
> = (props) => {
  const mappedSearch = props.searchKeyLabelPairs?.map((search, index) => {
    return (
      <button
        key={index}
        onClick={() => {
          if (props.selectSearch) props.selectSearch(search.key, search.label);
        }}
        className="p-2 w-full transition-all bg-neutral-200 rounded-xs"
      >
        {search.label}
      </button>
    );
  });

  const mappedSorting = props.sortKeyLabelPairs?.map((sort, index) => {
    return (
      <button
        key={index}
        onClick={() => {
          if (props.selectSort) props.selectSort(sort.key, sort.label);
        }}
        className="p-2 w-full transition-all bg-neutral-200 rounded-xs"
      >
        {sort.label}
      </button>
    );
  });

  const mappedCategories = props.categoryKeyValuePairs?.map((category) => {
    return category.values.map((value, index) => {
      const formattedValue = value.replaceAll("_", " ");

      return (
        <button
          onClick={() => {
            if (props.selectCategory) props.selectCategory(category.key, value);
          }}
          key={index}
          className="p-2 w-full transition-all bg-neutral-200 rounded-xs capitalize"
        >
          {formattedValue}
        </button>
      );
    });
  });

  return (
    <div className="w-full flex flex-row items-start gap-4 p-1 relative">
      {props.canSeeSearchDropDown ? (
        <div
          className="w-full max-h-90 t:w-6/12 l-l:w-4/12 absolute top-2 left-0 flex flex-col items-center justify-start translate-y-14 z-20
          rounded-md animate-fade bg-neutral-100 shadow-md p-2 gap-2 min-w-72 mr-auto"
        >
          {mappedSearch}
        </div>
      ) : null}

      {props.canSeeSortDropDown ? (
        <div
          className={`w-full max-h-90 min-w-72 absolute top-2 right-0 flex flex-col items-center justify-start translate-y-14 z-20
                    rounded-md gap-2 animate-fade bg-neutral-100 p-2 shadow-md t:w-44 t:max-w-44 t:min-w-44 
                    ${props.useCategoryFilter ? "t:right-49" : "t:right-1"}`}
        >
          {mappedSorting}
        </div>
      ) : null}

      {props.canSeeCategoryDropDown ? (
        <div
          className="w-full max-h-90 overflow-y-auto min-w-72 absolute top-2 right-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md gap-2 p-2 bg-neutral-100 animate-fade shadow-md t:w-44 t:max-w-44 t:min-w-44 t:right-1"
        >
          {mappedCategories}
        </div>
      ) : null}

      <div className="w-full flex flex-row items-start gap-4 overflow-x-auto py-2">
        {props.useSearchFilter ? (
          <Search
            searchLabel={props.searchLabel ?? ""}
            searchKey={props.searchKey ?? ""}
            searchValue={props.searchValue ?? ""}
            canSeeSearchDropDown={props.canSeeSearchDropDown ?? false}
            selectSearch={props.selectSearch ?? (() => {})}
            toggleCanSeeSearchDropDown={
              props.toggleCanSeeSearchDropDown ?? (() => {})
            }
            onChange={props.onChange ?? (() => {})}
          />
        ) : null}

        {props.useSortFilter ? (
          <Sort
            sortKey={props.sortKey ?? ""}
            isAsc={props.isAsc ?? false}
            sortLabel={props.sortLabel ?? ""}
            toggleCanSeeSortDropDown={
              props.toggleCanSeeSortDropDown ?? (() => {})
            }
            toggleAsc={props.toggleAsc ?? (() => {})}
            canSeeSortDropDown={props.canSeeSortDropDown ?? false}
            selectSort={props.selectSort ?? (() => {})}
          />
        ) : null}

        {props.useCategoryFilter ? (
          <Category
            categoryValue={props.categoryValue ?? ""}
            toggleCanSeeCategoryDropDown={
              props.toggleCanSeeCategoryDropDown ?? (() => {})
            }
            selectCategory={props.selectCategory ?? (() => {})}
            canSeeCategoryDropDown={props.canSeeCategoryDropDown ?? false}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Filter;
