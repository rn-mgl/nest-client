export interface LogoNavInterface {
  url: string;
  type: "dark" | "light";
}

export interface ModalTabsInterface {
  activeTab: string;
  tabs: Array<string>;
  handleActiveTab: (page: string) => void;
}

export interface PageTabsInterface {
  tabs: string[];
  activeTab: string;
}
