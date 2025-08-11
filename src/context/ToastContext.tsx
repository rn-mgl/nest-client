import React from "react";
import { ToastInterface } from "@/interface/ToastInterface";

interface ToastContextData {
  toasts: ToastInterface[];
  addToast: (
    subject: string,
    message: string,
    type: "info" | "success" | "warning" | "error",
    duration?: number
  ) => void;
  clearToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextData | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastInterface[]>([]);
  const intervalsRef = React.useRef<{ [id: string]: NodeJS.Timeout }>({});

  const clearToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  };

  const addToast = React.useCallback(
    (
      subject: string,
      message: string,
      type: "info" | "success" | "warning" | "error",
      duration?: number
    ) => {
      const newToast: ToastInterface = {
        duration: duration ?? 5000,
        id: Math.random().toString(36).slice(2),
        message: message,
        subject: subject,
        type: type,
        percentage: 0,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        const interval = setInterval(() => {
          setToasts((prev) => {
            const updatedToast = prev.map((toast) => {
              if (toast.id !== newToast.id) return toast;

              const newPercentage = toast.percentage + 1;

              if (newPercentage > 100) {
                setTimeout(() => {
                  clearToast(toast.id);
                }, 500);
              }

              return { ...toast, percentage: newPercentage };
            });

            return updatedToast;
          });
        }, Math.ceil(newToast.duration / 100));

        intervalsRef.current[newToast.id] = interval;
      }, 300);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToasts = () => {
  return React.useContext(ToastContext)!;
};

export { ToastProvider };
