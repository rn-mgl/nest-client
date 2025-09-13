import React from "react";

export default function useCategory(
  initialCategoryKey: string,
  initialCategoryValue: string
) {
  const [canSeeCategoryDropDown, setCanShowCategories] = React.useState(false);
  const [category, setCategory] = React.useState<{
    categoryKey: string;
    categoryValue: string;
  }>({
    categoryKey: initialCategoryKey,
    categoryValue: initialCategoryValue,
  });

  const handleCanSeeCategoryDropDown = React.useCallback(() => {
    setCanShowCategories((prev) => !prev);
  }, []);

  const handleSelectCategory = React.useCallback(
    (key: string, value: string) => {
      setCategory({
        categoryKey: key,
        categoryValue: value,
      });
    },
    []
  );

  return {
    canSeeCategoryDropDown,
    category,
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  };
}
