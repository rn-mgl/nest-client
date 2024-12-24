import React from "react";

export interface LogoInterface {
  url: string;
  type: "dark" | "light";
}

export interface SideNavInterface {
  home: string;
  navLinks: Array<{ label: string; url: string; icon: React.ReactNode }>;
}
