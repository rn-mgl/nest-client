import React from "react";

export default function useSearch(initialSearchKey: string) {
  const [search, setSearch] = React.useState({
    searchKey: initialSearchKey,
    searchValue: "",
  });

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
    handleSearch,
  };
}
