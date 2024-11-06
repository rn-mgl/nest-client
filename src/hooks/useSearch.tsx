import React from "react";

export default function useSearch(initialSearchKey: string) {
  const [searchData, setSearchData] = React.useState({
    key: initialSearchKey,
    value: "",
  });

  const handleSearchData = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setSearchData((prev) => {
        return {
          ...prev,
          value: value,
        };
      });
    },
    []
  );

  return {
    searchData,
    handleSearchData,
  };
}
