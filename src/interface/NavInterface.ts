export interface Logo {
  url: string;
  type: "dark" | "light";
}

export interface SideNav {
  home: string;
  navLinks: Array<{ label: string; url: string; icon: React.ReactNode }>;
}
