import React from "react";

export default function useSearch(
  initialSearchKey: string,
  initialSearchLabel: string
) {
  const [canShowSearch, setCanShowSearch] = React.useState(false);
  const [search, setSearch] = React.useState({
    searchKey: initialSearchKey,
    searchLabel: initialSearchLabel,
    searchValue: "",
  });

  const handleCanShowSearch = React.useCallback(() => {
    setCanShowSearch((prev) => !prev);
  }, []);

  const handleSelectSearch = (key: string, label: string) => {
    setSearch((prev) => {
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
    canShowSearch,
    handleSearch,
    handleCanShowSearch,
    handleSelectSearch,
  };
}
