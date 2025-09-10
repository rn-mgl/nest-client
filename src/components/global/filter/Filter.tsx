import { FilterInterface } from "@/interface/FilterInterface";
import React from "react";
import Category from "./Category";
import Search from "./Search";
import Sort from "./Sort";

// custom reusable filter button
const Option: React.FC<{ onClick: () => void; label: string }> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="p-2 w-full transition-all bg-neutral-200 rounded-xs capitalize"
    >
      {props.label}
    </button>
  );
};

const Filter: React.FC<FilterInterface> = ({
  search,
  sort,
  category,
  ...props
}) => {
  const mappedSearch =
    search &&
    props?.searchKeyLabelPairs?.map((value) => {
      return (
        <Option
          key={`${value.label}-${value.key}`}
          label={value.label}
          onClick={() => search.selectSearch(value.key, value.label)}
        />
      );
    });

  const mappedSorting =
    sort &&
    props?.sortKeyLabelPairs?.map((value) => {
      return (
        <Option
          key={`${value.label}-${value.key}`}
          onClick={() => sort.selectSort(value.key, value.label)}
          label={value.label}
        />
      );
    });

  const mappedCategories =
    category &&
    props?.categoryKeyValuePairs?.flatMap((cat) => {
      return cat.labelValues.map((value) => {
        return (
          <Option
            key={`${cat.key}-${value.value}-${value.label}`}
            onClick={() =>
              category.selectCategory(cat.key, value.value, value.label)
            }
            label={value.label}
          />
        );
      });
    });

  return (
    <div className="w-full flex flex-row items-start gap-4 p-1 relative">
      {search && search.canSeeSearchDropDown ? (
        <div
          className="w-full max-h-90 t:w-6/12 l-l:w-4/12 absolute top-2 left-0 flex flex-col items-center justify-start translate-y-14 z-20
          rounded-md animate-fade bg-neutral-100 shadow-md p-2 gap-2 min-w-72 mr-auto"
        >
          {mappedSearch}
        </div>
      ) : null}

      {sort && sort.canSeeSortDropDown ? (
        <div
          className={`w-full max-h-90 min-w-72 absolute top-2 right-0 flex flex-col items-center justify-start translate-y-14 z-20
                    rounded-md gap-2 animate-fade bg-neutral-100 p-2 shadow-md t:w-44 t:max-w-44 t:min-w-44 
                    ${category ? "t:right-49" : "t:right-1"}`}
        >
          {mappedSorting}
        </div>
      ) : null}

      {category && category.canSeeCategoryDropDown ? (
        <div
          className="w-full max-h-90 overflow-y-auto min-w-72 absolute top-2 right-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md gap-2 p-2 bg-neutral-100 animate-fade shadow-md t:w-44 t:max-w-44 t:min-w-44 t:right-1"
        >
          {mappedCategories}
        </div>
      ) : null}

      <div className="w-full flex flex-row items-start gap-4 overflow-x-auto py-2">
        {search ? (
          <Search
            searchLabel={search.searchLabel}
            searchKey={search.searchKey}
            searchValue={search.searchValue}
            canSeeSearchDropDown={search.canSeeSearchDropDown}
            selectSearch={search.selectSearch}
            toggleCanSeeSearchDropDown={search.toggleCanSeeSearchDropDown}
            onChange={search.onChange}
          />
        ) : null}

        {sort ? (
          <Sort
            sortKey={sort.sortKey}
            isAsc={sort.isAsc}
            sortLabel={sort.sortLabel}
            toggleCanSeeSortDropDown={sort.toggleCanSeeSortDropDown}
            toggleAsc={sort.toggleAsc}
            canSeeSortDropDown={sort.canSeeSortDropDown}
            selectSort={sort.selectSort}
          />
        ) : null}

        {category ? (
          <Category
            categoryValue={category.categoryValue}
            categoryLabel={category.categoryLabel}
            toggleCanSeeCategoryDropDown={category.toggleCanSeeCategoryDropDown}
            selectCategory={category.selectCategory}
            canSeeCategoryDropDown={category.canSeeCategoryDropDown}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Filter;
