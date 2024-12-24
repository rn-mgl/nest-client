import React from "react";

export interface InputInterface {
  id: string;
  value: string | number;
  placeholder: string;
  required: boolean;
  type: "text" | "email" | "password" | "number";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: boolean;
  icon?: React.ReactNode;
  min?: number;
}

export interface TextAreaInterface {
  id: string;
  value: string;
  placeholder: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  label?: boolean;
  icon?: React.ReactNode;
}

export interface SelectInterface<T = string | number> {
  id: string;
  value: string | number;
  options: Array<{ value: string | number; label: string }>;
  placeholder: string;
  required: boolean;
  activeSelect: boolean;
  onChange: (value: T, label: string) => void;
  toggleSelect: () => void;
  label: string;
  icon?: React.ReactNode;
}
