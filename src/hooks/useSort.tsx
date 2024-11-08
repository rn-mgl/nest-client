import React from "react";

export default function useSort(initialSortKey: string) {
  const [canShowSort, setCanShowSort] = React.useState(false);
  const [sort, setSort] = React.useState<{
    sortKey: string;
    isAsc: boolean;
  }>({
    sortKey: initialSortKey,
    isAsc: false,
  });

  const handleCanShowSort = React.useCallback(() => {
    return setCanShowSort((prev) => !prev);
  }, []);

  const handleSelectSort = React.useCallback((key: string) => {
    setSort((prev) => {
      return {
        ...prev,
        sortKey: key,
      };
    });
  }, []);

  const handleToggleAsc = React.useCallback(() => {
    setSort((prev) => {
      return {
        ...prev,
        isAsc: !prev.isAsc,
      };
    });
  }, []);

  return {
    canShowSort,
    sort,
    handleCanShowSort,
    handleSelectSort,
    handleToggleAsc,
  };
}
