export interface TextFieldInterface {
  label: string;
  value: string | number;
}

export interface TextBlockInterface {
  label?: string;
  value: string | number;
}

export interface TableInterface {
  headers: string[];
  contents: object[];
  color: "blue" | "purple" | "green" | "yellow" | "neutral";
}
