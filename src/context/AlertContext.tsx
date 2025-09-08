import React from "react";
import { AlertInterface } from "@/interface/PopupInterface";

interface AlertContextInterface {
  alert: AlertInterface | null;
  showAlert: (alert: AlertInterface) => void;
  hideAlert: () => void;
}

const AlertContext = React.createContext<AlertContextInterface | null>(null);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = React.useState<AlertInterface | null>(null);

  const showAlert = (alert: AlertInterface) => {
    setAlert(alert);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be inside the Alert Context");
  }
  return context;
};

export default AlertProvider;
