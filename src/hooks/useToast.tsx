import React from "react";

const useToast = () => {
  const [toast, setToast] = React.useState<{
    message: string;
    type: "info" | "error" | "warning";
    active: boolean;
  }>({
    message: "",
    type: "info",
    active: false,
  });

  const handleToast = React.useCallback(
    (toastDetails: {
      message: string;
      type: "info" | "error" | "warning";
      active: boolean;
    }) => {
      setToast(toastDetails);
    },
    []
  );

  return { toast, handleToast };
};

export default useToast;
