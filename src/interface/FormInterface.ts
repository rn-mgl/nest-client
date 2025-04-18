import React from "react";

export interface InputInterface {
  id: string;
  value: string | number;
  placeholder: string;
  required: boolean;
  type: "text" | "email" | "password" | "number" | "datetime-local";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field?: string,
    index?: number
  ) => void;
  label?: boolean;
  icon?: React.ReactNode;
  min?: number;
}

export interface TextAreaInterface {
  id: string;
  value: string;
  placeholder: string;
  required: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field?: string,
    index?: number
  ) => void;
  rows?: number;
  label?: boolean;
  icon?: React.ReactNode;
}

export interface SelectInterface {
  id: string;
  value: number;
  options: Array<{ value: number; label: string }>;
  placeholder: string;
  required: boolean;
  activeSelect: boolean;
  onChange: (value: number, label: string) => void;
  toggleSelect: () => void;
  label: string;
  icon?: React.ReactNode;
}

export interface ModalNavInterface {
  activeFormPage: string;
  pages: Array<string>;
  handleActiveFormPage: (page: string) => void;
}

export interface CheckBoxInterface {
  isChecked: boolean;
  onClick: () => void;
}

export interface FileInterface {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  url?: string | null;
  type: "file" | "video" | "image" | "audio";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field?: string,
    index?: number
  ) => void;
  removeSelectedFile: () => void;
}
