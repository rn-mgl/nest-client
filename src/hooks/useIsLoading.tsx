import React from "react";

export default function useIsLoading(initialState: boolean) {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const handleIsLoading = React.useCallback((loadingState: boolean) => {
    setIsLoading(loadingState);
  }, []);

  return {
    isLoading,
    handleIsLoading,
  };
}
