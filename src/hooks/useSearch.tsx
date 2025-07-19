import React from "react";

export default function useSearch(
  initialSearchKey: string,
  initialSearchLabel: string
) {
  const [canSeeSearchDropDown, setCanShowSearch] = React.useState(false);
  const [debounceSearch, setDebounceSearch] = React.useState({
    searchKey: initialSearchKey,
    searchLabel: initialSearchLabel,
    searchValue: "",
  });
  const [search, setSearch] = React.useState({
    searchKey: initialSearchKey,
    searchLabel: initialSearchLabel,
    searchValue: "",
  });

  const handleCanSeeSearchDropDown = React.useCallback(() => {
    setCanShowSearch((prev) => !prev);
  }, []);

  const handleSelectSearch = (key: string, label: string) => {
    setDebounceSearch((prev) => {
      return {
        ...prev,
        searchKey: key,
        searchLabel: label,
      };
    });
  };

  const handleSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setDebounceSearch((prev) => {
        return {
          ...prev,
          searchValue: value,
        };
      });
    },
    []
  );

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      setSearch((prev) => {
        if (
          prev.searchKey !== debounceSearch.searchKey ||
          prev.searchLabel !== debounceSearch.searchLabel ||
          prev.searchValue !== debounceSearch.searchValue
        ) {
          return debounceSearch;
        }

        return prev;
      });
    }, 200);

    return () => clearTimeout(debounce);
  }, [debounceSearch]);

  return {
    search,
    canSeeSearchDropDown,
    debounceSearch,
    handleSearch,
    handleCanSeeSearchDropDown,
    handleSelectSearch,
  };
}
