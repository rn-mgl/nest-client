import React from "react";
import { ToastInterface } from "../interface/ToastInterface";

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastInterface[]>([]);

  const clearToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = React.useCallback((toastDetails: ToastInterface) => {
    setToasts((prev) => {
      return [...prev, toastDetails];
    });

    setTimeout(() => {
      clearToast(toastDetails.id);
    }, 3000);
  }, []);

  return { toasts, addToast, clearToast };
};

export default useToast;
