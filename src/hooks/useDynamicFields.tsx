import React from "react";

export default function useDynamicFields<T>(initialState: T[]) {
  const [fields, setFields] = React.useState<T[]>(initialState);

  const addField = (newField: T) => {
    setFields((prev) => [...prev, newField]);
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  // this function is used primarily for dynamic fields with file inputs
  const removeTargetFieldValue = (fieldName: string, index: number) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [fieldName]: "" };

      return updated;
    });
  };

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof T,
    index: number
  ) => {
    const { value, files } = e.target as HTMLInputElement;

    setFields((prev) => {
      const updated = [...prev];

      if (files && files.length) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        const fileSet = { rawFile: file, fileURL: url };
        updated[index] = { ...updated[index], [fieldName]: fileSet };
      } else {
        updated[index] = {
          ...updated[index],
          [fieldName]: parseValue(fieldName, value),
        };
      }

      return updated;
    });
  };

  const parseValue = (key: keyof T, value: string) => {
    const initialValue = initialState[0][key];

    if (initialValue === null) return value;

    switch (typeof initialValue) {
      case "undefined":
        return value;
      case "boolean":
        return Boolean(value);
      case "number":
        return Number(value);
      default:
        return value;
    }
  };

  const populateFields = React.useCallback((fields: T[]) => {
    setFields(fields);
  }, []);

  return {
    fields,
    addField,
    removeField,
    handleField,
    removeTargetFieldValue,
    populateFields,
  };
}
