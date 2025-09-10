import React from "react";

export default function useFilterAndSort<T>(
  data: T[],
  search: {
    searchKey: string;
    searchLabel: string;
    searchValue: string;
  },
  sort: {
    sortKey: string;
    sortLabel: string;
    isAsc: boolean;
  },
  category: {
    categoryKey: string;
    categoryLabel: string;
    categoryValue: string | number | boolean | null;
  }
) {
  const sortAndFilter = React.useMemo(() => {
    return data
      .filter((d) => {
        if (search.searchKey === null || search.searchValue === null)
          return true;

        const matchedSearch = d[search.searchKey as keyof T]
          ?.toString()
          .toLowerCase()
          .includes(search.searchValue.toLowerCase());

        // for "All" category
        let matchedCategory = true;

        // if not set
        if (typeof category.categoryValue === "undefined") {
          matchedCategory = true;
        }
        // if matched by value, or
        // by truthy and falsy
        else if (
          d[category.categoryKey as keyof T] === category.categoryValue ||
          Boolean(d[category.categoryKey as keyof T]) === category.categoryValue
        ) {
          matchedCategory = true;
        }
        // fallback to true if value is all, else did not match
        else {
          matchedCategory = category.categoryValue === "all" ? true : false;
        }

        return matchedSearch && matchedCategory;
      })
      .toSorted((a, b) => {
        if (!sort.sortKey) return 0;

        const left = a[sort.sortKey as keyof T] as string | number | null;
        const right = b[sort.sortKey as keyof T] as string | number | null;

        if (left === null || right === null) return 0;

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#syntax
        // if -1, a before b
        // if 1, b before a
        // if 0, equal
        const order = sort.isAsc ? 1 : -1;

        if (left < right) {
          return -1 * order;
        } else if (left > right) {
          return 1 * order;
        } else {
          return 0;
        }
      });
  }, [category, search, sort, data]);

  return sortAndFilter;
}
