import React from "react";

export default function useIsLoading() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleIsLoading = React.useCallback((loadingState: boolean) => {
    setIsLoading(loadingState);
  }, []);

  return {
    isLoading,
    handleIsLoading,
  };
}
