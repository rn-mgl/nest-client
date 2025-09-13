import React from "react";

export default function useFilterAndSort<T>(
  data: T[],
  search?: {
    searchKey: string;
    searchLabel: string;
    searchValue: string;
  },
  sort?: {
    sortKey: string;
    sortLabel: string;
    isAsc: boolean;
  },
  category?: {
    categoryKey: string;
    categoryValue: string;
  }
) {
  const drillPathValue = React.useCallback((data: T, path: string) => {
    if (!path.includes(".")) return null;

    let value = data;

    const paths = path.split(".");

    for (let i = 0; i < paths.length; i++) {
      const currentPath = paths[i];

      value = value[currentPath as keyof object] ?? null;

      if (value === null) {
        return null;
      }
    }

    return value;
  }, []);

  const sortAndFilter = React.useMemo(() => {
    return data
      .filter((d) => {
        let matchedSearch = true;

        if (search) {
          if (search.searchKey === null || search.searchValue === null)
            return true;

          const value =
            drillPathValue(d, search.searchKey) ??
            d[search.searchKey as keyof T];

          matchedSearch = !!value
            ?.toString()
            .toLowerCase()
            .includes(search.searchValue.toLowerCase());
        }

        let matchedCategory = true;

        if (category) {
          // if matched by value, or
          if (d[category.categoryKey as keyof T] === category.categoryValue) {
            matchedCategory = true;
          }
          // fallback to true if value is all, else did not match
          else {
            matchedCategory = category.categoryValue === "All" ? true : false;
          }
        }

        return matchedSearch && matchedCategory;
      })
      .toSorted((a, b) => {
        if (!sort) return 0;

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
  }, [category, search, sort, data, drillPathValue]);

  return sortAndFilter;
}
