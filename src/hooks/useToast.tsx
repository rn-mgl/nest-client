import React from "react";
import { ToastInterface } from "../interface/ToastInterface";

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastInterface[]>([]);

  const clearToast = (index: number) => {
    setToasts((prev) => prev.filter((_, i) => i !== index));
  };

  const addToast = React.useCallback((toastDetails: ToastInterface) => {
    setToasts((prev) => {
      return [...prev, toastDetails];
    });
  }, []);

  return { toasts, addToast, clearToast };
};

export default useToast;
