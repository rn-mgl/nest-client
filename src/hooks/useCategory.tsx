import React from "react";

export default function useCategory(
  initialCategoryKey: string,
  initialCategoryValue: string | number | boolean | null,
  initialCategoryLabel: string
) {
  const [canSeeCategoryDropDown, setCanShowCategories] = React.useState(false);
  const [category, setCategory] = React.useState<{
    categoryKey: string;
    categoryValue: string | number | boolean | null;
    categoryLabel: string;
  }>({
    categoryKey: initialCategoryKey,
    categoryValue: initialCategoryValue,
    categoryLabel: initialCategoryLabel,
  });

  const handleCanSeeCategoryDropDown = React.useCallback(() => {
    setCanShowCategories((prev) => !prev);
  }, []);

  const handleSelectCategory = React.useCallback(
    (key: string, value: string | number | boolean | null, label: string) => {
      if (value === category.categoryValue) return;

      setCategory({
        categoryKey: key,
        categoryValue: value,
        categoryLabel: label,
      });
    },
    [category.categoryValue]
  );

  return {
    canSeeCategoryDropDown,
    category,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  };
}
