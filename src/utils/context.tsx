import React from "react";
import { AppContext as AppContextInterface } from "@/interface/ContextInterface";

const AppContext = React.createContext<AppContextInterface | null>({ url: "" });

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const url = `http://localhost:8000/api`;

  return <AppContext.Provider value={{ url }}>{children}</AppContext.Provider>;
};

export default function useGlobalContext() {
  return React.useContext(AppContext)!;
}

export { AppContext, AppProvider };
