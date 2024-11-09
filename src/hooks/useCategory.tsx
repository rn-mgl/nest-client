import React from "react";

export default function useCategory(
  initialCategoryKey: string,
  initialCategoryValue: string | boolean | null,
  initialCategoryLabel: string
) {
  const [canShowCategories, setCanShowCategories] = React.useState(false);
  const [category, setCategory] = React.useState<{
    categoryKey: string;
    categoryLabel: string;
    categoryValue: string | boolean | null;
  }>({
    categoryKey: initialCategoryKey,
    categoryLabel: initialCategoryLabel,
    categoryValue: initialCategoryValue,
  });

  const handleCanShowCategories = React.useCallback(() => {
    setCanShowCategories((prev) => !prev);
  }, []);

  const handleSelectCategory = React.useCallback(
    (key: string, value: string | boolean | null, label: string) => {
      setCategory({
        categoryKey: key,
        categoryValue: value,
        categoryLabel: label,
      });
    },
    []
  );

  return {
    canShowCategories,
    category,
    handleCanShowCategories,
    handleSelectCategory,
  };
}
