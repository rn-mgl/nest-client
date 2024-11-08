import React from "react";

export default function useFilters() {
  const [showFilters, setShowFilters] = React.useState(false);

  const handleShowFilters = React.useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
    showFilters,
    handleShowFilters,
  };
}
