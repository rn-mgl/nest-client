import React from "react";

export default function useSearch(
  initialSearchKey: string,
  initialSearchLabel: string
) {
  const [canSeeSearchDropDown, setCanShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState({
    searchKey: initialSearchKey,
    searchLabel: initialSearchLabel,
    searchValue: "",
  });

  const toggleCanSeeSearchDropDown = React.useCallback(() => {
    setCanShowSearch((prev) => !prev);
  }, []);

  const handleSelectSearch = React.useCallback((key: string, label: string) => {
    setSearch((prev) => {
      return {
        ...prev,
        searchKey: key,
        searchLabel: label,
      };
    });
  }, []);

  const handleSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setSearch((prev) => {
        return {
          ...prev,
          searchValue: value,
        };
      });
    },
    []
  );

  return {
    search,
    canSeeSearchDropDown,
    handleSearch,
    toggleCanSeeSearchDropDown,
    handleSelectSearch,
  };
}
