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

export interface TextArea {
  id: string;
  value: string;
  placeholder: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  label?: boolean;
  icon?: React.ReactNode;
}
