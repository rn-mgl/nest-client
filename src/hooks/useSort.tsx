import React from "react";

export default function useSort(
  initialSortKey: string,
  initialSortLabel: string
) {
  const [canSeeSortDropDown, setCanShowSort] = React.useState(false);
  const [sort, setSort] = React.useState<{
    sortKey: string;
    sortLabel: string;
    isAsc: boolean;
  }>({
    sortKey: initialSortKey,
    sortLabel: initialSortLabel,
    isAsc: false,
  });

  const handleCanSeeSortDropDown = React.useCallback(() => {
    return setCanShowSort((prev) => !prev);
  }, []);

  const handleSelectSort = React.useCallback((key: string, label: string) => {
    setSort((prev) => {
      return {
        ...prev,
        sortKey: key,
        sortLabel: label,
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
    canSeeSortDropDown,
    sort,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  };
}
