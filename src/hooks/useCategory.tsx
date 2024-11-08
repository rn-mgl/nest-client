import React from "react";

export default function useCategory(
  initialCategoryKey: string,
  initialCategoryValue: string | boolean | null
) {
  const [canShowCategories, setCanShowCategories] = React.useState(false);
  const [category, setCategory] = React.useState<{
    categoryKey: string;
    categoryValue: string | boolean | null;
  }>({
    categoryKey: initialCategoryKey,
    categoryValue: initialCategoryValue,
  });

  const handleCanShowCategories = React.useCallback(() => {
    setCanShowCategories((prev) => !prev);
  }, []);

  const handleSelectCategory = React.useCallback(
    (key: string, value: string | boolean | null) => {
      setCategory({
        categoryKey: key,
        categoryValue: value,
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
