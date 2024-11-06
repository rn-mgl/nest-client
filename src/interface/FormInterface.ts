import React from "react";

export interface InputString {
  id: string;
  value: string;
  placeholder: string;
  required: boolean;
  type: "text" | "email" | "password";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: boolean;
  icon?: React.ReactNode;
}
