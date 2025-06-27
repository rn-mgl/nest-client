import React from "react";
import { ToastInterface } from "../interface/ToastInterface";

interface ToastContextData {
  toasts: ToastInterface[];
  addToast: (toast: ToastInterface) => void;
  clearToast: (id: number) => void;
}

const ToastContext = React.createContext<ToastContextData | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastInterface[]>([]);

  const clearToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = React.useCallback((toast: ToastInterface) => {
    setToasts((prev) => {
      return [...prev, toast];
    });

    setTimeout(() => {
      clearToast(toast.id);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToasts = () => {
  return React.useContext(ToastContext)!;
};

export { ToastContext, ToastProvider };
